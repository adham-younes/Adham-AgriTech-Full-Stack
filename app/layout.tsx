import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { cookies } from "next/headers"
import ToasterProvider from "@/components/toaster-provider"
import "./globals.css"

export const metadata: Metadata = {
  title: "Adham AgriTech - منصة الزراعة الذكية",
  description: "Smart Agriculture Platform for Egyptian Farmers - منصة الزراعة الذكية للمزارعين المصريين",
  generator: "v0.app",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const cookieLang = cookieStore.get("lang")?.value
  const defaultLang = process.env.NEXT_PUBLIC_DEFAULT_LANG === "en" ? "en" : "ar"
  const lang = cookieLang === "en" ? "en" : defaultLang
  const dir = lang === "ar" ? "rtl" : "ltr"

  return (
    <html lang={lang} dir={dir} className="dark">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ToasterProvider />
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
