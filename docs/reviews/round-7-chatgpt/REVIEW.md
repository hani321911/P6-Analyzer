# Round 7 Review by ChatGPT — Follow-up after merge ff6ee67

**Author**: ChatGPT (Round 7)
**Date**: 2026-05-06
**Issue**: #1 (follow-up comment)
**Reviewed commit**: `ff6ee67ce9b5034cc4f0aaf4c18fb6123b367b32`

> ChatGPT's follow-up review after Claude.ai's Round 6 fixes (commits 6b7d86f + ff6ee67).
> Identified 2 remaining technical bugs (R1, R2) and test quality concerns (T1, T2).

---

## Summary

Good progress on governance items, but two prior technical hotfix concerns remain visible
in `code-split`, and the newly committed tests are partially structural rather than fully
verifying the executable implementation.

## ✅ Items resolved by previous merge (ff6ee67)
- code-split/ regenerated and synced with v29.0.11
- tests folder added (tests/README.md)
- Claim-grade / DCMA wording downgraded to "Candidate"
- README updated to v29.0.11
- Push policy added to CLAUDE.md

## ⚠️ Remaining technical issues

### R1 — getActualPctRatio() fallback strict for missing pctType-specific field
- Type=Physical + physicalPct=undefined + pctComplete=0.45 → returns 0 (BUG)
- Expected: 0.45 (graceful fallback)

### R2 — Longest Path actId/id mismatch unresolved
- Activities with both id and actId
- Relationships using id (ObjectId) — relationships dropped
- Expected: alias map for all ID variants

## Test quality observations
### T1 — Phase 2 tests use copied helper logic, not actual app code
### T2 — Phase 1 pctType test defines manual helperText, not real getActualPctRatio

## Recommended next commit
`fix: close Round 6 technical verification gaps`

- [ ] Add pctType selected-field-missing fallback
- [ ] Add ObjectId-based Longest Path test
- [ ] Update _calculateNetworkLongestPath() mapping if needed
- [ ] Add end-to-end analyze() EVM test
- [ ] Re-run 60+ tests
- [ ] Then close Issue #1
