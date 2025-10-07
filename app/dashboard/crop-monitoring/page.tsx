"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Loader2, TrendingUp } from "lucide-react"
import Link from "next/link"

export default function CropMonitoringPage() {
  const [monitoring, setMonitoring] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<"ar" | "en">("ar")

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchMonitoring()
  }, [])

  async function fetchMonitoring() {
    try {
      const { data, error } = await supabase
        .from("crop_monitoring")
        .select("*, fields(name, farms(name))")
        .order("monitoring_date", { ascending: false })

      if (error) throw error
      setMonitoring(data || [])
    } catch (error) {
      console.error("[v0] Error fetching crop monitoring:", error)
    } finally {
      setLoading(false)
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent":
        return "bg-green-500"
      case "good":
        return "bg-green-400"
      case "fair":
        return "bg-yellow-500"
      case "poor":
        return "bg-orange-500"
      case "critical":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const t = {
    ar: {
      title: "مراقبة المحاصيل",
      addMonitoring: "إضافة مراقبة جديدة",
      noMonitoring: "لا توجد بيانات مراقبة",
      noMonitoringDesc: "ابدأ بإضافة بيانات مراقبة المحاصيل",
      field: "الحقل",
      farm: "المزرعة",
      date: "التاريخ",
      health: "الحالة الصحية",
      ndvi: "مؤشر NDVI",
      evi: "مؤشر EVI",
      viewDetails: "عرض التفاصيل",
      excellent: "ممتاز",
      good: "جيد",
      fair: "متوسط",
      poor: "ضعيف",
      critical: "حرج",
    },
    en: {
      title: "Crop Monitoring",
      addMonitoring: "Add New Monitoring",
      noMonitoring: "No Monitoring Data",
      noMonitoringDesc: "Start by adding crop monitoring data",
      field: "Field",
      farm: "Farm",
      date: "Date",
      health: "Health Status",
      ndvi: "NDVI Index",
      evi: "EVI Index",
      viewDetails: "View Details",
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
      poor: "Poor",
      critical: "Critical",
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t[lang].title}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>
            {lang === "ar" ? "EN" : "ع"}
          </Button>
          <Link href="/dashboard/crop-monitoring/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t[lang].addMonitoring}
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : monitoring.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="mx-auto max-w-md space-y-4">
            <h3 className="text-xl font-semibold">{t[lang].noMonitoring}</h3>
            <p className="text-muted-foreground">{t[lang].noMonitoringDesc}</p>
            <Link href="/dashboard/crop-monitoring/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t[lang].addMonitoring}
              </Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {monitoring.map((item) => (
            <Card key={item.id} className="p-6 hover:border-primary transition-colors">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-1">{item.fields?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t[lang].farm}: {item.fields?.farms?.name}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t[lang].date}:{" "}
                    {new Date(item.monitoring_date).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t[lang].health}:</span>
                  <Badge className={getHealthColor(item.health_status)}>
                    {t[lang][item.health_status as keyof typeof t.ar] || item.health_status}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t[lang].ndvi}</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <p className="text-lg font-bold">{item.ndvi_value?.toFixed(2) || "N/A"}</p>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">{t[lang].evi}</p>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <p className="text-lg font-bold">{item.evi_value?.toFixed(2) || "N/A"}</p>
                    </div>
                  </div>
                </div>

                <Link href={`/dashboard/crop-monitoring/${item.id}`}>
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    {t[lang].viewDetails}
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
