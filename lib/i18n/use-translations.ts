"use client"

import { useState, useEffect, createContext, useContext } from "react"
import { translations } from "./translations"

type Language = "ar" | "en"
type TranslationKey = keyof typeof translations.ar

interface I18nContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: typeof translations.ar
  dir: "rtl" | "ltr"
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("ar")

  useEffect(() => {
    // Load saved language from localStorage
    const savedLang = localStorage.getItem("language") as Language
    if (savedLang && (savedLang === "ar" || savedLang === "en")) {
      setLanguage(savedLang)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    // Update document direction
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
    document.documentElement.lang = lang
  }

  const value: I18nContextType = {
    language,
    setLanguage: handleSetLanguage,
    t: translations[language],
    dir: language === "ar" ? "rtl" : "ltr",
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useTranslations() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useTranslations must be used within I18nProvider")
  }
  return context
}

// Helper function to get nested translation values
export function getTranslation(obj: any, path: string): string {
  return path.split('.').reduce((acc, part) => acc?.[part], obj) || path
}