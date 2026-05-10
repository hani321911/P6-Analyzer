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
