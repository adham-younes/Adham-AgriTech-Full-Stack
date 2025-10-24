# 🚀 البدء السريع - Adham AgriTech

> *دليل سريع لتشغيل منصة الزراعة الذكية في 5 دقائق*

## ⚡ التشغيل السريع

### 1. تثبيت التبعيات
```bash
pnpm install
# أو
npm install
```

### 2. إعداد متغيرات البيئة
```bash
# نسخ ملف البيئة
cp .env.example .env.local

# تحرير الملف
nano .env.local
```

### 3. تشغيل الخادم
```bash
pnpm run dev
# أو
npm run dev
```

### 4. فتح المتصفح
```
http://localhost:3003
```

## 🔑 المفاتيح المطلوبة

### ✅ يعمل حالياً
- **Supabase** - قاعدة البيانات ✅
- **Infura** - البلوكشين ✅

### ❌ مطلوب فوراً
- **OpenWeather** - بيانات الطقس
- **OpenAI** - المساعد الذكي

### 🔗 روابط الحصول على المفاتيح

| الخدمة | الرابط | الوقت المطلوب |
|--------|--------|----------------|
| OpenWeather | [openweathermap.org/api](https://openweathermap.org/api) | 5 دقائق |
| OpenAI | [platform.openai.com/api-keys](https://platform.openai.com/api-keys) | 10 دقائق |

## 🧪 اختبار APIs

```bash
# اختبار جميع APIs
node scripts/test-apis.js

# أو تشغيل سكريبت التفعيل
./scripts/activate-services.sh
```

## 📱 الصفحات المتاحة

- **الصفحة الرئيسية:** `/`
- **تسجيل الدخول:** `/auth/login`
- **إنشاء حساب:** `/auth/signup`
- **لوحة التحكم:** `/dashboard`
- **الطقس:** `/dashboard/weather` (يحتاج OpenWeather)
- **المساعد الذكي:** `/dashboard/ai-assistant` (يحتاج OpenAI)
- **التقارير:** `/dashboard/reports`
- **المزارع:** `/dashboard/farms`
- **الحقول:** `/dashboard/fields`

## 🛠️ استكشاف الأخطاء

### مشكلة: "API key not configured"
**الحل:** أضف المفتاح المطلوب إلى `.env.local`

### مشكلة: "Failed to fetch data"
**الحل:** تحقق من اتصال الإنترنت والمفاتيح

### مشكلة: "Database connection failed"
**الحل:** تحقق من Supabase URL و Anon Key

## 📞 الدعم

- **البريد:** adhamlouxor@gmail.com
- **النطاق:** [adham-agritech.com](https://adham-agritech.com)
- **الدليل الكامل:** [API_KEYS_GUIDE.md](./API_KEYS_GUIDE.md)

---

**🎉 استمتع بمنصة الزراعة الذكية!**