"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  TrendingUp, 
  Droplets, 
  Sun, 
  Leaf,
  MapPin,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react"
import Link from "next/link"
import ReportAnalytics from "@/components/dashboard/report-analytics"

interface ReportData {
  summary: {
    totalFarms: number
    totalFields: number
    totalArea: number
    period: {
      start: string
      end: string
    }
    generatedAt: string
  }
  farms: FarmReport[]
  analytics: {
    soilHealth: SoilAnalytics
    cropPerformance: CropAnalytics
    weatherImpact: WeatherAnalytics
    irrigationEfficiency: IrrigationAnalytics
  }
  recommendations: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
  charts: ChartData[]
}

interface FarmReport {
  id: string
  name: string
  location: string
  area: number
  fields: FieldReport[]
  overallHealth: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
  keyMetrics: {
    avgSoilHealth: number
    avgCropHealth: number
    waterEfficiency: number
    yieldProjection: number
  }
}

interface FieldReport {
  id: string
  name: string
  cropType: string
  area: number
  plantingDate: string
  expectedHarvest: string
  soilAnalysis: SoilAnalysisReport
  cropMonitoring: CropMonitoringReport
  irrigation: IrrigationReport
  weatherImpact: WeatherImpactReport
}

interface SoilAnalysisReport {
  ph: number
  nutrients: {
    nitrogen: number
    phosphorus: number
    potassium: number
  }
  organicMatter: number
  moisture: number
  healthScore: number
  recommendations: string[]
}

interface CropMonitoringReport {
  ndvi: number
  evi: number
  ndwi: number
  healthStatus: string
  growthStage: string
  satelliteImageUrl?: string
}

interface IrrigationReport {
  type: string
  efficiency: number
  waterUsage: number
  recommendations: string[]
}

interface WeatherImpactReport {
  avgTemperature: number
  totalPrecipitation: number
  humidity: number
  impactScore: number
  recommendations: string[]
}

interface SoilAnalytics {
  averagePh: number
  nutrientLevels: {
    nitrogen: { avg: number; trend: 'up' | 'down' | 'stable' }
    phosphorus: { avg: number; trend: 'up' | 'down' | 'stable' }
    potassium: { avg: number; trend: 'up' | 'down' | 'stable' }
  }
  organicMatterTrend: 'up' | 'down' | 'stable'
  healthDistribution: Record<string, number>
}

interface CropAnalytics {
  averageNdvi: number
  healthDistribution: Record<string, number>
  growthStages: Record<string, number>
  yieldProjections: {
    optimistic: number
    realistic: number
    pessimistic: number
  }
}

interface WeatherAnalytics {
  avgTemperature: number
  totalPrecipitation: number
  extremeWeatherEvents: number
  impactOnCrops: 'positive' | 'neutral' | 'negative'
}

interface IrrigationAnalytics {
  averageEfficiency: number
  waterUsageTrend: 'up' | 'down' | 'stable'
  systemDistribution: Record<string, number>
}

interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'scatter'
  title: string
  data: any[]
  xAxis?: string
  yAxis?: string
}

export default function ReportViewPage() {
  const params = useParams()
  const [report, setReport] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lang, setLang] = useState<"ar" | "en">("ar")

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchReport()
  }, [params.id])

  async function fetchReport() {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", params.id)
        .single()

      if (error) throw error
      setReport(data)
    } catch (error) {
      console.error("Error fetching report:", error)
    } finally {
      setLoading(false)
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'fair': return 'text-yellow-600 bg-yellow-100'
      case 'poor': return 'text-orange-600 bg-orange-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent': return '🟢'
      case 'good': return '🔵'
      case 'fair': return '🟡'
      case 'poor': return '🟠'
      case 'critical': return '🔴'
      default: return '⚪'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(lang === "ar" ? "ar-EG" : "en-US")
  }

  const t = {
    ar: {
      title: "عرض التقرير",
      back: "رجوع",
      loading: "جاري التحميل...",
      error: "خطأ في تحميل التقرير",
      summary: "ملخص التقرير",
      farms: "المزارع",
      fields: "الحقول",
      totalArea: "المساحة الإجمالية",
      period: "الفترة",
      generatedAt: "تم الإنشاء في",
      overallHealth: "الصحة العامة",
      keyMetrics: "المقاييس الرئيسية",
      soilHealth: "صحة التربة",
      cropHealth: "صحة المحاصيل",
      waterEfficiency: "كفاءة الري",
      yieldProjection: "توقع الإنتاج",
      recommendations: "التوصيات",
      immediate: "فوري",
      shortTerm: "قصير المدى",
      longTerm: "طويل المدى",
      download: "تحميل",
      export: "تصدير",
      soilAnalysis: "تحليل التربة",
      cropMonitoring: "مراقبة المحاصيل",
      weatherImpact: "تأثير الطقس",
      irrigation: "الري",
      ph: "الأس الهيدروجيني",
      nutrients: "المغذيات",
      nitrogen: "النيتروجين",
      phosphorus: "الفوسفور",
      potassium: "البوتاسيوم",
      organicMatter: "المادة العضوية",
      moisture: "الرطوبة",
      healthScore: "درجة الصحة",
      ndvi: "مؤشر الغطاء النباتي",
      evi: "مؤشر الغطاء النباتي المحسن",
      ndwi: "مؤشر المياه",
      growthStage: "مرحلة النمو",
      temperature: "درجة الحرارة",
      precipitation: "الهطول",
      humidity: "الرطوبة",
      impactScore: "درجة التأثير",
      efficiency: "الكفاءة",
      waterUsage: "استخدام المياه",
      systemType: "نوع النظام",
      excellent: "ممتاز",
      good: "جيد",
      fair: "متوسط",
      poor: "ضعيف",
      critical: "حرج"
    },
    en: {
      title: "View Report",
      back: "Back",
      loading: "Loading...",
      error: "Error loading report",
      summary: "Report Summary",
      farms: "Farms",
      fields: "Fields",
      totalArea: "Total Area",
      period: "Period",
      generatedAt: "Generated At",
      overallHealth: "Overall Health",
      keyMetrics: "Key Metrics",
      soilHealth: "Soil Health",
      cropHealth: "Crop Health",
      waterEfficiency: "Water Efficiency",
      yieldProjection: "Yield Projection",
      recommendations: "Recommendations",
      immediate: "Immediate",
      shortTerm: "Short Term",
      longTerm: "Long Term",
      download: "Download",
      export: "Export",
      soilAnalysis: "Soil Analysis",
      cropMonitoring: "Crop Monitoring",
      weatherImpact: "Weather Impact",
      irrigation: "Irrigation",
      ph: "pH Level",
      nutrients: "Nutrients",
      nitrogen: "Nitrogen",
      phosphorus: "Phosphorus",
      potassium: "Potassium",
      organicMatter: "Organic Matter",
      moisture: "Moisture",
      healthScore: "Health Score",
      ndvi: "NDVI",
      evi: "EVI",
      ndwi: "NDWI",
      growthStage: "Growth Stage",
      temperature: "Temperature",
      precipitation: "Precipitation",
      humidity: "Humidity",
      impactScore: "Impact Score",
      efficiency: "Efficiency",
      waterUsage: "Water Usage",
      systemType: "System Type",
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
      poor: "Poor",
      critical: "Critical"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>{t[lang].loading}</p>
        </div>
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <FileText className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          <p>{t[lang].error}</p>
          <Link href="/dashboard/reports">
            <Button className="mt-4">{t[lang].back}</Button>
          </Link>
        </div>
      </div>
    )
  }

  const reportData: ReportData = report.data

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/reports">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{report.title}</h1>
            <p className="text-muted-foreground">
              {t[lang].generatedAt}: {formatDate(report.created_at)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setLang(lang === "ar" ? "en" : "ar")}>
            {lang === "ar" ? "EN" : "ع"}
          </Button>
          <Button className="gap-2">
            <Download className="h-4 w-4" />
            {t[lang].download}
          </Button>
        </div>
      </div>

      {/* Summary */}
      <Card className="p-6">
        <h2 className="text-2xl font-semibold mb-4">{t[lang].summary}</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{reportData.summary.totalFarms}</div>
            <div className="text-sm text-muted-foreground">{t[lang].farms}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{reportData.summary.totalFields}</div>
            <div className="text-sm text-muted-foreground">{t[lang].fields}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{reportData.summary.totalArea} ha</div>
            <div className="text-sm text-muted-foreground">{t[lang].totalArea}</div>
          </div>
          <div className="text-center">
            <div className="text-sm text-muted-foreground">{t[lang].period}</div>
            <div className="text-sm font-medium">
              {formatDate(reportData.summary.period.start)} - {formatDate(reportData.summary.period.end)}
            </div>
          </div>
        </div>
      </Card>

      {/* Analytics Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <h3 className="font-semibold">{t[lang].soilHealth}</h3>
          </div>
          <div className="text-2xl font-bold">{reportData.analytics.soilHealth.averagePh.toFixed(1)}</div>
          <div className="text-sm text-muted-foreground">pH Level</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold">{t[lang].cropHealth}</h3>
          </div>
          <div className="text-2xl font-bold">{(reportData.analytics.cropPerformance.averageNdvi * 100).toFixed(1)}%</div>
          <div className="text-sm text-muted-foreground">NDVI Average</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="h-5 w-5 text-cyan-600" />
            <h3 className="font-semibold">{t[lang].waterEfficiency}</h3>
          </div>
          <div className="text-2xl font-bold">{reportData.analytics.irrigationEfficiency.averageEfficiency.toFixed(0)}%</div>
          <div className="text-sm text-muted-foreground">Irrigation Efficiency</div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="h-5 w-5 text-yellow-600" />
            <h3 className="font-semibold">{t[lang].temperature}</h3>
          </div>
          <div className="text-2xl font-bold">{reportData.analytics.weatherImpact.avgTemperature.toFixed(1)}°C</div>
          <div className="text-sm text-muted-foreground">Average Temperature</div>
        </Card>
      </div>

      {/* Farms */}
      {reportData.farms && reportData.farms.length > 0 && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">{t[lang].farms}</h2>
          <div className="space-y-4">
            {reportData.farms.map((farm: FarmReport) => (
              <div key={farm.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{farm.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {farm.location}
                    </p>
                  </div>
                  <Badge className={getHealthColor(farm.overallHealth)}>
                    {getHealthIcon(farm.overallHealth)} {t[lang][farm.overallHealth as keyof typeof t.ar]}
                  </Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-4 mb-4">
                  <div>
                    <div className="text-sm text-muted-foreground">{t[lang].soilHealth}</div>
                    <div className="flex items-center gap-2">
                      <Progress value={farm.keyMetrics.avgSoilHealth} className="flex-1" />
                      <span className="text-sm font-medium">{farm.keyMetrics.avgSoilHealth.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{t[lang].cropHealth}</div>
                    <div className="flex items-center gap-2">
                      <Progress value={farm.keyMetrics.avgCropHealth} className="flex-1" />
                      <span className="text-sm font-medium">{farm.keyMetrics.avgCropHealth.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{t[lang].waterEfficiency}</div>
                    <div className="flex items-center gap-2">
                      <Progress value={farm.keyMetrics.waterEfficiency} className="flex-1" />
                      <span className="text-sm font-medium">{farm.keyMetrics.waterEfficiency.toFixed(0)}%</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">{t[lang].yieldProjection}</div>
                    <div className="text-lg font-semibold">{farm.keyMetrics.yieldProjection.toLocaleString()} kg</div>
                  </div>
                </div>

                {/* Fields */}
                {farm.fields && farm.fields.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">{t[lang].fields}</h4>
                    <div className="grid gap-2 md:grid-cols-2">
                      {farm.fields.map((field: FieldReport) => (
                        <div key={field.id} className="border rounded p-3">
                          <div className="flex items-center justify-between mb-2">
                            <h5 className="font-medium">{field.name}</h5>
                            <Badge variant="outline">{field.cropType}</Badge>
                          </div>
                          <div className="grid gap-2 text-sm">
                            <div className="flex justify-between">
                              <span>{t[lang].area}:</span>
                              <span>{field.area} ha</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t[lang].ph}:</span>
                              <span>{field.soilAnalysis.ph.toFixed(1)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>{t[lang].ndvi}:</span>
                              <span>{field.cropMonitoring.ndvi.toFixed(3)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Analytics */}
      <ReportAnalytics reportId={report.id} lang={lang} />

      {/* Recommendations */}
      {reportData.recommendations && (
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">{t[lang].recommendations}</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {reportData.recommendations.immediate && reportData.recommendations.immediate.length > 0 && (
              <div>
                <h3 className="font-semibold text-red-600 mb-2">{t[lang].immediate}</h3>
                <ul className="space-y-1">
                  {reportData.recommendations.immediate.map((rec: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-red-500">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {reportData.recommendations.shortTerm && reportData.recommendations.shortTerm.length > 0 && (
              <div>
                <h3 className="font-semibold text-yellow-600 mb-2">{t[lang].shortTerm}</h3>
                <ul className="space-y-1">
                  {reportData.recommendations.shortTerm.map((rec: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-yellow-500">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {reportData.recommendations.longTerm && reportData.recommendations.longTerm.length > 0 && (
              <div>
                <h3 className="font-semibold text-blue-600 mb-2">{t[lang].longTerm}</h3>
                <ul className="space-y-1">
                  {reportData.recommendations.longTerm.map((rec: string, index: number) => (
                    <li key={index} className="text-sm flex items-start gap-2">
                      <span className="text-blue-500">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  )
}