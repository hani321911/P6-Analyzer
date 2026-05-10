# 04_PROMPT_FOR_CLAUDE

You are reviewing and patching **P6 Analyzer v29.0.11.3-WIP**.

**IMPORTANT:** This is a fresh Round 9.2 progress-calculation patch request, not v29.0.11.2.

**SHA verified:** `7decb08c14b9b227fbb68b16d49bf33b7b52882bac793ec0f7e93d94bce4bc4f`  
**Self-assessed accuracy of this review package:** 95%  
**Primary objective:** Correct Planned% / Actual% / BAC / PV / EV / AC / SPI / CPI calculation reliability according to PMI/AACE/GAO/DCMA/EIA-748 style earned value principles and NG SA use cases.

## What ChatGPT found

1. Row-level C-01/C-02 mostly fixed.
2. `getActualPctRatio()` fallback logic is functionally good.
3. Critical remaining issue: summary totals still use `evmAll`, not `evmFiltered`.
4. `isUnbaselined` is flagged but not excluded from official totals.
5. WBS breakdown uses `all.filter(!milestone)` and `totalCost(r._raw)`, which can reintroduce progress-file mutable cost.
6. Planned% is still calendar-day linear; P6 calendars and Saudi holidays are parsed but not used in planned calculation.
7. S-Curve earned still mirrors planned via `earnedRatio`.
8. Phase 1 `normalizePct(1.5)` test should be updated: Oracle P6 percent fields are 0–100, so `1.5` means 1.5%.
9. Phase 2 static tests are stale and should detect `firstNonNull(...)` order, not old `??` string.

## Apply patches in this order

### 1. Official EVM eligibility set

Implement Patch 1 from `03_RECOMMENDED_PATCHES_v29.0.11.3.md`:
- Add `!r.isUnbaselined` to `evmFiltered`.
- Set `evmAll = evmFiltered` for official totals.
- Keep `all = rows.filter(!isSummary)` only for UI counts/non-EVM lists.

### 2. WBS EVM rollup

Implement Patch 2:
- Build WBS EVM groups from `evmFiltered`.
- Use `r.bac || r.units || r.dur || 0` as the weight.
- Do not use `totalCost(r._raw)` for WBS EVM weighting because `_raw` may be progress row.

### 3. S-Curve earned redesign

Implement Patch 4:
- Keep planned buckets based on baseline BAC over planned dates.
- Build earned buckets from actual dates where possible:
  - completed: actualStart → actualFinish,
  - in-progress: actualStart → dataDate,
  - no actualStart but EV>0: bucket at dataDate.
- Remove `earnedRatio = totalEV / totalPV` and `cumPlanned * earnedRatio`.

### 4. Calendar-aware planned percentage

Implement Patch 3 carefully:
- Use activity calendar `workWeek`, `holidays`, and `exceptions` when available.
- Fallback to current linear calendar method when calendar data is missing.
- Guard long loops.

### 5. Percent policy and tests

Do not change `normalizePct(1.5)` to return 1.0 for P6 XML fields. Update Phase 1 test to expect 0.015.

Also harden direct string input:
```js
String(v).trim().replace(/%$/, "")
```

### 6. Phase 2 test update

Replace old static string checks for `??` with branch checks for:

```js
firstNonNull(p.physicalPct, p.pctComplete, p.durationPct, p.unitsPct)
firstNonNull(p.durationPct, p.pctComplete, p.physicalPct, p.unitsPct)
```

## Must-pass verification checklist

Run:

```bash
cp p6-analyzer-v29.0.11.3-WIP.html p6-analyzer.html
node tests/phase1/test_v29_0_10.cjs
node tests/phase2/test_phase2.cjs
node tests/integration/test_e2e_analyze.cjs
node tests/comprehensive/test_08_round9_regressions.cjs
node round9_2_formula_audit.cjs
```

Expected after patch:

- Phase 1: 36/36 after updating `1.5` expectation.
- Phase 2: 40/40 after updating static checks.
- Integration: 28/28.
- Custom Scenario C: official totals should match patched baseline-scoped totals, not current code totals.
- S-Curve: no occurrence of `cumPlanned * earnedRatio` should remain.

## Final commit message template

```text
fix(evm): align progress totals with baseline-scoped EVM set

- Exclude unbaselined and LOE activities from official EVM totals
- Use baseline BAC weights in WBS EVM rollups
- Redesign S-Curve earned buckets from actual progress timing
- Add calendar-aware planned percentage fallback
- Update percent scale tests for P6 0-100 percent fields
- Refresh Phase 2 static checks for firstNonNull fallback logic

Refs: Round 9.2 ChatGPT progress audit
SHA reviewed: 7decb08c14b9b227fbb68b16d49bf33b7b52882bac793ec0f7e93d94bce4bc4f
```

## Do not propose

- TypeScript migration
- build step/bundler
- React framework change
- Hijri 11-day approximation
- inline style refactor
- removing bilingual Arabic/English support
