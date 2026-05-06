# 🤝 المساهمة في P6 Analyzer
# Contributing Guide

شكراً لاهتمامك بالمساهمة! هذا المشروع مصمم خصيصاً لمشاريع SEC / NG SA، وأي مساهمة يجب أن تحترم سياق الصناعة.

---

## 📋 قبل المساهمة

### اقرأ هذه الوثائق أولاً:
1. 📐 [`docs/architecture/README.md`](docs/architecture/README.md) — معمارية النظام
2. 🇸🇦 [`docs/architecture/NG_SA_CONTEXT.md`](docs/architecture/NG_SA_CONTEXT.md) — سياق NG SA الإلزامي
3. 📚 [`docs/implementation/LESSONS_LEARNED.md`](docs/implementation/LESSONS_LEARNED.md) — دروس المراجعات السابقة

---

## 🔍 طلب مراجعة كود (Code Review Request)

### الـ Multi-AI Review Process المعتمد:

نستخدم **3 نماذج AI** للمراجعة بالتوازي:
- **Claude** (claude.ai) — التحقق المنطقي + grep verification
- **ChatGPT** (chat.openai.com) — التحليل العميق + domain expertise
- **Gemini** (gemini.google.com) — مراجعة سريعة (⚠️ معرّض للأخطاء)

### استخدم الـ workflows الموجودة:

```bash
# للمراجعات الجديدة
docs/reviews/templates/REVIEW_REQUEST_TEMPLATE.md
```

---

## ⚠️ ما يجب تجنبه (Common Pitfalls)

### اقتراحات سابقة مرفوضة (لا تكرّرها):

| ❌ Don't | ✅ Why |
|---------|-------|
| اقتراح escape HTML في React | React.createElement آمن بطبيعته |
| Event listeners cleanup في React vendor | الـ listeners ذاتية التنظيف |
| React.Fragment keys للـ static children | غير لازمة |
| Hijri تقريب 11 يوم | غير دقيق علمياً (354.367 يوم) |
| EVM /0 fix بدون verify | محمي بـ `null` already |

### قبل اقتراح bug:
- [ ] تحققت بـ grep من الكود الفعلي؟
- [ ] قرأت الـ context السطور المحيطة؟
- [ ] هذا في app code أم React vendor؟
- [ ] هل هذا اختلاف في framework defaults؟

---

## 🎯 معايير الجودة

### كل تغيير يجب أن يحقق:

1. **Syntax VALID**: `acorn parse` ينجح
2. **Functional tests**: 100% pass على الـ test cases الجديدة
3. **No regressions**: الـ tests القديمة تستمر تنجح
4. **Documentation**: تحديث الـ relevant `.md` files
5. **CHANGELOG entry**: تسجيل التغيير

### أمثلة كود مقبول:

```javascript
// ✅ GOOD: Clear comment explaining WHY
// v29.0.10: Use ?? instead of || to preserve 0 values (e.g., Manual pctType)
const value = a ?? b ?? defaultValue;

// ✅ GOOD: Function with clear contract
function getActualPctRatio(p) {
  if (!p) return 0;
  // ... logic respects pctType
  return Math.max(0, Math.min(1, num)); // clamped 0-1
}
```

```javascript
// ❌ BAD: No explanation
const value = a ?? b ?? c;

// ❌ BAD: Unbounded
function getRatio(p) {
  return p.pct; // could be any number
}
```

---

## 📝 صياغة Commit Messages

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types:
- `feat`: ميزة جديدة
- `fix`: إصلاح bug
- `refactor`: إعادة هيكلة بدون تغيير سلوك
- `docs`: تحديث وثائق
- `test`: إضافة/تعديل tests
- `chore`: مهام صيانة

### Scopes:
- `parser`: P6 XML parser
- `analyze`: analyze() function
- `audit`: DCMA/PMI/GAO/AACE
- `evm`: EVM calculations
- `cert`: Certificates detection
- `ui`: React components
- `docs`: التوثيق

### أمثلة:

```
fix(audit): network-based longest path replaces buggy reduce/sum

Previous code summed all critical activity durations, which is wrong
for parallel critical paths. New implementation uses topological DP
on relationships graph.

Refs: ChatGPT review C1 (Round 3)
Tests: 22/22 pass (incl. parallel paths case)
```

```
feat(cert): add EHC and ECC detection (mandatory NG SA certs)

EHC (Energization & Holding Commissioning) and ECC (Equipment
Commercial Commissioning) were missing entirely. NG SA requires
6 mandatory certs; we had only 4.

Refs: ChatGPT review M7 (promoted to Critical by Claude)
```

---

## 🔬 Testing

### قبل الـ commit:

```bash
# 1. Syntax check
node -e "
const acorn = require('acorn');
const fs = require('fs');
const html = fs.readFileSync('p6-analyzer.html', 'utf-8');
const matches = [...html.matchAll(/<script>([\\s\\S]*?)<\\/script>/g)];
acorn.parse(matches[1][1], { ecmaVersion: 2022 });
console.log('✓ Syntax VALID');
"

# 2. Functional test on real schedule
# اختبر على schedule حقيقي من SEC قبل الـ merge

# 3. Performance check
# تحقق أن الأداة تتعامل مع schedules كبيرة (5000+ activities) بدون lag
```

### اختبارات إلزامية حسب نوع التغيير:

| التغيير | الاختبارات الإلزامية |
|---------|----------------------|
| EVM | SPI/CPI calculations + 3 test schedules |
| Critical Path | Parallel paths + linear path + empty |
| Certificates | Real certs + false positives |
| Hijri | Multi-day coverage + post-2028 warning |
| Project Type | كل الـ 10 أنواع |

---

## 📚 الموارد

### الوثائق الرسمية:
- [DCMA 14-Point Schedule Assessment](https://www.dcma.mil/)
- [PMI Practice Standard for EVM](https://www.pmi.org/)
- [Saudi Calendar Authority (Umm al-Qura)](https://www.ucm.gov.sa)

### Internal:
- NG SA Project Scheduling and Control Manual (Feb 2016)
- SEC Quality Procedures
- NG Matrix Weightages document

---

## 📞 Contact

**Maintainer**: هاني تيسير | Planning Engineer | SEC / NG SA, Jeddah

للأسئلة التقنية: افتح Issue في GitHub
للقضايا الحرجة: تواصل مع المُطوّر مباشرة

---

شكراً لمساهمتك! 🚀
