# 📝 Changelog

كل التغييرات الملحوظة في هذا المشروع.

التنسيق مبني على [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)،
والمشروع يلتزم بـ [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> ⚠️ **Policy**: This file is **append-only**. Older release details are preserved for traceability and audit purposes.

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
