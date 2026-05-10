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
