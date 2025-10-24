"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle2, AlertCircle, Loader2, RefreshCw } from "lucide-react"

interface ServiceStatus {
  status: "success" | "error"
  message: string
}

interface HealthResponse {
  status: "healthy" | "degraded" | "error"
  timestamp: string
  services: {
    weather: ServiceStatus
    blockchain: ServiceStatus
    copernicus: ServiceStatus
    supabase: ServiceStatus
  }
}

export default function ServicesPage() {
  const [health, setHealth] = useState<HealthResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<"ar" | "en">("ar")

  useEffect(() => {
    checkHealth()
  }, [])

  async function checkHealth() {
    setLoading(true)
    try {
      const response = await fetch("/api/services/health")
      const data: HealthResponse = await response.json()
      setHealth(data)
    } catch (error) {
      console.error("[v0] Error checking services health:", error)
    } finally {
      setLoading(false)
    }
  }

  const t = {
    ar: {
      title: "حالة الخدمات",
      subtitle: "مراقبة حالة جميع الخدمات الخارجية",
      refresh: "تحديث",
      status: "الحالة",
      message: "الرسالة",
      healthy: "سليمة",
      degraded: "متدهورة",
      error: "خطأ",
      weather: "خدمة الطقس",
      blockchain: "خدمة البلوكتشين",
      copernicus: "خدمة الأقمار الصناعية",
      supabase: "قاعدة البيانات",
      lastUpdate: "آخر تحديث",
    },
    en: {
      title: "Services Status",
      subtitle: "Monitor the health and performance of all integrated services",
      refresh: "Refresh All",
      status: "Overall Status",
      message: "Message",
      healthy: "Online",
      degraded: "Limited",
      error: "Offline",
      weather: "Weather Service",
      blockchain: "Blockchain Service",
      copernicus: "Satellite Service",
      supabase: "Database",
      lastUpdate: "Last Update",
    },
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-500/20 border-green-500/50 text-green-400"
      case "error":
        return "bg-red-500/20 border-red-500/50 text-red-400"
      default:
        return "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
    }
  }

  const getStatusIcon = (status: string) => {
    if (status === "success") {
      return <CheckCircle2 className="h-5 w-5 text-green-400" />
    }
    return <AlertCircle className="h-5 w-5 text-red-400" />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            {t[lang].title}
          </h1>
          <p className="text-gray-400 mt-2">{t[lang].subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLang(lang === "ar" ? "en" : "ar")}
            className="glass-card border-white/10 hover:border-green-500/50"
          >
            {lang === "ar" ? "EN" : "ع"}
          </Button>
          <Button
            onClick={checkHealth}
            disabled={loading}
            className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            {t[lang].refresh}
          </Button>
        </div>
      </div>

      {health && (
        <>
          <Card className="glass-card p-6 border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">{t[lang].status}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    className={`${
                      health.status === "healthy"
                        ? "bg-green-500/20 border-green-500/50 text-green-400"
                        : health.status === "degraded"
                          ? "bg-yellow-500/20 border-yellow-500/50 text-yellow-400"
                          : "bg-red-500/20 border-red-500/50 text-red-400"
                    } border`}
                  >
                    {t[lang][health.status as keyof typeof t.ar]}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">{t[lang].lastUpdate}</p>
                <p className="text-sm font-mono text-green-400 mt-1">
                  {new Date(health.timestamp).toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US")}
                </p>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            {Object.entries(health.services).map(([key, service]) => (
              <Card key={key} className={`glass-card p-6 border ${getStatusColor(service.status)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(service.status)}
                      <h3 className="text-lg font-semibold">{t[lang][key as keyof typeof t.ar] || key}</h3>
                    </div>
                    <p className="text-sm opacity-90">{service.message}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-green-500" />
        </div>
      )}
    </div>
  )
}
