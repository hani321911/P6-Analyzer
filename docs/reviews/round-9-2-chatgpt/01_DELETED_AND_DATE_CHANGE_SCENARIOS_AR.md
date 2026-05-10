# 01_DELETED_AND_DATE_CHANGE_SCENARIOS_AR

## الهدف

هذا التقرير يركز تحديداً على سؤال: ماذا يحدث لو كان هناك:

1. أنشطة موجودة في Baseline ثم حُذفت أو اختفت من Progress Plan.
2. أنشطة تم تعديل تواريخها في Progress Plan.
3. أنشطة جديدة ظهرت في Progress وليست في Baseline.

والهدف هو قياس أثر هذه الحالات على:

- Planned %.
- Actual %.
- BAC.
- PV.
- EV.
- SPI.
- CPI.
- S-Curve.
- WBS rollup.

## 1. المبدأ الصحيح حسب أفضل الممارسات

في EVM، لا يجوز أن يكون Progress Plan هو المصدر الوحيد للـ denominator. السبب أن Progress يمثل التحديث الحالي، وقد يحتوي على:

- حذف غير معتمد.
- نشاط جديد غير معتمد.
- تغيير تواريخ لتغطية التأخير.
- تغيير cost/resource loading.
- تغيير percent complete.

لذلك يجب أن تكون القاعدة:

```text
Official BAC/PV basis = Approved Baseline أو Revised Baseline فقط
Official EV = Baseline BAC × Actual% من Progress
Official AC = Actual Cost من Progress
```

## 2. سيناريو A — نشاط محذوف من Progress

### بيانات السيناريو

| النشاط | Baseline BAC | Baseline Planned% عند Data Date | موجود في Progress؟ | Actual% في Progress |
|---|---:|---:|---:|---:|
| A | 500,000 | 100% | نعم | 100% |
| B | 500,000 | 100% | لا | 0% / missing |

### الحساب الصحيح

```text
BAC = 1,000,000
PV = 500,000×100% + 500,000×100% = 1,000,000
EV = 500,000×100% + 500,000×0% = 500,000
SPI = EV / PV = 0.50
```

### الحساب الخاطئ لو اعتمدنا Progress فقط

```text
BAC = 500,000
PV = 500,000
EV = 500,000
SPI = 1.00
```

### الأثر

هذا أخطر نوع تشويه؛ لأن المشروع المتأخر أو ناقص scope يظهر كأنه on schedule. لذلك يجب أن تبقى الأنشطة المحذوفة من Progress داخل baseline denominator، مع flag واضح.

### نتيجة المراجعة على Round 9.2

- الكود صار يبني rows من union بين baseline/progress، وهذا جيد.
- يوجد flag `isDeletedFromProgress`.
- لكن يجب التأكد أن جميع totals الرسمية لا تتسرب إلى progress-only أو non-filtered sets.

## 3. سيناريو B — تعديل تواريخ نشاط في Progress

### بيانات السيناريو

| النشاط | Baseline Start | Baseline Finish | Progress Finish المعدل | Data Date | Actual% |
|---|---|---|---|---|---:|
| A | 01-Jan | 31-Jan | 31-Mar | 15-Feb | 20% |

### الحساب الصحيح

إذا كان Baseline Finish هو 31-Jan، ففي 15-Feb النشاط يجب أن يكون 100% planned حسب baseline.

```text
Planned% = 100%
EV = BAC × 20%
PV = BAC × 100%
SPI = 0.20
```

### الحساب الخاطئ لو استخدمنا Progress Finish

لو استخدم البرنامج التاريخ المعدل 31-Mar:

```text
Planned% ≈ 50% أو أقل حسب طول المدة الجديدة
EV = BAC × 20%
PV = BAC × 50%
SPI = 0.40
```

هنا SPI تحسن ظاهرياً من 0.20 إلى 0.40 فقط لأن التاريخ تم تمديده في Progress، وليس لأن المشروع تحسن.

### قرار المراجعة

أي تعديل في Progress dates يجب أن يظهر كـ variance، لا أن يعيد تعريف الخطة. استخدام progress planned dates لحساب PV الرسمي يجب منعه إلا في حالة واحدة: وجود Revised Baseline معتمد.

## 4. سيناريو C — نشاط جديد في Progress غير موجود في Baseline

### بيانات السيناريو

| النشاط | موجود في Baseline؟ | Progress BAC/Cost | Actual% |
|---|---:|---:|---:|
| A | نعم | 1,000,000 | 50% |
| X-New | لا | 200,000 | 100% |

### الحساب الصحيح قبل اعتماد change order

```text
Official BAC = 1,000,000
Official EV = 1,000,000 × 50% = 500,000
X-New يظهر كـ Unbaselined Scope، ولا يدخل في official BAC/EV
```

### الحساب الخاطئ

```text
BAC = 1,200,000
EV = 500,000 + 200,000 = 700,000
Actual% weighted = 58.3% بدلاً من 50%
```

### الأثر

النشاط الجديد قد يرفع EV ويظهر المشروع أفضل من الواقع قبل اعتماده ضمن baseline.

## 5. سيناريو D — حذف + تعديل تواريخ + نشاط جديد معاً

### بيانات مختصرة

| النشاط | Baseline BAC | Progress Status | Baseline Planned% | Progress Planned% المعدل | Actual% |
|---|---:|---|---:|---:|---:|
| A | 400,000 | موجود | 100% | 80% | 80% |
| B | 300,000 | محذوف | 100% | - | 0% |
| C | 300,000 | موجود | 50% | 25% | 20% |
| D-New | - | جديد | - | 100% | 100% |

### الحساب الرسمي الصحيح

```text
BAC = 1,000,000
PV = 400,000×1.00 + 300,000×1.00 + 300,000×0.50 = 850,000
EV = 400,000×0.80 + 300,000×0.00 + 300,000×0.20 = 380,000
SPI = 380,000 / 850,000 = 0.447
```

### الحساب المضلل المحتمل

لو حذف B، واستخدم progress dates لـ C، وأدخل D-New:

```text
BAC قد يصبح 700,000 + D-New
PV ينخفض
EV يرتفع بسبب D-New
SPI يتحسن بشكل مصطنع
```

## 6. اختبارات قبول مطلوبة لهذا السيناريو

| Test ID | الشرط | Expected |
|---|---|---|
| DEL-01 | Baseline activity missing in Progress | يظهر في rows كـ deleted/missing |
| DEL-02 | Deleted activity BAC > 0 | يدخل في official BAC |
| DEL-03 | Deleted activity planned due before DD | يدخل في PV |
| DEL-04 | Deleted activity no progress | EV = 0 unless valid prior actual exists |
| DEL-05 | Deleted activity must not disappear from WBS | يظهر ضمن WBS baseline rollup |
| DATE-01 | Progress finish extended | Planned% remains baseline-driven |
| DATE-02 | Progress start shifted later | PV does not reset to 0 |
| DATE-03 | Progress dates compressed | PV does not accelerate artificially |
| DATE-04 | Revised baseline flag present | only then allow updated baseline dates |
| NEW-01 | Progress-only activity | flag `isUnbaselined=true` |
| NEW-02 | Progress-only activity | excluded from official BAC/PV/EV |
| NEW-03 | Approved change/rebaseline | included only after baseline revision |

## 7. Recommendation

أضف في الكود مفهوم واضح:

```js
const officialEvmRows = rows.filter(r =>
  !r.isMilestone &&
  !r.isSummary &&
  !isLOEActivity(r._raw) &&
  !r.isUnbaselined &&
  r.bac > 0
);
```

ثم اجعل كل totals الرسمية تستخدم `officialEvmRows` فقط:

- totalBAC.
- totalPV.
- totalEV.
- totalAC.
- SPI/CPI.
- EAC/VAC/TCPI.
- WBS EVM.
- S-Curve.

أما الأنشطة المحذوفة من Progress فلا تستبعد؛ لأنها baseline scope ما لم يثبت وجود approved deletion.
