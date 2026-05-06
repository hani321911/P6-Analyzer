# 🤖 CLAUDE.md — تعليمات لـ Claude Code

> ملف توجيهي يُقرأ تلقائياً من Claude Code عند فتح الـ repo.
> يضمن السلوك الموحّد عبر كل المحادثات.

---

## 👤 المالك والسياق

**المُطوّر**: هاني تيسير
- **الدور**: Planning Engineer
- **الشركة**: Saudi Electricity Company (SEC) / National Grid SA
- **الموقع**: جدة، المملكة العربية السعودية
- **التخصص**: Primavera P6 + power transmission projects
- **اللغة المفضلة**: عربي + مصطلحات إنجليزية

---

## 🎯 المشروع

**P6 Analyzer** — أداة تحليل احترافية لجداول Primavera P6 خاصة بـ NG SA.

- **الإصدار الحالي**: v29.0.11
- **النوع**: Single-file HTML (1.4 MB, 20,275 سطر)
- **التقنيات**: React 19.2.5 (CDN), JavaScript ES2022
- **Build step**: ❌ لا يوجد — يعمل مباشرة في المتصفح

---

## 📐 القواعد الإلزامية

### 1. أسلوب الردود
- ابدأ كل رد بـ: `نسبة الدقة: XX%`
- إذا الدقة < 100%، صرّح أن المعلومات قد تكون غير دقيقة
- اللغة: عربي + مصطلحات إنجليزية
- مباشر، تقني، بدون حشو

### 2. قبل أي تعديل
- ✅ اقرأ `docs/architecture/NG_SA_CONTEXT.md` كلياً
- ✅ تحقق من `docs/implementation/STATUS.md` لمعرفة الحالة الحالية
- ✅ تحقق من `docs/implementation/LESSONS_LEARNED.md` لتجنب الأخطاء المعروفة
- ✅ افحص الكود الفعلي بـ grep قبل أي ادعاء

### 3. عند تطبيق التغييرات
- زِد patch version تلقائياً: `v29.0.11` → `v29.0.11.1`
- حدّث الإصدار في:
  - `p6-analyzer.html` (header + footer + version constants)
  - `CHANGELOG.md` (قسم جديد)
  - `docs/implementation/STATUS.md`
  - `README.md` (badge)
- استخدم Conventional Commits:
  - `feat(scope): ...` — ميزة جديدة
  - `fix(scope): ...` — إصلاح bug
  - `docs(scope): ...` — توثيق فقط
  - `refactor(scope): ...` — إعادة هيكلة
  - `test(scope): ...` — اختبارات

### 4. الـ commits
- ✅ كل commit يجب أن يجتاز `acorn parse` (syntax check)
- ✅ كل commit يحدّث CHANGELOG.md
- ❌ لا تعمل commits بدون رسالة واضحة
- ❌ لا تدفع مباشرة لـ main لو التغيير كبير — استخدم branch

### 5. الـ branches
- `main` — الإصدارات المستقرة
- `develop` — العمل قيد التنفيذ
- `feature/<name>` — ميزات جديدة (مثل `feature/phase-3`)
- `fix/<name>` — إصلاحات
- `docs/<name>` — تحديث وثائق فقط

---

## 🚫 اقتراحات سابقة مرفوضة (لا تكرّرها أبداً)

من مراجعة Gemini Round 2 (دقة 25%):

| ❌ الاقتراح الخاطئ | ✅ السبب |
|---------------------|---------|
| XSS escape في React | React.createElement يستخدم textContent (آمن بطبيعته) |
| Event listeners cleanup | الـ listeners في React vendor (L288)، self-cleanup |
| React.Fragment keys | غير لازمة لـ static children، فقط للـ arrays.map() |
| Hijri تقريب 11 يوم | السنة الهجرية 354.367 يوم، رؤية الهلال ±1-2 يوم |
| EVM /0 fix | محمي بالفعل بـ `null` ternary |
| `dangerouslySetInnerHTML` paranoia | غير مستخدم مع user input |

---

## 🎯 النقاط الـ 6 الحرجة في الكود

كل تعديل يجب أن يأخذ في الاعتبار تأثيره على هذه:

1. **التقويم الهجري** — Saudi calendar 2024-2028 + post-2028 warning
2. **طرق حساب الإنجاز** — 5 طرق (cost, units, duration, count, ng_matrix)
3. **شهادات الإنجاز** — 6 إلزامية: TCC, PAC, FAC, RTR, **EHC, ECC**
4. **المسار الحرج** — Network-based topological DP (وليس reduce/sum)
5. **Project Type Detection** — 10 أنواع NG SA
6. **EVM Calculations** — SPI/CPI/EAC1/EAC2/EAC3/VAC/TCPI

---

## 🇸🇦 NG SA Specifics

### 6 شهادات إلزامية (لا 4!):
```
EHC → ECC → TCC → RTR → PAC → FAC
```

### 10 أنواع مشاريع:
- ss_lines, ohtl, ugc, hvdc, telecom, cyber, asset_repl, drpc_svc, battery, purchase_order

### Filename Convention:
```
####-{V}{TYPE}{seq?}
```
مثال: `1234-1MP1`

### Recovery Trigger:
- 10% slip OR 30+ يوم
- (للمشاريع HVDC قد يكون 60-90 يوم — تحقق من NG SA Manual)

### Saudi Holidays:
- Founding Day: 22 فبراير
- National Day: 23 سبتمبر
- Eid Al-Fitr: 3 أيام (هجري)
- Eid Al-Adha: 4-5 أيام (هجري)
- Ramadan: شهر كامل (تخفيض ساعات)

---

## ⚠️ P6 XML Quirks (يجب معرفتها)

1. **PercentComplete**: مخزّن كـ **decimal 0-1** (NOT 0-100)
2. **Duration**: مخزّن **بالساعات** (يجب القسمة على HoursPerDay من Calendar)
3. **TotalFloat**: غالباً مفقود في XML exports (يحسب من Late/Early Finish)
4. **LongestPath**: نادراً موجود في XML (parser يقبل true/Y/Yes/T/TRUE)
5. **Critical Path ≠ Longest Path**: استخدم network DP وليس reduce/sum
6. **HoursPerDay**: يختلف بين calendars (8/10/12 hours)

---

## 🧪 Testing Protocol

### قبل كل commit:

```bash
# 1. Syntax check (إلزامي)
node -e "
const acorn = require('acorn');
const fs = require('fs');
const html = fs.readFileSync('p6-analyzer.html', 'utf-8');
const matches = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
acorn.parse(matches[1][1], { ecmaVersion: 2022 });
console.log('✓ Syntax VALID');
"

# 2. Functional test (إن وُجد)
node tests/run-tests.js

# 3. Size check
wc -l p6-analyzer.html
ls -lh p6-analyzer.html
```

### اختبارات إلزامية حسب نوع التغيير:

| نوع التعديل | الاختبارات الإلزامية |
|-------------|----------------------|
| EVM | SPI/CPI + 3 EAC formulas + edge cases (PV=0) |
| Critical Path | Parallel paths + linear + cycle detection |
| Certificates | Real certs + false positives (PAC Walkdown) |
| Hijri | Multi-day coverage + post-2028 warning |
| LOE | 4 patterns (Level of Effort, LOE, TT_LOE, includes) |

---

## 📊 إصلاحات مطبّقة (لا تكرّرها)

### Phase 1 (v29.0.10) — Critical
- [x] EHC + ECC certifications
- [x] actualPct respects pctType
- [x] Network-based longest path
- [x] Negative context filter for certs

### Phase 2 (v29.0.11) — Major
- [x] Multi-day holidays full coverage
- [x] LOE activity exclusion
- [x] EAC1/EAC2/EAC3 + VAC + TCPI
- [x] Cost coverage warning

### Phase 3 (Backlog) — Nice to have
- [ ] EVM official P6 fields parser
- [ ] Resource Assignments parser
- [ ] Boolean flexible parsing for LongestPath
- [ ] MC vs TCC separation
- [ ] Recovery threshold verification
- [ ] Project Type confidence scoring
- [ ] blended documentation cleanup

---

## 🎓 المراجع التقنية

### معايير دولية:
- DCMA 14-Point Schedule Assessment
- PMI Practice Standard for EVM
- GAO Schedule Assessment Guide (GAO-16-89G)
- AACE 38R-06 Schedule Risk Analysis

### مراجع NG SA:
- NG SA Project Scheduling and Control Manual (Feb 2016)
- SEC Quality Procedures
- NG Matrix Weightages document

### مراجع Hijri:
- Saudi Calendar Authority (Umm al-Qura): https://www.ucm.gov.sa
- لا تستخدم تقدير 11-day approximation

---

## 🤝 Multi-AI Review Protocol

### عند طلب مراجعة جديدة:

1. **Claude (هذا الـ Claude Code أو Claude.ai)**:
   - مراجعة أساسية + grep verification
   - يستخدم: `prompts/PROMPT_C_future_reviews.md`

2. **ChatGPT** (chat.openai.com):
   - مراجعة عميقة + counter-points
   - أرسل: `docs/reviews/PROMPTS_GUIDE.md`

3. **Gemini** (gemini.google.com):
   - ⚠️ احذر — دقة 25% فقط
   - استخدم للنظرة العامة فقط، لا تثق بالاقتراحات

### بعد كل مراجعة:
- أضف ملف في `docs/reviews/round-X-{reviewer}/`
- حدّث `docs/reviews/README.md`

---

## 🔄 Git Workflow المعتمد

### للتعديلات الصغيرة (< 50 سطر):
```bash
# مباشرة على main
git checkout main
# تعديلاتك هنا...
git add .
git commit -m "fix(scope): description"
git push origin main
```

### للتعديلات الكبيرة (Phase 3 مثلاً):
```bash
# branch جديد
git checkout -b feature/phase-3
# تعديلات...
git push -u origin feature/phase-3
gh pr create --title "Phase 3: [description]" --body-file .github/PULL_REQUEST_TEMPLATE.md
# بعد المراجعة: merge
```

### Tags + Releases:
```bash
git tag -a v29.0.12 -m "v29.0.12 - Phase 3 Initial"
git push origin v29.0.12
gh release create v29.0.12 \
  --title "v29.0.12 — Phase 3 Initial" \
  --notes-file <(sed -n '/## \[29.0.12\]/,/## \[29.0.11\]/p' CHANGELOG.md | head -n -1) \
  releases/p6-analyzer-v29.0.12.html
```

---

## 💡 Tips للأداء الأمثل

### عند فحص الكود الكبير:
- استخدم `grep -n` لسرعة البحث
- لا تقرأ الملف كاملاً، استخدم `view` مع `view_range`
- استخدم acorn parse للتحقق من الـ structure

### عند التعديلات المتعددة:
- اعمل تعديل واحد → syntax check → commit → التالي
- لا تجمع تعديلات متعددة في commit واحد كبير

### عند التحقق من الادعاءات:
- ChatGPT/Claude يدعون أحياناً → تحقق بـ grep
- مثال: "EHC missing" → `grep -c "certEHC" p6-analyzer.html`

---

## 📞 إذا احتجت مساعدة

- 🌐 Claude.ai (المحادثات الطويلة + التخطيط): https://claude.ai
- 💻 Claude Code Docs: https://code.claude.com/docs
- 📚 Anthropic API: https://docs.anthropic.com

---

## 🎯 الأولويات الحالية

```
✅ Phase 1: Critical fixes (DONE in v29.0.10)
✅ Phase 2: Major fixes (DONE in v29.0.11)
⏳ Phase 3: Nice-to-have (NOT STARTED)
```

عند الجاهزية لـ Phase 3:
1. اقرأ `docs/implementation/CHECKLIST.md` Phase 3 section
2. اعمل branch: `feature/phase-3`
3. ابدأ بـ 3.1 (EVM official fields parser)

---

> **آخر تحديث**: 2026-05-06
> **بواسطة**: هاني تيسير (مع مساعدة Claude.ai)

---

**مهم**: هذا الملف يُقرأ تلقائياً من Claude Code. أي تعديل عليه يؤثر على سلوك Claude Code في كل المحادثات المستقبلية.
