# P6 Analyzer v29.0.9.2 — معمارية النظام / System Architecture

**Version**: v29.0.9.2 (latest)
**Last Updated**: 2026-05-06
**File Size**: 1.37 MB single-file HTML
**Total Lines**: ~20,025
**Tech Stack**: React 19.2.5 (CDN), Pure JavaScript (no build step), Single-file HTML
**Author**: Hani Taysseer (SEC Planning Engineer, Jeddah, Saudi Arabia)

## 🆕 v29.0.9.2 Changes (Latest)
1. **`findLongestPathDuration` 3-tier strategy**: P6's LongestPath flag → TotalFloat≤0 critical path → heuristic fallback
2. **HoursPerDay from calendar**: Replaces hardcoded `/8` for hours-to-days conversion (post-processing loop)
3. **Hijri post-2028 warning**: `_warning` attached to holiday array + displayed in CalendarsPanel
4. **`longestPath` field**: Now read from P6 XML in parseP6XML

---

## 1. Executive Summary / الملخص التنفيذي

**P6 Analyzer** is a **single-file HTML application** for analyzing **Primavera P6 schedules** (XML/XER format). It compares baselines vs progress, calculates progress using 6 different methods, audits schedule quality against industry standards (DCMA, PMI, GAO, AACE), and generates executive PDF/Word/CSV reports.

The tool is specifically tailored for **Saudi Electricity Company (SEC) National Grid SA** projects, with built-in compliance for:
- NG SA Project Scheduling and Control Manual (Feb 2016)
- Saudi Arabia official holidays (Gregorian + Hijri 2024-2028)
- 10 NG project types (Substations, OHTL, UG Cables, HVDC, Telecom, etc.)
- Bilingual support (Arabic/English) with full RTL/LTR

---

## 2. Top-Level Architecture / المعمارية العليا

```
┌──────────────────────────────────────────────────────────────────┐
│                    SINGLE-FILE HTML APPLICATION                   │
│                                                                    │
│  ┌──────────────┐     ┌──────────────┐    ┌──────────────────┐  │
│  │  React CDN   │ ──► │  App Script  │ ──► │ Single Root <div>│  │
│  │  (vendor)    │     │  (~19,500 L) │    │  Mounted by React│  │
│  └──────────────┘     └──────────────┘    └──────────────────┘  │
│                                                                    │
└──────────────────────────────────────────────────────────────────┘

         ▼ User uploads files                ▼ Display
┌──────────────────────┐              ┌──────────────────────────┐
│  File Slots:         │              │  17 Tabs:                 │
│  - Original Baseline │              │  exec, methods, scurve,   │
│  - Revised Baseline  │              │  acts, crit, late, evm,   │
│  - Progress (latest) │              │  dcma, lookahead, nf, oe, │
└──────────────────────┘              │  rh, sv, ll, sd, ac, code │
         │                            └──────────────────────────┘
         ▼
┌──────────────────────────────────────────────────────────────────┐
│                    DATA FLOW PIPELINE                              │
│                                                                    │
│  parseP6XML()  ──►  analyze()  ──►  ExecutiveDashboard render     │
│                          │                                         │
│                          ├──► DCMA 14-point check                  │
│                          ├──► PMI standards                        │
│                          ├──► GAO best practices                   │
│                          ├──► AACE 38R-06                          │
│                          ├──► NG SA compliance                     │
│                          ├──► Phase discovery (16 templates)       │
│                          ├──► Milestone tracking                   │
│                          ├──► Calendar audit (SA holidays)         │
│                          ├──► EVM (Earned Value Management)        │
│                          └──► Recovery schedule trigger            │
└──────────────────────────────────────────────────────────────────┘
```

---

## 3. File Structure / بنية الملف

```
p6-analyzer-v29.0.9.1.html (1.4 MB, ~19,929 lines)
│
├── <!DOCTYPE html>
├── <head>: meta + CSS variables for dark theme
│
├── <body>:
│   ├── <div id="root"></div>              ← React mount point
│   ├── <script>...React vendor (193K)...</script>
│   └── <script>                            ← Main app script (1.2 MB, ~19,589 lines)
│         ├── i18n strings (English + Arabic)
│         ├── Constants & libraries (PHASE_LIBRARY, NG_PHASE_PATTERNS, etc.)
│         ├── Helper functions
│         ├── Audit functions (DCMA, PMI, GAO, AACE)
│         ├── parseP6XML
│         ├── analyze() ← main computation
│         ├── React components (~50+)
│         ├── ExecutiveDashboard ← main render
│         ├── AuditPanel ← baseline quality auditor
│         └── App ← root component (file upload, state)
│       </script>
│
└── </body>
```

---

## 4. Key Modules / الوحدات الرئيسية

### 4.1 Data Layer

#### `parseP6XML(xmlText, filename)` — Lines ~5513-6130
Parses Primavera P6 XML or XER files. Extracts:
- **Activities**: actId, name, plannedStart/Finish, actualStart/Finish, totalFloat, status, durations, costs, EVM data
- **WBS**: hierarchical work breakdown structure with parent/child relationships
- **Relationships**: predecessor/successor logic, lag, type (FS/SS/FF/SF)
- **Calendars**: Working hours/days, holidays, exceptions (CalendarObjectId, StandardWorkWeek, HolidayOrException)
- **Project metadata**: name, dataDate, version, start/finish dates

#### `analyze(baseline, progress, revisedBL)` — Lines ~6692-7790
**The heart of the system.** Returns a comprehensive `result` object containing:

```typescript
{
  // Activities & Structure
  rows: Activity[],             // All activities with computed fields
  milestoneRows: Milestone[],   // Filtered milestones
  wbsBreakdown: WbsRow[],       // WBS hierarchy with progress
  wbsMeta: { groupLevel, totalPackages, displayedPackages, maxDepth },

  // Summary metrics
  summary: {
    total, completed, inProgress, notStarted, critical, behind,
    overallSPI, overallCPI, totalBac, totalEV, totalAC, totalPV
  },

  // Progress methods (6 calculation methods)
  methodResults: {
    duration, cost, units, count, ng_matrix, blended
  },
  recommended: 'cost' | 'duration' | 'ng_matrix' | ...,

  // Project metadata
  timeline: { slipPRvsBL, slipBLvsOrig, slipPRvsOrig },
  dataDate: '2025-XX-XX',
  noProgress: boolean,

  // Compliance & Quality
  integrityIssues: Issue[],
  integrityScore: number (0-100),
  filenameValidation: { valid, reason, ... },
  filenameValidations: Record<string, validation>,

  // Phase discovery
  phaseDiscovery: { phases, methodResults, ... },

  // NG SA specific
  isNGProject: boolean,
  ngMatrixColumn: 'ss_lines' | 'ohtl' | ... | null,
  ngTypeName: { en, ar } | null,
  milestoneCompliance: { has_TCC, has_PAC, has_FAC, ... }[],
  ngCompliance: { score, violations, ... },
  recoveryTrigger: { triggered, slipPct, totalDelayed, ... },
  preCommCompliance: PreCommItem[],

  // EVM
  evm: { /* Earned Value */ },

  // Project type & key milestones
  projectType: { key, name_en, name_ar, palette: { from, to } },
  keyMilestones: Milestone[],

  // Schedule integrity
  codeTypes: ActivityCode[],

  // Calendars
  calendars: Record<id, Calendar>,
  calendarTypeCounts: { Global, Project, Resource },
  saHolidayAudit: {
    primaryCalendar,
    audit: [{ date, en, ar, present }],
    coveragePct,
    present, missing
  } | null,

  // Internal (with _ prefix)
  _dcmaActivities, _dcmaRelationships, _varianceBaseline, _varianceProgress
}

// Note: blProj, prProj, origProj, blVer, prVer, oVer
// are NOT returned by analyze() — they are added AFTER analyze()
// in the runManual() function (around line 18900-18910).
```

### 4.2 Audit Functions

| Function | Lines | Purpose |
|----------|-------|---------|
| `runDCMAHealthCheck(activities, dataDate, relationships)` | 4151-4376 | DCMA 14-point assessment |
| `bqaDCMA14()` | 5905-6236 | Detailed DCMA breakdown |
| `bqaPMI()` | 6236-6314 | PMI Schedule Standards |
| `bqaGAO()` | 6314-6374 | GAO Best Practices |
| `bqaAACE()` | 6374-6503 | AACE 38R-06 |
| `bqaDetectProjectInfo()` | 6603-6692 | Auto-detect project type from activity names |

### 4.3 Specialized Analysis

| Function | Lines | Purpose |
|----------|-------|---------|
| `analyzeScheduleVariance()` | 4376-4945 | BL vs Progress comparison, BEI calculation |
| `analyzeOpenEnds()` | 4945-5104 | Activities missing predecessor/successor |
| `analyzeNegativeFloat()` | 5104-5240 | Activities with float < 0 |
| `buildLookahead()` | 5240+ | 4-week / 8-week lookahead views |
| `detectLogicLoops()` | ~6000+ | Circular dependency detection |
| `buildScheduleDensity()` | ~5500+ | Activity density per period |
| `buildResourceHistogram()` | ~5700+ | Resource loading curves |
| `discoverPhasesFromSchedule(rows, wbsMap, ngType)` | 2352-2530 | Auto-discover phases from activity names |
| `checkMilestoneCompliance(rows, ngType)` | ~3000+ | Verifies mandatory milestones (TCC, PAC, FAC, RTR, EHC, ECC) |
| `runComplianceCheck(rows, relationships, wbsMap)` | ~3146+ | NG SA 7-rule compliance |
| `validateNGFilename(filename)` | 3299-3335 | Filename pattern: `####-{V}{TYPE}{seq?}` |
| `checkRecoveryTrigger(rows, totalActivities)` | 3335-3378 | Triggers if 10%+ slip OR 30+ days |
| `auditCalendarSAHolidays(cal, projStart, projFinish)` | ~3120+ | Verifies Saudi holidays in calendar |
| `buildExpectedSAHolidays(projStart, projFinish)` | ~3060+ | Generates expected SA holidays for project span |

### 4.4 React Components Hierarchy

```
App (root, manages file slots + tab state)
├── FileUploader (3 slots: Original / Revised / Progress)
├── Tab buttons (4 visible: exec, methods, scurve, acts)
├── ReportsToolsDropdown (13 hidden tabs accessible via dropdown)
│
└── Active Tab Content:
    │
    ├── tab="exec" → ExecutiveDashboard (THE main view)
    │   ├── progressOnly banner (if no baseline)
    │   ├── Project Name selector
    │   ├── ProjectTypeBanner (Detected Project Type)
    │   ├── _card_DetectedType (KeyMilestonesPanel)
    │   ├── _card_BriefingAndButtons (NEW v29.0.9.1):
    │   │   ├── PROGRESS PERFORMANCE section (Planned/Variance/Actual)
    │   │   └── PROJECT SCHEDULE TIMELINE (TCC, RTR, PAC, FAC milestones)
    │   │   └── Action Buttons (Executive PDF, Print, Email, Audit)
    │   ├── PROJECT PHASES (PhaseTemplateSelector + PhaseTimeline)
    │   ├── _card_ExecStatus (status badge + variance + slip)
    │   ├── _card_Integrity (IntegrityAlert)
    │   ├── MilestoneCompliancePanel (NG mandatory milestones)
    │   ├── CalendarsPanel (calendars + SA holiday audit)
    │   ├── NGCompliancePanel (7 NG rules score)
    │   ├── RecoveryAlertPanel (if triggered)
    │   ├── FilenameValidatorPanel (per uploaded file)
    │   ├── PreCommCompliancePanel (substations only)
    │   ├── _card_Gauges (3 dial gauges)
    │   ├── _card_KpiCards (Total/Completed/Critical/Behind/SPI/CPI)
    │   ├── _card_Milestones (MilestonesSection)
    │   ├── _card_WbsBreakdown (WbsBreakdownSection)
    │   ├── _card_OrigTimeline (Original/Revised/Forecast)
    │   ├── _card_Distributions (Status + Variance dist)
    │   └── _card_DelayedMilestones (alert)
    │
    ├── tab="methods" → MethodCard grid + MethodExplanation
    ├── tab="scurve" → SCurveChart
    ├── tab="acts" / "crit" / "late" → Activities table
    ├── tab="evm" → EVM cards + EVMPerWBSTable + per-activity table
    ├── tab="dcma" → DCMAHealthPanel (lazy-loaded)
    ├── tab="lookahead" → LookaheadPanel
    ├── tab="nf" → NegativeFloatPanel
    ├── tab="oe" → OpenEndsPanel
    ├── tab="rh" → ResourceHistogramPanel
    ├── tab="sv" → ScheduleVariancePanel
    ├── tab="ll" → LogicLoopPanel
    ├── tab="sd" → ScheduleDensityPanel
    ├── tab="ac" → ActivityClusterPanel
    └── tab="code" → ActivityCodes Panel (inline)
    │
    └── AuditPanel (separate top-level — Baseline Quality Auditor)
```

---

## 5. Calculation Methods (6 methods) / طرق الحساب الستة

The system supports **6 progress calculation methods**, all calculated and shown side-by-side:

| Method | Formula | Best For |
|--------|---------|----------|
| `duration` | Σ(planned_dur × % comp) / Σ(planned_dur) | Time-based projects |
| `cost` | Σ(BAC × % comp) / Σ(BAC) | Cost-loaded schedules |
| `units` | Σ(planned_units × % comp) / Σ(planned_units) | Resource-loaded schedules |
| `count` | Count(completed) / Count(total) | Simple counts |
| `ng_matrix` | NG SA-prescribed weights per project type | NG SA projects |
| `blended` | Weighted blend of duration + cost | General-purpose |

The **`recommended`** method is determined by `bqaDetectProjectInfo()` based on:
- Detected project type
- Available data (BAC, units, etc.)
- NG matrix membership

---

## 6. State Management / إدارة الحالة

The app uses React `useState` (no Redux/Zustand). Key state:

```typescript
// In App component (~line 18686)
const [slots, setSlots] = useState({
  original: { file, parsed, version, ... } | null,
  revised:  { file, parsed, version, ... } | null,
  progress: { file, parsed, version, ... } | null
});
const [result, setResult] = useState(null);
const [loading, setLoading] = useState(false);
const [err, setErr] = useState(null);
const [activeMethod, setActiveMethod] = useState('cost');
const [tab, setTab] = useState('exec');

// In ExecutiveDashboard (~line 16365)
const [pdfLoading, setPdfLoading] = useState(false);
const [pdfError, setPdfError] = useState(null);
const [overrideType, setOverrideType] = useState(null);
const [phaseTemplate, setPhaseTemplate] = useState('discover');
```

---

## 7. Internationalization (i18n) / التدويل

Two complete dictionaries (English + Arabic) at lines ~440-2030:

```js
const I18N = {
  en: { /* ~600 keys */ },
  ar: { /* ~600 keys */ }
};
```

Used via `useLang()` context:
```js
const { t, m, lang } = useLang();
// t.kpiCompleted = "Completed" / "مكتمل"
// m.cost = "Cost-Weighted Σ(BAC × %) ÷ Σ(BAC)"
// lang = 'en' | 'ar'
```

The app supports **full RTL** when `lang === 'ar'` (uses `direction: rtl`, `borderInlineStart`, etc.).

---

## 8. Reports / التقارير

| Report | Function | Format | Lines |
|--------|----------|--------|-------|
| Executive PDF | `generateExecutivePDF()` | HTML → window.print() | 10021+ |
| Narrative Report | `generateNarrativeReport()` + `downloadNarrativeReport()` | HTML download (Word-compatible) | 14467, 14743 |
| CSV (multi-purpose) | `downloadCSV(filename, headers, rows)` | CSV with BOM (Excel-friendly) | 9908 |
| Integrity Issue CSV | `exportIntegrityIssueCSV(issue, lang)` | CSV per issue category | 9928 |

**CSV calls** (15 total): WBS breakdown, clusters, codes, trend, density, logic loops, variance, histogram, open ends, etc.

---

## 9. Saudi Arabia Specific Features / الميزات الخاصة بالسعودية

### 9.1 Holiday Audit
- **Founding Day** (22 Feb) — Gregorian
- **National Day** (23 Sep) — Gregorian
- **Eid Al-Fitr** — Hijri-based (3-day holiday after Ramadan)
- **Eid Al-Adha** — Hijri-based (4-day holiday during Hajj)
- **Ramadan** — Hijri-based (work hours typically reduced)

Hijri ↔ Gregorian conversion table for **2024-2028** is hardcoded in `SA_ISLAMIC_HOLIDAYS` (~line 3008).

### 9.2 NG SA Compliance
10 project types with specific:
- Phase libraries (e.g., Substations: Civil → Steel → E&I → Testing → RTR → TCC → PAC → FAC)
- Mandatory milestones (TCC=Technical Completion, PAC=Preliminary Acceptance, FAC=Final Acceptance, RTR=Reliability Test Run, EHC=Energization & Holding Commissioning, ECC=Equipment Commercial Commissioning)
- Filename convention: `####-{V}{TYPE}{seq?}` (e.g., `1234-1MP1`, `5678-2BPS`)
- Recovery trigger thresholds (10%+ slip OR 30+ days)

### 9.3 Pre-Commissioning Checks
For substations only — verifies presence of:
- HV/MV/LV testing milestones
- Protection settings verification
- SCADA integration tests
- Final HV switching
- Energization activities

---

## 10. Refactoring History / تاريخ التطوير الحديث

### v29.0.7
- Field-name bug fixes: `a.actName` → `a.name` (22 sites), `a.wbsId` → `a.wbs` (11 sites)
- DCMA-04: `"FS"` → `"Finish to Start"` string match
- Performance: O(n²) → Set-based (`withoutResources`)

### v29.0.8
- Added `CalendarsPanel` reading P6 XML calendars
- Saudi Arabia Holiday Audit feature
- Phase Discovery v2 (method-aware progress)
- 16 phase templates

### v29.0.9
- **Major refactor**: 5,334-char inline render block split into 10 separate `_card_` variables
- Section reordering per user request
- BUG-18 fix: Division-by-zero protection (7 locations: `(s.total > 0 ? ... : 0)`)

### v29.0.9.1 (current)
- **Briefing+Buttons block extracted** as `_card_BriefingAndButtons` (React.Fragment wrapper)
- Moved to render BEFORE PROJECT PHASES (per user request from screenshot)
- Final section order:
  1. Project Info
  2. Detected Project Type (banner + KeyMilestones)
  3. Progress Performance + Schedule Timeline + Action Buttons
  4. PROJECT PHASES
  5. EXECUTIVE STATUS
  6. Schedule Integrity Check
  7. (the rest in original order)

---

## 11. Known Architectural Decisions / القرارات المعمارية

1. **Single-file HTML** — No build step, runs offline, easy to share via email/USB
2. **No localStorage** — All state in-memory, no persistence between page reloads
3. **React 19.2.5 from CDN** — uses pre-compiled vendor script (esbuild output)
4. **Lazy-loading for heavy panels** — DCMAHealthPanel only computes when its tab is opened
5. **Inline rendering for many tabs** — `crit`, `late`, `evm`, `code`, `acts` are rendered inline in ExecutiveDashboard rather than as separate components (intentional, simplifies state passing)
6. **Field protection via fallbacks** — `(result.blProj && result.blProj.name) || (result.prProj && result.prProj.name) || "Project"`
7. **Try/catch coverage**: 140 try blocks with 122 catch handlers (good resilience)

---

## 12. File Sections Reference / مرجع أقسام الملف

| Lines | Section | File in code_split/ |
|-------|---------|---------------------|
| 1-2030 | i18n + project type definitions | `00_constants_and_i18n.js` |
| 2030-2796 | Phase library + templates + discoverPhasesFromSchedule | `01_phase_library_templates.js` |
| 2796-3299 | Mandatory milestones + Saudi holidays + calendar audit | `02_milestones_and_calendars.js` |
| 3299-3500 | NG filename validator + recovery + glossary + pre-comm | `03_ng_compliance_glossary.js` |
| 3500-6130 | parseP6XML — XML parser | `04_p6_xml_parser.js` |
| 6130-6692 | DCMA + PMI + GAO + AACE + project type detection | `05_audit_dcma_pmi_gao_aace.js` |
| 6692-7800 | analyze() main + return object | `06_analyze_main.js` |
| 7800-9908 | Helper components (Gauge, Card, Tab, etc.) | `07_helper_components.js` |
| 9908-11000 | downloadCSV + generateExecutivePDF + exportIntegrity | `08_pdf_csv_exports.js` |
| 11000-13000 | IntegrityAlert + DCMAHealthPanel + EVMTabPanel + ... | `09_panels_part1.js` |
| 13000-14467 | Lookahead + NegFloat + OpenEnds + ResourceHist + ... | `10_panels_part2.js` |
| 14467-14764 | generateNarrativeReport + downloadNarrativeReport | `11_narrative_report.js` |
| 14764-16365 | PhaseTemplateSelector + PhaseTimeline + Milestones + Calendars + NG + Recovery + Filename + PreComm | `12_phases_milestones_panels.js` |
| 16365-17415 | **ExecutiveDashboard** (main render — 1050+ lines) | `13_executive_dashboard.js` |
| 17415-18686 | AuditPanel (Baseline Quality Auditor) | `14_audit_panel.js` |
| 18686-19589 | App root (file slots + tab state + analyze caller) | `15_main_app.js` |

---

## 13. Recent Verified Tests / الاختبارات الموثقة

### ✅ Functional tests passed:
- `checkRecoveryTrigger`: Returns `triggered=true` when slip >10%, `false` when <10%
- `buildExpectedSAHolidays`: Returns 5 holidays for 2026 (Founding+Ramadan+Fitr+Adha+National)
- `auditCalendarSAHolidays`: Computes coverage% accurately (e.g., 1/5 → 20%)
- `_bqaDuration`: Handles all 5 edge cases (0, null, dates-only, etc.)
- `analyzeNegativeFloat`: Correctly detects activities with float < 0
- `validateNGFilename`: Returns `{valid, reason, projectNumber, version, type, ...}`
- `downloadCSV`: All 15 calls use `array of arrays` format (verified)

### ✅ Syntax: VALID
- Acorn parser: 158 body nodes, no errors
- Total `function` definitions: 117

### ✅ BUG-18 (division by zero): FIXED
All 7 unprotected divisions now use `(s.total > 0 ? ... : 0)` pattern.

---

## 14. Known Open Issues / القضايا المفتوحة

### 🟡 BUG-19 (low priority): Memory leak in long sessions
- `addEventListener` count: 8 types
- `removeEventListener` count: 6 types
- **Missing cleanup**: `error`, `load` events
- **Impact**: Negligible for normal use; minor leak in very long sessions

### 🟡 PERF-02: Hardcoded 8-hour workday assumption
Lines 5582-5585 use `/8` to convert hours to days. **Wrong** for 12-hr/10-hr workdays.

### 🟡 PERF-03: findLongestPathDuration is approximation
Line 6223 uses heuristic, not real CPM forward/backward pass.

---

## 15. How to Run / كيفية التشغيل

```bash
# Simply open the HTML file in any modern browser (Chrome/Firefox/Safari/Edge)
open p6-analyzer-v29.0.9.1.html

# Or serve locally (optional):
python3 -m http.server 8000
# Then visit http://localhost:8000/p6-analyzer-v29.0.9.1.html
```

**No build step. No npm install. No internet (after React CDN cached).**

---

## End of Architecture Document
