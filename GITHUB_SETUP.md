# 🚀 خطوات رفع المشروع إلى GitHub

> دليل شامل خطوة بخطوة لرفع P6 Analyzer إلى GitHub

---

## 📋 المتطلبات الأساسية

### على Mac Mini M4 (Warp Terminal):

```bash
# 1. تأكد من تثبيت Git
git --version
# لو لم يكن مثبت:
brew install git

# 2. تأكد من تثبيت GitHub CLI (اختياري لكن موصى به)
gh --version
# لو لم يكن مثبت:
brew install gh
```

### على Windows PC (PowerShell):

```powershell
# 1. تأكد من Git
git --version
# لو لم يكن مثبت، حمّل من: https://git-scm.com/download/win

# 2. GitHub CLI (اختياري)
winget install --id GitHub.cli
```

---

## 🔐 الخطوة 1: إنشاء حساب GitHub والمستودع

### 1.1 — إنشاء حساب (إن لم يكن لديك)
1. اذهب إلى https://github.com/signup
2. سجّل بإيميلك (يُفضّل إيميل العمل)

### 1.2 — إنشاء Repository
**عبر الموقع** (الأسهل):
1. اذهب إلى https://github.com/new
2. **Repository name**: `p6-analyzer`
3. **Description**: `P6 Analyzer for SEC / National Grid SA — Schedule analysis tool`
4. **Visibility**: 
   - 🔒 **Private** (موصى به للأعمال الداخلية)
   - 🌐 **Public** (للمشاركة العامة)
5. **لا تختار** "Initialize with README" (لأنك ستضيفه يدوياً)
6. اضغط **Create repository**

**عبر Terminal** (للمتقدمين):
```bash
gh auth login  # إعداد المصادقة لمرة واحدة
gh repo create p6-analyzer --private --description "P6 Analyzer for SEC / NG SA"
```

---

## 📁 الخطوة 2: إعداد المجلد المحلي

### 2.1 — انسخ الحزمة المُجهَّزة

```bash
# على Mac
cd ~/Documents
unzip ~/Downloads/p6-analyzer-github-repo.zip
cd p6-analyzer-github-repo

# على Windows
cd $HOME\Documents
Expand-Archive -Path "$HOME\Downloads\p6-analyzer-github-repo.zip" -DestinationPath .
cd p6-analyzer-github-repo
```

### 2.2 — تحقق من البنية

```bash
ls -la
```

يجب أن ترى:
```
.git/                         (يُنشأ لاحقاً)
.github/                      ← workflows + templates
.gitignore
CHANGELOG.md
CONTRIBUTING.md
README.md
code-split/                   ← الكود مُقسَّم
docs/                         ← التوثيق
p6-analyzer.html             ← الكود الرئيسي
releases/                    ← إصدارات سابقة
```

---

## 🔧 الخطوة 3: إعداد Git المحلي

### 3.1 — أول مرة فقط (configuration عام)

```bash
# اضبط اسمك وإيميلك
git config --global user.name "Hani Taysseer"
git config --global user.email "your-email@example.com"

# اضبط main كـ default branch
git config --global init.defaultBranch main

# اضبط محرر النصوص (اختياري)
git config --global core.editor "code --wait"  # VS Code
# أو
git config --global core.editor "nano"          # Nano
```

### 3.2 — تهيئة Git في المجلد

```bash
cd ~/Documents/p6-analyzer-github-repo

# إنشاء repo محلي
git init

# تأكد من branch name
git branch -M main
```

---

## 📤 الخطوة 4: أول commit

### 4.1 — إضافة الملفات

```bash
# رؤية ما سيتم إضافته
git status

# إضافة كل شيء
git add .

# تحقق
git status  # يجب أن ترى كل الملفات في "Changes to be committed"
```

### 4.2 — أول commit

```bash
git commit -m "feat: initial commit — P6 Analyzer v29.0.10

Phase 1 critical fixes implemented:
- Add EHC + ECC certifications (mandatory NG SA)
- Fix actualPct to respect pctType (Physical/Duration/Units/Manual)
- Replace Longest Path sum with network-based topological DP
- Add negative context filter for cert false positives

Multi-AI reviewed: Claude (Round 1, 4) + ChatGPT (Round 3, 5) + Gemini (Round 2)
Tests: 22/22 functional pass

Refs: docs/reviews/round-5-chatgpt-final/"
```

---

## 🌐 الخطوة 5: ربط بـ GitHub remote

### 5.1 — اربط بالـ remote

```bash
# اعرض رابط repo الخاص بك من GitHub (يبدأ بـ git@github.com: أو https://)
git remote add origin git@github.com:YOUR_USERNAME/p6-analyzer.git

# أو HTTPS
git remote add origin https://github.com/YOUR_USERNAME/p6-analyzer.git

# تحقق
git remote -v
```

### 5.2 — ادفع الكود لأول مرة

```bash
git push -u origin main
```

**في حال طلب مصادقة**:
- HTTPS: استخدم Personal Access Token من https://github.com/settings/tokens
- SSH: تحتاج لإعداد SSH key أولاً (انظر القسم التالي)

---

## 🔑 الخطوة 6: إعداد SSH (لتجنب كتابة Password كل مرة)

### 6.1 — أنشئ SSH key

```bash
# على Mac/Linux
ssh-keygen -t ed25519 -C "your-email@example.com"
# اضغط Enter للموقع الافتراضي
# ضع passphrase قوية (اختياري)

# عرض المفتاح العام
cat ~/.ssh/id_ed25519.pub
# انسخه (يبدأ بـ ssh-ed25519...)
```

### 6.2 — أضفه لـ GitHub

1. اذهب إلى https://github.com/settings/ssh/new
2. **Title**: `Mac Mini M4` (أو ما تحب)
3. **Key**: الصق المفتاح العام
4. اضغط **Add SSH key**

### 6.3 — اختبر الاتصال

```bash
ssh -T git@github.com
# يجب أن ترى: Hi YOUR_USERNAME! You've successfully authenticated...
```

---

## 🏷️ الخطوة 7: إنشاء Release لـ v29.0.10

### 7.1 — أنشئ tag

```bash
# tag للإصدار الحالي
git tag -a v29.0.10 -m "v29.0.10 — Phase 1 Critical Fixes

- EHC + ECC mandatory cert detection
- pctType-aware actualPct calculation
- Network-based longest path (DCMA-04 accuracy)
- Negative context filter for cert false positives

Tests: 22/22 pass
Multi-AI reviewed (Claude + ChatGPT)"

# ادفع الـ tag لـ GitHub
git push origin v29.0.10
```

### 7.2 — أنشئ Release على GitHub

**عبر الموقع**:
1. اذهب إلى `https://github.com/YOUR_USERNAME/p6-analyzer/releases`
2. اضغط **Create a new release**
3. **Choose a tag**: `v29.0.10` (الذي أنشأته للتو)
4. **Title**: `v29.0.10 — Phase 1 Critical Fixes`
5. **Description**: انسخ من `CHANGELOG.md` قسم v29.0.10
6. **ارفع** ملف `releases/p6-analyzer-v29.0.10.html` كـ asset
7. اضغط **Publish release**

**عبر CLI**:
```bash
gh release create v29.0.10 \
  --title "v29.0.10 — Phase 1 Critical Fixes" \
  --notes-file <(sed -n '/## \[29.0.10\]/,/## \[29.0.9.2\]/p' CHANGELOG.md | head -n -1) \
  releases/p6-analyzer-v29.0.10.html
```

---

## 🔄 الخطوة 8: Workflow اليومي

### 8.1 — قبل البدء بالعمل

```bash
cd ~/Documents/p6-analyzer-github-repo
git pull origin main  # احصل على آخر التحديثات
```

### 8.2 — أنشئ branch للميزة

```bash
# لميزة جديدة
git checkout -b feature/phase-2-loe-exclusion

# أو لإصلاح bug
git checkout -b fix/multi-day-holidays
```

### 8.3 — اعمل + commit

```bash
# اعمل على الكود
# ...

# تحقق من التغييرات
git status
git diff

# أضف
git add p6-analyzer.html docs/implementation/STATUS.md CHANGELOG.md

# commit
git commit -m "feat(audit): exclude LOE activities from progress calculation

- Add isLOEActivity() helper
- Update evmFiltered to exclude LOE
- Test: 4/4 cases pass

Refs: ChatGPT M3, Phase 2.2"
```

### 8.4 — ادفع الـ branch

```bash
git push -u origin feature/phase-2-loe-exclusion
```

### 8.5 — أنشئ Pull Request

**عبر CLI**:
```bash
gh pr create --title "Phase 2.2: LOE Activity Exclusion" \
  --body-file .github/PULL_REQUEST_TEMPLATE.md
```

**أو عبر الموقع**:
- اذهب إلى repo على GitHub
- ستجد رابط "Compare & pull request"
- املأ القالب
- اضغط "Create pull request"

---

## 🤝 الخطوة 9: مشاركة الـ repo مع مراجعين

### 9.1 — Private repo (Internal team)

1. اذهب إلى `Settings → Collaborators and teams`
2. اضغط **Add people**
3. أدخل username أو email
4. اختر دور:
   - **Read** — يقدر يرى ويعلّق فقط
   - **Triage** — يقدر يدير issues
   - **Write** — يقدر يـ push
   - **Maintain** — يقدر يدير الـ repo
   - **Admin** — كل الصلاحيات

### 9.2 — Public repo (Open review)

- اجعل الـ repo public (Settings → General → Danger Zone)
- شارك الرابط على LinkedIn / Twitter
- اطلب مراجعات في Issues

---

## 📚 الخطوة 10: تنظيم Issues للمراجعات المستقبلية

### إنشاء labels مفيدة:

```bash
gh label create "phase-2" --description "Phase 2 — Major fixes" --color "fbca04"
gh label create "phase-3" --description "Phase 3 — Nice to have" --color "0e8a16"
gh label create "ai-review" --description "AI-generated review" --color "7057ff"
gh label create "claude-review" --description "Reviewed by Claude" --color "ff9500"
gh label create "chatgpt-review" --description "Reviewed by ChatGPT" --color "10a37f"
gh label create "domain-ng-sa" --description "NG SA specific" --color "1d76db"
```

### استخدم القوالب الجاهزة:
- `.github/ISSUE_TEMPLATE/bug_report.md`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `.github/ISSUE_TEMPLATE/review_request.md`

---

## 🎯 الخطوة 11: أمن البيانات

### ⚠️ احذر من رفع بيانات حساسة:

`.gitignore` يستثني تلقائياً:
- ✅ `.env` files
- ✅ `test-schedules/` (P6 schedules حقيقية)
- ✅ `private/`, `client-data/`
- ✅ AI artifacts

### قبل أي push، تحقق:

```bash
# تحقق من المحتوى
git diff --staged

# لو نسيت ملف حساس بالخطأ
git reset HEAD <file>  # احذفه من staged
echo "filename" >> .gitignore
```

### لو رفعت ملف حساس بالخطأ:

```bash
# لا تضع ملفات حساسة public!
# لو تم الـ push، يحتاج:
# 1. أزل الملف من تاريخ Git (BFG Repo-Cleaner)
# 2. غيّر passwords/keys فوراً
# 3. أبلغ GitHub Support
```

---

## 📊 الخطوة 12: Dashboard

### مشاهد مفيدة بعد الإعداد:

1. **Insights → Pulse** — نشاط الـ repo
2. **Insights → Contributors** — من ساهم
3. **Issues** — قائمة المهام
4. **Pull requests** — التغييرات قيد المراجعة
5. **Actions** — workflows runs (syntax checks)
6. **Releases** — الإصدارات المنشورة

---

## ✅ Checklist نهائي

قبل اعتبار الإعداد مكتملاً:

- [ ] Repo منشأ على GitHub
- [ ] الكود مرفوع (v29.0.10)
- [ ] CHANGELOG.md موجود ومحدّث
- [ ] README.md جذاب
- [ ] CONTRIBUTING.md للمساهمين
- [ ] .gitignore مُعدّ بشكل آمن
- [ ] Issue/PR templates موجودة
- [ ] GitHub Actions يعمل (syntax check)
- [ ] Release v29.0.10 منشور
- [ ] (اختياري) Collaborators تمت إضافتهم
- [ ] (اختياري) GitHub Pages مُفعّل لعرض README

---

## 🚀 الإعداد التالي: Live Demo (اختياري)

### تفعيل GitHub Pages لعرض الأداة مباشرة:

1. Settings → Pages
2. Source: `main` branch / `/ (root)`
3. Save

ستحصل على رابط مثل:
`https://YOUR_USERNAME.github.io/p6-analyzer/`

⚠️ **احذر**: لا تفعّل Pages لو الـ repo فيه بيانات حساسة!

---

## 📞 المساعدة

- 📖 [GitHub Docs](https://docs.github.com)
- 💬 [GitHub Community](https://github.community)
- 🎓 [Pro Git Book](https://git-scm.com/book/en/v2) (مجاني)

---

**حظاً موفقاً مع GitHub! 🚀**
