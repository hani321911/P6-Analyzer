# 🎨 Gemini Prompt — Review UI/UX Improvement Proposal

> **For**: Gemini Web App (gemini.google.com) with GitHub Connector
> **Target file**: docs/design-proposals/UI_UX_REVIEW_v29.0.11.1.md

---

## 📋 Prompt to Use

```
I need you to review the UI/UX improvement proposal for P6-Analyzer.

## Context

I'm Hani Taysseer, Planning Engineer at SEC / NG SA, Jeddah. The proposal was written by Claude.ai after analyzing the v29.0.11.1 codebase. I want your independent assessment before implementing.

## Required Reading

1. docs/design-proposals/UI_UX_REVIEW_v29.0.11.1.md — The proposal to review
2. .gemini/config.yaml — Review configuration
3. .gemini/styleguide.md — Project-specific rules
4. p6-analyzer.html — The actual application code
5. docs/architecture/NG_SA_CONTEXT.md — Saudi context

## Review Questions

Please answer these specifically:

### Section 1: Accuracy
1. Is the claim of "315 unique colors" accurate? (Verify with grep on p6-analyzer.html)
2. Is the claim of "0% accessibility coverage" accurate? (Verify aria-label / role count)
3. Is the claim of "only 2 useMemo calls" accurate? (Verify with grep)
4. Are there any claims in the proposal that are exaggerated or wrong?

### Section 2: Recommendations
5. Are the WCAG 2.1 recommendations correct and complete?
6. Is the proposed color palette (24 tokens) realistic for a dark dashboard?
7. Is the type scale (6 sizes) appropriate for a dense data dashboard?
8. Are the prioritization phases (A → D) correctly ordered?

### Section 3: Missing Items
9. What UI/UX issues did the proposal MISS?
10. Are there Arabic-specific UI considerations not addressed?
11. Are there NG SA-specific terminology issues in labels?
12. Are there Saudi cultural design considerations needed?

### Section 4: Hidden Risks
13. Are there technical risks in implementing Phase A (accessibility)?
14. Could color reduction break existing visual differentiation?
15. Could useMemo refactoring introduce bugs?
16. Are there mobile-specific risks not addressed?

### Section 5: Alternatives
17. Are there better alternatives to the proposed solutions?
18. Should we consider a CSS framework (Tailwind, etc.)?
19. Should we use a UI library (Radix UI, Headless UI)?
20. Is single-file architecture still justified for this project size?

## Constraints

⚠️ Do NOT suggest these (rejected in previous rounds):
- React.Fragment keys
- XSS escape for React
- Event listener cleanup
- Hijri 11-day approximation
- EVM /0 fixes
- Inline styles as "bad practice"

## Expected Output

```markdown
# 🎨 Gemini Review — UI/UX Proposal v29.0.11.1

## 📊 Accuracy Verification
- Color count claim: [verified/disputed + evidence]
- a11y coverage claim: [verified/disputed + evidence]
- useMemo count claim: [verified/disputed + evidence]

## ✅ What the Proposal Got Right
[list]

## ❌ What the Proposal Got Wrong
[list with evidence]

## 🔍 What the Proposal Missed
[list new UI/UX issues]

## 🎯 NG SA-Specific UI Considerations
[Saudi cultural / RTL / Arabic-specific issues]

## 🚀 Better Alternatives
[suggestions]

## 📊 Risk Assessment
| Phase | Risk Level | Why |
|-------|:---------:|-----|
| A1 (a11y) | [Low/Med/High] | [reason] |
| A2 (colors) | [Low/Med/High] | [reason] |
| A3 (typography) | [Low/Med/High] | [reason] |

## 🎯 Recommended Priority Order (Your Version)
[Reorder if needed]

## 🏆 Final Verdict
- [ ] Approve as-is
- [ ] Approve with modifications
- [ ] Reject and rewrite

[Detailed reasoning]
```

## Important

Be honest. If the proposal is good, say so. If it has flaws, point them out with specific code evidence (file paths + line numbers).

You have access to the entire repo via GitHub connector. Use it.

Start with: "I have read all required files" then begin.
```

---

## After Gemini Responds

1. Save to: `docs/reviews/round-8-gemini/UIUX_REVIEW.md`
2. Compare with Claude.ai's original proposal
3. Identify points of agreement / disagreement
4. Make final decision on implementation priority
