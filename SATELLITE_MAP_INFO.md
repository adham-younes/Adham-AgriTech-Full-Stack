# خريطة الأقمار الصناعية في Adham AgriTech
## Satellite Map in Adham AgriTech

**التاريخ / Date:** 7 أكتوبر 2025

---

## ✅ الإجابة المختصرة / Short Answer

### نعم! التطبيق يحتوي على:

```
✅ صور أقمار صناعية (Satellite Imagery)
✅ خريطة تفاعلية (Interactive Map) - صفحة Demo الجديدة
✅ تكامل مع Planet Labs API
✅ تكامل مع Mapbox
✅ مؤشرات NDVI, EVI, NDWI
```

---

## 🛰️ أنواع عرض الأقمار الصناعية / Types of Satellite Views

### 1. صور الأقمار الصناعية الثابتة ✅ (موجود)

**الموقع:** صفحة تفاصيل مراقبة المحاصيل  
**المسار:** `/dashboard/crop-monitoring/[id]`

**الملف:** `app/dashboard/crop-monitoring/[id]/page.tsx`

```typescript
// السطر 254-267
{monitoring.satellite_image_url && (
  <Card className="p-6">
    <h2 className="text-xl font-bold mb-4">{t[lang].satelliteImage}</h2>
    <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
      <Image
        src={monitoring.satellite_image_url || "/placeholder.svg"}
        alt="Satellite imagery"
        fill
        className="object-cover"
        unoptimized
      />
    </div>
  </Card>
)}
```

**الميزات:**
- ✅ عرض صور أقمار صناعية عالية الدقة
- ✅ من Planet Labs API
- ✅ مخزنة في قاعدة البيانات
- ✅ مرتبطة بكل مراقبة للمحاصيل

---

### 2. خريطة تفاعلية ✅ (جديد - تم إضافتها)

**الموقع:** صفحة Demo  
**المسار:** `/demo`

**الملف:** `app/demo/page.tsx` (تم إنشاؤه الآن)

**الميزات:**
- ✅ خريطة Mapbox تفاعلية كاملة
- ✅ عرض satellite (أقمار صناعية)
- ✅ عرض terrain (تضاريس)
- ✅ Markers للمزارع
- ✅ Popups تفاعلية
- ✅ 3D buildings
- ✅ Navigation controls
- ✅ Zoom & Pan
- ✅ لا تحتاج تسجيل دخول

**كيفية الوصول:**
```
http://localhost:3000/demo
(أو الرابط المُشارك من Cursor Port Forwarding)
```

---

## 🔑 المفاتيح المستخدمة / API Keys Used

### 1. Mapbox Access Token ✅
```env
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoiYWRoYW15b3VuZXMiLCJhIjoiY21nZ3NxeThmMDB5djJqc2R5NmFkaGlpdyJ9.i5syGJ-2PtK49U6DmB5Eww
```

**الاستخدام:**
- خريطة تفاعلية
- Satellite imagery basemap
- Street maps
- 3D terrain

**الحالة:** 🟢 مفعّل ويعمل

---

### 2. Planet Labs API Key ✅
```env
PLANET_API_KEY=PLAK1efdf8c62a944f1d8d15fc6d78d87014
```

**الاستخدام:**
- صور أقمار صناعية عالية الدقة
- تحديثات يومية
- مؤشرات NDVI, EVI, NDWI
- تحليل الغطاء النباتي

**الحالة:** 🟢 مفعّل وجاهز

---

## 📊 المؤشرات المتوفرة / Available Indices

### في قاعدة البيانات (crop_monitoring table):

#### 1. NDVI (Normalized Difference Vegetation Index)
```
مؤشر الغطاء النباتي المعياري
- يقيس صحة النباتات
- القيم: -1 إلى +1
- القيمة العالية = نباتات صحية
```

#### 2. EVI (Enhanced Vegetation Index)
```
مؤشر الغطاء النباتي المحسن
- أكثر دقة من NDVI
- يقلل تأثير التربة والغلاف الجوي
- مثالي للمناطق الكثيفة
```

#### 3. NDWI (Normalized Difference Water Index)
```
مؤشر المياه المعياري
- يقيس محتوى الرطوبة
- مفيد لإدارة الري
- يكشف الإجهاد المائي
```

#### 4. درجة الحرارة (Temperature)
```
- درجة حرارة السطح
- من بيانات الأقمار الصناعية
- مفيدة لتوقع الإجهاد الحراري
```

---

## 🗺️ أنماط الخرائط المتاحة / Available Map Styles

### في صفحة Demo الجديدة:

#### 1. Satellite View (أقمار صناعية)
```javascript
style: 'mapbox://styles/mapbox/satellite-streets-v12'
```
- ✅ صور حقيقية من الفضاء
- ✅ تفاصيل عالية الدقة
- ✅ أسماء الشوارع overlayed
- ✅ مثالي لرؤية المزارع والحقول

#### 2. Terrain View (تضاريس)
```javascript
style: 'mapbox://styles/mapbox/outdoors-v12'
```
- ✅ خريطة طبوغرافية
- ✅ تفاصيل التضاريس
- ✅ الطرق والمسارات
- ✅ مفيد للتخطيط

---

## 📍 الميزات التفاعلية / Interactive Features

### في صفحة /demo:

#### 1. Farm Markers (علامات المزارع)
```javascript
// مثال من الكود
const demoFarms = [
  { name: 'مزرعة النيل', coords: [31.2357, 30.0444], health: 'excellent' },
  { name: 'مزرعة الدلتا', coords: [31.2557, 30.0644], health: 'good' },
  { name: 'مزرعة الخير', coords: [31.2157, 30.0344], health: 'fair' },
]
```

**الميزات:**
- ✅ علامات ملونة حسب حالة المحصول
  - 🟢 أخضر = ممتاز (excellent)
  - 🟡 أصفر-أخضر = جيد (good)
  - 🟡 أصفر = متوسط (fair)
- ✅ Popups تفاعلية عند الضغط
- ✅ معلومات المزرعة
- ✅ حالة الصحة

#### 2. Navigation Controls
```
✅ Zoom in/out
✅ Rotate
✅ Tilt (3D view)
✅ Reset bearing
```

#### 3. 3D Buildings
```javascript
// في المناطق الحضرية
'type': 'fill-extrusion'
'paint': {
  'fill-extrusion-height': ['get', 'height'],
  'fill-extrusion-opacity': 0.6
}
```

---

## 🚀 كيفية الوصول / How to Access

### الطريقة 1: صفحة Demo (جديدة) ⭐

```bash
# الرابط المباشر
http://localhost:3000/demo

# أو إذا كنت تستخدم Port Forwarding
https://[your-cursor-url]:3000/demo
```

**الميزات:**
- ✅ لا تحتاج تسجيل دخول
- ✅ خريطة تفاعلية كاملة
- ✅ بيانات تجريبية
- ✅ جميع الميزات مفعّلة

---

### الطريقة 2: صفحة مراقبة المحاصيل (تحتاج تسجيل دخول)

```bash
# بعد تسجيل الدخول:
1. Dashboard
2. مراقبة المحاصيل
3. اختر مراقبة
4. شاهد صورة القمر الصناعي

# المسار
/dashboard/crop-monitoring/[id]
```

---

## 📱 التصميم Responsive / Responsive Design

### صفحة Demo:

```
✅ Desktop (lg): عرض كامل
✅ Tablet (md): Grid columns تتكيف
✅ Mobile: Single column
✅ Map height: 600px على جميع الأحجام
```

---

## 🎨 الواجهة / UI Components

### Stats Cards (4 بطاقات):
```
1. 🌱 مزارع نشطة: 3
2. 📍 حقول زراعية: 8
3. 💧 كفاءة الري: 92%
4. 📈 نمو الإنتاجية: +15%
```

### Feature Cards (3 بطاقات):
```
1. 🛰️ صور عالية الدقة - Planet Labs
2. 📊 مؤشرات NDVI - تحليل الصحة
3. 📍 تتبع دقيق - GPS tracking
```

---

## 🔄 التحديثات المستقبلية / Future Enhancements

### مقترحات للإضافة:

#### 1. رسم الحدود (Draw Tools)
```javascript
// Mapbox Draw plugin
- رسم حدود الحقول
- قياس المساحات
- تحديد المناطق
```

#### 2. Time-lapse
```javascript
// عرض التغيرات بمرور الوقت
- مقارنة صور تاريخية
- رؤية نمو المحاصيل
- تتبع التغيرات الموسمية
```

#### 3. Heat Maps
```javascript
// خرائط حرارية
- توزيع الري
- مناطق الإجهاد
- كثافة الغطاء النباتي
```

#### 4. Real-time Updates
```javascript
// تحديثات فورية
- بيانات الطقس live
- تحديثات NDVI
- تنبيهات فورية
```

---

## 📊 قاعدة البيانات / Database Schema

### جدول crop_monitoring:

```sql
CREATE TABLE crop_monitoring (
  id UUID PRIMARY KEY,
  field_id UUID REFERENCES fields(id),
  monitoring_date DATE NOT NULL,
  health_status TEXT, -- excellent, good, fair, poor, critical
  
  -- Satellite Indices
  ndvi_value NUMERIC, -- -1 to 1
  evi_value NUMERIC, -- -1 to 1
  ndwi_value NUMERIC, -- -1 to 1
  
  -- Temperature
  temperature_celsius NUMERIC,
  
  -- Image URL
  satellite_image_url TEXT, -- من Planet Labs
  
  -- Notes
  notes TEXT,
  notes_ar TEXT,
  
  created_at TIMESTAMP DEFAULT NOW()
);
```

**الموقع:** `scripts/005_create_crop_monitoring.sql`

---

## 🧪 كيفية الاختبار / How to Test

### خطوات سريعة:

#### 1. افتح صفحة Demo
```bash
# في المتصفح (بعد Port Forwarding)
http://localhost:3000/demo
```

#### 2. شاهد الخريطة
```
✅ يجب أن تظهر خريطة تفاعلية
✅ موقع افتراضي: القاهرة، مصر
✅ 3 علامات للمزارع التجريبية
```

#### 3. جرّب التفاعل
```
✅ اضغط على علامة مزرعة → Popup
✅ Zoom in/out باستخدام الماوس أو الأزرار
✅ اسحب الخريطة للتحرك
✅ بدّل بين satellite و terrain
```

#### 4. اختبر على الموبايل
```
✅ افتح نفس الرابط على موبايل
✅ يجب أن تعمل بسلاسة
✅ Touch gestures للـ zoom والـ pan
```

---

## 🐛 حل المشاكل / Troubleshooting

### المشكلة 1: الخريطة لا تظهر

**الأسباب المحتملة:**
```
❌ Mapbox token غير صحيح
❌ مشكلة في الاتصال بالإنترنت
❌ JavaScript error
```

**الحل:**
```bash
# تحقق من Console
F12 → Console

# تحقق من Token
echo $NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

# أعد تشغيل الخادم
pnpm dev
```

---

### المشكلة 2: Markers لا تظهر

**السبب:**
```
⏳ الخريطة لم تُحمّل بالكامل بعد
```

**الحل:**
```javascript
// الكود يحتوي على:
map.current.on('load', () => {
  // Markers تُضاف هنا
})
```

---

### المشكلة 3: صور الأقمار غير واضحة

**السبب:**
```
🔍 مستوى Zoom منخفض
```

**الحل:**
```
✅ Zoom in أكثر (zoom level 15+)
✅ استخدم satellite view
✅ انتظر تحميل tiles عالية الدقة
```

---

## 📞 معلومات إضافية / Additional Info

### موارد Mapbox:
```
📖 Docs: https://docs.mapbox.com/mapbox-gl-js/
🎨 Styles: https://docs.mapbox.com/api/maps/styles/
🗺️ Examples: https://docs.mapbox.com/mapbox-gl-js/examples/
```

### موارد Planet Labs:
```
📖 API Docs: https://developers.planet.com/docs/
🛰️ Imagery: https://www.planet.com/products/
📊 NDVI Guide: https://developers.planet.com/docs/ndvi/
```

---

## ✅ الخلاصة / Summary

### ما هو موجود في التطبيق:

```
✅ صور أقمار صناعية ثابتة (في crop monitoring)
✅ خريطة Mapbox تفاعلية (صفحة /demo الجديدة)
✅ Planet Labs API integration
✅ مؤشرات NDVI, EVI, NDWI
✅ Markers تفاعلية للمزارع
✅ Toggle بين satellite و terrain
✅ 3D buildings
✅ Navigation controls
✅ Responsive design
✅ لا يحتاج تسجيل دخول (صفحة Demo)
```

### للوصول الآن:
```
🌐 http://localhost:3000/demo
(أو الرابط من Cursor Port Forwarding)
```

---

**تم إعداد التقرير بواسطة / Prepared By:** AI Code Assistant  
**التاريخ / Date:** 7 October 2025  
**الحالة / Status:** ✅ خريطة تفاعلية جاهزة للاستخدام!

---

**End of Report**
