# نظام المسارات الموحد - Unified Path System
## مرجع استخدام كامل والتوثيق

---

## المشكلة الأصلية 🔴

### مسارات مطلقة غير آمنة:
```javascript
// ❌ هذا يفشل في الصفحات الفرعية
fetch('/edd_system/data/cases.json');
fetch('/edd_system/js/case_manager.js');
document.src = '/edd_system/css/styles.css';
```

**المشاكل:**
- لا تعمل في صفحات فرعية (مثل `/edd_system/admin/dashboard.html`)
- غير محمولة (عند نقل النظام لـ subdir آخر)
- صعبة الاختبار في بيئات مختلفة
- غير آمنة للنشر في staging/production

---

## الحل ✅

### استخدام Path Manager الموحد:

```javascript
// ✅ آمن وحاسوب في جميع الحالات
pathManager.getScriptPath('case_manager.js');      // /edd_system/js/case_manager.js
pathManager.getStylePath('dashboard.css');         // /edd_system/css/dashboard.css
pathManager.getAssetPath('employees/user.jpg');    // /edd_system/assets/employees/user.jpg
pathManager.getAbsoluteUrl('/api/v1/cases');       // http://localhost:8585/api/v1/cases
```

---

## التثبيت والإعداد

### الخطوة 1: إضافة السكريبت إلى HEAD (كأول سكريبت)
```html
<head>
  <!-- يجب أن يكون في البداية قبل أي سكريبت آخر -->
  <script src="/edd_system/js/path_manager.js"></script>
  
  <!-- الآن يمكن استخدام pathManager -->
  <script src="/edd_system/js/edd_data_model.js"></script>
  <script src="/edd_system/js/case_manager.js"></script>
</head>
```

### الخطوة 2: استخدام في البرامج
```javascript
// في أي سكريبت باستطاعتك استخدام pathManager مباشرة

// تحميل البيانات
async function loadCases() {
  const data = await pathManager.get('cases');
  console.log(data); // التحقق من الحالات
}

// الذهاب لصفحة أخرى
pathManager.navigate('dashboard');
pathManager.navigate('kycForm', { customerId: '123' });
```

---

## الواجهة العامة (Public API)

### 📍 حاصل المسارات (Path Getters):

| الدالة | المثال | الإرجاع |
|-------|--------|--------|
| `getScriptPath(filename)` | `getScriptPath('case.js')` | `/edd_system/js/case.js` |
| `getStylePath(filename)` | `getStylePath('main.css')` | `/edd_system/css/main.css` |
| `getAssetPath(filename)` | `getAssetPath('img.jpg')` | `/edd_system/assets/img.jpg` |
| `getPageUrl(name)` | `getPageUrl('dashboard')` | `/edd_system/dashboard.html` |
| `getApiUrl(endpoint)` | `getApiUrl('cases')` | `/api/v1/cases` |
| `getAbsoluteUrl(path)` | `getAbsoluteUrl('/api/v1/cases')` | `http://localhost:8585/api/v1/cases` |

### 🌐 طلبات API الآمنة (Safe API Calls):

```javascript
// GET
const cases = await pathManager.get('cases');

// POST
const newCase = await pathManager.post('cases/create', {
  customerId: 'CUST001',
  customerName: 'Ahmed Al-Thani'
});

// PUT
await pathManager.put('cases/12345', {
  status: 'COMPLETED'
});

// DELETE
await pathManager.delete('cases/12345');
```

**المميزات:**
- ✅ إضافة رأس Authorization تلقائياً (Bearer Token)
- ✅ معالجة الأخطاء التلقائية
- ✅ تحويل JSON تلقائي
- ✅ التحقق من الحالة التلقائي

### 🔐 مدير التحقق (Authentication Manager):

```javascript
// الحصول على التوكن
const token = pathManager.getAuthToken();

// حفظ التوكن بعد تسجيل الدخول
pathManager.setAuthToken(response.token);

// حذف التوكن (تسجيل الخروج)
pathManager.clearAuthToken();

// التحقق من التحقق وإعادة التوجيه
if (!pathManager.redirectIfNotAuthenticated()) {
  return; // المستخدم غير مصرح
}
```

### 🧭 التنقل (Navigation):

```javascript
// الذهاب إلى صفحة باسم محدد مسبقاً
pathManager.navigate('dashboard');
pathManager.navigate('kycForm', { customerId: '123' });

// الذهاب إلى أي URL
pathManager.navigateTo('/edd_system/custom_page.html');

// إعادة التوجيه للدخول إذا لم يكن مسجلاً
pathManager.redirectIfNotAuthenticated();
```

### 📚 تحميل الموارد الديناميكي (Dynamic Resource Loading):

```javascript
// تحميل سكريبت
await pathManager.loadScript('case_manager.js');

// تحميل ورقة أنماط
pathManager.loadStylesheet('custom.css');
```

---

## أمثلة عملية (Real-World Examples)

### مثال 1: تحميل الحالات والعرض

**قبل (المشكلة):**
```javascript
// ❌ لا يعمل في جميع الحالات
fetch('/edd_system/api/cases')
  .then(r => r.json())
  .then(data => {
    displayCases(data);
  })
  .catch(err => console.error('فشل التحميل:', err));
```

**بعد (الحل):**
```javascript
// ✅ آمن وموثوق
(async function() {
  try {
    const cases = await pathManager.get('cases');
    displayCases(cases);
  } catch (error) {
    console.error('فشل التحميل:', error);
    showErrorNotification('فشل تحميل الحالات');
  }
})();
```

### مثال 2: إنشاء حالة جديدة

**قبل:**
```javascript
// ❌ مسار مطلق، لا يوجد معالجة خطأ
fetch('/edd_system/api/cases', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(caseData)
});
```

**بعد:**
```javascript
// ✅ مع معالجة خطأ وتحقق آلي
try {
  const newCase = await pathManager.post('cases', caseData);
  console.log('تم إنشاء الحالة:', newCase.id);
  window.eddDataModel.addCase(newCase);
} catch (error) {
  showErrorNotification('فشل إنشاء الحالة: ' + error.message);
}
```

### مثال 3: تسجيل الدخول وحفظ التوكن

```javascript
async function login(username, password) {
  try {
    const response = await pathManager.post('auth/login', {
      username,
      password
    });

    // حفظ التوكن
    pathManager.setAuthToken(response.token);

    // الذهاب للدashboard
    pathManager.navigate('dashboard');
  } catch (error) {
    showErrorNotification('فشل تسجيل الدخول');
  }
}
```

### مثال 4: حماية الصفحات (Authentication Guard)

```javascript
// في أول بيان في الصفحة
document.addEventListener('DOMContentLoaded', () => {
  if (!pathManager.redirectIfNotAuthenticated()) {
    return; // المستخدم سيتم إعادة توجيهه للدخول
  }

  // تحميل بيانات المستخدم
  loadUserData();
});
```

---

## ملف الإعدادات (.env)

يمكنك تعديل السلوك عبر متغيرات البيئة:

```env
# .env.example
NODE_ENV=development
API_BASE_URL=http://localhost:8585
API_TIMEOUT=5000
AUTH_TOKEN_STORAGE=localStorage
```

**استخدام في pathManager:**
```javascript
// pathManager سيكتشف هذه تلقائياً من window.location
// لكن يمكن تجاوزها يدوياً:
pathManager.baseURL = 'https://api.example.com';
```

---

## الترجيع والتوقع (Troubleshooting)

### المشكلة: "404 Not Found" عند التحميل

**السبب:** المسار غير صحيح

**الحل:**
```javascript
// تشخيص المشكلة
pathManager.printDebugInfo();
pathManager.testPaths();

// تحقق من:
// 1. اسم الملف صحيح؟
// 2. الملف موجود فعلاً؟
// 3. المسار نسبي صحيح؟
```

### المشكلة: خطأ "401 Unauthorized"

**السبب:** عدم وجود توكن أو انتهاء صلاحيته

**الحل:**
```javascript
if (!pathManager.getAuthToken()) {
  pathManager.navigate('login');
}
```

### المشكلة: CORS Error

**السبب:** طلب لـ API خارج النطاق

**الحل:**
```javascript
// تأكد من أن API على نفس الدومين أو لديه CORS headers
// في server.js تأكد من:
app.use(cors());
```

---

## أفضل الممارسات (Best Practices)

### ✅ افعل:

```javascript
// 1. استخدم pathManager لجميع المسارات
const url = pathManager.getApiUrl('cases');

// 2. استخدم الدوال المساعدة بدلاً من fetch مباشرة
const data = await pathManager.get('cases');

// 3. تحقق من التحقق قبل الوصول للبيانات الحساسة
pathManager.redirectIfNotAuthenticated();

// 4. استخدم try-catch مع الطلبات
try {
  const data = await pathManager.get('endpoint');
} catch (error) {
  console.error('API Error:', error);
}
```

### ❌ لا تفعل:

```javascript
// ❌ مسارات مطلقة
fetch('/edd_system/api/cases');

// ❌ hardcoded URLs
const url = 'http://localhost:8585/api/cases';

// ❌ عدم التحقق من التحقق
// (استخدم redirectIfNotAuthenticated بدلاً من ذلك)

// ❌ تجاهل الأخطاء
fetch(url).then(r => r.json()); // ❌ لا معالجة خطأ
```

---

## الخريطة الكاملة للمسارات (Complete Path Map)

```
الدومين: http://localhost:8585
├── /edd_system/                   [eddSystemRoot]
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── kyc_form.html
│   ├── cdd_view.html
│   ├── business_view.html
│   ├── admin_dashboard.html
│   ├── /js/                       [jsRoot]
│   │   ├── path_manager.js        ← Start here
│   │   ├── edd_data_model.js      ← Global data model
│   │   ├── case_manager.js
│   │   ├── kyc_form_enhancer.js
│   │   └── ...
│   ├── /css/
│   │   ├── main.css
│   │   ├── dashboard.css
│   │   └── ...
│   └── /assets/
│       └── employees/
│
└── /api/v1/                       [apiRoot]
    ├── /auth
    │   ├── /login
    │   └── /logout
    ├── /cases
    │   ├── GET     (list all)
    │   ├── POST    (create)
    │   ├── /:id    (get one)
    │   └── /:id PUT/DELETE
    ├── /kyc
    ├── /stats
    ├── /notifications
    ├── /audit
    └── /health
```

---

## اختبار النظام (System Testing)

### تشغيل الاختبارات:

```bash
# في كونسول المتصفح:
pathManager.testPaths();     # اختبار جميع المسارات
pathManager.printDebugInfo(); # طباعة معلومات التصحيح
```

### نتيجة الاختبار المتوقعة:
```
Script (case_manager.js): /edd_system/js/case_manager.js
CSS: /edd_system/css/edd_system.css
API (cases): /api/v1/cases
API (absolute): http://localhost:8585/api/v1/cases
Page (dashboard): /edd_system/dashboard.html
Asset: /edd_system/assets/employees/user.jpg
```

---

## خطة الترحيل (Migration Plan)

### الخطوة 1: إضافة path_manager.js
✅ تم - الملف موجود الآن

### الخطوة 2: تحديث جميع الصفحات
قائمة الملفات التي تحتاج التحديث:
- [ ] dashboard.html
- [ ] cdd_view.html
- [ ] business_view.html
- [ ] edd_case.html
- [ ] admin_dashboard.html
- [ ] management_dashboard.html
- [ ] all other HTML files

### الخطوة 3: تحديث جميع الـ JavaScript files
- [ ] case_manager.js
- [ ] edd_data_model.js (update script loads)
- [ ] enterprise_features.js
- [ ] export_reports.js
- [ ] decision_support.js

### الخطوة 4: الاختبار الشامل
- [ ] اختبر في localhost
- [ ] اختبر في subdirectory
- [ ] اختبر API calls جميعها

---

## الملاحظات الختامية

هذا النظام يحل **مشكلة المسارات المطلقة** و يجعل التطبيق:
- ✅ **محمول** - يعمل في أي مسار
- ✅ **آمن** - معالجة خطأ تلقائية + auth
- ✅ **موثوق** - يكتشف البيئة تلقائياً
- ✅ **قابل للصيانة** - مكان واحد للتحديثات

**الخطوة التالية:** تحديث جميع الصفحات لاستخدام `pathManager` بدلاً من المسارات المطلقة.
