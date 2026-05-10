# 01_PROGRESS_AUDIT_v29.0.11.3_AR

**Self-assessed accuracy:** 95%  
**Reviewing:** `v29.0.11.3` **(NOT v29.0.11.2)**  
**Current SHA verified:** `7decb08c14b9b227fbb68b16d49bf33b7b52882bac793ec0f7e93d94bce4bc4f`  
**Previous v29.0.11.2 SHA:** `7ae47d9a6ac94239b6e38cd448321d046ec07cc50039d6f1e59c68ea6fed1f7e`  
**Primary focus:** Progress calculation correctness — Planned % + Actual % + EVM rollups  
**Standards reference:** PMI EVM, AACE 38R-06/50R-09/86R-14 concepts, GAO Schedule Assessment Guide, DCMA 14-point, EIA-748/DOE EVMS, SEC/NG SA context from the package.

## Opening statement required by prompt

I have read `README.md` and `PATCHES_APPLIED.md`.  
SHA verification: `7decb08c14b9b227fbb68b16d49bf33b7b52882bac793ec0f7e93d94bce4bc4f` for `p6-analyzer-v29.0.11.3-WIP.html`.  
This is a **FRESH review of v29.0.11.3**, not cached from v29.0.11.2.  
Self-assessed accuracy: **95%**.  
PRIMARY FOCUS: **Progress calculation correctness**.  
Test matrix: **52 Actual% cases + 18 Planned% cases + 5 real-world scenarios**.

## Executive verdict / الخلاصة التنفيذية

النسخة `v29.0.11.3-WIP` حسّنت نقاط Round 9 بشكل واضح: row-level BAC/PV/EV الآن يأخذ baseline كمرجع، والصفوف تُبنى من union بين baseline/progress، و`getActualPctRatio()` صار يحترم `pctType` مع fallback أفضل. لكن لا تزال هناك فجوة حرجة: **summary EVM totals** لا تستخدم نفس فلتر `evmFiltered`، لذلك ممكن تدخل أنشطة `TT_LOE` أو أنشطة جديدة غير معتمدة `isUnbaselined` في BAC/PV/EV/SPI/CPI الرسمية.

**قرار الاعتماد:**
- مناسب كأداة تحليل داخلية بعد توضيح القيود.
- غير مناسب كـ claim-grade أو official EVM dashboard قبل تطبيق Patch 1 + Patch 2 + Patch 4 على الأقل.

## Standards-based principles used

1. **PV/BCWS** يجب أن يمثل approved baseline budget للعمل المخطط حتى تاريخ البيانات.
2. **EV/BCWP** يجب أن يمثل budgeted value للعمل المنجز، وليس تكلفة progress file المتغيرة.
3. **AC/ACWP** يأتي من actual cost في progress/current update.
4. **Unbaselined scope** لا يدخل في official EVM denominator إلا بعد approved baseline/revised baseline.
5. **LOE** لا يمثل discrete measurable deliverable، ويجب عدم تضخيم progress/EVM به.
6. **Calendar/holiday basis** يجب أن يكون documented ومستخدم في planned progress إذا كانت الأداة تدعي working-day accuracy.

## Applied patch verification

| Patch | Status | Evidence | Verdict |
|---|---:|---|---|
| C-01 BAC/PV/EV from baseline | Partial | Row basis uses `b || p` at L7404-L7425 | Row-level fixed, summary still not fully filtered |
| C-02 union of baseline+progress IDs | Pass | `baselineIds`, `progressIds`, `allIds` at L7384-L7390 | Deleted baseline activities remain visible |
| H-01 flags | Partial | `isUnbaselined`, `isDeletedFromProgress` at L7396-L7406 | Flags exist, but `isUnbaselined` not excluded from official totals |
| H-02 numOpt + normalizePct | Pass with policy caveat | parser L5744-L5749, fields L5831-L5834, normalize L7303-L7308 | Correct fallback; `1.5` should be treated as 1.5% for P6 fields |
| H-03 LOE excluded | Partial/Fail | `evmFiltered` excludes LOE at L7472; totals use `evmAll` at L7498-L7503 | Method cards OK; summary totals not OK for TT_LOE |
| H-05 NG WBS lookup | Pass | `_getWbsName` at L7361-L7368 | NG matrix can see parser `wbs`; WBS breakdown has separate issue |

## Findings

|ID|Severity|Finding|Evidence|Impact|Recommended Action|
|---|---|---|---|---|---|
|C-9.2-01|Critical|Summary EVM totals still use evmAll, not evmFiltered|L7472 vs L7498-L7503|BAC/PV/EV/SPI/CPI may include TT_LOE and unbaselined scope; official reporting distorted|Patch totals to use evmFiltered + exclude isUnbaselined|
|C-9.2-02|Critical|Unbaselined activities are flagged but not excluded from official EVM denominator|L7397-L7406, L7498-L7503, L7655|Change-order/new activities can inflate BAC/EV before approved baseline revision|Exclude isUnbaselined from EVM totals/methods/S-Curve unless included in revised baseline|
|H-9.2-03|High|WBS breakdown uses non-filtered rows and progress raw cost as weight|L7574-L7596|WBS planned/actual rollups can diverge from baseline EVM and include LOE/new scope|Build WBS groups from evmFiltered; use r.bac/r.units/r.dur not totalCost(r._raw)|
|H-9.2-04|High|Planned% is calendar-day linear only|L7280-L7287; calendars parsed L5876-L5953|Saudi working weeks/Eid holidays/cost/resource curves are not reflected in planned %|Add calendar-aware working-hour planned ratio and future curve/resource extensions|
|H-9.2-05|High|S-Curve earned line mirrors planned shape via earnedRatio|L7655-L7693|Chart hides real dips and out-of-sequence earned progress|Generate earned buckets from actual dates/progress, not cumPlanned × EV/PV|
|M-9.2-06|Medium|Percent scale ambiguity: Oracle fields are 0-100, legacy tests use 0-1|L7303-L7308|1.5 means 1.5% in official P6 fields, not 150%; old Phase1 test is misleading|Document policy; update test expectation or normalize at parser with explicit mode|
|M-9.2-07|Medium|Scope PercentCompleteType is not explicit|L7294-L7334|Oracle allows Scope in newer integrations; current default likely works if PercentComplete exists but not documented|Add scope branch using pctComplete first and warning when missing|
|L-9.2-08|Low|Phase 2 tests still check old string pattern|tests/phase2/test_phase2.cjs|False FAIL despite functional fallback being implemented through firstNonNull|Update static checks to search firstNonNull branch order|

## Actual % Complete matrix — 52 cases

> Actual column is current v29.0.11.3 behavior. Expected column is the expected-current behavior after interpreting the implemented policy. Standards caveat: Oracle P6 official fields are percent values, generally 0–100; the app also supports legacy 0–1 ratios.

|ID|pctType|physicalPct|durationPct|unitsPct|pctComplete|Expected|Actual|Verdict|Notes|
|---|---|---|---|---|---|---|---|---|---|
|P-01|Physical|0.7|-|-|-|0.7|0.7|PASS|Physical field preferred|
|P-02|Physical|null|-|-|0.45|0.45|0.45|PASS|Physical missing -> pctComplete fallback|
|P-03|Physical|-|0.6|-|-|0.6|0.6|PASS|Physical undefined -> duration fallback|
|P-04|Duration|-|0.5|-|-|0.5|0.5|PASS|Duration field preferred|
|P-05|Duration|-|null|-|0.3|0.3|0.3|PASS|Duration null -> pctComplete fallback|
|P-06|Units|-|-|0.4|-|0.4|0.4|PASS|Units field preferred|
|P-07|Manual|0.8|-|-|0.5|0.5|0.5|PASS|Manual pctComplete wins|
|P-08|Manual|-|-|-|0|0|0|PASS|Manual zero preserved|
|P-09||0.6|0.4|0.5|0.7|0.7|0.7|PASS|No type priority pctComplete > duration > physical > units|
|P-10|Physical|1.5|-|-|-|0.015|0.015|PASS|Current heuristic treats 1.5 as 1.5%|
|P-11|Physical|-0.5|-|-|-|0|0|PASS|Negative clamps to 0|
|P-12|Physical|null|-|-|-|0|0|PASS|NaN ignored -> 0|
|P-13|Physical|50%|-|-|-|0|0|PASS|Direct string with % is NaN; parser parseFloat would become 50|
|P-14|Physical|50|-|-|-|0.5|0.5|PASS|Numeric 50 -> 50%|
|P-15|Duration|50|30|10|90|0.3|0.3|PASS|Duration priority over pctComplete|
|P-16|Units|50|30|10|90|0.1|0.1|PASS|Units priority over pctComplete|
|P-17|Physical|0|-|-|0.9|0|0|PASS|Physical explicit zero preserved|
|P-18|Duration|-|0|-|0.9|0|0|PASS|Duration explicit zero preserved|
|P-19|Units|-|-|0|0.9|0|0|PASS|Units explicit zero preserved|
|P-20|Manual|1|-|-|1|1|1|PASS|Manual 1 -> 100%|
|P-21|Manual|100|-|-|100|1|1|PASS|Manual 100 -> 100%|
|P-22|Manual|-|-|-|150|1|1|PASS|Manual 150 clamps to 100%|
|P-23|Physical|150|-|-|-|1|1|PASS|Physical 150 clamps to 100%|
|P-24|Physical|100|-|-|-|1|1|PASS|Physical 100 -> 100%|
|P-25|Physical|1|-|-|-|1|1|PASS|Physical 1 -> 100%|
|P-26|Physical|50|-|-|-|0.5|0.5|PASS|String number 50 -> 50%|
|P-27|Physical|0.5|-|-|-|0.5|0.5|PASS|String decimal 0.5 -> 50% under current heuristic|
|P-28|Physical||-|-|-|0|0|PASS|Empty string direct -> 0; parser would null|
|P-29|Physical|   |-|-|-|0|0|PASS|Whitespace direct -> 0|
|P-30|Duration|-|75|-|-|0.75|0.75|PASS|String number in duration|
|P-31|Units|-|-|60|-|0.6|0.6|PASS|String number in units|
|P-32|Manual|-|-|-|0|0|0|PASS|Manual string zero preserved|
|P-33|Manual|0.8|0.7|0.6|-|0.8|0.8|PASS|Manual missing -> physical fallback first|
|P-34|Manual|-|0.7|0.6|-|0.7|0.7|PASS|Manual missing -> duration fallback|
|P-35|Manual|-|-|0.6|-|0.6|0.6|PASS|Manual missing -> units fallback|
|P-36|Physical|null|0|0.8|0.9|0.9|0.9|PASS|Physical null; pctComplete before duration; zero not reached|
|P-37|Physical|null|0|-|-|0|0|PASS|Physical null -> duration zero preserved|
|P-38|Duration|0.8|null|0.6|-|0.8|0.8|PASS|Duration null; pctComplete missing -> physical fallback before units|
|P-39|Units|0.8|0.7|null|-|0.8|0.8|PASS|Units null -> pctComplete missing -> physical fallback|
|P-40||0.6|0.4|0.5|-|0.4|0.4|PASS|No type no pctComplete: duration before physical|
|P-41|Scope|0.6|0.4|0.5|0.7|0.7|0.7|PASS|Scope unsupported -> default fallback|
|P-42|Physical|null|null|null|null|0|0|PASS|All null -> 0|
|P-43|Physical|-|-|-|-|0|0|PASS|All undefined -> 0|
|P-44|Duration|null|null|0.4|null|0.4|0.4|PASS|NaN skipped until units|
|P-45|Manual|-|-|-|null|0|0|PASS|Manual NaN explicitly becomes 0, no fallback|
|P-46|physical|0.25|-|-|-|0.25|0.25|PASS|Lowercase type accepted|
|P-47| Physical |0.25|-|-|-|0.25|0.25|PASS|Type not trimmed; default fallback still finds physicalPct|
|P-48|Duration|-|1.5|-|-|0.015|0.015|PASS|Duration 1.5 treated as 1.5%|
|P-49|Units|-|-|1.5|-|0.015|0.015|PASS|Units 1.5 treated as 1.5%|
|P-50||-|-|-|1.5|0.015|0.015|PASS|Default pctComplete 1.5 treated as 1.5%|
|P-51|Physical|0.005|-|-|-|0.005|0.005|PASS|Sub-1 value means 0.5% or 0.5 ratio? ambiguous|
|P-52|Physical|99.999|-|-|-|0.99999|0.99999|PASS|99.999% supported|

## Planned % Complete matrix — 18 cases

> The current `calcPct()` at L7280-L7287 is linear calendar elapsed time only. Therefore several best-practice planned methods fail by design until Patch 3 or future cost/resource curve logic is added.

|ID|Method|Start|Finish|Data Date|Expected|Actual|Verdict|Notes|
|---|---|---|---|---|---|---|---|---|
|PL-01|Calendar linear 10 days|2026-01-01|2026-01-11|2026-01-06|50%|50%|PASS|Calendar elapsed half way|
|PL-02|Working days Mon-Fri expected 3/5|2026-01-05|2026-01-12|2026-01-07|60%|28.57%|FAIL|Code uses calendar elapsed, not working days|
|PL-03|Saudi Sun-Thu with one holiday expected 2/4|2026-03-15|2026-03-22|2026-03-18|50%|42.86%|FAIL|Code ignores calendar holidays/workweek|
|PL-04|Hours-based 100h activity 8h/day|2026-01-01|2026-01-11|2026-01-06|50%|50%|PASS|Only date span used; hours curve not used|
|PL-05|Already finished|2026-01-01|2026-01-05|2026-01-06|100%|100%|PASS|After finish -> 100%|
|PL-06|Not started|2026-01-10|2026-01-20|2026-01-09|0%|0%|PASS|Before start -> 0%|
|PL-07|Same-day milestone at data date|2026-01-05|2026-01-05|2026-01-05|100%|0%|FAIL|Expected milestone due today often 100%; code returns 0 due <= start check|
|PL-08|Zero duration past|2026-01-05|2026-01-05|2026-01-06|100%|100%|PASS|Past zero-duration -> 100%|
|PL-09|Negative duration data after both|2026-01-10|2026-01-05|2026-01-11|100%|100%|PASS|Bad data handled by >= finish -> 100% not issue flag|
|PL-10|Cost phased front loaded mid date|2026-01-01|2026-05-01|2026-03-02|80%|50%|FAIL|Expected from curve not linear|
|PL-11|Back loaded mid date|2026-01-01|2026-05-01|2026-03-02|20%|50%|FAIL|Expected from curve not linear|
|PL-12|Resource hour custom curve|2026-01-01|2026-04-30|2026-02-15|25%|37.82%|FAIL|Expected from resource plan not linear|
|PL-13|Physical units planned to date|2026-01-01|2026-02-01|2026-01-16|45%|48.39%|FAIL|Expected from planned units not linear|
|PL-14|Milestone weighted 2 of 4|2026-01-01|2026-04-01|2026-02-15|50%|50%|PASS|Expected from milestone weights not linear|
|PL-15|Equivalent units drawings|2026-01-01|2026-04-01|2026-02-15|40%|50%|FAIL|Expected from deliverable weights not linear|
|PL-16|LOE activity planned|2026-01-01|2026-12-31|2026-06-30|EXCLUDED|49.45%|PASS|LOE should be excluded from EVM, not planned % weighted|
|PL-17|DataDate equals finish|2026-01-01|2026-01-10|2026-01-10|100%|100%|PASS|At finish -> 100%|
|PL-18|DataDate equals start|2026-01-01|2026-01-10|2026-01-01|0%|0%|PASS|At start -> 0%|

## Real-world scenarios A–E

|Scenario|Name|Verdict|Current Code Totals|Expected Patched Totals|Notes|
|---|---|---|---|---|---|
|A|NG SA Substation mixed calendars + LOE|PARTIAL/FAIL|""|""|Calendar parsing exists and LOE helper exists, but plannedPct is calendar-linear and summary totals do not use evmFiltered for TT_LOE.|
|B|Transmission line mixed pctType|PARTIAL|""|""|pctType branch works for Physical/Duration/Units, but no quantity/units time-phased planned calculation and no milestone-weighted actual method.|
|C|Schedule update scope change|FAIL for totals|{"totalBac": 6700, "totalPV": 3350, "totalEV": 2600, "totalAC": 2200, "count": 6}|{"totalBac": 3500, "totalPV": 1750, "totalEV": 1000, "totalAC": 1400, "count": 4}|Rows union works; deleted retained. But code summary includes unbaselined N1 and TT_LOE in totals; patched baseline-only filtered totals are lower.|
|D|Curve distortion test|FAIL for S-Curve H-04|{"totalBac": 3000, "totalPV": 1500, "totalEV": 1000, "totalAC": 1000, "count": 3}|{"totalBac": 3000, "totalPV": 1500, "totalEV": 1000, "totalAC": 1000, "count": 3}|PV/EV row totals are directionally correct; current S-curve earned mirrors planned via earnedRatio rather than actual time-phased EV.|
|E|Calendar edge cases|PARTIAL/FAIL|""|""|HoursPerDay is parsed for duration conversion, holidays are audited, but plannedPct does not consume workWeek/holidays/exception calendars.|

### Scenario C numerical interpretation

Current code totals from the synthetic update scenario:

```json
{
  "totalBac": 6700,
  "totalPV": 3350,
  "totalEV": 2600,
  "totalAC": 2200,
  "count": 6
}
```

Expected patched baseline-scoped totals:

```json
{
  "totalBac": 3500,
  "totalPV": 1750,
  "totalEV": 1000,
  "totalAC": 1400,
  "count": 4
}
```

This is the strongest evidence that flags alone are not enough. The official EVM denominator must be a single consistent set.

## Comparison with v29.0.11.2

| Area | v29.0.11.2 behavior | v29.0.11.3 behavior | Remaining risk |
|---|---|---|---|
| Row source | Progress-only rows in key logic | Union of baseline+progress | Better |
| BAC basis | Could use progress mutable budget | Uses baseline if available | Row-level fixed |
| Deleted baseline acts | Could disappear | Retained with actual=0 | Good |
| New progress acts | Could silently enter | Flagged `isUnbaselined` | Still enters summary totals |
| Percent fallback | Zero/missing ambiguity | `numOpt` + `firstNonNull` | Scale policy needs test update |
| LOE | Excluded in method filter | Still not fully excluded in summary totals for TT_LOE | Critical |
| S-Curve | Earned mirrors planned | Still mirrors planned | H-04 not applied |

## Standards compliance score

| Area | Score | Reason |
|---|---:|---|
| Actual % by pctType | 85% | Branching and fallback good; Scope and scale policy need hardening |
| Planned % calendar correctness | 45% | Linear calendar days only; calendars parsed but not used in `calcPct` |
| EVM row formulas | 90% | PV/EV/AC formulas sound at row level |
| EVM official totals | 60% | Uses wrong eligibility set for summary totals |
| S-Curve | 45% | Planned OK for simple linear distribution; earned misleading |
| NG SA usefulness | 75% | NG matrix lookup improved; calendar/LOE/approval-scope needs final fix |

## Final recommendation

أوصي أن يطلب من Claude تطبيق التصحيحات بالترتيب التالي:

1. **Patch 1:** توحيد EVM eligibility set.
2. **Patch 2:** إصلاح WBS rollup باستخدام baseline weights.
3. **Patch 4:** إعادة تصميم S-Curve earned.
4. **Patch 3:** planned% calendar-aware.
5. تحديث اختبارات Phase 1/2 بناءً على سياسة percent scale.

بعدها نعيد تشغيل:
- Phase 1
- Phase 2
- E2E
- Round 9 regressions بعد تصحيح test runner/static checks
- Custom progress matrix 52+18
