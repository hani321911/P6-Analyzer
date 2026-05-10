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
