// ===========================================
// Adham AgriTech - Translation Hook
// ===========================================

import { useState, useEffect, useCallback } from 'react';

export type Language = 'ar' | 'en';
export type TranslationKey = string;

interface TranslationData {
  [key: string]: any;
}

interface UseTranslationReturn {
  t: (key: TranslationKey, params?: Record<string, any>) => string;
  language: Language;
  setLanguage: (lang: Language) => void;
  isLoading: boolean;
  error: string | null;
}

// تحميل الترجمة
const loadTranslation = async (language: Language): Promise<TranslationData> => {
  try {
    const response = await fetch(`/locales/${language}.json`);
    if (!response.ok) {
      throw new Error(`Failed to load ${language} translation`);
    }
    return await response.json();
  } catch (error) {
    console.error('Translation loading error:', error);
    // إرجاع ترجمة افتراضية فارغة
    return {};
  }
};

// الحصول على قيمة من كائن متداخل باستخدام مفتاح منقوط
const getNestedValue = (obj: any, key: string): string => {
  return key.split('.').reduce((current, part) => {
    return current && current[part] !== undefined ? current[part] : undefined;
  }, obj);
};

// استبدال المعاملات في النص
const interpolate = (text: string, params?: Record<string, any>): string => {
  if (!params) return text;
  
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match;
  });
};

export const useTranslation = (): UseTranslationReturn => {
  const [language, setLanguageState] = useState<Language>('ar');
  const [translations, setTranslations] = useState<TranslationData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // تحميل الترجمة عند تغيير اللغة
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const translationData = await loadTranslation(language);
        setTranslations(translationData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Translation loading failed');
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [language]);

  // دالة الترجمة
  const t = useCallback((key: TranslationKey, params?: Record<string, any>): string => {
    const translation = getNestedValue(translations, key);
    
    if (translation === undefined) {
      console.warn(`Translation missing for key: ${key}`);
      return key; // إرجاع المفتاح نفسه إذا لم توجد الترجمة
    }

    if (typeof translation !== 'string') {
      console.warn(`Translation is not a string for key: ${key}`);
      return key;
    }

    return interpolate(translation, params);
  }, [translations]);

  // تغيير اللغة
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    // حفظ اللغة في localStorage
    localStorage.setItem('preferred-language', lang);
    // تحديث اتجاه النص
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, []);

  // تحميل اللغة المحفوظة عند التهيئة
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    if (savedLanguage && (savedLanguage === 'ar' || savedLanguage === 'en')) {
      setLanguageState(savedLanguage);
    }
  }, []);

  return {
    t,
    language,
    setLanguage,
    isLoading,
    error
  };
};

// Hook مبسط للاستخدام السريع
export const useT = () => {
  const { t } = useTranslation();
  return t;
};

// Hook للحصول على اللغة الحالية فقط
export const useLanguage = () => {
  const { language, setLanguage } = useTranslation();
  return { language, setLanguage };
};