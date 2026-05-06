# Review: v29.0.11 Phase 2 verification notes

**Author**: ChatGPT (Round 6)
**Date**: 2026-05-06
**Issue**: #1
**Source**: GitHub Issue #1 by ChatGPT

> Original review by ChatGPT after v29.0.11 commit (21c569d). Preserved verbatim for traceability.

---

Reviewed commit: `21c569d65c95a3deeaaba083cdcb3112f3ad063d`
Base commit: `792e43852ad023bb1cd61e123c44961c3fef42bf`

## Summary

v29.0.11 shows good progress and appears to include the claimed Phase 2 work in the main executable/release files. However, ChatGPT did **not** recommend marking it as fully `claim-grade` / `DCMA-ready` until verification items are closed.

## Critical Issues Identified

### C1 — code-split/ stale vs p6-analyzer.html
- code-split was not updated in v29.0.11 commit
- Risk: future reviewers inspect old logic

### C2 — "Claim-grade" / "DCMA-ready" wording too strong
- Phase 3 items still pending
- Recommended: "Candidate — needs validation"

## Major Issues

### M1 — Verify Phase 2 in executable HTML (grep evidence requested)
### M2 — No test files committed despite "60/60" claim
### M3 — Verify Longest Path actId/id mapping + getActualPctRatio fallback
### M4 — CHANGELOG traceability (older releases truncated)

## Minor

### m1 — README "What's new" still references v29.0.10
### m2 — Direct-push policy too permissive

## Verification Matrix (from ChatGPT)

| Fix | Commit claim | Code verification | Status |
|---|---:|---:|---|
| Multi-day holidays full coverage | yes | needs grep evidence | ⚠️ verify |
| LOE exclusion | yes | needs grep evidence | ⚠️ verify |
| EAC1/EAC2/EAC3 | yes | needs grep evidence | ⚠️ verify |
| VAC / TCPI | yes | needs grep evidence | ⚠️ verify |
| Cost coverage warning | yes | needs grep evidence | ⚠️ verify |
| Worst-case CPI×SPI warning | yes | needs grep evidence | ⚠️ verify |
| `CLAUDE.md` | yes | confirmed | ✅ |
| release HTML v29.0.11 | yes | confirmed | ✅ |
| `code-split/` updated | no | not in changed files | ❌ |

## Recommended Close Criteria

- [ ] code-split updated or marked archival
- [ ] Phase 2 grep checks pasted/verified
- [ ] Tests or test evidence committed
- [ ] Claim-grade wording downgraded to candidate
- [ ] README heading corrected
- [ ] Changelog traceability preserved

## Final Recommendation

**Good progress, but needs verification before production-grade / claim-grade wording.**
