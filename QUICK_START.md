# Quick Start Guide - دليل البدء السريع

## English 🇬🇧

### 1. First Time Setup
```bash
# Install dependencies
npm install

# Create .env file from the template
cp .env.example .env

# Add your Gemini API Key to .env
# Visit https://ai.google.dev to get your key
```

### 2. Update `.env` file
```
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### 4. Build for Production
```bash
npm run build
```

---

## العربية 🇸🇦

### 1. الإعداد الأول
```bash
# تثبيت المتطلبات
npm install

# إنشاء ملف .env من النموذج
cp .env.example .env

# أضف مفتاح Gemini API إلى .env
# زر https://ai.google.dev للحصول على المفتاح
```

### 2. تحديث ملف `.env`
```
VITE_GEMINI_API_KEY=ضع_مفتاحك_الفعلي_هنا
```

### 3. تشغيل خادم التطوير
```bash
npm run dev
```

سيفتح التطبيق على `http://localhost:3000`

### 4. بناء للإنتاج
```bash
npm run build
```

---

## 🆘 استكشاف الأخطاء

### المشكلة: "VITE_GEMINI_API_KEY is not configured"
**الحل**: تأكد من وجود ملف `.env` وأنه يحتوي على مفتاح API صحيح

### المشكلة: "Failed to analyze clothing image"
**الحل**: 
- تأكد من أن صورة صحيحة (JPEG/PNG/WebP)
- تأكد من أن حجم الملف أقل من 5MB
- تأكد من أن لديك اتصال إنترنت

### المشكلة: npm install فشل
**الحل**:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

## 📱 الميزات الرئيسية

| الميزة | الوصف |
|--------|-------|
| **الخزانة الرقمية** | رفع صورك وتحليل الألوان والأنماط تلقائياً |
| **منسق الأزياء** | احصل على توصيات تنسيق ذكية |
| **المصمم المبدع** | صمّم ملابس جديدة باستخدام الذكاء الاصطناعي |
| **المتجر الحرفي** | تسوق منتجات حصرية مصنوعة يدوياً |
| **ثنائي اللغة** | دعم كامل للعربية والإنجليزية |

---

## 🔐 نصائح الأمان

✅ **افعل**:
- احفظ `.env` خاص بك فقط
- أعد تعيين مفتاح API إذا تم تسريبه
- استخدم متغيرات البيئة للبيانات الحساسة

❌ **لا تفعل**:
- لا تشارك ملف `.env`
- لا تضع مفاتيح API في الـ code مباشرة
- لا تنشر `.env` على GitHub

---

## 📚 المزيد من الموارد

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Google Gemini API](https://ai.google.dev/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**استمتع باستخدام Aura AI Fashion Assistant!** ✨
