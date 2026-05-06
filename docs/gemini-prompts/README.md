# 🤖 Gemini Prompts Library

> Pre-prepared prompts for using Gemini AI to review P6-Analyzer.

---

## 📋 Available Prompts

| File | Purpose | Tool |
|------|---------|------|
| [01_review_v29.0.11.1.md](01_review_v29.0.11.1.md) | Full code review of latest release | Gemini Web App |
| [02_review_uiux_proposal.md](02_review_uiux_proposal.md) | Review UI/UX improvement proposal | Gemini Web App |
| [03_pr_based_review.md](03_pr_based_review.md) | PR-based continuous review | Gemini Code Assist |

---

## 🎯 Which Prompt to Use?

```
السؤال: ماذا تريد مراجعته؟
                                                             
├─ مراجعة شاملة لـ v29.0.11.1                                
│  └─ استخدم: 01_review_v29.0.11.1.md                       
│      أداة: gemini.google.com (Web App)                    
│                                                            
├─ مراجعة مقترح UI/UX                                       
│  └─ استخدم: 02_review_uiux_proposal.md                    
│      أداة: gemini.google.com (Web App)                    
│                                                            
└─ مراجعة PR محدد (مستقبلاً)                                
   └─ استخدم: 03_pr_based_review.md                         
       أداة: GitHub Code Assist (تلقائي)                    
```

---

## 🚀 Quick Start

### To review latest release (v29.0.11.1):

1. اذهب: https://gemini.google.com
2. اضغط 📎 → Import code
3. الصق: https://github.com/hani321911/P6-Analyzer
4. افتح: [01_review_v29.0.11.1.md](01_review_v29.0.11.1.md)
5. انسخ القسم "Prompt to Use" والصقه

### To review UI/UX proposal:

1. نفس الخطوات أعلاه، لكن استخدم: [02_review_uiux_proposal.md](02_review_uiux_proposal.md)

---

## 📊 Multi-AI Review Strategy

```
┌──────────────────────────────────────────┐
│  When to use which AI?                    │
├──────────────────────────────────────────┤
│                                           │
│  📝 Strategic decisions      → Claude.ai  │
│  🔍 Deep code review         → ChatGPT    │
│  🎨 Visual reasoning         → Gemini     │
│  ⚡ Continuous PR reviews    → Gemini CA  │
│                                           │
└──────────────────────────────────────────┘
```

---

## 📚 References

- Past reviews: `../reviews/`
- Project rules: `../../CLAUDE.md`
- Style guide: `../../.gemini/styleguide.md`
- Lessons learned: `../implementation/LESSONS_LEARNED.md`
