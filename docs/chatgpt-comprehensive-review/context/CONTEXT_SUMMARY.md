# 📚 Project Context Summary for ChatGPT

## 👤 Project Owner
- **Name**: هاني تيسير (Hani Taysseer)
- **Role**: Planning Engineer
- **Company**: SEC / NG SA (Saudi Electricity Company / National Grid SA)
- **Location**: Jeddah, Saudi Arabia
- **Workstation**: Mac Mini M4 (Warp) + Windows PC (PowerShell)

## 🎯 Project Overview
**P6 Analyzer** is a single-file HTML application that analyzes Primavera P6 schedule XML exports for:
- DCMA 14-Point Schedule Assessment
- PMI Standard Earned Value Management (EVM)
- GAO Schedule Best Practices
- AACE Schedule Risk Analysis
- NG SA Project Scheduling Manual compliance
- Saudi-specific calendar (Hijri/Umm al-Qura)

## 📊 Current State
- **Version**: v29.0.11.2
- **File size**: 1.4 MB / 20,348 lines / 270 functions
- **Tests**: 191/191 (100%)
- **Architecture**: Single HTML file, React 19.2.5 (CDN), no build step
- **Bilingual**: Arabic + English

## 🏆 8 Multi-AI Review Rounds Completed
1. Claude (initial) — 88%
2. Gemini (copy-paste) — 25% ⚠️
3. ChatGPT — 85% (found EHC/ECC)
4. Claude (meta) — 96%
5. ChatGPT (counter) — 94%
6. ChatGPT (Phase 2) — 88% (code-split + tests)
7. ChatGPT (R7 follow-up) — 100% (R1+R2 real bugs!)
8. Gemini (GitHub Connector) — 100% (G1+G2 real bugs!)

## 🔧 Key Bug Fixes History

### Round 7 (ChatGPT) — R1 + R2:
**R1**: `getActualPctRatio` fallback when pctType-specific field missing
- Before: `{pctType: 'Physical', physicalPct: undefined}` → 0
- After: Falls back to pctComplete/durationPct/unitsPct via `??` chain

**R2**: Network DP key collision with mixed ID schemas
- Before: actMap keyed by actId, dropped ObjectId-based relationships
- After: Multi-key alias map + canonical key + uniqueKeys Set

### Round 8 (Gemini) — G1 + G2:
**G1**: NG SA Certificate Sequence Validation (was missing!)
- Now validates: RTR → EHC/ECC → TCC → PAC → FAC
- 13 sequence rules enforced

**G2**: FAC ≤ PAC Cross-Validation (was insufficient)
- Critical violation detection added

## 🇸🇦 NG SA Specific Terminology
- **TCC** = Taking-Over Certificate (Provisional)
- **PAC** = Provisional Acceptance Certificate
- **FAC** = Final Acceptance Certificate
- **RTR** = Ready-To-Run
- **EHC** = Energization & Holding Commissioning
- **ECC** = Equipment Commercial Commissioning
- **MC** = Mechanical Completion (different from TCC!)

## ⚠️ Architectural Decisions (DON'T QUESTION THESE)
1. ❌ NO TypeScript (single-file simplicity)
2. ❌ NO build step (CDN-based React)
3. ❌ NO domain lock in obfuscation
4. ❌ NO expiration date (no expiry)
5. ✅ Inline styles (intentional, not bad practice)
6. ✅ Single 1.4 MB file (deployment simplicity)
7. ✅ Arabic + English bilingual
8. ✅ RTL support (24 CSS rules)

## 🎯 What ChatGPT Should Focus On

### High Priority:
1. Verify R1+R2 (Round 7) fixes are correct
2. Verify G1+G2 (Round 8) fixes are correct
3. Find any NEW bugs not caught by previous rounds
4. Verify mathematical correctness of EVM formulas
5. Test edge cases not covered yet

### Medium Priority:
6. Performance bottlenecks (useMemo gaps)
7. Code quality issues (duplication, magic numbers)
8. Test coverage gaps

### Low Priority (already documented):
9. Accessibility (Phase A1 in UI/UX proposal)
10. Modular architecture (long-term refactor)
11. Phase 3 features (Gemini suggested)

## 🚫 What ChatGPT Should NOT Do

1. ❌ Repeat rejected suggestions from Round 2 (Gemini)
2. ❌ Suggest XSS escape for React.createElement
3. ❌ Suggest React.Fragment keys for static children
4. ❌ Question architectural decisions (single-file, no TypeScript)
5. ❌ Aspire to features (S-Curve, etc.) — stick to current code review
6. ❌ Be vague — provide line numbers and code evidence

## 📋 Acceptance Criteria for Round 9 Review

### Must Have:
- [ ] Read all required files (10 files minimum)
- [ ] Verify 100% test pass claim
- [ ] Reference specific line numbers
- [ ] Provide ready-to-commit code suggestions
- [ ] Self-assess accuracy %

### Nice to Have:
- [ ] Find a new bug (would be amazing!)
- [ ] Suggest performance optimization with measurement
- [ ] Identify NG SA Manual edge case

### Forbidden:
- [ ] Generic advice without code evidence
- [ ] Repeating Round 2 false positives
- [ ] Aspirational architecture suggestions

