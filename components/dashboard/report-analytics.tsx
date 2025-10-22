"use client"

import { useState, useEffect } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts"
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Leaf, 
  Droplets, 
  Sun,
  BarChart3,
  PieChart as PieChartIcon
} from "lucide-react"

interface ReportAnalyticsProps {
  reportId: string
  lang?: 'ar' | 'en'
}

export default function ReportAnalytics({ reportId, lang = 'en' }: ReportAnalyticsProps) {
  const [reportData, setReportData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    fetchReportData()
  }, [reportId])

  async function fetchReportData() {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .eq("id", reportId)
        .single()

      if (error) throw error
      setReportData(data)
    } catch (error) {
      console.error("Error fetching report data:", error)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

  const prepareSoilHealthData = () => {
    if (!reportData?.data?.analytics?.soilHealth?.healthDistribution) return []
    
    return Object.entries(reportData.data.analytics.soilHealth.healthDistribution).map(([key, value]) => ({
      name: key,
      value: value,
      percentage: ((value as number) / Object.values(reportData.data.analytics.soilHealth.healthDistribution).reduce((a: number, b: number) => a + b, 0) * 100).toFixed(1)
    }))
  }

  const prepareCropHealthData = () => {
    if (!reportData?.data?.analytics?.cropPerformance?.healthDistribution) return []
    
    return Object.entries(reportData.data.analytics.cropPerformance.healthDistribution).map(([key, value]) => ({
      name: key,
      value: value,
      percentage: ((value as number) / Object.values(reportData.data.analytics.cropPerformance.healthDistribution).reduce((a: number, b: number) => a + b, 0) * 100).toFixed(1)
    }))
  }

  const prepareIrrigationData = () => {
    if (!reportData?.data?.analytics?.irrigationEfficiency?.systemDistribution) return []
    
    return Object.entries(reportData.data.analytics.irrigationEfficiency.systemDistribution).map(([key, value]) => ({
      name: key,
      value: value,
      percentage: ((value as number) / Object.values(reportData.data.analytics.irrigationEfficiency.systemDistribution).reduce((a: number, b: number) => a + b, 0) * 100).toFixed(1)
    }))
  }

  const prepareFarmMetricsData = () => {
    if (!reportData?.data?.farms) return []
    
    return reportData.data.farms.map((farm: any, index: number) => ({
      name: farm.name.length > 10 ? farm.name.substring(0, 10) + '...' : farm.name,
      soilHealth: farm.keyMetrics?.avgSoilHealth || 0,
      cropHealth: farm.keyMetrics?.avgCropHealth || 0,
      waterEfficiency: farm.keyMetrics?.waterEfficiency || 0,
      yieldProjection: farm.keyMetrics?.yieldProjection || 0
    }))
  }

  const prepareWeatherData = () => {
    if (!reportData?.data?.analytics?.weatherImpact) return []
    
    // Mock weather data for demonstration
    return [
      { name: 'Mon', temperature: reportData.data.analytics.weatherImpact.avgTemperature || 20, precipitation: 5 },
      { name: 'Tue', temperature: (reportData.data.analytics.weatherImpact.avgTemperature || 20) + 2, precipitation: 0 },
      { name: 'Wed', temperature: (reportData.data.analytics.weatherImpact.avgTemperature || 20) - 1, precipitation: 10 },
      { name: 'Thu', temperature: (reportData.data.analytics.weatherImpact.avgTemperature || 20) + 3, precipitation: 2 },
      { name: 'Fri', temperature: (reportData.data.analytics.weatherImpact.avgTemperature || 20) - 2, precipitation: 8 },
      { name: 'Sat', temperature: (reportData.data.analytics.weatherImpact.avgTemperature || 20) + 1, precipitation: 3 },
      { name: 'Sun', temperature: (reportData.data.analytics.weatherImpact.avgTemperature || 20) + 2, precipitation: 0 }
    ]
  }

  const t = {
    ar: {
      title: "تحليلات التقرير",
      soilHealth: "صحة التربة",
      cropHealth: "صحة المحاصيل",
      irrigation: "أنظمة الري",
      farmMetrics: "مقاييس المزارع",
      weatherTrends: "اتجاهات الطقس",
      temperature: "درجة الحرارة",
      precipitation: "الهطول",
      efficiency: "الكفاءة",
      health: "الصحة",
      yield: "الإنتاج",
      excellent: "ممتاز",
      good: "جيد",
      fair: "متوسط",
      poor: "ضعيف",
      critical: "حرج",
      drip: "تنقيط",
      sprinkler: "رشاش",
      flood: "غمر",
      manual: "يدوي"
    },
    en: {
      title: "Report Analytics",
      soilHealth: "Soil Health",
      cropHealth: "Crop Health",
      irrigation: "Irrigation Systems",
      farmMetrics: "Farm Metrics",
      weatherTrends: "Weather Trends",
      temperature: "Temperature",
      precipitation: "Precipitation",
      efficiency: "Efficiency",
      health: "Health",
      yield: "Yield",
      excellent: "Excellent",
      good: "Good",
      fair: "Fair",
      poor: "Poor",
      critical: "Critical",
      drip: "Drip",
      sprinkler: "Sprinkler",
      flood: "Flood",
      manual: "Manual"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!reportData) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No report data available</p>
      </div>
    )
  }

  const soilHealthData = prepareSoilHealthData()
  const cropHealthData = prepareCropHealthData()
  const irrigationData = prepareIrrigationData()
  const farmMetricsData = prepareFarmMetricsData()
  const weatherData = prepareWeatherData()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t[lang].title}</h2>
        <div className="flex gap-2">
          <Button
            variant={chartType === 'bar' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('bar')}
          >
            <BarChart3 className="h-4 w-4" />
          </Button>
          <Button
            variant={chartType === 'pie' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('pie')}
          >
            <PieChartIcon className="h-4 w-4" />
          </Button>
          <Button
            variant={chartType === 'line' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setChartType('line')}
          >
            <TrendingUp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Soil Health Chart */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Leaf className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold">{t[lang].soilHealth}</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'pie' ? (
                <PieChart>
                  <Pie
                    data={soilHealthData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {soilHealthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : chartType === 'line' ? (
                <LineChart data={soilHealthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3B82F6" strokeWidth={2} />
                </LineChart>
              ) : (
                <BarChart data={soilHealthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3B82F6" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Crop Health Chart */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">{t[lang].cropHealth}</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'pie' ? (
                <PieChart>
                  <Pie
                    data={cropHealthData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {cropHealthData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : chartType === 'line' ? (
                <LineChart data={cropHealthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} />
                </LineChart>
              ) : (
                <BarChart data={cropHealthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10B981" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Irrigation Systems Chart */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Droplets className="h-5 w-5 text-cyan-600" />
            <h3 className="text-lg font-semibold">{t[lang].irrigation}</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'pie' ? (
                <PieChart>
                  <Pie
                    data={irrigationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${t[lang][name as keyof typeof t.ar] || name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {irrigationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              ) : chartType === 'line' ? (
                <LineChart data={irrigationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#06B6D4" strokeWidth={2} />
                </LineChart>
              ) : (
                <BarChart data={irrigationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#06B6D4" />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Farm Metrics Chart */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-purple-600" />
            <h3 className="text-lg font-semibold">{t[lang].farmMetrics}</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={farmMetricsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="soilHealth" stackId="a" fill="#3B82F6" name={t[lang].soilHealth} />
                <Bar dataKey="cropHealth" stackId="a" fill="#10B981" name={t[lang].cropHealth} />
                <Bar dataKey="waterEfficiency" stackId="a" fill="#06B6D4" name={t[lang].efficiency} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Weather Trends Chart */}
        <Card className="p-6 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Sun className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-semibold">{t[lang].weatherTrends}</h3>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weatherData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="temperature"
                  stackId="1"
                  stroke="#F59E0B"
                  fill="#F59E0B"
                  fillOpacity={0.3}
                  name={t[lang].temperature}
                />
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="precipitation"
                  stackId="2"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.3}
                  name={t[lang].precipitation}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Leaf className="h-4 w-4 text-green-600" />
            <span className="text-sm font-medium">{t[lang].soilHealth}</span>
          </div>
          <div className="text-2xl font-bold">
            {reportData.data?.analytics?.soilHealth?.averagePh?.toFixed(1) || 'N/A'}
          </div>
          <div className="text-xs text-muted-foreground">pH Level</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium">{t[lang].cropHealth}</span>
          </div>
          <div className="text-2xl font-bold">
            {((reportData.data?.analytics?.cropPerformance?.averageNdvi || 0) * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-muted-foreground">NDVI Average</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="h-4 w-4 text-cyan-600" />
            <span className="text-sm font-medium">{t[lang].efficiency}</span>
          </div>
          <div className="text-2xl font-bold">
            {reportData.data?.analytics?.irrigationEfficiency?.averageEfficiency?.toFixed(0) || 'N/A'}%
          </div>
          <div className="text-xs text-muted-foreground">Irrigation</div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sun className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium">{t[lang].temperature}</span>
          </div>
          <div className="text-2xl font-bold">
            {reportData.data?.analytics?.weatherImpact?.avgTemperature?.toFixed(1) || 'N/A'}°C
          </div>
          <div className="text-xs text-muted-foreground">Average</div>
        </Card>
      </div>
    </div>
  )
}