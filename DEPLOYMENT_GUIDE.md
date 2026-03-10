# 🚀 دليل نشر النظام - Deployment Guide
## EDD/QIB System on GitHub & Netlify

---

## 📋 جدول المحتويات

1. [المتطلبات الأساسية](#المتطلبات-الأساسية)
2. [الخطوة 1: إعداد Git](#الخطوة-1-إعداد-git)
3. [الخطوة 2: نشر على GitHub](#الخطوة-2-نشر-على-github)
4. [الخطوة 3: نشر على Netlify](#الخطوة-3-نشر-على-netlify)
5. [الاختبار والتحقق](#الاختبار-والتحقق)
6. [استكشاف الأخطاء](#استكشاف-الأخطاء)

---

## المتطلبات الأساسية

### البرامج المطلوبة:
```
✓ Git            - نظام التحكم بالإصدارات
✓ Node.js 18+    - بيئة JavaScript
✓ npm 9+         - مدير الحزم
```

### الحسابات المطلوبة:
```
✓ GitHub Account  - https://github.com (مجاني)
✓ Netlify Account - https://netlify.app (مجاني)
```

### التحقق من التثبيت:
```bash
git --version
node --version
npm --version
```

---

## الخطوة 1: إعداد Git

### 1.1 تكوين معلومات المستخدم (إذا لم تفعل سابقاً)

```bash
git config --global user.name "اسمك"
git config --global user.email "بريدك@example.com"

# التحقق من التكوين
git config --global --list
```

### 1.2 تهيئة مستودع Git محلي

```bash
cd c:\Users\mohan\EDD_QIB

# تهيئة git
git init

# أضف جميع الملفات
git add .

# أول commit
git commit -m "إنشاء مشروع EDD/QIB v2.0 - 120+ حالات demo"

# تحقق من الحالة
git status
```

### 1.3 التحقق من .gitignore

```bash
# تأكد من أن الملفات الحساسة مستبعدة
git status

# يجب ألا تظهر:
# - node_modules/
# - .env (بدون .example)
# - logs/
# - backup/
```

---

## الخطوة 2: نشر على GitHub

### 2.1 إنشاء مستودع GitHub جديد

**الطريقة الأولى: عبر واجهة GitHub**

1. اذهب إلى https://github.com/new
2. أملأ التفاصيل:
   - **Repository name**: `EDD_QIB` (أو اسم آخر)
   - **Description**: `Enhanced Due Diligence System for Qatar Islamic Bank`
   - **Visibility**: Public أو Private
   - **لا تختر**: Initialize with README (لديك بالفعل)
3. اضغط **Create Repository**

### 2.2 ربط المستودع المحلي بـ GitHub

```bash
# أضف remote اسمه origin
git remote add origin https://github.com/YOUR_USERNAME/EDD_QIB.git

# تحقق من الربط
git remote -v

# إعادة فرع main (إذا كان الفرع master)
git branch -M main

# أرسل التعديلات إلى GitHub
git push -u origin main
```

### 2.3 التحقق من النشر على GitHub

```
افتح: https://github.com/YOUR_USERNAME/EDD_QIB
```

**تأكد من أن:**
- ✅ جميع الملفات موجودة
- ✅ .gitignore يعمل (بدون node_modules)
- ✅ package.json موجود
- ✅ README.md موجود

---

## الخطوة 3: نشر على Netlify

### 3.1 الطريقة الأولى: ربط GitHub مباشرة (موصى بها)

**الخطوات:**

1. اذهب إلى https://app.netlify.com
2. انقر **Add new site** → **Import an existing project**
3. اختر **GitHub** كـ git provider
4. وافق على الصلاحيات إذا طُلب
5. اختر المستودع: `YOUR_USERNAME/EDD_QIB`
6. انقر **Next**

### 3.2 تكوين إعدادات البناء (Build Settings)

**في صفحة Build Configuration:**

```
Build command: npm run build
Publish directory: edd_system
```

**أو Netlify سيستخدم تلقائياً `netlify.toml` إذا كان موجوداً ✅**

### 3.3 تعيين متغيرات البيئة (Environment Variables)

انقر **Build & Deploy** → **Environment** → **Environment variables**

أضف:

| المتغير | القيمة | الملاحظات |
|---------|--------|----------|
| `NODE_ENV` | `production` | وضع الإنتاج |
| `API_BASE_URL` | `https://your-site.netlify.app` | أو دومينك الخاص |
| `JWT_SECRET` | `your-random-secret` | غيّر إلى قيمة عشوائية آمنة |

### 3.4 بدء النشر الأول

```
Netlify سيبدأ البناء تلقائياً عند:
- دفع commit إلى main
- أو اضغط Deploy site يدويًا
```

**مراقبة التقدم:**
- اذهب إلى **Deploys** في لوحة Netlify
- انظر إلى السجلات (Build logs) لأي أخطاء

---

## الاختبار والتحقق

### ✅ بعد النشر الناجح:

```bash
# 1. تحقق من الموقع
# افتح https://your-site.netlify.app (في المتصفح)

# 2. اختبر الصفحات الرئيسية
http://your-site.netlify.app/edd_system/
http://your-site.netlify.app/edd_system/login.html
http://your-site.netlify.app/edd_system/dashboard.html

# 3. افتح الـ Console (F12) وتحقق من عدم وجود أخطاء
```

### ⚡ اختبار الأداء

```bash
# تحقق من سرعة التحميل
# استخدم: https://pagespeed.web.dev/

# مؤشرات صحية:
# - Largest Contentful Paint (LCP) < 2.5s
# - Cumulative Layout Shift (CLS) < 0.1
# - First Input Delay (FID) < 100ms
```

### 🔄 ألم يعمل؟ اختبر محلياً أولاً

```bash
# ابدأ الخادم محلياً
npm start

# افتح في المتصفح
# http://localhost:8585
```

---

## استكشاف الأخطاء

### الخطأ: "Cannot find module 'express'"

**الحل:**
```bash
npm install
npm install express
```

### الخطأ: "Port 8585 already in use"

**الحل:**
```bash
# استخدم منفذ مختلف
PORT=9000 npm start

# أو أغلق العملية التي تستخدم 8585
lsof -i :8585
kill -9 <PID>
```

### الخطأ: "Build failed on Netlify"

**المراجعة:**
1. اقرأ السجلات: **Deploys** → السجل الفاشل → **Deploy log**
2. تحقق من:
   - ✅ `package.json` موجود
   - ✅ `npm run build` يعمل محلياً
   - ✅ نسخة Node.js صحيحة (18+)

### البيانات غير تظهر (120 حالة)

**المراجعة:**
1. افتح F12 → Console
2. اكتب: `window.eddDataModel.getStatistics()`
3. يجب أن ترى 120 حالة

---

## الخطوات التالية

### 📱 إضافة دومين custom

1. اذهب إلى **Domain settings**
2. اضغط **Add domain**
3. أدخل اسم النطاق (مثل: edd.qib.qa)
4. تابع التعليمات للـ DNS configuration

### 🔐 تفعيل HTTPS

✅ Netlify يوفر HTTPS مجاناً تلقائياً

### 🔄 النشر المستمر (CI/CD)

تم إعداده تلقائياً! في كل مرة تدفع إلى `main`:
1. GitHub يخبر Netlify
2. Netlify ينسخ الكود
3. Netlify يبني ويختبر
4. Netlify ينشر الإصدار الجديد

---

## أوامر مفيدة

### إدارة Git

```bash
# عرض آخر commit
git log --oneline

# أضف تعديلات
git add .

# أنشئ commit
git commit -m "رسالة واضحة عن التعديل"

# أرسل إلى GitHub
git push origin main

# اسحب آخر تعديلات
git pull origin main

# الفروع
git branch -a              # عرض الفروع
git checkout -b new-feature # إنشاء فرع جديد
git checkout main          # الرجوع للفرع الرئيسي
```

### اختبار محلي

```bash
# تثبيت الحزم
npm install

# بدء الخادم
npm start

# في نافذة أخرى - مراقبة التعديلات
npm run dev

# تشغيل الاختبارات
npm test

# فحص الأخطاء
npm run lint
```

---

## معلومات إضافية

### أحجام البيانات

```
120 حالة × معدل البيانات:
≈ 35-50 KB per case × 120 = 4.2-6 MB
SessionStorage limit: 5-10 MB (عادة كافي)

للضغط:
- استخدم IndexedDB للبيانات الكبيرة
- استخدم Service Workers للـ caching
```

### الأمان في الإنتاج

**قبل النشر الحقيقي:**

- [ ] غيّر `JWT_SECRET` إلى قيمة عشوائية قوية
- [ ] زيّن `CORS_ORIGIN` إلى دومينك فقط
- [ ] فعّل HTTPS (Netlify يفعل تلقائياً)
- [ ] استخدم database بدلاً من in-memory
- [ ] أضف WAF (Web Application Firewall)
- [ ] راقب الحركة والأخطاء

### النسخ الاحتياطية

```bash
# قبل أي نشر كبير
git tag -a v2.0.0 -m "Release v2.0.0"
git push origin v2.0.0

# استعادة من tag
git checkout v2.0.0
```

---

## الدعم والمساعدة

**MongoDB:**
- https://docs.netlify.com/
- https://docs.github.com/

**المجتمع:**
- Stack Overflow: [netlify] [github] tags
- Netlify Community: https://answers.netlify.com/

---

## الملخص

| الخطوة | الأمر | الوقت |
|-------|------|------|
| 1. إعداد Git | `git init && git config` | 2 دقيقة |
| 2. create GitHub Repo | عبر الواجهة | 3 دقائق |
| 3. الدفع إلى GitHub | `git push` | 1 دقيقة |
| 4. ربط Netlify | عبر الواجهة | 5 دقائق |
| 5. اختبار | تحميل الموقع | 3 دقائق |
| **الإجمالي** | | **~15 دقيقة** |

---

**تمت!** 🎉 نظامك الآن مباشر على الإنترنت مع:
- ✅ 120+ حالة واقعية
- ✅ Auto-deployment من GitHub
- ✅ HTTPS آمن
- ✅ CDN سريع عالميًا
