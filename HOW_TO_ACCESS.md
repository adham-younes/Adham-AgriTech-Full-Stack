# كيفية الوصول إلى التطبيق
## How to Access the Application

**⚠️ أنت في بيئة Cursor البعيدة (Remote Environment)**

---

## 🚨 المشكلة / The Problem

```
❌ http://localhost:3000 لن يعمل!
❌ localhost:3000 won't work!

السبب: أنت تعمل في بيئة سحابية بعيدة (Cursor remote)
The application is running on a remote server, not your local machine
```

---

## ✅ الحلول المتاحة / Available Solutions

### الحل 1: Port Forwarding في Cursor (الأسهل) ⭐

**في Cursor:**

1. **افتح لوحة Ports:**
   - اضغط `Ctrl+Shift+P` (أو `Cmd+Shift+P` على Mac)
   - اكتب: `Ports: Focus on Ports View`
   - أو اذهب إلى: View → Ports

2. **أضف Port 3000:**
   - في لوحة Ports، ابحث عن port 3000
   - إذا لم يظهر، اضغط "Forward a Port"
   - أدخل: `3000`
   - اضغط Enter

3. **احصل على الرابط:**
   - سترى رابط مثل:
   ```
   https://[random-id].cursor.sh:3000
   أو
   http://localhost:3000 (forwarded)
   ```

4. **افتح الرابط في المتصفح**
   - انقر على أيقونة Globe 🌐 بجانب Port 3000
   - أو انسخ الرابط وافتحه في المتصفح

---

### الحل 2: تشغيل محلي (Local Setup) 🏠

إذا كنت تريد تشغيل المشروع على جهازك المحلي:

#### الخطوات:

1. **Clone المشروع:**
```bash
git clone <repository-url>
cd <project-directory>
```

2. **انسخ ملف .env.local:**
```bash
# من البيئة البعيدة، انسخ محتوى:
cat /workspace/.env.local

# ثم أنشئ نفس الملف على جهازك المحلي
```

3. **ثبّت Dependencies:**
```bash
pnpm install
# أو
npm install
```

4. **شغّل المشروع:**
```bash
pnpm dev
# أو
npm run dev
```

5. **افتح المتصفح:**
```
http://localhost:3000
```

**الآن سيعمل! ✅**

---

### الحل 3: Deploy إلى Vercel (للإنتاج) 🚀

لنشر التطبيق على الإنترنت:

#### الخطوات:

1. **اذهب إلى:**
   https://vercel.com

2. **اربط مع Git Repository**

3. **Environment Variables:**
   أضف جميع المفاتيح من `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=...
   PLANET_API_KEY=...
   GENERIC_API_IDENTIFIER=...
   OPENWEATHER_API_KEY=...
   OPENAI_API_KEY=...
   ```

4. **Deploy**

5. **احصل على رابط عام:**
   ```
   https://your-app.vercel.app
   ```

---

## 🧪 كيف تتحقق أن الخادم يعمل / Verify Server is Running

### في Terminal (داخل Cursor):

```bash
# تحقق من أن الخادم يعمل
curl http://localhost:3000

# يجب أن ترى HTML output
```

### تحقق من الـ Process:

```bash
# ابحث عن Next.js process
ps aux | grep "next dev"

# يجب أن ترى process يعمل
```

---

## 📊 الحالة الحالية / Current Status

```
✅ الخادم يعمل في البيئة البعيدة
✅ Server is RUNNING on remote environment

Port: 3000
URL (remote): http://localhost:3000
Status: ✅ Active

⚠️ لكن لا يمكن الوصول له مباشرة من متصفحك
⚠️ But NOT accessible directly from your browser
```

---

## 🎯 التوصية / Recommendation

**أفضل حل حسب حالتك:**

### إذا كنت في Cursor Desktop:
```
✅ استخدم Port Forwarding (الحل 1)
   الوقت: 2 دقيقة
   الأسهل والأسرع
```

### إذا كنت تريد التطوير المحلي:
```
✅ Clone واعمل محلياً (الحل 2)
   الوقت: 10 دقائق
   أفضل لل development
```

### إذا كنت تريد مشاركة التطبيق:
```
✅ Deploy على Vercel (الحل 3)
   الوقت: 15 دقيقة
   يعطيك URL عام
```

---

## 📝 ملاحظات مهمة / Important Notes

### 1. Port Forwarding في Cursor
```
✅ سريع وسهل
✅ مثالي للاختبار
⚠️ الرابط خاص بك فقط
⚠️ يتغير عند إعادة التشغيل
```

### 2. التشغيل المحلي
```
✅ تحكم كامل
✅ أسرع في التطوير
✅ لا يحتاج اتصال بالإنترنت
⚠️ يحتاج setup على جهازك
```

### 3. Vercel Deployment
```
✅ URL عام ودائم
✅ Auto-deploy عند Push
✅ HTTPS مجاني
✅ يمكن مشاركته
⚠️ يحتاج Git repository
```

---

## 🔧 حل سريع الآن / Quick Fix Now

### الطريقة الأسرع (30 ثانية):

1. **في Cursor، اضغط:**
   ```
   Ctrl+` (لفتح Terminal)
   ```

2. **تأكد أن الخادم يعمل:**
   ```bash
   curl http://localhost:3000 | head -20
   ```

3. **افتح Ports Panel:**
   ```
   View → Ports
   أو
   Ctrl+Shift+P → "Ports: Focus"
   ```

4. **اضغط على Globe 🌐 بجانب port 3000**

5. **سيفتح في المتصفح! ✅**

---

## 🆘 إذا لم يعمل / If It Still Doesn't Work

### المشكلة: Port 3000 لا يظهر في Ports Panel

**الحل:**

1. **أوقف الخادم:**
```bash
# اضغط Ctrl+C في Terminal حيث يعمل pnpm dev
```

2. **أعد التشغيل:**
```bash
cd /workspace
pnpm dev
```

3. **انتظر حتى ترى:**
```
✓ Ready on http://localhost:3000
```

4. **الآن Port 3000 يجب أن يظهر في Ports Panel**

---

### المشكلة: Port Forwarding غير متاح في Cursor

**الحل البديل:**

1. **استخدم SSH Tunnel:**
```bash
# من جهازك المحلي
ssh -L 3000:localhost:3000 user@remote-server
```

2. **أو اعمل Deploy على Vercel مباشرة**

---

## 📞 معلومات إضافية / Additional Info

### الخادم الحالي / Current Server:
```
Framework: Next.js 15.2.4
Mode: Development
Port: 3000
Status: ✅ Running
Environment: Cursor Remote

URLs (remote internal):
- http://localhost:3000 (main)
- http://127.0.0.1:3000 (alternative)
```

### الصفحات المتاحة:
```
✅ / (Home)
✅ /auth/login (Login)
✅ /auth/signup (Signup)
🔒 /dashboard (Protected - needs auth)
```

---

## 🎓 تعلم المزيد / Learn More

### Port Forwarding:
- https://code.visualstudio.com/docs/remote/ssh#_forwarding-a-port-creating-ssh-tunnel

### Vercel Deployment:
- https://vercel.com/docs

### Next.js Deployment:
- https://nextjs.org/docs/deployment

---

## ✅ Checklist

بعد تطبيق الحل:

- [ ] الخادم يعمل
- [ ] Port forwarding مفعّل (أو deployed)
- [ ] يمكنك الوصول للصفحة الرئيسية
- [ ] تظهر الواجهة بالعربية
- [ ] Dark mode مفعّل
- [ ] يمكنك التنقل بين الصفحات

---

## 🎉 بمجرد أن يعمل / Once It Works

عندما تستطيع فتح التطبيق، ستجد:

```
✨ صفحة رئيسية جميلة
✨ واجهة بالعربية كاملة
✨ Dark mode
✨ 6 بطاقات للميزات
✨ أزرار للتسجيل والدخول
✨ تصميم احترافي
```

**استمتع بمشروعك! 🌾🚜**

---

**تم الإعداد بواسطة / Prepared By:** AI Code Assistant  
**التاريخ / Date:** 7 October 2025  

**End of Guide**
