# 🇸🇦 NG SA Context Reference
# سياق شركة الكهرباء السعودية / National Grid SA

**Purpose**: مرجع سياقي ثابت لـ ChatGPT (وأي AI آخر) لاستخدامه في كل مراجعة مستقبلية لـ P6 Analyzer.

---

## 1. الكيان والمستخدم

### 1.1 الشركة
- **الاسم الكامل**: National Grid SA (NG SA) — الشبكة الوطنية للكهرباء
- **الشركة الأم**: Saudi Electricity Company (SEC) — شركة الكهرباء السعودية
- **التخصص**: نقل وتوزيع الكهرباء في المملكة العربية السعودية
- **الحجم**: تشغيل أكبر شبكة كهرباء في الشرق الأوسط

### 1.2 المستخدم
- **الاسم**: هاني تيسير
- **الدور**: مهندس تخطيط (Planning Engineer)
- **الموقع**: جدة، المملكة العربية السعودية
- **الخبرة**: Primavera P6 + تحليل المخاطر + أتمتة Python/Node.js
- **اللغة المفضلة**: العربية مع المصطلحات التقنية بالإنجليزية

---

## 2. أنواع المشاريع (10 أنواع رئيسية)

| Code | الاسم | الوصف |
|------|------|-------|
| `ss_lines` | Substations & Transmission | محطات تحويل + خطوط نقل |
| `ohtl` | Overhead Transmission Lines | خطوط نقل هوائية |
| `ugc` | Underground Cables | كبلات أرضية |
| `battery` | BESS | أنظمة تخزين البطاريات |
| `hvdc` | High Voltage DC | تيار مستمر عالي الجهد |
| `telecom` | Telecommunications | اتصالات الشبكة |
| `cyber` | Cyber Security | أمن سيبراني |
| `asset_repl` | Asset Replacement | استبدال الأصول |
| `drpc_svc` | DR/SVC | منظمات الجهد الديناميكية |
| `purchase_order` | PO Projects | مشاريع أوامر شراء |

---

## 3. الشهادات الإلزامية (6 شهادات)

```
دورة حياة المشروع في NG SA:

  Pre-Energization → Energization → Testing → Pre-Acceptance → Preliminary Acceptance → Final Acceptance
       ↓                ↓             ↓             ↓                    ↓                       ↓
      EHC              ECC           RTR           TCC                  PAC                     FAC
```

| Code | الاسم بالإنجليزية | الاسم بالعربية | الوصف |
|------|------------------|---------------|-------|
| **EHC** | Energization & Holding Commissioning | شهادة الإطلاق والتشغيل التحضيري | بداية إدخال الجهد |
| **ECC** | Equipment Commercial Commissioning | شهادة التشغيل التجاري للمعدات | المعدات تعمل تجارياً |
| **RTR** | Reliability Test Run | شهادة اختبار الموثوقية | عادة 30 يوم اختبار |
| **TCC** | Technical Completion Certificate | شهادة الإنجاز التقني | اكتمال الأعمال التقنية |
| **PAC** | Preliminary Acceptance Certificate | شهادة القبول الابتدائي | قبول أولي + فترة الـ DLP (1 سنة) |
| **FAC** | Final Acceptance Certificate | شهادة القبول النهائي | قبول نهائي بعد انتهاء DLP |

⚠️ **مهم جداً**: حالياً الكود يكشف 4 فقط (TCC, PAC, FAC, RTR). **EHC و ECC مفقودان** — يجب إضافتهما في v29.0.10.

---

## 4. التقويم السعودي

### 4.1 الإجازات الميلادية الثابتة
- **يوم التأسيس**: 22 فبراير (تأسس عام 1727م)
- **اليوم الوطني**: 23 سبتمبر (توحيد المملكة 1932م)

### 4.2 الإجازات الهجرية (متغيرة)
- **عيد الفطر**: 3 أيام بعد رمضان
- **عيد الأضحى**: 4 أيام في الحج (10-13 ذو الحجة)
- **رمضان**: شهر كامل (تخفيض ساعات العمل، ليس عطلة)

### 4.3 ملاحظات تقنية للهجري
- السنة الهجرية = **354.367 يوم** (متغير 354 أو 355)
- الفرق مع الميلادية = **~10-11 يوم/سنة** (متغير، ليس ثابت)
- **رؤية الهلال** قد تُغيّر التواريخ الرسمية بـ ±1-2 يوم
- المرجع الرسمي: تقويم أم القرى (https://www.ucm.gov.sa)
- **لا تقترح approximations** بطرح 11 يوم — هذا غير دقيق علمياً

### 4.4 جدول الكود الحالي (2024-2028)
```
2024: Ramadan: 2024-03-11 | Eid Al-Fitr: 2024-04-10 → 04-12 | Eid Al-Adha: 2024-06-16 → 06-19
2025: Ramadan: 2025-03-01 | Eid Al-Fitr: 2025-03-30 → 04-01 | Eid Al-Adha: 2025-06-06 → 06-09
2026: Ramadan: 2026-02-18 | Eid Al-Fitr: 2026-03-20 → 03-22 | Eid Al-Adha: 2026-05-26 → 05-29
2027: Ramadan: 2027-02-08 | Eid Al-Fitr: 2027-03-09 → 03-11 | Eid Al-Adha: 2027-05-16 → 05-19
2028: Ramadan: 2028-01-28 | Eid Al-Fitr: 2028-02-26 → 02-28 | Eid Al-Adha: 2028-05-04 → 05-07
```

السنوات > 2028: warning للمستخدم (تم تنفيذه في v29.0.9.2).

---

## 5. NG SA Filename Convention

### 5.1 النمط الرسمي
```
####-{V}{TYPE}{seq?}
```

- `####` = رقم المشروع (4 أرقام)
- `V` = إصدار (1, 2, 3, ... عند Revised Baseline)
- `TYPE` = حرفان للنوع (BP, MP, OH, UG, HV, etc.)
- `seq` = رقم تسلسلي اختياري

### 5.2 أمثلة
- `1234-1MP1` = مشروع 1234، إصدار 1، نوع MP، تسلسل 1
- `5678-2BPS` = مشروع 5678، إصدار 2 (revised)، نوع BPS

---

## 6. منهجية حساب الإنجاز في NG SA

### 6.1 الطرق المعتمدة
1. **Cost Method** ⭐ — المعيار الذهبي (PMI standard) — `Σ(BAC × actualPct) / Σ(BAC)`
2. **NG Matrix** ⭐ — للمشاريع NG SA الإلزامية (weights لكل phase)
3. **Duration Method** — fallback لو لا cost loading
4. **Units Method** — للـ resource-loaded schedules
5. **Count Method** — high-level reporting only

### 6.2 الـ NG Matrix Weights (عينة)
لمشاريع Substations:
```
Civil Works: 15%
Steel/Structural: 12%
E&I Installation: 28%
Testing & Commissioning: 25%
Documentation: 5%
Energization (RTR + TCC): 10%
PAC: 5%
```
هذه قيم استرشادية — الكود يحوي الـ matrix الفعلي.

### 6.3 Recovery Trigger (NG SA Manual)
- يُفعَّل إذا: **slip > 10%** OR **slip > 30 days**
- ⚠️ تحقق من المعيار الرسمي (قد يكون 60-90 يوم لـ HVDC)

---

## 7. معايير المراجعة (Audit Standards)

| Standard | Purpose |
|----------|---------|
| **DCMA 14-Point** | تقييم جودة الجدول من المنظور الدفاعي الأمريكي |
| **PMI Practice Standard** | Earned Value Management standard |
| **GAO Schedule Guide** | Government Accountability Office best practices |
| **AACE 38R-06** | Schedule Risk Analysis |

### 7.1 DCMA-04 (Critical Path Test)
- يقيس **CPLI** (Critical Path Length Index)
- يحتاج **longest path duration** (وليس مجموع كل critical activities!)
- ⚠️ الكود الحالي يستخدم `reduce/sum` — خطأ في parallel critical paths

### 7.2 BEI Calculation
- BEI = `Actual Progress / Required Progress for On-Time`
- يحتاج longest path الصحيح
- قيمة < 1 = behind schedule

---

## 8. Pre-Commissioning Tests (Substations)

النشاطات المتوقعة في Pre-Comm:
- HV Testing (High Voltage)
- MV Testing (Medium Voltage)
- LV Testing (Low Voltage)
- Protection Settings Verification
- SCADA Integration Tests
- Final HV Switching
- Energization Sequences

---

## 9. Pitfalls Specific to SEC / NG SA Schedules

### 9.1 Cost Loading
- **70% من schedules** لا يحوي full cost loading
- المخططون يستخدمون activity-level cost (وليس Resource Assignments)
- الأداة يجب أن تتعامل مع كلا النوعين

### 9.2 Calendar Working Hours
- معظم المشاريع: 8 ساعات/يوم
- **لكن** بعض المشاريع HVDC و EHV: 10 ساعات/يوم
- مشاريع Shift Work: 12 ساعات/يوم
- ⚠️ لا تفترض 8 ساعات ثابتاً (تم إصلاحه في v29.0.9.2)

### 9.3 Languages
- أسماء الأنشطة: **عادة بالإنجليزية** (وفقاً لـ NG SA Manual)
- لكن قد توجد أنشطة بـ Arabic mixed
- الكود يجب أن يدعم البحث بـ regex في كلا اللغتين

### 9.4 P6 Versions Used
- معظم المشاريع: P6 V18-V22
- بعض المشاريع الجديدة: P6 V23-V25
- الأداة يجب أن تتعامل مع كل الإصدارات

### 9.5 Common Activity Types in NG SA
- **TS** (Technical Specification)
- **MR** (Material Requisition)
- **PO** (Purchase Order)
- **FAT** (Factory Acceptance Test)
- **SAT** (Site Acceptance Test)
- **Cable Laying** / **Splicing** / **Termination**
- **Commissioning** / **Energization**

---

## 10. Reference Documents

### 10.1 Internal NG SA / SEC
- NG SA Project Scheduling and Control Manual (February 2016)
- SEC Quality Procedures (specific docs)
- NG Matrix Weightages document

### 10.2 External Standards
- DCMA 14-Point Schedule Assessment
- PMI Practice Standard for Earned Value Management
- GAO Schedule Assessment Guide (GAO-16-89G)
- AACE International RP 38R-06

### 10.3 Technical References
- Oracle Primavera P6 XML Schema
- IEEE Standards for Power Systems
- IEC Standards for Substations

---

## 11. Quick Glossary للمصطلحات المتكررة

| Acronym | Meaning |
|---------|---------|
| TCC | Technical Completion Certificate |
| PAC | Preliminary Acceptance Certificate |
| FAC | Final Acceptance Certificate |
| RTR | Reliability Test Run |
| EHC | Energization & Holding Commissioning |
| ECC | Equipment Commercial Commissioning |
| MC | Mechanical Completion |
| DLP | Defect Liability Period (1 year typically) |
| BAC | Budget at Completion |
| EAC | Estimate at Completion |
| ETC | Estimate to Complete |
| VAC | Variance at Completion |
| EV | Earned Value |
| PV | Planned Value |
| AC | Actual Cost |
| SPI | Schedule Performance Index |
| CPI | Cost Performance Index |
| TCPI | To-Complete Performance Index |
| CPLI | Critical Path Length Index |
| BEI | Baseline Execution Index |
| TF | Total Float |
| FF | Free Float |
| LOE | Level of Effort |
| WBS | Work Breakdown Structure |
| FAT | Factory Acceptance Test |
| SAT | Site Acceptance Test |

---

## 12. Standing Instructions for AI Reviewers

عندما تراجع كود P6 Analyzer:

1. **اعرف السياق**: هذا للسعودية (NG SA)، ليس generic
2. **6 شهادات إلزامية**: TCC, PAC, FAC, RTR, EHC, ECC (لا 4!)
3. **Hijri = 354.367 days**: لا تقترح approximations بـ 11 يوم
4. **PercentComplete = 0-1 decimal** في P6 XML (وليس 0-100)
5. **Duration in HOURS** (يجب القسمة على HoursPerDay من Calendar)
6. **Critical Path ≠ Longest Path**: استخدم network-based DP لـ longest path
7. **NG Matrix priority**: لمشاريع NG، استخدم ng_matrix method افتراضياً
8. **Recovery trigger**: 10% slip OR 30 days (تحقق من المعيار الرسمي)
9. **Languages**: أسماء الأنشطة بالإنجليزية عادةً (لكن قد تكون عربية)
10. **Single-file HTML**: لا تقترح build steps أو bundlers

---

End of NG SA Context Reference
