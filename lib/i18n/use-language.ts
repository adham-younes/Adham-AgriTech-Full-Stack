"use client"

import { useEffect, useState } from "react"

export type Language = "ar" | "en"

export function useLanguage() {
  const [language, setLanguage] = useState<Language>("ar")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // Get language from localStorage or browser preference
    const stored = localStorage.getItem("language") as Language | null
    const browserLang = navigator.language.startsWith("en") ? "en" : "ar"
    const lang = stored || browserLang

    setLanguage(lang)
    setMounted(true)

    // Update HTML attributes
    document.documentElement.lang = lang
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr"
  }, [])

  const toggleLanguage = () => {
    const newLang: Language = language === "ar" ? "en" : "ar"
    setLanguage(newLang)
    localStorage.setItem("language", newLang)
    document.documentElement.lang = newLang
    document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr"
  }

  return { language, toggleLanguage, mounted }
}
