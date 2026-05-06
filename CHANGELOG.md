# 📝 Changelog

كل التغييرات الملحوظة في هذا المشروع.

التنسيق مبني على [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)،
والمشروع يلتزم بـ [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- 🔴 **HIGH**: `findCertByRegex` كان يقبل false positives مثل "PAC Walkdown" كشهادة

### Changed
- ترتيب الشهادات في timeline: Start → EHC → ECC → TCC → RTR → PAC → FAC → Finish

### Test Coverage
- 22/22 اختبار وظيفي ناجح
- ✓ Parallel critical paths (50+60) returns 60 (not 110)
- ✓ Manual pctType + pctComplete=0 returns 0 (not 0.5)
- ✓ Negative context filter rejects 4/4 false positives
- ✓ EHC/ECC regex matches 10/10 cases correctly

### Reviewed by
- Claude (Round 1, 4) — 88% / 96% accuracy
- ChatGPT (Round 3, 5) — 85% / 94% accuracy
- Gemini (Round 2) — 25% accuracy

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
- Saudi Arabia Holiday Audit feature
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

### [29.0.11] — Phase 2 (Major) — متوقع خلال أسبوع

- [ ] Multi-day holidays full coverage check (replace `break` with full count)
- [ ] LOE activities exclusion from progress/EVM
- [ ] EAC1/EAC2/EAC3 + VAC + TCPI formulas
- [ ] Cost coverage warning في UI

### [29.0.12] — Phase 3 (Nice to have) — متوقع خلال شهر

- [ ] EVM official P6 fields parser (PlannedValueCost, EarnedValueCost, etc.)
- [ ] Resource Assignments parser للـ EVM rollup
- [ ] Boolean flexible parsing for `LongestPath` (Y/Yes/T/TRUE)
- [ ] MC vs TCC separation
- [ ] Recovery threshold verification وفقاً لـ NG SA Manual
- [ ] Project Type confidence + top candidates
- [ ] blended method documentation cleanup

---

## ملاحظات Multi-AI Review

كل إصدار يمر عبر مراجعة من 3 نماذج AI على الأقل:
- **Claude (claude.ai)** — مراجعة مفصلة + verification بـ grep
- **ChatGPT (chat.openai.com)** — مراجعة عميقة + counter-points
- **Gemini (gemini.google.com)** — مراجعة سريعة (احذر — دقة منخفضة)

التفاصيل في `docs/reviews/`.
