"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function LanguageToggle({ initialLang = "ar" as "ar" | "en" }) {
  const [lang, setLang] = useState<"ar" | "en">(initialLang)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  async function toggle() {
    const next = lang === "ar" ? "en" : "ar"
    setLang(next)
    try {
      await fetch("/api/lang", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lang: next }),
      })
      startTransition(() => router.refresh())
    } catch (e) {
      // no-op
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={toggle} disabled={isPending}>
      {lang === "ar" ? "EN" : "ع"}
    </Button>
  )
}
