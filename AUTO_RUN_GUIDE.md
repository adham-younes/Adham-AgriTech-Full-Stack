# دليل التشغيل التلقائي - Cursor Web Version
## Auto-Run Guide for Cursor Web

**📅 التاريخ:** 7 أكتوبر 2025  
**🌐 البيئة:** Cursor Web Version

---

## 🎯 الهدف / Goal

تشغيل التطبيق بشكل مؤتمت بالكامل والوصول لصفحة Demo مع خريطة الأقمار الصناعية **بدون الحاجة لتسجيل دخول**.

---

## ✅ الحالة الحالية / Current Status

```
✅ الخادم يعمل
✅ Port: 3000
✅ صفحة Demo جاهزة
✅ خريطة Mapbox تفاعلية
✅ Mapbox Token مفعّل
✅ Planet API Key مفعّل
✅ لا تحتاج تسجيل دخول
```

---

## 🚀 التشغيل التلقائي / Auto-Run

### الخادم يعمل بالفعل! ✅

```bash
# تحقق من حالة الخادم
curl http://localhost:3000 > /dev/null && echo "✅ Server running"
```

**النتيجة المتوقعة:** ✅ Server running

---

## 🌐 الوصول إلى التطبيق / Access the App

### في Cursor Web Version:

#### الخطوة 1: Port Forwarding (آلي)

Cursor Web يقوم بـ Port Forwarding تلقائياً!

**ابحث عن:**
```
1. في أسفل Cursor، ابحث عن "PORTS" panel
2. أو اضغط: Ctrl+Shift+P → "Ports: Focus on Ports View"
3. يجب أن ترى: Port 3000
```

#### الخطوة 2: احصل على الرابط

```
🌐 في Ports Panel:
   - ابحث عن Port 3000
   - انقر Globe icon 🌐 أو "Open in Browser"
   
أو:
   - انسخ الرابط المُعرَض
   - مثل: https://[random-id]-3000.app.github.dev
```

#### الخطوة 3: افتح في المتصفح

```
🔗 الرابط سيكون مثل:
   https://xxxxx-3000.app.github.dev/

✅ سيفتح صفحة Adham AgriTech الرئيسية
```

---

## 🗺️ صفحة Demo - خريطة الأقمار الصناعية

### الوصول المباشر (بدون تسجيل دخول):

```
🌐 أضف /demo للرابط:
   https://your-url:3000/demo

مثال:
   https://xxxxx-3000.app.github.dev/demo
```

### ما ستراه:

```
✅ خريطة Mapbox تفاعلية
✅ موقع: القاهرة، مصر
✅ 3 مزارع تجريبية مع Markers
✅ Toggle: Satellite / Terrain
✅ 4 بطاقات إحصائيات
✅ 3 بطاقات ميزات
✅ تصميم احترافي بالعربية
```

---

## 📊 الصفحات المتاحة / Available Pages

### بدون تسجيل دخول:

#### 1. الصفحة الرئيسية
```
🔗 /
✨ Hero section
✨ Feature cards (6)
✨ Call to action
```

#### 2. صفحة Demo (جديدة!) ⭐
```
🔗 /demo
🗺️ خريطة تفاعلية
🛰️ صور أقمار صناعية
📊 بيانات تجريبية
✨ لا تحتاج تسجيل دخول
```

#### 3. تسجيل الدخول
```
🔗 /auth/login
📝 نموذج تسجيل الدخول
```

#### 4. إنشاء حساب
```
🔗 /auth/signup
📝 نموذج التسجيل
```

---

### مع تسجيل دخول (يحتاج DB setup):

```
🔒 /dashboard
🔒 /dashboard/farms
🔒 /dashboard/fields
🔒 /dashboard/crop-monitoring
🔒 /dashboard/soil-analysis
🔒 /dashboard/weather
🔒 /dashboard/irrigation
🔒 /dashboard/ai-assistant
🔒 /dashboard/reports
```

---

## 🎮 كيفية الاستخدام / How to Use

### في صفحة /demo:

#### 1. الخريطة التفاعلية
```
🖱️ اسحب: تحريك الخريطة
🖱️ Scroll: Zoom in/out
🖱️ اضغط Marker: Popup معلومات
🎛️ أزرار التحكم: في الأعلى اليمين
```

#### 2. تبديل العرض
```
🛰️ زر "أقمار صناعية": عرض satellite
🗺️ زر "تضاريس": عرض terrain
```

#### 3. الإحصائيات
```
📊 4 بطاقات في الأعلى:
   - مزارع نشطة: 3
   - حقول زراعية: 8
   - كفاءة الري: 92%
   - نمو الإنتاجية: +15%
```

#### 4. الميزات
```
✨ 3 بطاقات توضح:
   - صور عالية الدقة من Planet Labs
   - مؤشرات NDVI لصحة المحاصيل
   - تتبع GPS دقيق
```

---

## 🔧 التحكم في الخادم / Server Control

### حالياً الخادم يعمل في الخلفية

#### إيقاف الخادم:
```bash
# ابحث عن process
ps aux | grep "next dev"

# أوقفه
pkill -f "next dev"
```

#### إعادة تشغيل الخادم:
```bash
cd /workspace
pnpm dev
```

#### التحقق من الحالة:
```bash
curl http://localhost:3000 && echo "✅ Running"
```

---

## 🛰️ تفاصيل خريطة الأقمار الصناعية / Satellite Map Details

### التقنيات المستخدمة:

#### 1. Mapbox GL JS v3.0.0
```javascript
- خرائط تفاعلية عالية الأداء
- WebGL rendering
- 3D support
- Vector tiles
```

#### 2. Mapbox Styles
```javascript
// Satellite View
style: 'mapbox://styles/mapbox/satellite-streets-v12'

// Terrain View
style: 'mapbox://styles/mapbox/outdoors-v12'
```

#### 3. Custom Markers
```javascript
// علامات المزارع الملونة
- 🟢 Excellent: #22c55e
- 🟡 Good: #84cc16
- 🟠 Fair: #eab308
```

#### 4. Interactive Popups
```javascript
// معلومات تظهر عند الضغط
- اسم المزرعة
- حالة الصحة
- بيانات إضافية
```

#### 5. 3D Buildings
```javascript
// في المدن (zoom 15+)
type: 'fill-extrusion'
paint: {
  'fill-extrusion-height': building height
  'fill-extrusion-opacity': 0.6
}
```

---

## 📱 التوافق / Compatibility

### ✅ المتصفحات المدعومة:
```
✅ Chrome/Edge (Chromium)
✅ Firefox
✅ Safari
✅ Mobile browsers
```

### ✅ الأجهزة:
```
✅ Desktop
✅ Laptop
✅ Tablet
✅ Mobile
```

### ✅ نظام التشغيل:
```
✅ Windows
✅ macOS
✅ Linux
✅ iOS
✅ Android
```

---

## 🎯 نقاط الوصول السريع / Quick Access Points

### للمستخدم النهائي:

```
1. الصفحة الرئيسية: /
   ↓
2. صفحة Demo: /demo
   ↓
3. شاهد الخريطة التفاعلية
   ↓
4. جرّب الميزات
   ↓
5. سجّل حساب: /auth/signup
   ↓
6. اذهب للـ Dashboard: /dashboard
```

---

## 🎨 الواجهة / UI/UX

### التصميم:
```
✅ Dark mode افتراضي
✅ عربي أولاً (RTL)
✅ Responsive
✅ Animations سلسة
✅ Icons من Lucide
✅ Colors متناسقة
✅ Typography احترافية
```

### المكونات:
```
✅ Cards
✅ Badges
✅ Buttons
✅ Headers
✅ Footers
✅ Stats
✅ Interactive map
```

---

## 📊 البيانات التجريبية / Demo Data

### المزارع:

#### 1. مزرعة النيل
```
📍 الإحداثيات: 31.2357, 30.0444
✅ الحالة: ممتاز (Excellent)
🟢 اللون: أخضر
```

#### 2. مزرعة الدلتا
```
📍 الإحداثيات: 31.2557, 30.0644
✅ الحالة: جيد (Good)
🟡 اللون: أصفر-أخضر
```

#### 3. مزرعة الخير
```
📍 الإحداثيات: 31.2157, 30.0344
✅ الحالة: متوسط (Fair)
🟠 اللون: أصفر
```

---

## 🔍 استكشاف الأخطاء / Troubleshooting

### المشكلة: لا أرى Port 3000 في Ports Panel

**الحل:**
```bash
1. تأكد أن الخادم يعمل:
   curl http://localhost:3000

2. إذا لم يعمل، أعد تشغيله:
   cd /workspace
   pnpm dev

3. انتظر حتى ترى:
   ✓ Ready on http://localhost:3000

4. أعد فحص Ports Panel
```

---

### المشكلة: الخريطة لا تظهر

**الأسباب المحتملة:**
```
❌ مشكلة في Mapbox token
❌ مشكلة في تحميل المكتبة
❌ JavaScript error
```

**الحل:**
```bash
1. افتح Console (F12)
2. ابحث عن errors
3. تحقق من:
   - Network tab
   - Console errors
   - Token validity

4. إذا فشل، أعد تحميل الصفحة
```

---

### المشكلة: الخريطة بطيئة

**الأسباب:**
```
⏳ اتصال إنترنت بطيء
⏳ تحميل tiles عالية الدقة
⏳ 3D rendering
```

**الحل:**
```
✅ انتظر قليلاً
✅ قلل zoom level
✅ غيّر إلى terrain view
✅ أغلق تطبيقات أخرى
```

---

## 🎓 نصائح للاستخدام / Usage Tips

### 1. للحصول على أفضل تجربة:
```
✅ استخدم Chrome/Edge
✅ اتصال إنترنت جيد
✅ شاشة كبيرة (إن أمكن)
✅ zoom in للتفاصيل
```

### 2. لاستكشاف الخريطة:
```
🔍 ابدأ بـ zoom out (overview)
🔍 ثم zoom in على مزرعة
🔍 اضغط على markers
🔍 جرّب الأنماط المختلفة
```

### 3. لتجربة الميزات:
```
📊 اقرأ الإحصائيات في الأعلى
🛰️ بدّل بين satellite و terrain
📍 اضغط على كل marker
🎨 لاحظ تناسق الألوان
```

---

## 📞 الدعم / Support

### إذا احتجت مساعدة:

```
📖 اقرأ: SATELLITE_MAP_INFO.md
📖 اقرأ: HOW_TO_ACCESS.md
📖 اقرأ: SETUP_GUIDE.md
📖 اقرأ: TESTING_REPORT.md
```

### للتقارير التفصيلية:

```
📄 REPOSITORY_INSPECTION_REPORT.md - تحليل الكود
📄 TESTING_REPORT.md - نتائج الاختبار
📄 FINAL_STATUS_REPORT.md - الحالة النهائية
📄 STATUS_SUMMARY.md - ملخص سريع
```

---

## ✅ Checklist

### قبل أن تبدأ:
- [x] الخادم يعمل
- [x] Port 3000 نشط
- [x] Mapbox token صحيح
- [x] صفحة Demo جاهزة

### عند التجربة:
- [ ] فتحت الرابط في المتصفح
- [ ] رأيت الصفحة الرئيسية
- [ ] ذهبت إلى /demo
- [ ] رأيت الخريطة التفاعلية
- [ ] جربت Zoom in/out
- [ ] ضغطت على markers
- [ ] بدّلت بين satellite و terrain
- [ ] قرأت الإحصائيات

---

## 🎉 الخلاصة / Summary

### التطبيق جاهز! ✅

```
✅ الخادم يعمل
✅ صفحة Demo متاحة
✅ خريطة تفاعلية كاملة
✅ Mapbox integration
✅ Planet API ready
✅ بيانات تجريبية
✅ بدون تسجيل دخول
✅ تصميم احترافي
✅ RTL + عربي
✅ Responsive
```

### للوصول:
```
1. Port Forwarding في Cursor
2. احصل على الرابط
3. أضف /demo
4. استمتع! 🎉
```

---

**🌾 مشروعك جاهز للعرض! 🚜**

**Your project is ready to showcase! 🎉**

---

**تم الإعداد بواسطة / Prepared By:** AI Code Assistant  
**التاريخ / Date:** 7 October 2025  
**الحالة / Status:** ✅ Ready for Automatic Access!

**End of Guide**
