# دليل التثبيت الشامل - Adham AgriTech

<div dir="rtl">

## 📋 المتطلبات الأساسية

### 1. البرامج المطلوبة

#### Node.js (الإصدار 18 أو أحدث)
- **Windows**: حمل من [nodejs.org](https://nodejs.org/)
- **Mac**: استخدم Homebrew: `brew install node`
- **Linux**: 
  ```bash
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt-get install -y nodejs
  ```

#### pnpm (مدير الحزم)
```bash
npm install -g pnpm
```

#### Git
- **Windows**: حمل من [git-scm.com](https://git-scm.com/)
- **Mac/Linux**: عادة مثبت مسبقاً

### 2. الحسابات المطلوبة

قبل البدء، تأكد من إنشاء حسابات في:
- [Supabase](https://supabase.com) - قاعدة البيانات والمصادقة
- [OpenWeatherMap](https://openweathermap.org) - بيانات الطقس
- [Groq](https://groq.com) - الذكاء الاصطناعي
- [Mapbox](https://mapbox.com) - الخرائط (اختياري)

## 🚀 خطوات التثبيت

### الخطوة 1: تحميل المشروع

```bash
# استنساخ المستودع
git clone https://github.com/yourusername/adham-agritech.git

# الدخول إلى مجلد المشروع
cd adham-agritech
```

### الخطوة 2: تثبيت الحزم

```bash
# تثبيت جميع الحزم المطلوبة
pnpm install
```

إذا واجهت أي أخطاء، جرب:
```bash
# مسح الكاش وإعادة التثبيت
pnpm store prune
pnpm install --force
```

### الخطوة 3: إعداد Supabase

#### أ. إنشاء مشروع Supabase

1. اذهب إلى [app.supabase.com](https://app.supabase.com)
2. اضغط على "New Project"
3. املأ البيانات:
   - **Name**: Adham AgriTech
   - **Database Password**: كلمة مرور قوية (احفظها!)
   - **Region**: اختر أقرب منطقة (Frankfurt لمصر)
   - **Pricing Plan**: Free للتجربة

#### ب. إعداد قاعدة البيانات

1. بعد إنشاء المشروع، اذهب إلى **SQL Editor**
2. افتح ملف جديد وانسخ محتوى كل ملف SQL بالترتيب:

```sql
-- ابدأ بملف 000_create_functions.sql
-- ثم 001_create_profiles_and_users.sql
-- وهكذا حتى 012_create_forum.sql
```

3. نفذ كل ملف بالضغط على "Run"

#### ج. الحصول على مفاتيح API

1. اذهب إلى **Settings > API**
2. انسخ:
   - **Project URL**: يبدأ بـ `https://`
   - **anon public**: يبدأ بـ `eyJ`
   - **service_role**: يبدأ بـ `eyJ` (احذر! هذا سري)

### الخطوة 4: إعداد متغيرات البيئة

1. انسخ ملف المثال:
```bash
cp .env.example .env.local
```

2. افتح `.env.local` في محرر النصوص وأضف:

```env
# Supabase - من الخطوة السابقة
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenWeatherMap
OPENWEATHER_API_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Groq AI
GROQ_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx

# اختياري - Mapbox للخرائط
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.xxxxxxxxxxxxxxxxxxxxxxxx
```

### الخطوة 5: تشغيل التطبيق

```bash
# تشغيل في وضع التطوير
pnpm dev
```

افتح المتصفح على: [http://localhost:3000](http://localhost:3000)

## 🔧 حل المشاكل الشائعة

### مشكلة: "Module not found"
```bash
# أعد تثبيت الحزم
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### مشكلة: "Database connection failed"
- تأكد من أن مفاتيح Supabase صحيحة
- تحقق من أن جداول قاعدة البيانات تم إنشاؤها

### مشكلة: "Weather API not working"
- تأكد من تفعيل حساب OpenWeatherMap
- انتظر 10 دقائق بعد إنشاء المفتاح

### مشكلة: "AI Assistant not responding"
- تحقق من رصيد حساب Groq
- تأكد من صحة مفتاح API

## 🎯 الخطوات التالية

### 1. إنشاء حساب مستخدم
1. اذهب إلى `/auth/signup`
2. سجل بـ:
   - البريد الإلكتروني
   - كلمة المرور
   - الاسم الكامل
   - نوع الحساب (مزارع/مهندس/مدير)

### 2. إضافة أول مزرعة
1. من لوحة التحكم، اضغط "المزارع"
2. اضغط "إضافة مزرعة جديدة"
3. أدخل البيانات المطلوبة

### 3. البدء في المراقبة
- أضف حقول لمزرعتك
- سجل تحليلات التربة
- ابدأ مراقبة المحاصيل

## 📱 التثبيت للإنتاج

### استخدام Vercel (مجاني)

1. ارفع الكود إلى GitHub
2. اذهب إلى [vercel.com](https://vercel.com)
3. اربط مستودع GitHub
4. أضف متغيرات البيئة
5. Deploy!

### استخدام خادم خاص

```bash
# بناء التطبيق
pnpm build

# تشغيل في الإنتاج
pnpm start
```

## 🆘 الحصول على المساعدة

- 📧 راسلنا: support@adham-agritech.com
- 💬 انضم لمجتمعنا على Discord
- 📖 اقرأ [الأسئلة الشائعة](FAQ_AR.md)

</div>