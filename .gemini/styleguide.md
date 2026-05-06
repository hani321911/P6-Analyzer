# P6 Analyzer — Style Guide for Gemini Code Assist

> This document tells Gemini Code Assist what to suggest and what NOT to suggest.

---

## 🚫 DO NOT Suggest These (Verified False Positives)

These suggestions were made in past reviews (Round 2, Gemini) and proven INCORRECT after deep verification. Do not repeat them:

### 1. React Security False Positives
- ❌ **Don't suggest XSS escape for `React.createElement`**
  - Reason: `React.createElement` uses textContent by default (XSS-safe)
  - Reference: docs/implementation/LESSONS_LEARNED.md

- ❌ **Don't suggest event listener cleanup**
  - Reason: Listeners are in React vendor code (lines 1-300), self-managed
  - These are NOT in user code

- ❌ **Don't suggest React.Fragment keys for static children**
  - Reason: Keys only needed for `array.map()` rendered lists
  - Static `React.createElement` children don't need keys

### 2. Calendar False Positives
- ❌ **Don't suggest 11-day Hijri approximation**
  - Reason: Saudi Hijri year = 354.367 days (not 354 or 355)
  - Reason: Crescent moon visibility ±1-2 days (rule-based, not calculable)
  - Saudi uses Umm al-Qura calendar (official authority)

### 3. EVM False Positives
- ❌ **Don't suggest "EVM division by zero" fixes**
  - Already protected with `null` ternary at every site
  - See: `overallSPI: totalPV > 0 ? totalEV / totalPV : null`

- ❌ **Don't suggest fixing `dangerouslySetInnerHTML`**
  - Not used with user input in this codebase
  - All HTML in PDF reports is escaped via `esc()` helper

### 4. Code Style False Positives
- ❌ **Don't suggest converting `||` to `??` blindly**
  - Some `||` usages are intentional (e.g., default values for empty strings)
  - Only suggest `??` where preserving 0 or empty string matters

- ❌ **Don't flag inline styles as "bad practice"**
  - This is intentional architectural choice (single-file deployment)
  - No CSS preprocessor available

---

## ✅ DO Suggest These

### 1. Accessibility (Highest Priority)
- ✅ Missing `aria-label` on interactive elements
- ✅ Missing `role` attributes
- ✅ Missing `alt` text for SVG icons
- ✅ Color contrast issues (WCAG 2.1 AA: 4.5:1)
- ✅ Keyboard navigation gaps
- ✅ Focus management issues

### 2. NG SA Specific Issues
- ✅ Missing certificates from the 6 mandatory list (EHC, ECC, TCC, RTR, PAC, FAC)
- ✅ Hardcoded calendar values vs P6 calendar HoursPerDay
- ✅ Critical Path summed via reduce() instead of network DP
- ✅ Missing pctType handling
- ✅ Multi-day holidays counted as single days

### 3. PMI Standards Compliance
- ✅ Missing EAC formulas (need 3: EAC1, EAC2, EAC3)
- ✅ Missing VAC (Variance at Completion)
- ✅ Missing TCPI (To-Complete Performance Index)
- ✅ EVM forecasts not differentiated by performance scenarios

### 4. P6 XML Quirks
- ✅ Treating PercentComplete as 0-100 (it's 0-1 decimal!)
- ✅ Treating Duration as days (it's hours, divide by HoursPerDay!)
- ✅ Assuming TotalFloat is always present (often missing)
- ✅ Ignoring LongestPath field from XML

### 5. Performance Issues
- ✅ Missing useMemo for expensive calculations
- ✅ Missing useCallback for event handlers
- ✅ Re-renders triggered by reference equality issues
- ✅ Large list rendering without virtualization (>200 items)

### 6. UX Improvements
- ✅ Missing loading states (>500ms operations)
- ✅ Missing empty states
- ✅ Unclear error messages
- ✅ Missing confirmation for destructive actions
- ✅ Inconsistent visual hierarchy

---

## 🎯 Project-Specific Context

### Tech Stack
- **Single-file HTML** (no build step)
- **React 19.2.5** (CDN-loaded)
- **JavaScript ES2022**
- **Inline styles** (no CSS files)
- **Bilingual**: Arabic + English

### Critical Areas
1. **`p6-analyzer.html`** is the source of truth (1.4 MB, 20,275 lines)
2. **`code-split/*.js`** are auto-generated references (don't suggest changes here)
3. **`tests/`** has 104 functional tests (verify before claiming bugs)

### NG SA Specific Terminology
- **TCC** = Taking-Over Certificate
- **PAC** = Provisional Acceptance Certificate
- **FAC** = Final Acceptance Certificate
- **RTR** = Ready-To-Run
- **EHC** = Energization & Holding Commissioning
- **ECC** = Equipment Commercial Commissioning
- **MC** = Mechanical Completion (different from TCC!)

### Saudi Holidays
- Multi-day: Eid Al-Fitr (3 days), Eid Al-Adha (4-5 days), Ramadan (full month)
- Single-day: Founding Day (Feb 22), National Day (Sep 23)

---

## 📋 Review Checklist Template

When reviewing a PR, structure feedback as:

```markdown
## Summary
[Brief description of changes]

## ✅ What's Good
- [Positive observations]

## 🔴 Critical Issues
- [Blockers for production]

## 🟡 Major Issues  
- [Should fix soon]

## 🟢 Minor Issues / Suggestions
- [Nice to have]

## 🎯 NG SA Compliance Check
- [ ] All 6 certificates covered
- [ ] Hijri calendar correct
- [ ] EVM standards compliant
- [ ] LOE activities excluded

## 📊 Test Coverage
[Verify: 104 functional tests still pass?]
```

---

## 🤝 Collaboration with Other AIs

This project uses multi-AI review:
- **Claude.ai**: Strategic planning + execution
- **ChatGPT**: Code review + counter-points
- **Gemini (you)**: PR-level continuous review

Your role: **Continuous quality gate on every PR**.

Your strength: **Long-context understanding** (1M tokens) — read entire repo for context.

Avoid duplicating issues already raised by Claude or ChatGPT (check `docs/reviews/` first).
