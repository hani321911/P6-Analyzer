# 03_RECOMMENDED_PATCHES_v29.0.11.3

**Self-assessed accuracy:** 95%  
**Reviewing:** `v29.0.11.3` **(NOT v29.0.11.2)**  
**SHA:** `7decb08c14b9b227fbb68b16d49bf33b7b52882bac793ec0f7e93d94bce4bc4f`  
**Purpose:** Code-ready patches for progress calculation correctness.

## Patch priority

| Priority | Patch | Why |
|---:|---|---|
| 1 | EVM eligibility set | Fixes official BAC/PV/EV/SPI/CPI denominator |
| 2 | WBS EVM rollup | Prevents WBS summary from using progress cost/LOE/new scope |
| 3 | S-Curve earned redesign | Stops misleading earned curve |
| 4 | Calendar-aware planned% | Aligns planned progress with Saudi calendars and P6 calendars |
| 5 | Percent scale tests | Resolves `1.5` policy based on P6 documentation |
| 6 | Static test updates | Removes false failures |


### Patch 1 — Use the same EVM eligibility set everywhere

**Before — v29.0.11.3 around L7472-L7503:**
```js
const evmFiltered = rows.filter((r) => !r.isMilestone && !r.isSummary && !isLOEActivity(r._raw));
const all = rows.filter((r) => !r.isSummary);
const evmAll = all.filter((r) => !r.isMilestone);
const totalBac = evmAll.reduce((s, r) => s + r.bac, 0);
const totalPV = evmAll.reduce((s, r) => s + r.pv, 0);
const totalEV = evmAll.reduce((s, r) => s + r.ev, 0);
const totalAC = evmAll.reduce((s, r) => s + r.ac, 0);
```

**After — code-ready:**
```js
// Official EVM set: discrete baseline-scoped activities only.
// Excludes milestones, WBS summaries, LOE, and unapproved/unbaselined scope.
const evmFiltered = rows.filter((r) =>
  !r.isMilestone &&
  !r.isSummary &&
  !isLOEActivity(r._raw) &&
  !r.isUnbaselined
);

// UI activity counts can still use all non-summary rows, but official EVM must not.
const all = rows.filter((r) => !r.isSummary);
const evmAll = evmFiltered;

const totalBac = evmAll.reduce((s, r) => s + r.bac, 0);
const totalPV = evmAll.reduce((s, r) => s + r.pv, 0);
const totalEV = evmAll.reduce((s, r) => s + r.ev, 0);
const totalAC = evmAll.reduce((s, r) => s + r.ac, 0);
```

**Tests expected after patch:** Scenario C official BAC should stay baseline-scoped; TT_LOE and N1 unbaselined should not enter summary totals.

### Patch 2 — WBS EVM rollup must use baseline row weights

**Before — around L7574-L7596:**
```js
for (const r of all.filter((x) => !x.isMilestone)) {
  const rawWbs = r._raw?.wbs || "";
  ...
  const w = totalCost(r._raw) || totalUnits(r._raw) || (r.dur || 0);
  wbsGroups[key].totalWeight += w;
  wbsGroups[key].sumPV += w * r.plannedPct;
  wbsGroups[key].sumEV += w * r.actualPct;
  wbsGroups[key].sumBAC += r.bac;
}
```

**After — code-ready:**
```js
for (const r of evmFiltered) {
  const rawWbs = r._raw?.wbs || "";
  const rollupId = rawWbs ? rollupOf(rawWbs) : null;
  const key = rollupId || "_unassigned";
  if (!wbsGroups[key]) {
    const wbsInfo = wbsMap[key];
    wbsGroups[key] = {
      wbsId: key,
      name: wbsInfo?.name || (key === "_unassigned" ? "Unassigned" : `WBS ${key}`),
      code: wbsInfo?.code || "",
      rows: [], totalWeight: 0, sumPV: 0, sumEV: 0, sumBAC: 0
    };
  }
  wbsGroups[key].rows.push(r);
  const w = r.bac || r.units || r.dur || 0; // baseline-controlled weight
  wbsGroups[key].totalWeight += w;
  wbsGroups[key].sumPV += w * r.plannedPct;
  wbsGroups[key].sumEV += w * r.actualPct;
  wbsGroups[key].sumBAC += r.bac;
}
```

### Patch 3 — Calendar-aware planned percentage

**Replace `calcPct` around L7280-L7287 with:**
```js
const _clamp01 = (x) => Math.max(0, Math.min(1, Number.isFinite(x) ? x : 0));

const _ymd = (d) => d.toISOString().slice(0, 10);
const _dayName = (d) => ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"][d.getDay()];

const _workingHoursBetween = (start, end, cal) => {
  if (!cal || !cal.workWeek || end <= start) return null;
  const holidays = new Set(cal.holidays || []);
  const exceptions = new Map((cal.exceptions || []).map(e => [e.date, e.hours || 0]));
  let hours = 0;
  let cur = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  let guard = 0;
  while (cur < end && guard++ < 4000) {
    const ds = _ymd(cur);
    if (exceptions.has(ds)) {
      hours += Math.max(0, exceptions.get(ds));
    } else if (!holidays.has(ds)) {
      const wh = cal.workWeek[_dayName(cur)];
      hours += wh && wh.hours > 0 ? wh.hours : 0;
    }
    cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 1);
  }
  return hours;
};

const _linearPct = (act) => {
  if (!act?.plannedStart || !act?.plannedFinish) return 0;
  const s = new Date(act.plannedStart), f = new Date(act.plannedFinish);
  if (dataDate <= s) return 0;
  if (dataDate >= f) return 1;
  const span = f - s;
  return span > 0 ? (dataDate - s) / span : 1;
};

const calcPct = (act) => {
  if (!act?.plannedStart || !act?.plannedFinish) return 0;
  const s = new Date(act.plannedStart), f = new Date(act.plannedFinish);
  if (dataDate <= s) return 0;
  if (dataDate >= f) return 1;

  const cal = act.calendarId && (((progress && progress.calendars) || refBL.calendars || {})[act.calendarId]);
  const totalH = _workingHoursBetween(s, f, cal);
  const elapsedH = _workingHoursBetween(s, dataDate, cal);
  if (totalH && totalH > 0 && elapsedH !== null) return _clamp01(elapsedH / totalH);

  return _linearPct(act);
};
```

### Patch 4 — S-Curve earned redesign

**Replace the S-Curve block around L7655-L7693 with:**
```js
const evmAllForCurve = evmFiltered.filter((r) => r.bac > 0 && r.plannedStart && r.plannedFinish);
const plannedBuckets = {};
const earnedBuckets = {};

const _addMonthValue = (bucket, startDate, finishDate, value) => {
  const s = new Date(startDate), f = new Date(finishDate);
  if (isNaN(s) || isNaN(f) || value <= 0) return;
  if (f <= s) {
    const ym = s.toISOString().slice(0, 7);
    bucket[ym] = (bucket[ym] || 0) + value;
    return;
  }
  const totalDays = Math.max((f - s) / 864e5, 0.0001);
  let curMonth = new Date(s.getFullYear(), s.getMonth(), 1);
  const endMonth = new Date(f.getFullYear(), f.getMonth(), 1);
  let guard = 0;
  while (curMonth <= endMonth && guard++ < 600) {
    const monthStart = curMonth;
    const monthEnd = new Date(curMonth.getFullYear(), curMonth.getMonth() + 1, 1);
    const ovStart = s > monthStart ? s : monthStart;
    const ovEnd = f < monthEnd ? f : monthEnd;
    const ovDays = Math.max(0, (ovEnd - ovStart) / 864e5);
    if (ovDays > 0) {
      const ym = curMonth.toISOString().slice(0, 7);
      bucket[ym] = (bucket[ym] || 0) + value * (ovDays / totalDays);
    }
    curMonth = new Date(curMonth.getFullYear(), curMonth.getMonth() + 1, 1);
  }
};

for (const r of evmAllForCurve.slice(0, 10000)) {
  _addMonthValue(plannedBuckets, r.plannedStart, r.plannedFinish, r.bac);
  if ((r.ev || 0) > 0) {
    if (r.actualStart && r.actualFinish) _addMonthValue(earnedBuckets, r.actualStart, r.actualFinish, r.ev);
    else if (r.actualStart) _addMonthValue(earnedBuckets, r.actualStart, dataDate, r.ev);
    else {
      const ym = dataDate.toISOString().slice(0, 7);
      earnedBuckets[ym] = (earnedBuckets[ym] || 0) + r.ev;
    }
  }
}

const months = [...new Set([...Object.keys(plannedBuckets), ...Object.keys(earnedBuckets)])].sort();
let cumPlanned = 0, cumEarned = 0;
const dataDateStr = dataDate.toISOString().slice(0, 7);
const sCurve = months.map((ym) => {
  cumPlanned += plannedBuckets[ym] || 0;
  if (ym <= dataDateStr) cumEarned += earnedBuckets[ym] || 0;
  return { month: ym, planned: +cumPlanned.toFixed(0), earned: ym <= dataDateStr ? +cumEarned.toFixed(0) : null };
});
```

### Patch 5 — normalizePct decision and tests

**Decision:** do **not** change `normalizePct(1.5)` to clamp to `1.0` for P6 XML fields. Oracle's P6 field documentation describes `PercentComplete`, `DurationPercentComplete`, and `UnitsPercentComplete` as percent values in the 0–100 range; therefore `1.5` is best interpreted as **1.5%**. Update the Phase 1 expectation.

**Test update:**
```js
// Old:
test('Out-of-range (1.5) clamped to 1', Math.abs(getActualPctRatio({pctType:'Physical', physicalPct:1.5}) - 1) < 1e-9);

// New:
test('P6 percent 1.5 means 1.5%', Math.abs(getActualPctRatio({pctType:'Physical', physicalPct:1.5}) - 0.015) < 1e-9);
```

For direct non-parser user inputs like `"50%"`, normalize can be hardened as:
```js
const normalizePct = (v) => {
  if (v == null) return null;
  const s = String(v).trim().replace(/%$/, "");
  if (s === "") return null;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  if (n > 1 && n <= 100) return n / 100;
  return Math.max(0, Math.min(1, n));
};
```

### Patch 6 — Phase 2 static tests

Replace old string checks:
```js
script.includes('p.physicalPct ?? p.pctComplete ?? p.durationPct ?? p.unitsPct')
```
with function-aware checks:
```js
const physicalBranch = script.substring(script.indexOf('if (type === "physical")'), script.indexOf('} else if (type === "duration")'));
test('R1 fix present: physical uses firstNonNull order', physicalBranch.includes('firstNonNull(p.physicalPct, p.pctComplete, p.durationPct, p.unitsPct)'));
```


## Risk assessment

| Patch | Risk | Mitigation |
|---|---:|---|
| EVM eligibility | Medium | Re-run Scenario C; compare total BAC with baseline BAC |
| WBS rollup | Medium | Validate WBS totals equal summary totals for included activities |
| Calendar planned% | Medium/High | Add toggle/fallback and test with 5/6/7-day calendars |
| S-Curve redesign | Medium | Keep old planned buckets; only change earned buckets |
| Percent policy | Low | Update tests and add documentation in MethodExplanation |
| Static tests | Low | Does not affect product code |

## Acceptance checklist after patch

- [ ] `evmFiltered` excludes `isUnbaselined`.
- [ ] `totalBac/totalPV/totalEV/totalAC` derive from `evmFiltered`.
- [ ] WBS breakdown uses `evmFiltered` and `r.bac` as first cost weight.
- [ ] `TT_LOE` synthetic activity does not affect EVM totals.
- [ ] New activity in progress but absent baseline is shown as issue but excluded from official EVM.
- [ ] Deleted baseline activity remains in denominator with EV=0 until approved baseline revision.
- [ ] S-Curve earned is not `cumPlanned * earnedRatio`.
- [ ] Phase 1 `1.5` test updated to 1.5% or clearly documented otherwise.
- [ ] Phase 2 string checks updated to `firstNonNull` branch checks.
