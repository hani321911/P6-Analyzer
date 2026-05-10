# 00_MASTER_EXECUTIVE_SUMMARY_AR

## 1. نطاق المراجعة

هذه الحزمة تجمع نتائج مراجعتين مترابطتين:

1. مراجعة عميقة على `p6-analyzer-v29.0.11.2.html` الكامل، مع تركيز على دوال ومعادلات حساب نسب الإنجاز المخططة والفعلية وEVM.
2. مراجعة Round 9.2 على `p6-analyzer-v29.0.11.3-WIP.html` بعد أن طبّق Claude جزءاً من ملاحظات الجولة السابقة.

التركيز الأساسي لم يكن واجهة المستخدم أو التنسيق، بل صحة الحسابات التالية:

- Planned % Complete.
- Actual % Complete.
- BAC / PV / EV / AC.
- SPI / CPI / SV / CV.
- EAC / VAC / TCPI.
- WBS rollups.
- S-Curve.
- تأثير الأنشطة المحذوفة أو الجديدة أو المعدلة في Progress Plan.

## 2. الحكم التنفيذي

البرنامج قوي كأداة تحليل ومراجعة، لكنه لا يزال يحتاج إصلاحات قبل استخدامه كأداة رسمية لإصدار نسب إنجاز أو EVM claims.

### نقاط جيدة مؤكدة

- وجود union بين baseline/progress rows في نسخة Round 9.2، وهذا يسمح بظهور الأنشطة المحذوفة من Progress.
- `getActualPctRatio()` تحسن وصار يتعامل مع `pctType` وفلسفة fallback بشكل أفضل.
- بعض method cards تستخدم `evmFiltered` لاستبعاد milestone/summary/LOE.
- الاختبارات الرسمية نجحت في جولة v29.0.11.2 عند تشغيل الملف الكامل: 191/191.
- اختبارات Round 9.2 أظهرت تحسن واضح في Actual% matrix.

### نقاط تمنع الاعتماد الرسمي

| ID | درجة الخطورة | الملخص | سبب الأثر |
|---|---|---|---|
| CR-01 | Critical | Summary EVM totals تستخدم `evmAll` بدل `evmFiltered` | ممكن تدخل LOE أو unbaselined scope في BAC/PV/EV |
| CR-02 | Critical | الأنشطة الجديدة في Progress لا تزال قد تدخل في totals الرسمية | تضخم BAC/EV قبل وجود baseline change معتمد |
| CR-03 | Critical | حذف نشاط من Progress يجب ألا يخرجه من denominator | قد يحسن نسب الإنجاز وSPI بشكل مضلل |
| HI-01 | High | تعديل تواريخ Progress لا يجب أن يغير Planned% الرسمي | يعيد تشكيل الخطة أثناء التنفيذ ويخفي التأخير |
| HI-02 | High | S-Curve earned line مبني كـ `cumPlanned * earnedRatio` | يخفي الفروقات الزمنية الحقيقية في الإنجاز |
| HI-03 | High | WBS rollup يستخدم raw/progress weight في بعض المواضع | قد يبتعد عن baseline-controlled EVM |
| ME-01 | Medium | planned% calendar-day فقط | لا يعكس تقويمات Saudi/Eid/5-day/6-day بدقة |

## 3. المبدأ الحاكم للحساب الصحيح

أي حساب رسمي لازم يلتزم بالفصل التالي:

- **Baseline / Approved Plan:** مصدر BAC وPlanned dates وPV وdenominator.
- **Progress / Update:** مصدر Actual% وActual Cost وActual dates وstatus فقط.
- **New activities:** لا تدخل في official EVM إلا بعد approved baseline revision/change order.
- **Deleted activities:** تبقى ظاهرة ومحسوبة ضمن baseline scope إلى أن يتم اعتماد حذفها رسمياً.
- **Progress date changes:** لا تعيد تشكيل PV الرسمي إلا إذا كانت جزءاً من revised baseline معتمد.

## 4. نتيجة سيناريو الحذف وتعديل التواريخ

### حذف نشاط من Progress

لو النشاط موجود في baseline وغير موجود في progress، المفترض:

- يبقى ضمن BAC.
- يبقى ضمن PV حسب baseline dates.
- EV له = 0 أو حسب آخر actual معتمد إذا كان موجوداً سابقاً.
- يظهر flag واضح: `DeletedFromProgress` أو `MissingInUpdate`.
- لا يجوز أن يختفي من denominator.

### تعديل تاريخ نشاط في Progress

لو النشاط موجود في baseline وتم تغيير planned/current dates في progress:

- Planned% الرسمي يجب أن يستمر على baseline dates.
- Actual% يأتي من progress percent fields.
- التأخير يظهر كvariance، وليس كخطة جديدة.
- استخدام progress planned dates لحساب PV يعتبر خطأ إذا لم تكن revised baseline.

## 5. قرار الاستخدام

| الاستخدام | القرار |
|---|---|
| تحليل داخلي سريع | مقبول مع التحذيرات |
| مراجعة QA لملفات XER/XML | جيد |
| Dashboard رسمي لمطالبات الإنجاز | لا يعتمد قبل patches |
| EVM رسمي أمام الإدارة/المالك | لا يعتمد قبل patches واختبارات قبول |
| فحص فروقات baseline/progress | مناسب بعد إبراز flags بشكل واضح |

## 6. الأولوية التنفيذية للإصلاح

1. Patch official EVM eligibility: `evmAll = evmFiltered` واستبعاد unbaselined.
2. Patch deleted activities: baseline denominator ثابت دائماً.
3. Patch WBS rollups: من `evmFiltered` وبأوزان baseline.
4. Patch S-Curve earned: من actual timing وليس earnedRatio.
5. Patch planned% calendar-aware.
6. تحديث الاختبارات لقبول السيناريوهات الحساسة.


---

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


---

# 02_EVM_FORMULA_AND_PROGRESS_METHODS_AUDIT_AR

## 1. المعادلات الأساسية التي يجب اعتمادها

| المصطلح | الاسم | المعادلة الصحيحة |
|---|---|---|
| BAC | Budget at Completion | مجموع الميزانية المعتمدة من baseline للأنشطة الرسمية |
| PV / BCWS | Planned Value | مجموع `Baseline BAC × Planned% at Data Date` |
| EV / BCWP | Earned Value | مجموع `Baseline BAC × Actual% from Progress` |
| AC / ACWP | Actual Cost | مجموع actual cost من Progress |
| SV | Schedule Variance | `EV - PV` |
| CV | Cost Variance | `EV - AC` |
| SPI | Schedule Performance Index | `EV / PV` |
| CPI | Cost Performance Index | `EV / AC` |
| EAC | Estimate at Completion | غالباً `BAC / CPI` أو formula variant موثق |
| VAC | Variance at Completion | `BAC - EAC` |
| TCPI | To Complete Performance Index | `(BAC - EV) / (BAC - AC)` أو `(BAC - EV)/(EAC - AC)` حسب policy |

## 2. أهم قاعدة في البرنامج

الخلط بين baseline وprogress هو مصدر معظم الأخطاء المحتملة.

| عنصر الحساب | المصدر الصحيح |
|---|---|
| BAC | Baseline / Revised Baseline |
| Planned dates for official PV | Baseline dates |
| Planned% | Baseline dates/calendar/curve |
| Actual% | Progress percent fields حسب PercentCompleteType |
| Actual Cost | Progress actual cost |
| New scope | خارج الرسمي إلى أن يعتمد |
| Deleted scope | داخل الرسمي إلى أن يعتمد حذفه |

## 3. Planned% methods

### 3.1 Linear Calendar Days

```text
Planned% = (DataDate - BaselineStart) / (BaselineFinish - BaselineStart)
```

مقبول كطريقة fallback، لكنه غير كافٍ للمشاريع الرسمية لأنه يتجاهل الإجازات والتقاويم.

### 3.2 Working Days / Working Hours

```text
Planned% = WorkingHoursElapsed / TotalWorkingHours
```

هذه أفضل من calendar days، خصوصاً في السعودية ومشاريع SEC/NG SA بسبب:

- 5-day calendar.
- 6-day calendar.
- Friday/Saturday weekends.
- Eid holidays.
- night shifts.
- different hours/day.

### 3.3 Cost-loaded / Resource-loaded S-Curve

```text
Planned% = PlannedCostToDate / TotalBAC
```

هذه الأفضل إذا كانت activities cost/resource loaded، لأنها تعكس التوزيع الحقيقي للقيمة خلال مدة النشاط.

### 3.4 Milestone Weighted

```text
Planned/Actual % = sum(completed milestone weights) / total milestone weights
```

مهم للأنشطة التي لا يمكن قياسها خطياً.

### 3.5 Physical Quantity

```text
Actual% = QuantityCompleted / TotalQuantity
```

الأفضل للأنشطة مثل excavation, foundations, towers, stringing, concrete, cable pulling.

## 4. Actual% حسب P6 PercentCompleteType

| pctType | المصدر المفضل | fallback المناسب |
|---|---|---|
| Physical | PhysicalPercentComplete | PercentComplete ثم Duration ثم Units |
| Duration | DurationPercentComplete | PercentComplete ثم Physical ثم Units |
| Units | UnitsPercentComplete | PercentComplete ثم Physical ثم Duration |
| Manual | PercentComplete | لا يجوز أن يسقط zero إلى fallback |
| Missing | PercentComplete ثم Duration ثم Physical ثم Units | حسب policy موثق |

## 5. Zero handling

هذه نقطة مهمة جداً:

```text
0% قيمة صحيحة وليست missing
```

لذلك لا يجوز استخدام `||` في fallback؛ لأن `0 || other` سيأخذ other. يجب استخدام nullish أو firstNonNull.

## 6. Percent scale

P6 fields غالباً تأتي كـ 0–100 في XML، بينما بعض الاختبارات أو الإدخالات قد تستخدم 0–1.

السياسة المقترحة:

- إذا value > 1 و <= 100: تقسم على 100.
- إذا value >= 0 و <= 1: تستخدم كما هي.
- إذا value < 0: clamp إلى 0.
- إذا value > 100: clamp إلى 1.
- string مثل `50%`: strip `%` ثم parse.

مثال:

| input | result |
|---:|---:|
| 0.7 | 0.7 |
| 70 | 0.7 |
| 1.5 | 0.015 إذا اعتبرنا P6 XML percent field |
| 150 | 1.0 |
| -5 | 0 |
| `50%` | 0.5 |

## 7. Round 9.2 code observations

من grep على `v29.0.11.3-WIP`:

- `calcPct` موجود حول L7280.
- `getActualPctRatio` حول L7294.
- `normalizePct` حول L7303.
- flags `isUnbaselined` و`isDeletedFromProgress` حول L7397-L7398.
- `evmFiltered` حول L7472.
- المشكلة: `evmAll` حول L7499 ويستخدم في totals L7500-L7503.
- `earnedRatio` وS-Curve earned حول L7685-L7691.

## 8. التصحيح المطلوب

```js
const officialEvmRows = rows.filter(r =>
  !r.isMilestone &&
  !r.isSummary &&
  !isLOEActivity(r._raw) &&
  !r.isUnbaselined &&
  (r.bac || 0) > 0
);

const totalBac = officialEvmRows.reduce((s, r) => s + r.bac, 0);
const totalPV = officialEvmRows.reduce((s, r) => s + r.pv, 0);
const totalEV = officialEvmRows.reduce((s, r) => s + r.ev, 0);
const totalAC = officialEvmRows.reduce((s, r) => s + r.ac, 0);
```

## 9. Expected acceptance after patch

| Area | Expected |
|---|---|
| Deleted baseline activity | included in official denominator |
| Progress-only activity | excluded until rebaseline |
| LOE | excluded from EVM totals |
| Summary rows | excluded |
| Milestones | handled separately or weight-based only if configured |
| Planned% | baseline-driven |
| Actual% | progress-driven |
| S-Curve earned | actual timing-driven |
| WBS EVM | official rows only |


---

# 03_ACCEPTANCE_TEST_CHECKLIST_AR

## الهدف

هذه قائمة قبول يجب تنفيذها بعد تطبيق Claude للإصلاحات. لا تعتبر النسخة جاهزة رسمياً إلا إذا نجحت هذه الاختبارات.

## 1. تشغيل الاختبارات الرسمية

```bash
cp p6-analyzer-v29.0.11.3-WIP.html p6-analyzer.html
node tests/phase1/test_v29_0_10.cjs
node tests/phase2/test_phase2.cjs
node tests/integration/test_e2e_analyze.cjs
node tests/comprehensive/test_08_round9_regressions.cjs
node round9_2_formula_audit.cjs
```

## 2. نتائج قبول متوقعة

| Suite | Target |
|---|---:|
| Phase 1 | 36/36 بعد تحديث سياسة 1.5 |
| Phase 2 | 40/40 بعد تحديث static checks |
| Integration E2E | 28/28 |
| Round 9 regressions | Pass |
| Custom formula audit | كل سيناريوهات official totals تمر |

## 3. Acceptance scenarios

### DEL — Deleted Activities

| Test | Description | Pass Criteria |
|---|---|---|
| DEL-01 | baseline activity missing from progress | appears in rows |
| DEL-02 | missing activity has BAC | BAC included in totalBAC |
| DEL-03 | missing activity due by data date | PV included |
| DEL-04 | no actual progress | EV = 0 |
| DEL-05 | WBS rollup | included in WBS denominator |

### DATE — Progress Date Changes

| Test | Description | Pass Criteria |
|---|---|---|
| DATE-01 | progress finish extended | baseline planned% unchanged |
| DATE-02 | progress start moved later | PV does not reset |
| DATE-03 | progress finish compressed | PV does not accelerate unless revised baseline |
| DATE-04 | actual dates present | actual fields affect actual timing only |
| DATE-05 | revised baseline mode | changed dates allowed only when selected/approved |

### NEW — Unbaselined Activities

| Test | Description | Pass Criteria |
|---|---|---|
| NEW-01 | progress-only activity | `isUnbaselined=true` |
| NEW-02 | progress-only with cost | excluded from totalBAC/totalPV/totalEV |
| NEW-03 | progress-only complete | not inflating EV |
| NEW-04 | approved revised baseline | included only after baseline revision |

### LOE — Level of Effort

| Test | Description | Pass Criteria |
|---|---|---|
| LOE-01 | TT_LOE activity | excluded from official EVM |
| LOE-02 | LOE with cost | not inflating BAC/EV |
| LOE-03 | LOE in S-Curve | excluded or separately reported |

### WBS — Rollups

| Test | Description | Pass Criteria |
|---|---|---|
| WBS-01 | WBS totals | match sum of officialEvmRows |
| WBS-02 | deleted activity in WBS | included |
| WBS-03 | new unbaselined in WBS | excluded from official but shown separately |
| WBS-04 | LOE in WBS | excluded from official |

### S-Curve

| Test | Description | Pass Criteria |
|---|---|---|
| SC-01 | earned line | not computed by `cumPlanned * earnedRatio` |
| SC-02 | delayed actual | earned curve shows lag |
| SC-03 | future planned | earned null/frozen after data date |
| SC-04 | deleted activity | planned curve retains baseline BAC |

## 4. Manual UI verification

بعد الاختبارات البرمجية، افتح HTML في المتصفح وتحقق من:

- وجود badge أو flag للأنشطة المحذوفة من progress.
- وجود badge للأنشطة الجديدة غير الموجودة في baseline.
- totals في summary تطابق officialEvmRows.
- WBS rollup يطابق totals.
- S-Curve لا يرسم earned كنسخة بنفس شكل planned.
- report/export يوضح منهجية الحساب.

## 5. شروط الاعتماد النهائي

لا تعتمد النسخة إلا إذا:

1. كل totals الرسمية مبنية من source واحد موحد `officialEvmRows`.
2. الأنشطة المحذوفة لا تسقط من denominator.
3. الأنشطة الجديدة لا تدخل إلا بعد rebaseline.
4. تعديل تواريخ Progress لا يغير PV الرسمي.
5. اختبار سيناريو C من البرومبت ينجح رياضياً.
6. S-Curve earned يعكس actual timing.


---

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


---

# 05_CLAUDE_DELIVERY_MESSAGE_AR

## رسالة جاهزة لإرسالها إلى Claude

انسخ النص التالي وأرفق معه هذه الحزمة:

---

السلام عليكم Claude،

هذه حزمة مراجعة تفصيلية جديدة لـ P6 Analyzer Round 9.2. المطلوب ليس مراجعة عامة، بل تطبيق إصلاحات دقيقة على حسابات Planned% / Actual% / BAC / PV / EV / AC / SPI / CPI وسيناريوهات حذف/تعديل أنشطة Progress.

**المهم جداً:**
- لا تغيّر architecture.
- لا تقترح TypeScript أو build system.
- لا تغيّر هوية البرنامج أو اللغة الثنائية.
- ركّز فقط على صحة حسابات الإنجاز وEVM.

## الملفات الأهم داخل الحزمة

1. `03_consolidated_reports/00_MASTER_EXECUTIVE_SUMMARY_AR.md`
2. `03_consolidated_reports/01_DELETED_AND_DATE_CHANGE_SCENARIOS_AR.md`
3. `03_consolidated_reports/02_EVM_FORMULA_AND_PROGRESS_METHODS_AUDIT_AR.md`
4. `03_consolidated_reports/03_ACCEPTANCE_TEST_CHECKLIST_AR.md`
5. `02_round9_2_v29_0_11_3_wip_review/03_RECOMMENDED_PATCHES_v29.0.11.3.md`
6. `02_round9_2_v29_0_11_3_wip_review/04_PROMPT_FOR_CLAUDE.md`

## المطلوب منك

طبّق الإصلاحات التالية بالترتيب:

1. اجعل كل official EVM totals تستخدم مجموعة واحدة موحدة `officialEvmRows` أو `evmFiltered` بعد استبعاد:
   - milestones
   - summary rows
   - LOE / TT_LOE
   - unbaselined progress-only activities

2. لا تستبعد الأنشطة الموجودة في baseline والمحذوفة من progress. يجب أن تبقى في BAC/PV denominator.

3. اجعل Planned% الرسمي baseline-driven. لا تستخدم progress date changes لتحسين PV إلا إذا كان هناك revised baseline معتمد.

4. عدّل WBS rollup ليستخدم نفس officialEvmRows وبأوزان baseline.

5. أعد تصميم S-Curve earned. ممنوع استخدام:

```js
cumPlanned * earnedRatio
```

استخدم actual dates/data date لتوزيع EV.

6. حدّث الاختبارات طبقاً لـ `03_ACCEPTANCE_TEST_CHECKLIST_AR.md`.

## معيار النجاح

النسخة لا تعتبر جاهزة إلا إذا نجحت سيناريوهات:

- deleted baseline activities remain in denominator.
- progress-only activities excluded from official totals.
- progress date extension does not improve PV/SPI.
- LOE excluded everywhere official.
- WBS totals match official summary totals.
- S-Curve earned differs from planned shape when actual progress lags.

---
