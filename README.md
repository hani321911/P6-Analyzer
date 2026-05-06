# 🔌 P6 Analyzer for SEC / National Grid SA

> A single-file HTML application for analyzing **Primavera P6 schedules** (XML/XER) tailored for Saudi Electricity Company (SEC) / National Grid SA projects.

[![Version](https://img.shields.io/badge/version-29.0.11.1-blue.svg)](releases/)
[![License](https://img.shields.io/badge/license-Internal-orange.svg)]()
[![Status](https://img.shields.io/badge/status-Active-success.svg)]()
[![Reviews](https://img.shields.io/badge/multi--AI%20reviewed-Claude%20%2B%20ChatGPT%20%2B%20Gemini-purple.svg)](docs/reviews/)
[![Tests](https://img.shields.io/badge/tests-60%2F60%20pass-success.svg)](tests/)

---


## 🤖 AI-Assisted Quality Reviews

This repository uses **multi-AI continuous review**:

| AI | Role | Status |
|----|------|:------:|
| **Claude.ai** | Strategic planning + execution | ✅ Active |
| **ChatGPT** (Round 7+) | Code review + verification | ✅ Active |
| **Gemini Code Assist** | PR-level reviews | 🆕 Active |

### How it works:
1. Pull Request opened → Gemini auto-reviews in 5 minutes
2. Use `/gemini review` to request manual review
3. Use `/gemini summary` to get PR summary
4. All AI reviews documented in [`docs/reviews/`](docs/reviews/)

### Review configuration:
- See [`.gemini/config.yaml`](.gemini/config.yaml) for focus areas
- See [`.gemini/styleguide.md`](.gemini/styleguide.md) for project-specific rules
- See [`docs/implementation/LESSONS_LEARNED.md`](docs/implementation/LESSONS_LEARNED.md) for rejected suggestions

## 📋 ما هذه الأداة؟

أداة تحليل احترافية لجداول **Primavera P6** خاصة بمشاريع SEC / NG SA:

- 🇸🇦 **مخصصة لمشاريع السعودية**: تقويم هجري + إجازات رسمية + 10 أنواع مشاريع NG SA
- 📊 **5 طرق حساب نسبة الإنجاز**: Cost, Duration, Units, Count, NG Matrix
- ✅ **6 شهادات إلزامية**: TCC, PAC, FAC, RTR, EHC, ECC
- 🎯 **معايير دولية**: DCMA 14-Point, PMI, GAO, AACE 38R-06
- 💰 **EVM كامل**: SPI, CPI, EAC₁/EAC₂/EAC₃, VAC, TCPI
- 🌐 **ثنائي اللغة**: عربي ⇄ إنجليزي مع RTL/LTR كامل
- 📁 **Single-file HTML**: لا build، لا dependencies، يعمل offline

---

## 🚀 البدء السريع

```bash
# افتح الملف في المتصفح مباشرة
open p6-analyzer.html

# أو على Windows
start p6-analyzer.html

# أو شغّل خادم محلي
python3 -m http.server 8000
# ثم افتح http://localhost:8000/p6-analyzer.html
```

**لا تحتاج**: npm install، Node.js، أو internet (بعد caching الـ React CDN).

---

## 📦 الإصدار الحالي: v29.0.11

### 🆕 ما الجديد في v29.0.11.1 (Phase 2 + Round 7 Hotfix — Major Fixes) ⭐

| # | الإصلاح | التأثير |
|---|---------|---------|
| 2.1 | **Multi-day holidays full coverage** | تتبع دقيق لإجازات سعودية متعددة الأيام (3-state: complete/partial/missing) |
| 2.2 | **LOE activity exclusion** | استبعاد أنشطة Level of Effort من progress/EVM |
| 2.3 | **EAC₁/EAC₂/EAC₃ + VAC + TCPI** | صيغ EVM كاملة وفقاً لـ PMI standard |
| 2.4 | **Cost coverage warning** | تحذير عند ضعف cost loading (alert/warning/ok) |

### 📊 ما تم في v29.0.10 (Phase 1 — Critical Fixes)

| # | الإصلاح |
|---|---------|
| 1.1 | إضافة EHC + ECC للشهادات الإلزامية |
| 1.2 | احترام pctType في حساب actualPct |
| 1.3 | Network-based Longest Path (topological DP) |
| 1.4 | Negative context filter للشهادات |

### 🔬 60/60 اختبار وظيفي ناجح

```
✓ Parallel critical paths (50d + 60d) → 60 (was 110 — bug)
✓ pctType="Manual" + pctComplete=0 → 0 (was 0.5 — bug)
✓ Eid Al-Adha 1/5 days configured → "partial" (was "complete" — bug)
✓ EAC₁/EAC₂/EAC₃ formulas verified with realistic scenarios
✓ EHC/ECC patterns match 10/10 cases correctly
```

تشغيل الـ tests:
```bash
node tests/phase1/test_v29_0_10.cjs
node tests/phase2/test_phase2.cjs
```

---

## 📚 التوثيق

- 📖 [**Architecture Overview**](docs/architecture/README.md) — معمارية النظام الكاملة
- 🇸🇦 [**NG SA Context**](docs/architecture/NG_SA_CONTEXT.md) — السياق الإلزامي
- 🔍 [**Code Reviews**](docs/reviews/README.md) — تاريخ المراجعات (6 جولات)
- ✅ [**Implementation Status**](docs/implementation/STATUS.md) — تقدم Phases 1/2/3
- 📝 [**Changelog**](CHANGELOG.md) — سجل التغييرات
- 🤝 [**Contributing**](CONTRIBUTING.md) — كيف تساهم/تراجع
- 🤖 [**CLAUDE.md**](CLAUDE.md) — تعليمات Claude Code
- 🧪 [**Tests**](tests/README.md) — كيفية تشغيل الاختبارات

---

## 🎯 النقاط الـ 6 الحرجة في الكود

1. **التقويم الهجري** — Saudi calendar with Hijri 2024-2028 + multi-day coverage
2. **طرق حساب نسب الإنجاز** — 5 calculation methods + LOE exclusion
3. **شهادات الإنجاز** — 6 mandatory certs detection (TCC/PAC/FAC/RTR/EHC/ECC)
4. **المسار الحرج** — Network-based topological DP longest path
5. **Project Type Detection** — 10 NG SA project types
6. **EVM Calculations** — SPI/CPI/EAC₁/EAC₂/EAC₃/VAC/TCPI

---

## 📊 معاييرنا

| المعيار | الالتزام |
|---------|---------|
| **NG SA Project Manual** (Feb 2016) | ✅ |
| **DCMA 14-Point Schedule Assessment** | ✅ |
| **PMI Practice Standard for EVM** | ✅ (Phase 2) |
| **GAO Schedule Assessment Guide** | ✅ |
| **AACE 38R-06** | ✅ |

---

## 🚦 Production Readiness

| Use Case | الحالة |
|----------|:------:|
| Internal use (Planning team) | ✅ READY |
| Management reports | ✅ READY |
| **Claim-grade reports** | 🟡 **Candidate** — needs validation on real SEC schedules |
| **DCMA submission** | 🟡 **Candidate** — requires independent QA review |

> 💡 **Note**: Phase 2 implements all PMI/DCMA-standard formulas with 60/60 functional tests. The "Candidate" status reflects best practice — independent validation on real cost-loaded schedules is recommended before formal claim submissions.

---

## 🛠️ تنبيهات تقنية

- **PercentComplete في P6 XML**: مخزّن كـ decimal (0-1) وليس percentage (0-100)
- **Duration في P6 XML**: مخزّن بالساعات (يجب القسمة على HoursPerDay)
- **TotalFloat**: غالباً مفقود في XML exports (نحسبه من Late/Early Finish)
- **Critical Path ≠ Longest Path**: يحتاج network DP وليس reduce/sum
- **6 شهادات في NG SA**: TCC, PAC, FAC, RTR, **EHC, ECC** (ليس 4)

---

## 👤 المُطوّر

**هاني تيسير** | Planning Engineer @ SEC / NG SA | Jeddah, Saudi Arabia

---

## 🤖 Multi-AI Review Process

تم مراجعة الكود عبر 6 جولات بمشاركة 3 نماذج AI:

| الجولة | المراجع | الدقة | الملاحظات |
|-------|---------|:----:|-----------|
| 1 | Claude | 88% | اكتشاف عام شامل |
| 2 | Gemini | 25% | معظم الاقتراحات خاطئة ⚠️ |
| 3 | ChatGPT | 85% | اكتشاف EHC/ECC missing ⭐ |
| 4 | Claude | 96% | تصحيح الأولويات |
| 5 | ChatGPT | 94% | counter-points ذكية |
| 6 | ChatGPT | 88% | code-split sync + test evidence |

**الدرس**: التكامل بين Claude + ChatGPT أعلى جودة من أي مراجع منفرد.

---

## 📜 الترخيص

استخدام داخلي حصراً لـ SEC / NG SA. غير مرخّص للاستخدام التجاري الخارجي.

---

> _"From Claim-grade reporting to executive dashboards — built by an engineer, for engineers."_
>
> ## 🔍 Gemini Comprehensive Review Request

- **Date**: 2026-05-06
- **Reviewer**: Gemini Code Assist (Round 8)
- **Scope**: Full v29.0.11.1 codebase
