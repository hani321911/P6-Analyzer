# 04_RISK_REGISTER_AR

## سجل مخاطر حسابات الإنجاز وEVM

| Risk ID | الخطر | الاحتمال | الأثر | المستوى | التخفيف |
|---|---|---:|---:|---:|---|
| R-01 | دخول أنشطة unbaselined في totals الرسمية | عالي | عالي | Critical | استبعادها من officialEvmRows |
| R-02 | اختفاء الأنشطة المحذوفة من Progress من denominator | متوسط | عالي | Critical | union baseline/progress + إبقاؤها في BAC/PV |
| R-03 | تعديل dates في Progress يحسن Planned% | عالي | عالي | Critical | Planned% من baseline فقط |
| R-04 | LOE يضخم EV/BAC | متوسط | متوسط/عالي | High | استبعاد LOE من EVM totals |
| R-05 | S-Curve earned mirrors planned | عالي | متوسط/عالي | High | earned buckets من actual timing |
| R-06 | WBS rollup لا يطابق summary | متوسط | عالي | High | استخدام officialEvmRows لكل rollups |
| R-07 | calendar-day planned% يخالف التقويم السعودي | عالي | متوسط | High | calendar-aware planned ratio |
| R-08 | percent scale ambiguity | متوسط | متوسط | Medium | policy موثق + tests |
| R-09 | static tests قد تعطي false pass/fail | متوسط | متوسط | Medium | تحويلها لاختبارات سلوكية أكثر |
| R-10 | claims/reporting بدون disclosure | متوسط | عالي | High | إضافة منهجية واضحة في التقرير والتصدير |

## أعلى 3 مخاطر

### 1. Scope denominator distortion

أي حذف أو إضافة غير معتمدة قد تغير denominator. هذا يؤثر مباشرة على % complete وSPI.

### 2. Replanned progress masking delays

إذا استخدمت progress dates بدل baseline dates، يصبح كل تأخير قابل للإخفاء بمجرد تمديد التاريخ في التحديث.

### 3. Earned curve distortion

إذا كان earned curve مجرد planned curve مضروب في ratio، فلن يكشف التأخر الزمني الحقيقي.

## Controls مقترحة

- Locked baseline mode.
- Revised baseline mode منفصل وواضح.
- Scope change register داخل التحليل.
- Audit warnings في UI.
- Export methodology section.
- Test suite لكل سيناريو حساس.
