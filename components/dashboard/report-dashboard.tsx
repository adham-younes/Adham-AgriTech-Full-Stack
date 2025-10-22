"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  FileText, 
  TrendingUp, 
  Droplets, 
  Sun, 
  Leaf,
  BarChart3,
  PieChart,
  Activity,
  Calendar,
  MapPin,
  Download,
  Eye,
  Plus
} from "lucide-react"
import Link from "next/link"

interface ReportSummary {
  id: string
  title: string
  report_type: string
  date_from: string
  date_to: string
  created_at: string
  data: {
    summary: {
      totalFarms: number
      totalFields: number
      totalArea: number
    }
    analytics: {
      soilHealth: {
        averagePh: number
        healthDistribution: Record<string, number>
      }
      cropPerformance: {
        averageNdvi: number
        healthDistribution: Record<string, number>
      }
      weatherImpact: {
        avgTemperature: number
        totalPrecipitation: number
        impactOnCrops: string
      }
      irrigationEfficiency: {
        averageEfficiency: number
        systemDistribution: Record<string, number>
      }
    }
  }
}

export default function ReportDashboard() {
  const [reports, setReports] = useState<ReportSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<"ar" | "en">("ar")

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchReports()
  }, [])

  async function fetchReports() {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error
      setReports(data || [])
    } catch (error) {
      console.error("Error fetching reports:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "comprehensive":
        return "bg-purple-500"
      case "farm_summary":
        return "bg-blue-500"
      case "soil_analysis":
        return "bg-green-500"
      case "crop_monitoring":
        return "bg-yellow-500"
      case "irrigation":
        return "bg-cyan-500"
      case "financial":
        return "bg-pink-500"
      default:
        return "bg-gray-500"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "comprehensive":
        return <Activity className="h-4 w-4" />
      case "farm_summary":
        return <MapPin className="h-4 w-4" />
      case "soil_analysis":
        return <Leaf className="h-4 w-4" />
      case "crop_monitoring":
        return <TrendingUp className="h-4 w-4" />
      case "irrigation":
        return <Droplets className="h-4 w-4" />
      case "financial":
        return <BarChart3 className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")
  }

  const t = {
    ar: {
      title: "لوحة التقارير",
      recentReports: "التقارير الأخيرة",
      generateNew: "إنشاء تقرير جديد",
      viewAll: "عرض الكل",
      noReports: "لا توجد تقارير",
      noReportsDesc: "ابدأ بإنشاء تقرير جديد",
      type: "النوع",
      period: "الفترة",
      generated: "تم الإنشاء",
      farms: "المزارع",
      fields: "الحقول",
      area: "المساحة",
      soilHealth: "صحة التربة",
      cropHealth: "صحة المحاصيل",
      temperature: "درجة الحرارة",
      efficiency: "الكفاءة",
      view: "عرض",
      download: "تحميل",
      comprehensive: "شامل",
      farm_summary: "ملخص المزرعة",
      soil_analysis: "تحليل التربة",
      crop_monitoring: "مراقبة المحاصيل",
      irrigation: "الري",
      financial: "مالي"
    },
    en: {
      title: "Report Dashboard",
      recentReports: "Recent Reports",
      generateNew: "Generate New Report",
      viewAll: "View All",
      noReports: "No Reports",
      noReportsDesc: "Start by generating a new report",
      type: "Type",
      period: "Period",
      generated: "Generated",
      farms: "Farms",
      fields: "Fields",
      area: "Area",
      soilHealth: "Soil Health",
      cropHealth: "Crop Health",
      temperature: "Temperature",
      efficiency: "Efficiency",
      view: "View",
      download: "Download",
      comprehensive: "Comprehensive",
      farm_summary: "Farm Summary",
      soil_analysis: "Soil Analysis",
      crop_monitoring: "Crop Monitoring",
      irrigation: "Irrigation",
      financial: "Financial"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t[lang].title}</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>
            {lang === "ar" ? "EN" : "ع"}
          </Button>
          <Link href="/dashboard/reports/new">
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              {t[lang].generateNew}
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats */}
      {reports.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">{t[lang].recentReports}</h3>
            </div>
            <div className="text-2xl font-bold">{reports.length}</div>
            <div className="text-sm text-muted-foreground">Total Reports</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold">{t[lang].farms}</h3>
            </div>
            <div className="text-2xl font-bold">
              {reports.reduce((sum, r) => sum + (r.data?.summary?.totalFarms || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Farms</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <Leaf className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">{t[lang].fields}</h3>
            </div>
            <div className="text-2xl font-bold">
              {reports.reduce((sum, r) => sum + (r.data?.summary?.totalFields || 0), 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Fields</div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold">{t[lang].area}</h3>
            </div>
            <div className="text-2xl font-bold">
              {reports.reduce((sum, r) => sum + (r.data?.summary?.totalArea || 0), 0)} ha
            </div>
            <div className="text-sm text-muted-foreground">Total Area</div>
          </Card>
        </div>
      )}

      {/* Recent Reports */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{t[lang].recentReports}</h2>
          <Link href="/dashboard/reports">
            <Button variant="outline" size="sm">
              {t[lang].viewAll}
            </Button>
          </Link>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">{t[lang].noReports}</h3>
            <p className="text-muted-foreground mb-4">{t[lang].noReportsDesc}</p>
            <Link href="/dashboard/reports/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                {t[lang].generateNew}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div key={report.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{report.title}</h3>
                      <Badge className={`${getTypeColor(report.report_type)} text-white flex items-center gap-1`}>
                        {getTypeIcon(report.report_type)}
                        {t[lang][report.report_type as keyof typeof t.ar] || report.report_type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(report.date_from)} - {formatDate(report.date_to)}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {formatDate(report.created_at)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Report Metrics */}
                {report.data && (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary">
                        {report.data.summary?.totalFarms || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">{t[lang].farms}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary">
                        {report.data.summary?.totalFields || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">{t[lang].fields}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary">
                        {report.data.analytics?.soilHealth?.averagePh?.toFixed(1) || 'N/A'}
                      </div>
                      <div className="text-xs text-muted-foreground">{t[lang].soilHealth}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-primary">
                        {report.data.analytics?.weatherImpact?.avgTemperature?.toFixed(1) || 'N/A'}°C
                      </div>
                      <div className="text-xs text-muted-foreground">{t[lang].temperature}</div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Link href={`/dashboard/reports/${report.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full gap-2">
                      <Eye className="h-4 w-4" />
                      {t[lang].view}
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Download className="h-4 w-4" />
                    {t[lang].download}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  )
}