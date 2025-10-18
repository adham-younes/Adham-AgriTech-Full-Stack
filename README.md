# 🌾 Adham AgriTech - منصة الزراعة الذكية

<div dir="rtl">

## 🚀 نظرة عامة

**Adham AgriTech** هي منصة زراعية ذكية متكاملة تستخدم أحدث التقنيات لمساعدة المزارعين المصريين في:
- 📊 إدارة المزارع والحقول بكفاءة
- 🛰️ مراقبة المحاصيل بالأقمار الصناعية
- 🧪 تحليل التربة وتقديم توصيات مخصصة
- 💧 إدارة أنظمة الري الذكي
- 🤖 الحصول على استشارات زراعية فورية
- 🛒 بيع وشراء المنتجات الزراعية
- 👥 التواصل مع مجتمع المزارعين

</div>

## 🛠️ المتطلبات التقنية

- Node.js 18+ 
- pnpm 8+
- PostgreSQL 14+ (يتم توفيره عبر Supabase)
- حساب على [Supabase](https://supabase.com)
- حساب على [OpenWeatherMap](https://openweathermap.org/api)
- حساب على [Groq](https://groq.com) للذكاء الاصطناعي

## 📦 التثبيت

### 1. استنساخ المستودع

```bash
git clone https://github.com/yourusername/adham-agritech.git
cd adham-agritech
```

### 2. تثبيت الحزم

```bash
pnpm install
```

### 3. إعداد Supabase

1. أنشئ مشروع جديد على [Supabase](https://supabase.com)
2. انتقل إلى SQL Editor في لوحة تحكم Supabase
3. قم بتنفيذ جميع ملفات SQL في مجلد `scripts/` بالترتيب:

```bash
# نفذ الملفات بهذا الترتيب:
000_create_functions.sql
001_create_profiles_and_users.sql
002_create_farms.sql
003_create_fields.sql
004_create_soil_analysis.sql
005_create_crop_monitoring.sql
006_create_weather_data.sql
007_create_irrigation_systems.sql
008_create_notifications.sql
009_create_ai_chat.sql
010_create_reports.sql
011_create_marketplace.sql
012_create_forum.sql
```

### 4. إعداد متغيرات البيئة

1. انسخ ملف `.env.example` إلى `.env.local`:

```bash
cp .env.example .env.local
```

2. املأ المتغيرات المطلوبة:

```env
# من إعدادات مشروع Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...

# من OpenWeatherMap
OPENWEATHER_API_KEY=your_api_key_here

# من Groq
GROQ_API_KEY=gsk_...

# اختياري: لخرائط Mapbox
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk_...
```

### 5. تشغيل التطبيق

```bash
# وضع التطوير
pnpm dev

# بناء للإنتاج
pnpm build
pnpm start
```

التطبيق سيعمل على: [http://localhost:3000](http://localhost:3000)

## 🔑 الحصول على مفاتيح API

### Supabase
1. سجل في [supabase.com](https://supabase.com)
2. أنشئ مشروع جديد
3. اذهب إلى Settings > API
4. انسخ `URL` و `anon public key` و `service_role key`

### OpenWeatherMap
1. سجل في [openweathermap.org](https://openweathermap.org/api)
2. اذهب إلى My API Keys
3. أنشئ مفتاح جديد أو استخدم المفتاح الافتراضي

### Groq
1. سجل في [console.groq.com](https://console.groq.com)
2. اذهب إلى API Keys
3. أنشئ مفتاح جديد

### Mapbox (اختياري)
1. سجل في [mapbox.com](https://mapbox.com)
2. اذهب إلى Account > Tokens
3. انسخ Default public token

## 📱 الميزات الرئيسية

<div dir="rtl">

### 🏡 إدارة المزارع
- إضافة وتعديل بيانات المزارع
- تحديد الموقع الجغرافي
- إدارة معلومات الحقول

### 🌱 مراقبة المحاصيل
- تتبع مؤشرات NDVI و EVI
- تقييم صحة المحاصيل
- تنبيهات مبكرة للمشاكل

### 🧪 تحليل التربة
- تسجيل نتائج التحليلات
- توصيات ذكية للأسمدة
- تتبع التحسينات عبر الزمن

### 💬 المساعد الذكي
- إجابات فورية بالعربية
- نصائح مخصصة
- حفظ سجل المحادثات

### ☁️ بيانات الطقس
- توقعات 7 أيام
- بيانات محلية دقيقة
- تنبيهات الطقس السيئ

### 🛒 السوق الزراعي
- عرض المنتجات للبيع
- البحث والتصفية
- التواصل المباشر

### 👥 منتدى المجتمع
- طرح الأسئلة
- مشاركة الخبرات
- التعلم من الآخرين

</div>

## 🏗️ البنية التقنية

```
التطبيق مبني باستخدام:
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase (PostgreSQL + Auth)
- Radix UI + shadcn/ui
```

## 🤝 المساهمة

نرحب بالمساهمات! يرجى:
1. Fork المشروع
2. إنشاء فرع للميزة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'إضافة ميزة رائعة'`)
4. Push إلى الفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📄 الرخصة

هذا المشروع مرخص تحت رخصة MIT - انظر ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 الدعم والتواصل

- 📧 البريد الإلكتروني: support@adham-agritech.com
- 💬 الدردشة المباشرة: متاحة داخل التطبيق
- 📱 واتساب: +20 XXX XXX XXXX

## 🚀 خارطة الطريق

- [ ] تطبيق موبايل (React Native)
- [ ] تكامل حقيقي مع Google Earth Engine
- [ ] نظام دفع إلكتروني
- [ ] تحليلات متقدمة بالذكاء الاصطناعي
- [ ] تكامل blockchain للعقود الذكية

---

<div align="center">
صُنع بـ ❤️ لمزارعي مصر 🇪🇬
</div>