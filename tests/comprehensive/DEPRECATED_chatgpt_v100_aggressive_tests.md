# ⚠️ DEPRECATED: chatgpt_v100_aggressive_tests.cjs

## Status: **OBSOLETE — DO NOT USE**

This file was created by ChatGPT during the v100 audit (v29.0.11.10 era).
It contains **STALE LOCAL COPIES** of helper functions:

- `evalCurve()` — embedded old formula (gives 18.77% at midpoint, not 80%)
- `applyROC()` — embedded old logic (no validation)
- `totalCost()` — DOUBLE-COUNTS (sums `atCompletionExpenseCost` + `_derivedTotalCost`)

## Why It's Stale

When Claude fixed the real code in v29.0.11.11, this test file's local copies 
were **never updated**. Running it against the new code still shows the old 
behavior because the test doesn't read the real code.

### Example of the bug in this test:

```javascript
// This test's local totalCost (line 37):
function totalCost(a){ 
  return ['plannedNonLaborCost','plannedLaborCost','plannedMaterialCost',
          'plannedExpenseCost',
          'atCompletionExpenseCost',  // ← Included
          '_derivedTotalCost']        // ← Also included (DOUBLE!)
         .reduce((s,k)=>s+(Number(a[k])||0),0); 
}
```

For projects using `expense_weightage` cost method:
- `atCompletionExpenseCost` = $2.89B
- `_derivedTotalCost` = $2.89B (same value, Smart Detection copy)
- **Sum** = $5.78B (double-counted!)

## Replacement

Use `REAL_CODE_verification.cjs` instead, which:
1. Parses the actual HTML file
2. Extracts functions via AST
3. Runs against the real, current code

```bash
P6_HTML=code/p6-analyzer-v29.0.11.11.html node tests/REAL_CODE_verification.cjs
# Expected: 38/38 passed
```

## Why We Keep This File

For historical reference and to document why ChatGPT's previous "45/55" 
result was misleading. The file is **NOT** part of the validation pipeline.

## Acknowledgement

Per ChatGPT v100.1 audit (2026-05-11):
> "The old `chatgpt_v100_aggressive_tests.cjs` benchmark remains stale and 
> hung/timed out in this environment; it should be replaced or rewritten to 
> extract the real functions."

This file is officially **RETIRED** in v29.0.11.12.

---

## Active Tests in v29.0.11.12

| Test File | Status | Purpose |
|-----------|:------:|---------|
| `tests/REAL_CODE_verification.cjs` | ✅ Active | Extracts real functions, primary verification |
| `tests/test_09_smart_cost_detection.cjs` | ✅ Active | Basic Smart Cost detection |
| `tests/test_10_audit_fixes_and_fields.cjs` | ✅ Active | Audit fixes + UI |
| `tests/test_11_v100_enhancements.cjs` | ✅ Active | v100 enhancement coverage |
| `tests/scenarios/test_smart_detection.cjs` | ✅ Active | 25 real-world contractor scenarios |
| `tests/scenarios/test_extreme_cases.cjs` | ✅ Active | 19 extreme edge cases |
| `tests/scenarios/test_calculation_accuracy.cjs` | ✅ Active | EVM calculation accuracy |
| `benchmarks/chatgpt_aggressive_tests.cjs` | ⚠️ Partial | 75 scenarios, 4 known false expectations |
| `benchmarks/chatgpt_v100_aggressive_tests.cjs` | ❌ **DEPRECATED** | Stale local copies — see above |

---

**Last Updated**: 2026-05-11 (v29.0.11.12 release)
