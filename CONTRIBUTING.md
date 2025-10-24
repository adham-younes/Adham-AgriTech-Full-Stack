# 🤝 دليل المساهمة - Adham AgriTech

شكراً لك على اهتمامك بالمساهمة في مشروع Adham AgriTech! هذا الدليل سيساعدك على فهم كيفية المساهمة بشكل فعال.

## 📋 جدول المحتويات

1. [كيفية المساهمة](#كيفية-المساهمة)
2. [إعداد بيئة التطوير](#إعداد-بيئة-التطوير)
3. [معايير الكود](#معايير-الكود)
4. [عملية المساهمة](#عملية-المساهمة)
5. [الإبلاغ عن الأخطاء](#الإبلاغ-عن-الأخطاء)
6. [اقتراح ميزات جديدة](#اقتراح-ميزات-جديدة)

## 🚀 كيفية المساهمة

### أنواع المساهمات المقبولة

- **🐛 إصلاح الأخطاء** - إصلاح مشاكل في الكود
- **✨ ميزات جديدة** - إضافة وظائف جديدة
- **📚 تحسين الوثائق** - تحسين الدليل والوثائق
- **🎨 تحسينات UI/UX** - تحسين واجهة المستخدم
- **⚡ تحسينات الأداء** - تحسين سرعة التطبيق
- **🧪 اختبارات** - إضافة اختبارات جديدة
- **🔧 أدوات التطوير** - تحسين أدوات التطوير

## 🛠️ إعداد بيئة التطوير

### 1. استنساخ المشروع
```bash
git clone https://github.com/your-username/adham-agritech.git
cd adham-agritech
```

### 2. تثبيت التبعيات
```bash
# باستخدام pnpm (موصى به)
pnpm install

# أو باستخدام npm
npm install
```

### 3. إعداد متغيرات البيئة
```bash
# نسخ ملف البيئة
cp .env.example .env.local

# تحرير الملف وإضافة المفاتيح المطلوبة
nano .env.local
```

### 4. تشغيل الخادم
```bash
pnpm run dev
```

### 5. فتح المتصفح
```
http://localhost:3003
```

## 📝 معايير الكود

### TypeScript
- استخدم TypeScript لجميع الملفات الجديدة
- اكتب types واضحة ومفصلة
- تجنب استخدام `any` قدر الإمكان

```typescript
// ✅ جيد
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ سيء
const user: any = { ... };
```

### React Components
- استخدم Functional Components مع Hooks
- اكتب مكونات قابلة لإعادة الاستخدام
- استخدم TypeScript للـ props

```typescript
// ✅ جيد
interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ children, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
```

### CSS/Styling
- استخدم Tailwind CSS للتصميم
- اتبع naming conventions
- استخدم CSS variables للمواضيع

```css
/* ✅ جيد */
.primary-button {
  @apply bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90;
}

/* ❌ سيء */
.btn {
  background-color: #000;
  color: #fff;
  padding: 8px 16px;
  border-radius: 4px;
}
```

### File Structure
```
components/
├── ui/                 # مكونات الواجهة الأساسية
├── dashboard/          # مكونات لوحة التحكم
└── forms/             # مكونات النماذج

lib/
├── services/          # الخدمات
├── utils/             # وظائف مساعدة
└── types/             # تعريفات TypeScript
```

### Naming Conventions
- **Files:** kebab-case (`user-profile.tsx`)
- **Components:** PascalCase (`UserProfile`)
- **Functions:** camelCase (`getUserData`)
- **Constants:** UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Variables:** camelCase (`userName`)

## 🔄 عملية المساهمة

### 1. إنشاء Issue
- ابحث عن issues موجودة أولاً
- أنشئ issue جديد إذا لم تجد ما تبحث عنه
- اكتب وصفاً واضحاً للمشكلة أو الميزة

### 2. Fork المشروع
- اضغط على زر "Fork" في GitHub
- استنسخ fork إلى جهازك المحلي

### 3. إنشاء Branch
```bash
# إنشاء branch جديد
git checkout -b feature/amazing-feature

# أو لإصلاح خطأ
git checkout -b fix/bug-description
```

### 4. كتابة الكود
- اكتب الكود وفقاً لمعايير المشروع
- أضف تعليقات واضحة
- اكتب اختبارات إذا لزم الأمر

### 5. اختبار التغييرات
```bash
# تشغيل الاختبارات
pnpm run test

# فحص نوع البيانات
pnpm run type-check

# فحص التنسيق
pnpm run format:check
```

### 6. Commit التغييرات
```bash
# إضافة التغييرات
git add .

# Commit مع رسالة واضحة
git commit -m "feat: add user profile component

- Add UserProfile component with avatar and basic info
- Add TypeScript interfaces for user data
- Add responsive design with Tailwind CSS
- Add unit tests for component rendering"
```

### 7. Push التغييرات
```bash
git push origin feature/amazing-feature
```

### 8. إنشاء Pull Request
- اذهب إلى GitHub repository
- اضغط على "Compare & pull request"
- اكتب وصفاً واضحاً للتغييرات
- أضف screenshots إذا لزم الأمر

## 🐛 الإبلاغ عن الأخطاء

### معلومات مطلوبة
- **الوصف:** وصف واضح للمشكلة
- **خطوات التكرار:** خطوات لإعادة إنتاج المشكلة
- **النتائج المتوقعة:** ما كان يجب أن يحدث
- **النتائج الفعلية:** ما حدث فعلاً
- **البيئة:** نظام التشغيل، المتصفح، الإصدار
- **Screenshots:** صور للمشكلة إذا أمكن

### قالب Bug Report
```markdown
## 🐛 وصف المشكلة
وصف واضح للمشكلة

## 🔄 خطوات التكرار
1. اذهب إلى '...'
2. اضغط على '...'
3. انزل إلى '...'
4. شاهد الخطأ

## ✅ النتائج المتوقعة
ما كان يجب أن يحدث

## ❌ النتائج الفعلية
ما حدث فعلاً

## 📱 البيئة
- OS: [e.g. Windows 10, macOS 12.0]
- Browser: [e.g. Chrome 91, Firefox 89]
- Version: [e.g. 1.0.0]

## 📸 Screenshots
إذا أمكن، أضف screenshots للمشكلة
```

## 💡 اقتراح ميزات جديدة

### معلومات مطلوبة
- **الوصف:** وصف واضح للميزة المقترحة
- **السبب:** لماذا هذه الميزة مفيدة؟
- **الاستخدام:** كيف ستُستخدم هذه الميزة؟
- **البدائل:** هل فكرت في بدائل أخرى؟

### قالب Feature Request
```markdown
## 💡 وصف الميزة
وصف واضح للميزة المقترحة

## 🤔 المشكلة التي تحلها
ما المشكلة التي تحلها هذه الميزة؟

## 💭 الحل المقترح
كيف تريد أن تعمل هذه الميزة؟

## 🔄 البدائل
هل فكرت في بدائل أخرى؟

## 📋 متطلبات إضافية
- [ ] UI/UX design
- [ ] Backend changes
- [ ] Database changes
- [ ] API changes
- [ ] Documentation updates
```

## 📚 الموارد المفيدة

### الوثائق
- [Next.js Documentation](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)

### الأدوات
- [VS Code](https://code.visualstudio.com/)
- [GitHub Desktop](https://desktop.github.com/)
- [Postman](https://www.postman.com/)

### الاختبار
- [Jest](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright](https://playwright.dev/)

## 🏷️ Labels

### Bug Reports
- `bug` - خطأ في الكود
- `critical` - خطأ حرج
- `ui/ux` - مشكلة في الواجهة
- `performance` - مشكلة في الأداء

### Feature Requests
- `enhancement` - تحسين ميزة موجودة
- `feature` - ميزة جديدة
- `ui/ux` - تحسين واجهة المستخدم
- `api` - تغيير في API

### Pull Requests
- `ready for review` - جاهز للمراجعة
- `needs changes` - يحتاج تغييرات
- `approved` - موافق عليه
- `merged` - تم الدمج

## 📞 التواصل

- **GitHub Issues:** للمناقشات التقنية
- **Email:** adhamlouxor@gmail.com للاستفسارات العامة
- **Discord:** (إذا كان متوفراً)

## 🙏 شكر وتقدير

شكراً لجميع المساهمين الذين يساعدون في تطوير Adham AgriTech!

---

**📅 آخر تحديث:** 23 أكتوبر 2025  
**👨‍💻 المطور:** Adham Louxor  
**📧 البريد:** adhamlouxor@gmail.com