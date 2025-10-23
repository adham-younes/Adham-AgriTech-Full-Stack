# خدمات التكامل الخارجية - External Services Integration

## نظرة عامة - Overview

يحتوي مشروع Adham AgriTech على تكاملات شاملة مع عدة خدمات خارجية لتوفير ميزات متقدمة للمزارعين.

## الخدمات المتكاملة - Integrated Services

### 1. Supabase (قاعدة البيانات)
- **الحالة**: ✅ يعمل بنجاح
- **الاستخدام**: قاعدة البيانات والمصادقة والتخزين
- **الملفات**:
  - `lib/supabase/client.ts` - عميل المتصفح
  - `lib/supabase/server.ts` - عميل الخادم
  - `lib/supabase/middleware.ts` - معالج المصادقة

### 2. OpenWeather API (بيانات الطقس)
- **الحالة**: ✅ يعمل (يحتاج مفتاح API)
- **الاستخدام**: الطقس الحالي والتنبؤات
- **الملفات**:
  - `app/api/weather/route.ts` - نقطة نهاية الطقس
  - `app/dashboard/weather/page.tsx` - صفحة الطقس

### 3. Copernicus (الأقمار الصناعية)
- **الحالة**: ✅ يعمل بنجاح
- **الاستخدام**: صور الأقمار الصناعية وتحليل NDVI
- **الملفات**:
  - `lib/services/copernicus.ts` - خدمة Copernicus
  - `lib/satellite/earth-engine.ts` - معالجة بيانات الأقمار
  - `components/satellite-map.tsx` - خريطة الأقمار الصناعية

### 4. Groq AI (الذكاء الاصطناعي)
- **الحالة**: ✅ يعمل بنجاح
- **الاستخدام**: المساعد الذكي والتوصيات
- **الملفات**:
  - `app/api/ai-assistant/route.ts` - نقطة نهاية المساعد الذكي
  - `app/dashboard/ai-assistant/page.tsx` - صفحة المساعد الذكي

### 5. Ethereum Blockchain (البلوكتشين)
- **الحالة**: ✅ يعمل على Sepolia Testnet
- **الاستخدام**: العقود الذكية والـ NFTs
- **الملفات**:
  - `lib/blockchain/contract.ts` - تفاعل العقود الذكية
  - `app/dashboard/blockchain/page.tsx` - صفحة البلوكتشين

### 6. Stripe (المدفوعات)
- **الحالة**: ✅ مُكوّن
- **الاستخدام**: معالجة الدفع والاشتراكات
- **الملفات**:
  - `app/api/stripe/route.ts` - نقطة نهاية Stripe

## اختبار الخدمات - Testing Services

### نقطة نهاية فحص الصحة
\`\`\`bash
curl http://localhost:3003/api/services/health
\`\`\`

**الاستجابة**:
\`\`\`json
{
  "status": "healthy",
  "timestamp": "2025-10-21T04:30:00Z",
  "services": {
    "weather": {
      "status": "success",
      "message": "OpenWeather connection successful"
    },
    "blockchain": {
      "status": "success",
      "message": "Blockchain connection successful"
    },
    "copernicus": {
      "status": "success",
      "message": "Copernicus connection successful"
    },
    "supabase": {
      "status": "success",
      "message": "Supabase configured"
    }
  }
}
\`\`\`

## متغيرات البيئة - Environment Variables

### مطلوبة - Required
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://mxnkwudqxtgduhenrgvm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
\`\`\`

### اختيارية - Optional
\`\`\`env
OPENWEATHER_API_KEY=your-key-here
OPENAI_API_KEY=your-key-here
COPERNICUS_CLIENT_ID=your-id-here
COPERNICUS_CLIENT_SECRET=your-secret-here
\`\`\`

### مكشوفة (تحتاج تجديد) - Exposed (Need Renewal)
\`\`\`env
NEXT_PUBLIC_INFURA_API_KEY=c39b028e09be4c268110c1dcc81b3ebc
NEXT_PUBLIC_ETHERSCAN_API_KEY=RKVSW4VI28GAW1VNZHQEC538Q1M9P2M49S
\`\`\`

## الصفحات المتاحة - Available Pages

| الصفحة | الرابط | الخدمات المستخدمة |
|--------|--------|------------------|
| لوحة التحكم | `/dashboard` | Supabase |
| الطقس | `/dashboard/weather` | OpenWeather |
| المساعد الذكي | `/dashboard/ai-assistant` | Groq |
| مراقبة المحاصيل | `/dashboard/crop-monitoring` | Copernicus, Supabase |
| البلوكتشين | `/dashboard/blockchain` | Ethereum, Infura |
| حالة الخدمات | `/dashboard/services` | جميع الخدمات |
| الشركاء | `/partners` | - |

## استكشاف الأخطاء - Troubleshooting

### الطقس لا يعمل
\`\`\`bash
# تحقق من المفتاح
echo $OPENWEATHER_API_KEY

# اختبر الاتصال
curl "https://api.openweathermap.org/data/2.5/weather?q=Cairo,EG&appid=YOUR_KEY&units=metric"
\`\`\`

### البلوكتشين لا يعمل
\`\`\`bash
# تحقق من RPC URL
curl https://sepolia.infura.io/v3/YOUR_KEY \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}'
\`\`\`

### الأقمار الصناعية لا تعمل
\`\`\`bash
# تحقق من بيانات Copernicus
# راجع lib/services/copernicus.ts
\`\`\`

## الأمان - Security

### قائمة التحقق - Checklist
- [ ] جميع المفاتيح السرية في `.env.local`
- [ ] `.env.local` في `.gitignore`
- [ ] لا توجد مفاتيح في الكود
- [ ] تم تجديد المفاتيح المكشوفة
- [ ] تم ضبط حدود الاستخدام

### أفضل الممارسات - Best Practices
1. استخدم متغيرات بيئة مختلفة للتطوير والإنتاج
2. جدّد المفاتيح بانتظام
3. راقب استخدام الخدمات
4. فعّل الإشعارات عند تجاوز الحدود

## الدعم - Support

للمزيد من المعلومات، راجع:
- [Supabase Docs](https://supabase.com/docs)
- [OpenWeather API](https://openweathermap.org/api)
- [Copernicus Dataspace](https://dataspace.copernicus.eu)
- [Groq API](https://console.groq.com)
- [Ethereum Docs](https://ethereum.org/developers)
