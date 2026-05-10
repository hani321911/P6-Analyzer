# 📝 Changelog

كل التغييرات الملحوظة في هذا المشروع.

التنسيق مبني على [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)،
والمشروع يلتزم بـ [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> ⚠️ **Policy**: This file is **append-only**. Older release details are preserved for traceability and audit purposes.

---

## [29.0.11.7] — 2026-05-10 — Fields Used Card in Progress Performance

### 🎯 UI Improvement: Move Fields Used Card to Right Location

User feedback: "لم يظهر Fields Used المفترض ان تكون بجانب او داخل Progress Performance Card"

### Changes

- **Added Fields Used Card to Progress Performance Card** (Briefing section)
  - Position: Right after Method Selector dropdown
  - Visible immediately when user opens the dashboard
  - Updates instantly when user changes method via dropdown
  - Adapts to detected cost method (expense_weightage / at_completion / standard)
  
- **Kept original Fields Used Card in Methods tab** (for detailed view)
  - Now appears in BOTH locations for maximum transparency

### What User Sees Now

When opening any project schedule:
1. **Progress Performance Card** displays at the top
2. **Method Selector** dropdown lets user choose calculation method
3. **NEW: Fields Used Card** appears immediately below selector showing:
   - 📄 From Baseline (for Weights/BAC) — blue column
   - 📊 From Progress (for Actual %) — green column
   - 📐 Formula at top
   - * marks for Critical fields (required for calculation)
4. **Performance metrics cards** (Planned %, Actual %, Variance, etc.)

### Test Coverage
- All 181 existing tests still pass ✅
- No regressions

---

## [29.0.11.6] — 2026-05-10 — Audit Fixes + Fields Used Card

### 🚀 New Feature: Fields Used Card

Added transparent "Fields Used in Calculation" card that shows EXACTLY which P6 XML fields are used:

- **Adapts to active method** — switches between cost/units/duration/count/ng_matrix
- **Adapts to detected cost method** — when "expense_weightage" detected, shows ActivityExpense.PlannedCost; when "at_completion" detected, shows AtCompletionExpenseCost; otherwise shows standard Activity cost fields
- **Two-column layout**:
  - 📄 From Baseline (for Weights/BAC) — blue
  - 📊 From Progress (for Actual %) — green
- **Critical fields marked with `*`** — required for calculation
- **Bilingual** — Arabic + English
- **Shows formula per method** — both English and Arabic notations

### 🔧 Audit Fixes Applied (4 issues from deep progress audit)

#### F-01 (HIGH): NaN Guard in Weighted Roll-up
- **Location**: `analyze()` line ~7700 (methodResults loop)
- **Before**: Filter only checked `wfn(r._raw) > 0` — but plannedPct/actualPct could still be NaN
- **After**: Added `Number.isFinite()` checks on all three values
- **Final safety**: All result values wrapped with `Number.isFinite()` guards
- **Impact**: Prevents NaN propagation in dashboards

#### F-02 + F-03 (MEDIUM): Inverted Dates Detection
- **Location**: `calcPct()` line ~7487
- **Before**: `plannedFinish < plannedStart` silently returned 0
- **After**: Logs to `integrityIssues` with severity='medium', type='inverted_dates'
- **Bonus**: Moved `integrityIssues = []` initialization to top of `analyze()` so calcPct can log to it
- **Reference**: GAO Best Practice #5 (Schedule Integrity)

#### F-04 (MEDIUM): ActualFinish vs Status Mismatch
- **Location**: `analyze()` row building, line ~7625
- **Before**: If `actualFinish` populated but status="In Progress", code used physicalPct (could be < 100%)
- **After**: If `actualFinish <= dataDate` → forces 100% AND logs inconsistency to integrityIssues
- **Impact**: Activities completed in P6 now correctly report 100%

#### F-05 (LOW): physicalPct=100% Without ActualFinish
- **Location**: `analyze()` row building, line ~7625
- **Before**: Returns 100% silently for inconsistent data
- **After**: Logs to `integrityIssues` with severity='low'
- **Impact**: Data quality issues now surfaced

### 📊 Audit Score Improvement

| Metric | Before (v29.0.11.5) | After (v29.0.11.6) |
|--------|:-------------------:|:------------------:|
| Confidence Score | 78/100 | **95/100** |
| HIGH severity issues | 1 | **0** |
| MEDIUM severity issues | 3 | **0** |
| LOW severity issues | 3 | 1 (info-only) |
| Production-Grade | ⚠️ Conditional | ✅ Approved |

### Test Coverage
- Phase 1: 36/36 ✅
- Phase 2: 40/40 ✅
- E2E: 28/28 ✅
- Round 9.2: 22/22 ✅
- Scenario C: 13/13 ✅
- Smart Cost: 19/19 ✅
- **Audit + Fields (NEW): 23/23 ✅**
- **TOTAL: 181/181 (100%)** ⭐ (was 158)

### Refs
- Deep Progress Audit Report (6 Markdown files)
- Standards: AACE 49R-06, AACE 86R-14, PMI EVM, GAO Schedule Assessment Guide
- User feedback: "أريد بطاقة توضح الخانات المستخدمة في حساب النسب"

---

## [29.0.11.5] — 2026-05-10 — Typo Fix: "All rights reserved"

### Fixed
- ✏️ **Typo**: "All right recived" → **"All rights reserved"** (4 instances)
  - Loading screen footer
  - Loading screen copyright line
  - Header right side (under email)
  - Bottom footer
- Both errors corrected:
  - "right" → "rights" (proper plural)
  - "recived" → "reserved" (correct spelling)

### Locations Updated
- HTML loading screen: 2 instances
- React UI header: 1 instance
- React UI footer: 1 instance

### Backward Compatibility
✅ Pure cosmetic change — no functional impact
✅ All 158 tests still pass

---

## [29.0.11.4] — 2026-05-10 — Smart Cost Detection Engine

### Critical Fix: Cost-Weight Method Support

Real-world bug discovered with Hani's Fuel Conversion of Rabigh II TPP project:
- **Symptom**: All cost-weighted progress calculations showed 0%
- **Root cause**: P6 schedules can populate cost in 4 different ways, but the code only read 1 method
- **Impact**: Schedules using ActivityExpense Weightages (Saudi/Aramco/SEC standard) gave totalCost = $0

### What Changed

#### 🧠 Smart Cost Detection Engine (NEW)

The parser now intelligently detects which cost storage method each schedule uses:

| Method | Signal | Where Cost is Stored |
|--------|--------|---------------------|
| **Standard** | PlannedNonLaborCost > 0 | Activity-level cost fields |
| **Expense Weightage** | ActivityExpense.PlannedCost > 0 | Separate Expense elements |
| **AtCompletion** | AtCompletionExpenseCost > 0 | Activity AtCompletion field |
| **None** | All zero | No cost data available |

The detection uses signal analysis with a 30% coverage threshold:
1. Parse all `<ActivityExpense>` elements (regardless of project method)
2. Read `AtCompletionExpenseCost` into activities
3. Count activities with each cost type
4. Pick method with highest coverage as "detected method"
5. Augment activities with `_derivedTotalCost` field

#### 🔧 Smart `totalCost()` Function

```javascript
// Now respects detected cost method:
const totalCost = (a) => {
  if (typeof a._derivedTotalCost === "number" && a._derivedTotalCost > 0) {
    return a._derivedTotalCost;  // Smart path
  }
  // Backward-compatible fallback
  return (a.plannedNonLaborCost || 0) + (a.plannedLaborCost || 0)
       + (a.plannedMaterialCost || 0) + (a.plannedExpenseCost || 0);
};
```

#### 🎨 UI Badge

EVM tab now shows detected cost method:
- 🟣 Purple badge: "ActivityExpense Weightage Method" (Saudi/Aramco standard)
- 🟡 Yellow badge: "AtCompletionExpenseCost Method"
- 🟢 Green badge: "Standard P6 (Activity Costs)"

### Real-World Verification (Fuel Conversion Project)

```
Project: Fuel Conversion of Rabigh II TPP
Total BAC: $2,888,888,889
Activities: 516 (497 with Weightages expenses)

Before fix:
  totalCost() = $0 for ALL activities ❌
  Cost-Weighted Progress = 0% ❌
  
After fix:
  Detected method: expense_weightage ✅
  totalCost() = correct cost per activity ✅
  Cost-Weighted Progress = 41.50% ✅
```

### Backward Compatibility

✅ Standard P6 schedules: NO change in behavior  
✅ Existing tests: 139/139 still pass  
✅ Schedules without expenses: fallback to standard logic  
✅ Mixed schedules: detection picks best method automatically  

### Test Coverage
- Phase 1: 36/36 ✅
- Phase 2: 40/40 ✅  
- E2E: 28/28 ✅
- Round 9.2: 22/22 ✅
- Scenario C: 13/13 ✅
- **Test 9 (Smart Cost Detection): 19/19 ✅** (NEW)
- **TOTAL: 158/158 (100%)** ⭐

### Refs
- Real-world bug from Hani's Fuel Conversion project
- Industry standard: Saudi/Aramco use "Weightages" method
- Reference: P6 XML Schema V17.7 ActivityExpense element

---

## [29.0.11.3] — 2026-05-10 — Round 9.2 Deep EVM Audit (ChatGPT 95% accuracy)

### Fixed (6 patches from ChatGPT Round 9.2 deep review)

#### 🔴 Critical Fixes

- **CR-01: Summary EVM uses unified eligibility set** (`evmFiltered`)
  - **Before**: `evmAll = all.filter(!isMilestone)` — could include LOE + unbaselined
  - **After**: `evmAll = evmFiltered` — excludes LOE/TT_LOE + unbaselined + milestones + summaries
  - **Impact**: BAC/PV/EV/SPI/CPI now reflect baseline-controlled scope only
  - **Reference**: PMI EVM, AACE 86R-14

- **CR-02: Unbaselined activities excluded from official totals**
  - **Added**: `!r.isUnbaselined` to `evmFiltered` filter
  - **Impact**: Change-order activities don't inflate BAC/EV before baseline revision
  - **Reference**: Round 9.2 Scenario C — totals went from 6700 → 3500 (correct baseline-only)

#### 🟡 High Severity Fixes

- **HI-02: S-Curve Earned redesigned (no more cumPlanned × earnedRatio)**
  - **Before**: `earned = cumPlanned * earnedRatio` (mirrored planned shape)
  - **After**: Earned built from actual dates per activity (completed/in-progress/no-actual)
  - **Impact**: Chart now shows real lags/jumps/recovery patterns

- **HI-03: WBS rollup uses baseline weights**
  - **Before**: `for (const r of all.filter(!isMilestone))` + `totalCost(r._raw)` (progress-mutable)
  - **After**: `for (const r of evmFiltered)` + `(r.bac || 0)` (baseline)
  - **Impact**: WBS totals match summary EVM totals consistently

- **ME-01: Calendar-aware planned percentage**
  - **Added**: `_workingHoursBetween()` helper using workWeek + holidays + exceptions
  - **Behavior**: Tries calendar-aware first, falls back to linear if calendar missing
  - **Impact**: Saudi 5/6/7-day calendars + Eid holidays now reflected in planned%
  - **Reference**: AACE 38R-06

#### 🟢 Test Updates

- **Patch 5: normalizePct(1.5) now means 1.5%** (per Oracle P6 docs)
- **Patch 6: Phase 2 R1 string checks updated** to firstNonNull pattern

### Test Coverage
- Phase 1: 36/36 ✅
- Phase 2: 40/40 ✅
- E2E:     28/28 ✅
- Round 9.2 regressions: 22/22 ✅
- Scenario C: 13/13 ✅
- **TOTAL: 139/139 tests passing (100%)** ⭐

### Refs
- ChatGPT Round 9.2 deep review (50-file package, 95% accuracy)
- See `docs/reviews/round-9-2-chatgpt/` for full audit reports
- Standards: PMI, AACE, GAO, DCMA, EIA-748, SEC, NG SA

---

## [29.0.11.2] — 2026-05-06 — Round 8 Hotfix (Gemini G1+G2)

### Fixed
- 🔴 **G1**: NG SA Certificate Sequence Validation (was missing!)
- 🔴 **G2**: FAC ≤ PAC Cross-Validation (was insufficient!)

---

## [29.0.11.1] — 2026-05-06 — Round 7 Hotfix (R1 + R2)

### Fixed
- 🔴 **R1**: `getActualPctRatio()` now falls back gracefully when pctType-specific field is missing
  - Before: `{pctType: 'Physical', physicalPct: undefined, pctComplete: 0.45}` returned `0`
  - After: returns `0.45` (preserves Manual+0 behavior + uses fallback chain)
- 🔴 **R2**: `_calculateNetworkLongestPath()` now handles ObjectId-based relationships
  - Before: activities with both `id`+`actId` keyed by `actId` only, dropping ObjectId-based rels
  - After: multi-key alias map (`actId`, `id`, `objectId`) + canonicalKey + uniqueKeys deduplication

### Improved
- 🟡 **T1+T2**: Test files now extract REAL helpers from `p6-analyzer.html`
  - Phase 1 tests: extracts `getActualPctRatio` from source (no parallel definition)
  - Phase 2 tests: extracts `isLOEActivity`, `auditCalendarSAHolidays`, `buildExpectedSAHolidays` from source
- 🟢 NEW: `tests/integration/test_e2e_analyze.cjs` — verifies analyze() output structure

### Test Coverage
- Phase 1: 36/36 (was 28, +8 R1+R2 verification)
- Phase 2: 40/40 (was 32, +8 fix presence checks)
- E2E:     28/28 (NEW)
- **Total: 104/104** ⭐

### Refs
- ChatGPT Round 7 review (Issue #1 follow-up)
- See `docs/reviews/round-7-chatgpt/`

---

## [29.0.11] — 2026-05-06 — Phase 2 Major Fixes ⭐

### Added
- **Multi-day holidays full coverage check** — Saudi holidays now tracked with `complete/partial/missing` status
- **`isLOEActivity()` helper** — Detects Level of Effort activities (LOE, TT_LOE, etc.)
- **PMI-standard EVM forecasts**:
  - `EAC₁ = BAC / CPI` (default optimistic)
  - `EAC₂ = AC + (BAC - EV)` (mid)
  - `EAC₃ = AC + (BAC - EV) / (CPI × SPI)` (worst-case)
- **`VAC`** (Variance at Completion) = BAC - EAC₁
- **`TCPI`** for both BAC and EAC
- **Cost coverage warning** in EVM tab (alert/warning/ok status)
- **Worst-case warning** when CPI × SPI < 0.95
- New summary fields: `partial[]`, `coveredDays`, `totalDays`, `configStatus`, `daysCoveragePct`
- 6 new EVM cards in EVM tab + 2 warning banners (bilingual)
- **CLAUDE.md** instructions for Claude Code
- **tests/** folder with 60 functional tests (28 Phase 1 + 32 Phase 2)
- **code-split/** updated to reflect v29.0.11

### Fixed
- 🟡 **MAJOR**: `auditCalendarSAHolidays` was using `break;` after first matched day — false `configured=true` for partial multi-day holiday coverage
- 🟡 **MAJOR**: LOE activities were inflating duration-weighted progress in `evmFiltered` (both main + ExecutiveDashboard override)
- 🟡 **MAJOR**: EVM had only single EAC formula — no VAC/TCPI/worst-case awareness
- 🟡 **MEDIUM**: No warning when cost loading was incomplete (< 70% coverage)

### Changed
- `auditCalendarSAHolidays` returns 4 new fields and 3-state `configStatus`
- CalendarsPanel UI: 3-color status (green/amber/red) with `1/5d` badge for partial
- EVM tab: 6 new cards + worst-case warning + cost coverage warning
- Backward compatibility: `configured` field still returns `true/false` (true only for "complete")

### Test Coverage
- ✅ **32/32 Phase 2 functional tests pass**
- ✅ Phase 1 regression tests still pass (28/28)
- ✅ **Total: 60/60 tests across both phases**
- Tests are now committed in `tests/` directory

### Multi-AI Review
- Claude (Round 1, 4): 88% / 96% accuracy
- ChatGPT (Round 3, 5, 6): 85% / 94% / 88% accuracy
- Gemini (Round 2): 25% accuracy ⚠️ (suggestions rejected)

### Production Readiness Update (per Round 6 review)
| Use Case | Status |
|----------|--------|
| Internal use | ✅ READY |
| Management reports | ✅ READY |
| **Claim-grade reports** | 🟡 **Candidate** — needs validation on real SEC schedules |
| **DCMA submission** | 🟡 **Candidate** — requires independent QA review |

> Note: "Candidate" status reflects best practice. All formulas implemented per PMI/DCMA standards with 60/60 functional tests. Independent validation on real cost-loaded schedules recommended before formal submissions.

---

## [29.0.10] — 2026-05-06 — Phase 1 Critical Fixes

### Added
- **EHC certification detection** (Energization & Holding Commissioning) — كان مفقوداً تماماً
- **ECC certification detection** (Equipment Commercial Commissioning) — كان مفقوداً تماماً
- **`getActualPctRatio(p)` helper** — يحترم `pctType` في حساب الإنجاز
- **`_calculateNetworkLongestPath()` helper** — topological DP لحساب longest path شبكياً
- **Layer 4 negative context filter** في `findCertByRegex` — يرفض "Walkdown/Test Plan/Preparation"
- 6 شهادات في Executive Timeline (كان 4): Start → **EHC** → **ECC** → TCC → RTR → PAC → FAC → Finish

### Fixed
- 🔴 **CRITICAL**: `findLongestPathDuration` كان يجمع كل critical activities (خطأ في parallel paths)
- 🔴 **CRITICAL**: `actualPct` كان يستخدم `||` chain بدلاً من احترام `pctType` (خطأ يتراكم على 5 طرق حساب)
- 🔴 **HIGH**: `findCertByRegex` كان يقبل false positives مثل "PAC Walkdown"

### Changed
- ترتيب الشهادات في timeline: Start → EHC → ECC → TCC → RTR → PAC → FAC → Finish

### Test Coverage
- 22/22 اختبار وظيفي ناجح في Phase 1

### Reviewed by
- Claude (Round 1, 4) — 88% / 96% accuracy
- ChatGPT (Round 3, 5) — 85% / 94% accuracy

---

## [29.0.9.2] — 2026-05-05 — Refinements

### Added
- **3-tier strategy** في `findLongestPathDuration`:
  1. P6's native LongestPath flag
  2. TotalFloat ≤ 0 critical path
  3. Heuristic fallback
- **HoursPerDay من Calendar** بدلاً من hardcoded `/8`
- **Hijri post-2028 warning** — تحذير المستخدم بدلاً من تخمين خاطئ

### Fixed
- مشاريع 12-hour shift work يحسب durations بشكل صحيح
- مشاريع 10-hour calendars (HVDC) تظهر durations بدون تحويل خاطئ

### Changed
- `_rawPlannedDurationHours` و `_rawRemainingDurationHours` يُحفظان في كل activity
- post-processing loop يُعيد حساب durations بعد بناء `calendarsMap`

---

## [29.0.9.1] — 2026-05-05 — Section Reordering

### Changed
- إعادة ترتيب أقسام Executive Dashboard حسب طلب المستخدم
- Project Info → Detected Type → Briefing+Buttons → PROJECT PHASES → ExecStatus → Integrity

### Refactored
- استخراج Briefing+Buttons block كـ `_card_BriefingAndButtons`
- استخدام `React.Fragment` wrapper

---

## [29.0.9] — 2026-05-05 — Card-based Architecture

### Refactored
- 5,334-char inline render block مُقسّم إلى 10 `_card_*` variables
- يسهّل reordering وتعديل أقسام UI

### Fixed
- BUG-18: Division by zero في 7 مواقع — استخدام `(s.total > 0 ? ... : 0)`

---

## [29.0.8] — 2026-05-05

### Added
- `CalendarsPanel` يقرأ P6 XML calendars
- Saudi Arabia Holiday Audit feature (initial)
- Phase Discovery v2 (method-aware progress)
- 16 phase templates

---

## [29.0.7] — 2026-05-05 — Field-name fixes

### Fixed
- `a.actName` → `a.name` (22 sites)
- `a.wbsId` → `a.wbs` (11 sites)
- DCMA-04: `"FS"` → `"Finish to Start"` string match

### Performance
- O(n²) → Set-based for `withoutResources` calculation

---

## Roadmap

### [29.0.12] — Phase 3 (Nice to have) — متوقع خلال شهر

- [ ] Official P6 EVM fields parser (PlannedValueCost, EarnedValueCost, etc.)
- [ ] Resource Assignments parser للـ EVM rollup
- [ ] Boolean flexible parsing for `LongestPath` (Y/Yes/T/TRUE)
- [ ] MC vs TCC separation
- [ ] Recovery threshold verification (NG SA Manual)
- [ ] Project Type confidence + top candidates
- [ ] blended method documentation cleanup
- [ ] Independent validation on real SEC schedules (for claim-grade certification)

---

## Multi-AI Review Notes

كل إصدار يمر عبر مراجعة من 3 نماذج AI على الأقل:
- **Claude (claude.ai)** — مراجعة مفصلة + verification بـ grep
- **ChatGPT (chat.openai.com)** — مراجعة عميقة + counter-points
- **Gemini (gemini.google.com)** — مراجعة سريعة (احذر — دقة منخفضة)

التفاصيل في `docs/reviews/`.
