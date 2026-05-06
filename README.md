# 🔌 P6 Analyzer for SEC / National Grid SA

> A single-file HTML application for analyzing **Primavera P6 schedules** (XML/XER) tailored for Saudi Electricity Company (SEC) / National Grid SA projects.

[![Version](https://img.shields.io/badge/version-29.0.10-blue.svg)](releases/)
[![License](https://img.shields.io/badge/license-Internal-orange.svg)]()
[![Status](https://img.shields.io/badge/status-Active-success.svg)]()
[![Reviews](https://img.shields.io/badge/multi--AI%20reviewed-Claude%20%2B%20ChatGPT%20%2B%20Gemini-purple.svg)](docs/reviews/)

---

## 📋 ما هذه الأداة؟

أداة تحليل احترافية لجداول **Primavera P6** خاصة بمشاريع SEC / NG SA:

- 🇸🇦 **مخصصة لمشاريع السعودية**: تقويم هجري + إجازات رسمية + 10 أنواع مشاريع NG SA
- 📊 **6 طرق حساب نسبة الإنجاز**: Cost, Duration, Units, Count, NG Matrix, Blended
- ✅ **6 شهادات إلزامية**: TCC, PAC, FAC, RTR, EHC, ECC
- 🎯 **معايير دولية**: DCMA 14-Point, PMI, GAO, AACE 38R-06
- 💰 **EVM كامل**: SPI, CPI, EAC, ETC, VAC, TCPI
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

## 📦 الإصدار الحالي: v29.0.10

### 🆕 ما الجديد في v29.0.10 (Phase 1 — Critical Fixes)

| # | الإصلاح | التأثير |
|---|---------|---------|
| 1.1 | إضافة **EHC + ECC** للشهادات | اكتمال الـ 6 شهادات الإلزامية (33% missing → 0%) |
| 1.2 | احترام **pctType** في حساب actualPct | دقة كل الـ 5 طرق حساب |
| 1.3 | **Network-based Longest Path** بـ topological DP | DCMA-04 / CPLI accuracy |
| 1.4 | **Negative context filter** للشهادات | إزالة false positives |

### 🔬 22/22 اختبار وظيفي ناجح

```
✓ Parallel critical paths (50d + 60d) → returns 60 (was 110 — bug)
✓ pctType="Manual" + pctComplete=0 → returns 0 (was 0.5 — bug)
✓ "PAC Walkdown" → rejected as cert
✓ "PAC Issuance" → accepted as cert
✓ EHC/ECC patterns match 10/10 cases correctly
```

---

## 📚 التوثيق

- 📖 [**Architecture Overview**](docs/architecture/README.md) — معمارية النظام الكاملة
- 🔍 [**Code Reviews**](docs/reviews/README.md) — تاريخ المراجعات (5 جولات)
- ✅ [**Implementation Status**](docs/implementation/STATUS.md) — تقدم Phases 1/2/3
- 📝 [**Changelog**](CHANGELOG.md) — سجل التغييرات
- 🤝 [**Contributing**](CONTRIBUTING.md) — كيف تساهم/تراجع

---

## 🎯 النقاط الـ 6 الحرجة في الكود

1. **التقويم الهجري** — Saudi calendar with Hijri 2024-2028
2. **طرق حساب نسب الإنجاز** — 6 calculation methods
3. **شهادات الإنجاز** — 6 mandatory certs detection
4. **المسار الحرج** — Network-based longest path
5. **Project Type Detection** — 10 NG SA project types
6. **EVM Calculations** — SPI/CPI/EAC/ETC/VAC/TCPI

---

## 📊 معاييرنا

| المعيار | الالتزام |
|---------|---------|
| **NG SA Project Manual** (Feb 2016) | ✅ |
| **DCMA 14-Point Schedule Assessment** | ✅ |
| **PMI Practice Standard for EVM** | ✅ Phase 2 |
| **GAO Schedule Assessment Guide** | ✅ |
| **AACE 38R-06** | ✅ |

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

تم مراجعة الكود عبر 5 جولات بمشاركة 3 نماذج AI:

| الجولة | المراجع | الدقة | الملاحظات |
|-------|---------|------|-----------|
| 1 | Claude | 88% | اكتشاف عام شامل |
| 2 | Gemini | 25% | معظم الاقتراحات خاطئة |
| 3 | ChatGPT | 85% | اكتشاف EHC/ECC missing ⭐ |
| 4 | Claude | 96% | تصحيح أولويات |
| 5 | ChatGPT | 94% | counter-points ذكية |

**الدرس**: التكامل بين Claude + ChatGPT أعلى جودة من أي مراجع منفرد.

---

## 📜 الترخيص

استخدام داخلي حصراً لـ SEC / NG SA. غير مرخّص للاستخدام التجاري الخارجي.

---

> _"From Claim-grade reporting to executive dashboards — built by an engineer, for engineers."_
