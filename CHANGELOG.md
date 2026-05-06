# 📝 Changelog

كل التغييرات الملحوظة في هذا المشروع.

التنسيق مبني على [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)،
والمشروع يلتزم بـ [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
- ✅ **32/32 functional tests pass**
- ✅ Phase 1 regression tests still pass (28/28)
- ✅ **Total: 60/60 tests across both phases**

### Multi-AI Review
- Claude (Round 1, 4): 88% / 96% accuracy
- ChatGPT (Round 3, 5): 85% / 94% accuracy
- Gemini (Round 2): 25% accuracy ⚠️ (suggestions rejected)

### Production Readiness Update
| Use Case | v29.0.10 | **v29.0.11** |
|----------|----------|--------------|
| Internal use | ✅ READY | ✅ READY |
| Management reports | ✅ READY | ✅ READY |
| **Claim-grade reports** | 🟡 CAUTION | ✅ **READY** ⭐ |
| **DCMA submission** | 🟡 CAUTION | ✅ **READY** ⭐ |

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
- 🔴 **CRITICAL**: `actualPct` كان يستخدم `||` chain بدلاً من احترام `pctType`
- 🔴 **HIGH**: `findCertByRegex` كان يقبل false positives مثل "PAC Walkdown"

### Test Coverage
- 22/22 اختبار وظيفي ناجح

---

## [29.0.9.2] — 2026-05-05 — Refinements

### Added
- **3-tier strategy** في `findLongestPathDuration`
- **HoursPerDay من Calendar** بدلاً من hardcoded `/8`
- **Hijri post-2028 warning**

---

## [29.0.9.1] — 2026-05-05 — Section Reordering

### Changed
- إعادة ترتيب أقسام Executive Dashboard
- استخراج `_card_BriefingAndButtons`

---

## [29.0.9] — 2026-05-05 — Card-based Architecture

### Refactored
- 5,334-char inline render block مُقسّم إلى 10 `_card_*` variables

### Fixed
- BUG-18: Division by zero في 7 مواقع

---

## Roadmap

### [29.0.12] — Phase 3 (Nice to have) — متوقع خلال شهر

- [ ] EVM official P6 fields parser
- [ ] Resource Assignments parser
- [ ] Boolean flexible parsing for `LongestPath`
- [ ] MC vs TCC separation
- [ ] Recovery threshold verification (NG SA Manual)
- [ ] Project Type confidence scoring
- [ ] blended method documentation cleanup
