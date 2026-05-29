# إعداد Appwrite + النشر (Hosting)

اتبع الخطوات بالترتيب **قبل** تجربة التسجيل على الموقع.

---

## الجزء 1: إعداد Appwrite Console

افتح: https://cloud.appwrite.io → مشروع **STEM Asyut Deutsch Klub**

### 1) تفعيل تسجيل الدخول بالإيميل

1. من القائمة: **Auth** → **Settings**
2. فعّل **Email/Password** (أو Email + Password)
3. احفظ

### 2) إضافة منصات الويب (مهم جداً)

1. **Auth** → **Settings** → **Platforms** (أو **Add platform** → Web)
2. أضف كل عنوان تستخدمه:

| الاسم | Hostname |
|--------|----------|
| Local dev | `localhost` |
| Production | `your-domain.com` (بدون https://) |

> بدون هذه الخطوة، التسجيل والدخول **لن يعمل** من المتصفح.

### 3) إنشاء قاعدة البيانات

1. **Databases** → **Create database**
2. **Database ID:** `sadk_members` (نفس الاسم بالضبط)
3. **Name:** أي اسم (مثلاً SADK Members)

### 4) إنشاء Table للأعضاء (Collection)

داخل `sadk_members`:

1. **Create table** (+ Create table)
2. **Table ID:** `profiles` (نفس الاسم بالضبط)
3. **Name:** Member Profiles

### 5) إضافة الأعمدة (Columns / Attributes)

في table `profiles` → **Columns** → أضف:

| Key | Type | Size | Required |
|-----|------|------|----------|
| `userId` | String | 36 | ✅ |
| `name` | String | 128 | ✅ |
| `email` | String | 320 | ✅ |
| `grade` | String | 32 | ❌ |
| `avatarFileId` | String | 36 | ❌ |

### 6) صلاحيات Table

ادخل **profiles** → **Settings** → **Permissions**:

| Permission | Role |
|------------|------|
| Create | **Users** |
| Read | **Users** |
| Update | **Users** |
| Delete | **Users** |

وفعّل **Row security** (ON) في نفس صفحة Settings.

> عند التسجيل، الكود يحفظ صفًا لكل عضو مع صلاحيات على مستوى الصف (كل عضو يقرأ/يعدّل ملفه فقط). صورة البروفايل تُرفع لاحقًا من صفحة **My Account** بعد تأكيد الإيميل.

### 6ب) إعدادات الأمان في Auth (مهم للنسخة الجديدة)

1. **Auth** → **Settings**
2. فعّل **Email/Password**
3. فعّل **Email verification** (تأكيد البريد) إن وُجدت في مشروعك
4. اضبط **Session duration** (مثلاً 30 يوم) حسب ما تريد
5. **Auth** → **Email templates** (أو Messaging):
   - تأكد أن قوالب **Verification** و **Password recovery** مفعّلة
   - على Appwrite Cloud غالبًا الإيميلات جاهزة؛ إن أردت SMTP خاصًا: **Settings** → **SMTP**

### 6ج) منصات الويب — أضف كل هذه Hostnames

| الاسم | Hostname |
|--------|----------|
| Local | `localhost` |
| Production | `sadk.appwrite.network` |
| Custom domain | نطاقك إن وُجد (بدون `https://`) |

### 7) Storage لصور البروفايل

1. من القائمة: **Storage** → **Create bucket**
2. **Bucket ID:** `avatars` (بالضبط)
3. **Name:** Member Avatars
4. **Settings** → **Permissions**:
   - **Create** → **Users**
   - **Read** → **Users**
   - **Update** → **Users**
5. فعّل **File security** (Row/File security) إن وُجد

### 8) (اختياري) فهرس لـ userId

في **Indexes** → أضف index على `userId` (type: key).

---

## الجزء 2: تجربة محليًا

```bash
npm.cmd install
npm.cmd run dev
```

افتح:

- تسجيل: http://localhost:5173/pages/signup.html (أو 5174)
- دخول: http://localhost:5173/pages/login.html
- حسابي: http://localhost:5173/pages/account.html

في الـ navbar يظهر **Login** و **Sign Up** — وبعد الدخول يظهر اسمك.

---

## الجزء 3: النشر على Appwrite (Hosting + Domain)

Appwrite يوفر **Sites** لاستضافة مواقع ثابتة (مثل موقعكم).

### أ) بناء المشروع

```bash
npm.cmd run build
```

ينتج مجلد `dist/` جاهز للنشر.

### ب) رفع الموقع على Appwrite Sites

1. في Console: **Sites** → **Create site**
2. اختر **Connect GitHub** (يفضل) أو **Manual deploy**
3. إذا GitHub:
   - اربط repo المشروع
   - **Build command:** `npm install && npm run build`
   - **Output directory:** `dist`
   - **Install command:** `npm install`
4. إذا Manual: ارفع محتويات مجلد `dist` بعد البناء

### ج) إضافة Domain مخصص

1. في **Sites** → موقعك → **Domains**
2. **Add domain** → أدخل نطاقك (مثلاً `deutschklub.example.com`)
3. Appwrite يعطيك سجلات DNS (CNAME أو A) — أضفها عند مزود النطاق (GoDaddy, Namecheap, Cloudflare…)
4. انتظر حتى يصبح الحالة **Verified** + SSL تلقائي

### د) بعد النشر — لا تنسَ

في **Auth** → **Platforms** أضف hostname النطاق الحقيقي (بدون `https://`).

مثال: إذا الموقع `www.sadk-club.com` أضف `www.sadk-club.com`.

---

## ملفات المشروع المتعلقة بال Auth

| الملف | الوظيفة |
|-------|---------|
| `js/appwrite.js` | اتصال Appwrite |
| `js/auth-config.js` | IDs + إعدادات الأمان |
| `js/auth-service.js` | تسجيل / دخول / تحقق إيميل / استعادة كلمة المرور |
| `js/auth-validation.js` | قواعد كلمة المرور والإيميل |
| `js/auth-guard.js` | حماية الصفحات (يتطلب تسجيل دخول) |
| `js/auth-ui.js` | واجهة كلمة المرور (قوة + إظهار/إخفاء) |
| `pages/login.html` | تسجيل الدخول |
| `pages/signup.html` | إنشاء حساب |
| `pages/account.html` | الملف الشخصي (محمي) |
| `pages/verify-email.html` | تأكيد البريد |
| `pages/forgot-password.html` | طلب رابط استعادة |
| `pages/reset-password.html` | تعيين كلمة مرور جديدة |

إذا غيّرت Database ID أو Collection ID في Console، عدّل `js/auth-config.js` ليطابقهم.

---

## الجزء 4: نشر النسخة الجديدة على Appwrite Sites (خطوة بخطوة)

### الخطوة 1 — رفع الكود على GitHub

1. افتح المشروع محليًا في Cursor/VS Code
2. احفظ كل الملفات
3. من Terminal:

```bash
git add .
git commit -m "Enhance auth security: email verification, password recovery, stronger passwords"
git push origin main
```

> إذا الفرع الرئيسي اسمه `master` استبدل `main` بـ `master`.

### الخطوة 2 — إعداد Appwrite Console (قبل النشر)

1. https://cloud.appwrite.io → مشروع **STEM Asyut Deutsch Klub**
2. **Auth** → **Platforms** → تأكد من:
   - `localhost`
   - `sadk.appwrite.network`
3. **Auth** → **Settings** → فعّل Email/Password + Email verification
4. **Databases** → `sadk_members` → `profiles` → Permissions تتضمن **Delete** للـ Users
5. **Storage** → `avatars` → File security + صلاحيات Users

### الخطوة 3 — نشر تلقائي من GitHub

1. **Sites** → موقع **stem-asyut-deutsch-klub** (أو اسم موقعك)
2. تأكد من الإعدادات:
   - **Repository:** `RadwanYahyaMohamed/SADK-Website`
   - **Branch:** `main` (أو الفرع الذي تستخدمه)
   - **Install command:** `npm install`
   - **Build command:** `npm install && npm run build`
   - **Output directory:** `dist`
3. بعد `git push`، انتظر **Deploy** حتى تصبح الحالة **Ready** / **Success**
4. افتح: https://sadk.appwrite.network

### الخطوة 4 — اختبار بعد النشر

| الاختبار | الرابط |
|----------|--------|
| تسجيل حساب جديد | `/pages/signup.html` |
| تأكيد الإيميل | افتح الرابط من صندوق الوارد |
| تسجيل الدخول | `/pages/login.html` |
| نسيت كلمة المرور | `/pages/forgot-password.html` |
| الحساب | `/pages/account.html` |

### الخطوة 5 — إن لم يُنشر تلقائيًا

1. **Sites** → موقعك → **Deployments**
2. اضغط **Redeploy** أو **Create deployment**
3. راجع **Build logs** إن فشل البناء

---

## ما الذي تغيّر في الأمان؟

| الميزة | الوصف |
|--------|--------|
| كلمة مرور قوية | 8+ أحرف، حرف كبير وصغير، رقم، رمز |
| تأكيد الإيميل | رابط تحقق بعد التسجيل |
| استعادة كلمة المرور | forgot + reset |
| حماية الصفحات | `account.html` للمسجّلين فقط |
| صلاحيات الصفوف | كل عضو يصل لملفه فقط في DB و Storage |
| محاولات دخول | قفل مؤقت بعد 5 محاولات فاشلة (15 دقيقة) |
| شروط العضوية | checkbox عند التسجيل |

---

## أخطاء شائعة

| المشكلة | الحل |
|---------|------|
| `Invalid Origin` | أضف `localhost` في Auth Platforms |
| `Collection not found` | تأكد IDs: `sadk_members` و `profiles` |
| `Unauthorized` على DB | راجع صلاحيات Table (Users → Create/Read/Update) + Row security |
| رفع الصورة فشل | تأكد bucket `avatars` + عمود `avatarFileId` + صلاحيات Storage |
| التسجيل لا يعمل على النطاق الحقيقي | أضف النطاق في Platforms |
| لا يصل إيميل التحقق | راجع Email templates + Spam + فعّل verification في Auth |
| رابط التحقق لا يعمل | أضف `sadk.appwrite.network` في Platforms |
| لا أستطيع تعديل الحساب | أكّد الإيميل أولاً من الرابط المرسل |

---

## بدائل للاستضافة

يمكنك أيضًا نشر `dist/` على:

- **Netlify** / **Vercel** / **GitHub Pages**

لكن يبقى **Appwrite** للـ Auth والـ Database فقط — وتضيف نطاق الاستضافة في **Platforms**.
