# 🔗 كيف تحصل على رابط التطبيق
## How to Get Your Web App Link

---

## 🚨 مهم جداً!

**أنا لا أستطيع إعطاءك رابط مباشرة** لأن:
- التطبيق يعمل على بيئة Cursor البعيدة
- يحتاج Port Forwarding من Cursor
- أو يحتاج Deploy على Vercel

---

## ✅ الخيار 1: Cursor Port Forwarding (الآن - 2 دقيقة)

### في Cursor Desktop:

```
1. ابحث عن "PORTS" panel في أسفل Cursor
2. ستجد: Port 3000
3. انقر على أيقونة Globe 🌐
4. سيفتح في المتصفح
5. انسخ الرابط (مثل: https://xxxxx-3000.app.github.dev)
```

### على موبايلك:

```
1. افتح نفس الرابط في متصفح الموبايل
2. Chrome → ⋮ → Add to Home Screen
3. ✅ لديك "تطبيق" الآن!
```

---

## ✅ الخيار 2: Deploy على Vercel (10 دقائق - رابط دائم)

### الخطوات:

```
1. اذهب: https://vercel.com
2. Sign up with GitHub
3. Import هذا المشروع
4. Add Environment Variables:
   
   NEXT_PUBLIC_SUPABASE_URL=https://fqiyunkcubguuwzdkmoc.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZxaXl1bmtjdWJndXV3emRrbW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4MTQ1NTksImV4cCI6MjA3NTM5MDU1OX0.N_2Rz4oNTXL_eKhzJhbNki1m46zZV_8YroggOG_yXfI
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiYWRoYW15b3VuZXMiLCJhIjoiY21nZ3NxeThmMDB5djJqc2R5NmFkaGlpdyJ9.i5syGJ-2PtK49U6DmB5Eww
   PLANET_API_KEY=PLAK1efdf8c62a944f1d8d15fc6d78d87014
   GENERIC_API_IDENTIFIER=2fcea48b-e470-423d-ba99-ecd658a48774

5. Deploy
6. ✅ رابط دائم: https://your-app.vercel.app
```

---

## 📊 حالة المشروع:

```
✅ الخادم يعمل (Port 3000)
✅ جميع المفاتيح مفعّلة
✅ التطبيق جاهز
⏸️ يحتاج قاعدة بيانات (SQL script)
⏸️ يحتاج رابط عام (Vercel أو Port Forwarding)
```

---

## 🗄️ قبل أن تبدأ - قاعدة البيانات!

```
1. https://supabase.com/dashboard
2. Project: fqiyunkcubguuwzdkmoc
3. SQL Editor
4. Run: scripts/000_SETUP_ALL_AT_ONCE.sql
5. ✅ 12 جدول جاهز
```

---

## 📱 بعد الحصول على الرابط:

### على Android:
```
Chrome → ⋮ → Add to Home Screen
```

### على iPhone:
```
Safari → Share → Add to Home Screen
```

---

**🌾 بالتوفيق! 🚜**
