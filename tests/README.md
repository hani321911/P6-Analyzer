# 🧪 Test Suite

> Tests for P6 Analyzer functional verification.

## 📋 Test Coverage

| Phase | File | Tests | Description |
|-------|------|:-----:|-------------|
| Phase 1 | `phase1/test_v29_0_10.cjs` | 28 | EHC/ECC, pctType, longest path, negative filter |
| Phase 2 | `phase2/test_phase2.cjs` | 32 | Multi-day holidays, LOE, EAC formulas, cost coverage |

**Total**: 60 functional tests across both phases.

---

## 🚀 How to Run

### Run all tests:
```bash
# From repo root
node tests/phase1/test_v29_0_10.cjs
node tests/phase2/test_phase2.cjs
```

### Run a single phase:
```bash
node tests/phase2/test_phase2.cjs
```

### Expected output:
```
═══════════════════════════════════════════════════════════
  PHASE X TEST SUITE — vXX.X.XX
═══════════════════════════════════════════════════════════

▶ FIX X.Y — [test name]
───────────────────────────────────────────────
  ✓ test 1
  ✓ test 2
  ...

═══════════════════════════════════════════════════════════
  PHASE X RESULTS: XX/XX tests passed
═══════════════════════════════════════════════════════════
```

Exit code:
- `0` = all tests passed
- `1` = at least one test failed

---

## 🔬 Phase 1 — Critical Fixes Tests (v29.0.10)

### TEST 1: getActualPctRatio respects pctType (10 cases)
- Manual + 0 → 0 (regression test for old `||` chain bug)
- Physical/Duration/Units fallbacks
- Edge cases: null, NaN, out-of-range

### TEST 2: findLongestPathDuration network DP (5 cases)
- **Parallel paths (50d + 60d) → 60d** (was 110d)
- Linear paths
- Cycle detection (no infinite loop)
- Empty input handling

### TEST 3: Negative context filter (7 cases)
- Rejects: "PAC Walkdown", "TCC Test Plan", "Pre-PAC", "FAC Preparation"
- Accepts: "PAC Achievement", "TCC Issuance", "FAC Certificate"

### TEST 4: EHC + ECC patterns (6 cases)
- EHC: "EHC Unit 1", "Energization & Holding Commissioning"
- ECC: "ECC Achievement", "Equipment Commercial Commissioning"

---

## 🔬 Phase 2 — Major Fixes Tests (v29.0.11)

### TEST 1: Multi-day holidays (5 cases)
- Eid Al-Adha 5-day coverage scenarios
- Status: complete / partial / missing
- New fields: `coveredDays`, `totalDays`, `daysCoveragePct`

### TEST 2: LOE Activity Exclusion (8 cases)
- Detects: "Level of Effort", "LOE", "TT_LOE"
- Doesn't false-positive: "Task Dependent", "Resource Dependent"
- Null safety

### TEST 3: EAC1/EAC2/EAC3 + VAC + TCPI (11 cases)
- Realistic scenario: SPI=0.714, CPI=0.833
  - EAC1 = 1.2M (correct)
  - EAC2 = 1.1M (correct)
  - EAC3 = 1.44M (worst case)
  - VAC = -200K
- Worst-case warning trigger
- Edge cases: PV=0, CPI=0

### TEST 4: Cost Coverage Warning (4 cases)
- 100% / 80% / 60% / 25% scenarios
- Status thresholds: ok (≥70%) / warning (50-70%) / alert (<50%)

### Regression Checks
- Phase 1 fixes still in code

---

## 📊 Latest Results

| Phase | Pass | Total | Status |
|-------|:----:|:-----:|:------:|
| Phase 1 | 28 | 28 | ✅ 100% |
| Phase 2 | 32 | 32 | ✅ 100% |
| **Total** | **60** | **60** | **✅ 100%** |

---

## 🛠️ Adding New Tests

When implementing new fixes:
1. Add test cases to the appropriate phase file
2. Update test count in this README
3. Run tests before commit
4. Document in CHANGELOG.md

---

## 🤖 CI Integration

`.github/workflows/syntax-check.yml` runs syntax validation on every push.
For full functional tests, run manually before each release.

Future: add functional test runs to CI workflow.
