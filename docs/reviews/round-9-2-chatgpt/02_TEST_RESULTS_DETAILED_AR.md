# 02_TEST_RESULTS_DETAILED_AR

**Self-assessed accuracy:** 95%  
**Reviewing:** `v29.0.11.3` **(NOT v29.0.11.2)**  
**SHA:** `7decb08c14b9b227fbb68b16d49bf33b7b52882bac793ec0f7e93d94bce4bc4f`  
**Scope:** Official tests + custom numerical tests for progress calculation correctness.

## Test environment

- Source file: `p6-analyzer-v29.0.11.3-WIP.html`
- SHA verified against `sha256.txt`: `7decb08c14b9b227fbb68b16d49bf33b7b52882bac793ec0f7e93d94bce4bc4f`
- Local execution: Node.js test suites bundled in the ZIP
- Custom audit script: `round9_2_formula_audit.cjs`

## Official test execution summary

| Suite | Result | Exit | Notes |
|---|---:|---:|---|
| Phase 1 | 35/36 | 1 | Only failure: old `1.5` clamp expectation |
| Phase 2 | 38/40 | 1 | Two false/static checks expecting old `??` string pattern |
| Integration E2E | 28/28 | 0 | Output structure and EVM UI checks pass |
| Round 9 regression test 8 | 7/20 | 1 | Many failures are static/runner expectations not directly progress-calculation focused |
| Custom formula audit | 52/52 Actual cases; 10/18 Planned best-practice cases | 0 | Planned failures caused by current linear calendar-day method |

## Full official logs

- `logs/phase1.log`
- `logs/phase2.log`
- `logs/integration_e2e.log`
- `logs/round9_regressions.log`
- `logs/custom_formula_audit.log`
- `logs/custom_formula_audit_results.json`

## Phase 1 important failure

```text
✗ FAIL: Out-of-range (1.5) clamped to 1
```

### Assessment
This is not necessarily a product bug. Based on official Oracle P6 field documentation, percent complete fields are percent values in the 0–100 domain. Under that interpretation, `1.5` means **1.5%**, so v29.0.11.3 returning `0.015` is defensible. The test should be updated unless the app explicitly switches to ratio-only internal fixtures.

## Phase 2 important failures

```text
✗ FAIL: R1 fix present: physical with fallback chain
✗ FAIL: R1 fix present: duration with fallback chain
```

### Assessment
These are static string checks looking for the old nullish-coalescing pattern. The code now implements fallback via `firstNonNull(...)` at L7310-L7334, so functional behavior is present. Update the tests to detect the new pattern.

## Custom Actual % testing

**Result:** 52/52 cases matched the expected behavior of the current implementation.

Key confirmations:
- Manual `0` is preserved.
- Physical/Duration/Units branch preference is respected.
- Missing primary field falls back without treating missing as zero.
- Negative percent clamps to 0.
- Percent values above 1 and up to 100 are interpreted as 0–100 percent.
- `150` clamps to 100%.
- Direct string `"50%"` is not accepted by `Number()`, but parser-level `parseFloat("50%")` would become 50.

## Custom Planned % testing

**Result:** 10/18 passed against best-practice expectations.

The failures are expected because current `calcPct()` is only:

```js
(dataDate - plannedStart) / (plannedFinish - plannedStart)
```

It does not use:
- activity calendar working days,
- Saudi holidays,
- calendar exceptions,
- resource curves,
- cost curves,
- physical quantity plans,
- milestone weights,
- equivalent units.

## Boundary value analysis

| Boundary | Current behavior | Verdict |
|---|---|---|
| `null` percent | fallback/0 | Good |
| `undefined` percent | fallback/0 | Good |
| explicit `0` | preserved | Good |
| `NaN` | skipped or 0 | Good |
| `1` | 100% | Acceptable for ratio mode |
| `100` | 100% | Good for P6 percent mode |
| `1.5` | 1.5% | Correct for P6 percent mode; conflicts with old test |
| `150` | 100% | Good clamp |
| `"50"` | 50% | Good |
| `"50%"` direct | 0 | Harden recommended if values can bypass parser |

## Real-world scenario execution

### A — NG SA Substation

Verdict: **Partial/Fail**

- Multiple calendars are parsed.
- Saudi holidays can be audited.
- LOE helper exists.
- But planned progress ignores calendar workweek/holiday exceptions.
- Summary totals still can include `TT_LOE` because they use `evmAll`, not `evmFiltered`.

### B — Transmission Line / LOM

Verdict: **Partial**

- Mixed pctType works at activity actual% level.
- However planned progress cannot yet be quantity-based for foundations/towers/stringing.
- Testing milestone-weighted method is not implemented as a true method; NG matrix may approximate by name/WBS, but not by explicit milestone weights.

### C — Schedule update mid-project

Verdict: **Fail for official totals**

Current code totals:

```json
{
  "totalBac": 6700,
  "totalPV": 3350,
  "totalEV": 2600,
  "totalAC": 2200,
  "count": 6
}
```

Expected after patch:

```json
{
  "totalBac": 3500,
  "totalPV": 1750,
  "totalEV": 1000,
  "totalAC": 1400,
  "count": 4
}
```

Root cause: `isUnbaselined` and `TT_LOE` are not excluded from summary totals.

### D — Curve distortion

Verdict: **Fail for S-Curve, pass for row totals**

Synthetic case produced:

```json
{
  "totalBac": 3000,
  "totalPV": 1500,
  "totalEV": 1000,
  "totalAC": 1000,
  "count": 3
}
```

This gives SPI = 1000 / 1500 = 0.667 directionally as expected. But chart earned curve remains distorted because earned is calculated as `cumPlanned * earnedRatio`.

### E — Calendar edge cases

Verdict: **Partial/Fail**

- HoursPerDay is parsed and used for duration conversion.
- Holiday audit exists.
- Planned% does not consume workweek/holiday data.

## Performance impact

Current calculation is O(n) for rows and bounded for S-Curve with a 10,000-activity slice and 600-month guard. Proposed calendar-aware planned% adds O(activity × days) if implemented naïvely. The patch includes a 4,000-day guard and should be acceptable for NG SA schedules, but a cached calendar working-day index would be better if projects exceed ~10,000 activities.

## Re-run command reference

```bash
cd round9-recheck-package
cp p6-analyzer-v29.0.11.3-WIP.html p6-analyzer.html
node tests/phase1/test_v29_0_10.cjs
node tests/phase2/test_phase2.cjs
node tests/integration/test_e2e_analyze.cjs
node tests/comprehensive/test_08_round9_regressions.cjs
node round9_2_formula_audit.cjs
```
