# 🤖 Gemini Prompt — Review v29.0.11.1 (Latest Release)

> **For**: Gemini Web App (gemini.google.com) with GitHub Connector
> **Repo**: hani321911/P6-Analyzer
> **Branch**: main (latest = v29.0.11.1)

---

## Setup Instructions

1. اذهب إلى: https://gemini.google.com
2. اضغط **📎 (Add file)** → **Import code**
3. الصق رابط الـ repo: `https://github.com/hani321911/P6-Analyzer`
4. اربط حساب GitHub (مرة واحدة فقط)
5. اختر branch: `main`
6. انتظر اكتمال الـ indexing (~30 ثانية)
7. الصق البرومبت أدناه

---

## 📋 Prompt to Use

```
I need a comprehensive code review for the P6-Analyzer project at version v29.0.11.1.

## Context

I am Hani Taysseer, Planning Engineer at Saudi Electricity Company (SEC) / National Grid SA, Jeddah. This is a Primavera P6 schedule analysis tool I'm developing.

The project has been through 7 multi-AI review rounds (Claude + ChatGPT). Phase 1 and Phase 2 are complete. I want a fresh perspective from Gemini.

## Required Reading (please read in this order)

1. .gemini/config.yaml — Review focus areas + ignore list
2. .gemini/styleguide.md — DO/DON'T suggestions (CRITICAL)
3. CLAUDE.md — Project rules
4. docs/architecture/NG_SA_CONTEXT.md — Saudi Arabia / NG SA context
5. docs/implementation/LESSONS_LEARNED.md — Rejected suggestions (don't repeat them)
6. docs/implementation/STATUS.md — Current status
7. docs/reviews/round-7-chatgpt/CLAUDE_RESPONSE.md — Latest review
8. CHANGELOG.md — v29.0.11.1 section
9. p6-analyzer.html — The actual code (1.4 MB, 20,275 lines)
10. tests/ — 104 functional tests

## Review Scope

Review the entire main branch (v29.0.11.1). Focus on:

### 🔴 Critical Areas:
1. **Calculations integrity** — DCMA, EVM (EAC1/2/3, VAC, TCPI), Critical Path
2. **NG SA compliance** — All 6 mandatory certificates (EHC, ECC, TCC, RTR, PAC, FAC)
3. **Saudi calendar accuracy** — Hijri holidays multi-day coverage
4. **Performance** — useMemo usage with large schedules
5. **Accessibility (a11y)** — aria-labels, roles, alt text

### 🟡 Major Areas:
6. **Code quality** — Are there hidden bugs?
7. **Error handling** — Are edge cases covered?
8. **Test coverage** — Do tests verify actual implementation?

### 🟢 Suggestions:
9. **Architecture improvements** for future Phase 3
10. **UX improvements** beyond the existing UI/UX proposal

## Constraints (IMPORTANT)

⚠️ Do NOT suggest these (they were rejected in previous rounds):
- React XSS escape (React.createElement is safe)
- Event listener cleanup (in vendor code)
- React.Fragment keys for static children
- Hijri 11-day approximation (year is 354.367 days)
- EVM division-by-zero "fixes" (already null-protected)
- Inline styles as "bad practice" (intentional architecture)

## Expected Output

Please provide a structured review in this format:

```markdown
# 🔍 P6 Analyzer v29.0.11.1 — Gemini Review (Round 8)

**Reviewer**: Gemini
**Date**: [today's date]
**Accuracy self-assessment**: [your honest %]

## 📊 Executive Summary
- Overall code quality: [score/10]
- Critical issues found: [count]
- Major issues found: [count]
- Minor issues found: [count]

## ✅ What's Good
[List strengths]

## 🔴 Critical Issues
[blocking issues]

## 🟡 Major Issues
[should-fix issues]

## 🟢 Minor Issues / Suggestions
[nice-to-have]

## 🎯 NG SA Compliance Check
- [ ] All 6 certificates covered
- [ ] Hijri calendar correct
- [ ] EVM PMI-compliant
- [ ] LOE excluded

## 🤔 Comparison with Previous Reviews
[How does your view differ from Claude/ChatGPT?]

## 💡 Suggestions for Phase 3
[New ideas for future]

## 🏆 Final Verdict
[Approve / Approve with changes / Block]
```

## Final Note

Be brutally honest. If you find a real bug, say so clearly. If you disagree with previous reviewers (Claude or ChatGPT), explain why with code evidence.

Reference specific file paths and line numbers in your feedback.

Start by saying "I have read all required files" then begin your review.
```

---

## After Gemini Responds

Copy Gemini's review and:

1. **Save to**: `docs/reviews/round-8-gemini/REVIEW.md`
2. **Share with Claude.ai** for analysis
3. **Implement valid suggestions** in a new branch

---

## Expected Output Quality

Based on Gemini 3.x improvements:
- Coding accuracy: 75-90% (vs 25% in Round 2)
- Long context handling: Excellent (1M tokens)
- Hallucination rate: ~88% on facts (need to verify suggestions)

**Always verify Gemini's claims before implementing.**
