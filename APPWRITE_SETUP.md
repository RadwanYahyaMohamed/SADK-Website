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

وفعّل **Row security** (ON) في نفس صفحة Settings.

> عند التسجيل، الكود يحفظ صفًا لكل عضو. صورة البروفايل تُرفع لاحقًا من صفحة **My Account**.

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
| `js/auth-config.js` | IDs قاعدة البيانات |
| `js/auth-service.js` | تسجيل / دخول / حفظ في DB |
| `pages/login.html` | صفحة الدخول |
| `pages/signup.html` | صفحة إنشاء حساب |
| `pages/account.html` | الملف الشخصي |

إذا غيّرت Database ID أو Collection ID في Console، عدّل `js/auth-config.js` ليطابقهم.

---

## أخطاء شائعة

| المشكلة | الحل |
|---------|------|
| `Invalid Origin` | أضف `localhost` في Auth Platforms |
| `Collection not found` | تأكد IDs: `sadk_members` و `profiles` |
| `Unauthorized` على DB | راجع صلاحيات Table (Users → Create/Read/Update) + Row security |
| رفع الصورة فشل | تأكد bucket `avatars` + عمود `avatarFileId` + صلاحيات Storage |
| التسجيل لا يعمل على النطاق الحقيقي | أضف النطاق في Platforms |

---

## بدائل للاستضافة

يمكنك أيضًا نشر `dist/` على:

- **Netlify** / **Vercel** / **GitHub Pages**

لكن يبقى **Appwrite** للـ Auth والـ Database فقط — وتضيف نطاق الاستضافة في **Platforms**.
