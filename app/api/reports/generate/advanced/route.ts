import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { ReportGenerator } from '@/lib/services/report-generator'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      reportType, 
      startDate, 
      endDate, 
      farmIds, 
      title,
      userId,
      options = {}
    } = body

    if (!userId || !reportType || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const reportGenerator = new ReportGenerator()
    let reportData

    // Generate comprehensive report based on type
    switch (reportType) {
      case 'comprehensive':
        reportData = await reportGenerator.generateComprehensiveReport(
          userId,
          startDate,
          endDate,
          farmIds
        )
        break
      case 'farm_summary':
        if (!farmIds || farmIds.length === 0) {
          return NextResponse.json(
            { error: 'Farm ID required for farm summary report' },
            { status: 400 }
          )
        }
        reportData = await reportGenerator.generateFarmSummaryReport(
          userId,
          farmIds[0],
          startDate,
          endDate
        )
        break
      case 'soil_analysis':
        reportData = await reportGenerator.generateSoilAnalysisReport(
          userId,
          startDate,
          endDate,
          farmIds
        )
        break
      case 'crop_monitoring':
        reportData = await reportGenerator.generateCropMonitoringReport(
          userId,
          startDate,
          endDate,
          farmIds
        )
        break
      case 'weather_analysis':
        reportData = await generateWeatherAnalysisReport(
          userId,
          startDate,
          endDate,
          farmIds
        )
        break
      case 'irrigation_efficiency':
        reportData = await generateIrrigationEfficiencyReport(
          userId,
          startDate,
          endDate,
          farmIds
        )
        break
      case 'yield_prediction':
        reportData = await generateYieldPredictionReport(
          userId,
          startDate,
          endDate,
          farmIds
        )
        break
      case 'financial_summary':
        reportData = await generateFinancialSummaryReport(
          userId,
          startDate,
          endDate,
          farmIds
        )
        break
      default:
        return NextResponse.json(
          { error: 'Invalid report type' },
          { status: 400 }
        )
    }

    // Save report to database
    const { data: report, error: saveError } = await supabase
      .from('reports')
      .insert({
        user_id: userId,
        title: title || `${reportType} Report - ${startDate} to ${endDate}`,
        report_type: reportType,
        date_from: startDate,
        date_to: endDate,
        data: reportData,
        farm_id: farmIds?.[0] || null
      })
      .select()
      .single()

    if (saveError) {
      console.error('Error saving report:', saveError)
      return NextResponse.json(
        { error: 'Failed to save report' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      report: {
        id: report.id,
        title: report.title,
        type: report.report_type,
        data: reportData,
        createdAt: report.created_at
      }
    })

  } catch (error) {
    console.error('Error generating advanced report:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Weather Analysis Report Generator
async function generateWeatherAnalysisReport(
  userId: string,
  startDate: string,
  endDate: string,
  farmIds?: string[]
) {
  const reportGenerator = new ReportGenerator()
  const weatherData = await reportGenerator['getWeatherData'](userId, startDate, endDate, farmIds)
  const farms = await reportGenerator['getFarms'](userId, farmIds)

  // Calculate weather analytics
  const analytics = {
    temperature: {
      average: weatherData.reduce((sum, w) => sum + (w.temperature || 0), 0) / weatherData.length,
      min: Math.min(...weatherData.map(w => w.temperature || 0)),
      max: Math.max(...weatherData.map(w => w.temperature || 0)),
      trend: calculateTemperatureTrend(weatherData)
    },
    precipitation: {
      total: weatherData.reduce((sum, w) => sum + (w.precipitation || 0), 0),
      average: weatherData.reduce((sum, w) => sum + (w.precipitation || 0), 0) / weatherData.length,
      daysWithRain: weatherData.filter(w => (w.precipitation || 0) > 0).length
    },
    humidity: {
      average: weatherData.reduce((sum, w) => sum + (w.humidity || 0), 0) / weatherData.length,
      trend: calculateHumidityTrend(weatherData)
    },
    extremeEvents: {
      heatWaves: weatherData.filter(w => (w.temperature || 0) > 35).length,
      coldSnaps: weatherData.filter(w => (w.temperature || 0) < 5).length,
      heavyRain: weatherData.filter(w => (w.precipitation || 0) > 50).length
    }
  }

  return {
    summary: {
      totalFarms: farms.length,
      totalFields: 0,
      totalArea: farms.reduce((sum, farm) => sum + farm.area, 0),
      period: { start: startDate, end: endDate },
      generatedAt: new Date().toISOString()
    },
    farms: [],
    analytics: {
      weatherAnalysis: analytics,
      soilHealth: {} as any,
      cropPerformance: {} as any,
      weatherImpact: {} as any,
      irrigationEfficiency: {} as any
    },
    recommendations: generateWeatherRecommendations(analytics),
    charts: generateWeatherCharts(weatherData, analytics)
  }
}

// Irrigation Efficiency Report Generator
async function generateIrrigationEfficiencyReport(
  userId: string,
  startDate: string,
  endDate: string,
  farmIds?: string[]
) {
  const reportGenerator = new ReportGenerator()
  const fields = await reportGenerator['getFields'](userId, farmIds)
  const farms = await reportGenerator['getFarms'](userId, farmIds)

  // Calculate irrigation analytics
  const systemTypes = fields.reduce((acc, field) => {
    const type = field.irrigation_type || 'unknown'
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const efficiencyScores = fields.map(field => {
    const type = field.irrigation_type || 'manual'
    const efficiencyMap: Record<string, number> = {
      'drip': 90,
      'sprinkler': 75,
      'flood': 60,
      'manual': 50
    }
    return efficiencyMap[type] || 50
  })

  const analytics = {
    averageEfficiency: efficiencyScores.reduce((sum, score) => sum + score, 0) / efficiencyScores.length,
    systemDistribution: systemTypes,
    waterUsage: {
      estimated: fields.reduce((sum, field) => {
        const baseUsage = field.area * 10 // liters per hectare per day
        const typeMultiplier: Record<string, number> = {
          'drip': 0.6,
          'sprinkler': 0.8,
          'flood': 1.2,
          'manual': 1.0
        }
        return sum + baseUsage * (typeMultiplier[field.irrigation_type] || 1.0)
      }, 0),
      efficiency: efficiencyScores.reduce((sum, score) => sum + score, 0) / efficiencyScores.length
    },
    recommendations: generateIrrigationRecommendations(systemTypes, efficiencyScores)
  }

  return {
    summary: {
      totalFarms: farms.length,
      totalFields: fields.length,
      totalArea: farms.reduce((sum, farm) => sum + farm.area, 0),
      period: { start: startDate, end: endDate },
      generatedAt: new Date().toISOString()
    },
    farms: [],
    analytics: {
      irrigationEfficiency: analytics,
      soilHealth: {} as any,
      cropPerformance: {} as any,
      weatherImpact: {} as any
    },
    recommendations: {
      immediate: analytics.recommendations.immediate || [],
      shortTerm: analytics.recommendations.shortTerm || [],
      longTerm: analytics.recommendations.longTerm || []
    },
    charts: generateIrrigationCharts(analytics)
  }
}

// Yield Prediction Report Generator
async function generateYieldPredictionReport(
  userId: string,
  startDate: string,
  endDate: string,
  farmIds?: string[]
) {
  const reportGenerator = new ReportGenerator()
  const cropMonitoring = await reportGenerator['getCropMonitoring'](userId, startDate, endDate, farmIds)
  const fields = await reportGenerator['getFields'](userId, farmIds)
  const farms = await reportGenerator['getFarms'](userId, farmIds)

  // Calculate yield predictions
  const avgNdvi = cropMonitoring.reduce((sum, c) => sum + (c.ndvi_value || 0), 0) / cropMonitoring.length
  const totalArea = fields.reduce((sum, f) => sum + f.area, 0)
  const baseYield = 1000 // kg/hectare base yield
  const ndviMultiplier = Math.max(0.5, Math.min(1.5, avgNdvi))

  const predictions = {
    optimistic: Math.round(totalArea * baseYield * ndviMultiplier * 1.2),
    realistic: Math.round(totalArea * baseYield * ndviMultiplier),
    pessimistic: Math.round(totalArea * baseYield * ndviMultiplier * 0.8),
    confidence: calculateConfidenceLevel(avgNdvi, cropMonitoring.length)
  }

  return {
    summary: {
      totalFarms: farms.length,
      totalFields: fields.length,
      totalArea: totalArea,
      period: { start: startDate, end: endDate },
      generatedAt: new Date().toISOString()
    },
    farms: [],
    analytics: {
      yieldPrediction: predictions,
      soilHealth: {} as any,
      cropPerformance: {} as any,
      weatherImpact: {} as any,
      irrigationEfficiency: {} as any
    },
    recommendations: generateYieldRecommendations(predictions, avgNdvi),
    charts: generateYieldCharts(predictions, cropMonitoring)
  }
}

// Financial Summary Report Generator
async function generateFinancialSummaryReport(
  userId: string,
  startDate: string,
  endDate: string,
  farmIds?: string[]
) {
  const reportGenerator = new ReportGenerator()
  const farms = await reportGenerator['getFarms'](userId, farmIds)
  const fields = await reportGenerator['getFields'](userId, farmIds)

  // Mock financial calculations (in real app, these would come from financial data)
  const totalArea = farms.reduce((sum, farm) => sum + farm.area, 0)
  const estimatedRevenue = totalArea * 500 // $500 per hectare
  const estimatedCosts = totalArea * 300 // $300 per hectare
  const estimatedProfit = estimatedRevenue - estimatedCosts

  const financials = {
    revenue: {
      estimated: estimatedRevenue,
      perHectare: 500,
      trend: 'stable'
    },
    costs: {
      estimated: estimatedCosts,
      perHectare: 300,
      breakdown: {
        seeds: estimatedCosts * 0.3,
        fertilizers: estimatedCosts * 0.25,
        labor: estimatedCosts * 0.2,
        equipment: estimatedCosts * 0.15,
        other: estimatedCosts * 0.1
      }
    },
    profit: {
      estimated: estimatedProfit,
      margin: (estimatedProfit / estimatedRevenue) * 100,
      trend: 'increasing'
    }
  }

  return {
    summary: {
      totalFarms: farms.length,
      totalFields: fields.length,
      totalArea: totalArea,
      period: { start: startDate, end: endDate },
      generatedAt: new Date().toISOString()
    },
    farms: [],
    analytics: {
      financialSummary: financials,
      soilHealth: {} as any,
      cropPerformance: {} as any,
      weatherImpact: {} as any,
      irrigationEfficiency: {} as any
    },
    recommendations: generateFinancialRecommendations(financials),
    charts: generateFinancialCharts(financials)
  }
}

// Helper functions
function calculateTemperatureTrend(weatherData: any[]): 'increasing' | 'decreasing' | 'stable' {
  if (weatherData.length < 2) return 'stable'
  
  const firstHalf = weatherData.slice(0, Math.floor(weatherData.length / 2))
  const secondHalf = weatherData.slice(Math.floor(weatherData.length / 2))
  
  const firstAvg = firstHalf.reduce((sum, w) => sum + (w.temperature || 0), 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, w) => sum + (w.temperature || 0), 0) / secondHalf.length
  
  const diff = secondAvg - firstAvg
  if (diff > 2) return 'increasing'
  if (diff < -2) return 'decreasing'
  return 'stable'
}

function calculateHumidityTrend(weatherData: any[]): 'increasing' | 'decreasing' | 'stable' {
  if (weatherData.length < 2) return 'stable'
  
  const firstHalf = weatherData.slice(0, Math.floor(weatherData.length / 2))
  const secondHalf = weatherData.slice(Math.floor(weatherData.length / 2))
  
  const firstAvg = firstHalf.reduce((sum, w) => sum + (w.humidity || 0), 0) / firstHalf.length
  const secondAvg = secondHalf.reduce((sum, w) => sum + (w.humidity || 0), 0) / secondHalf.length
  
  const diff = secondAvg - firstAvg
  if (diff > 5) return 'increasing'
  if (diff < -5) return 'decreasing'
  return 'stable'
}

function calculateConfidenceLevel(avgNdvi: number, dataPoints: number): number {
  let confidence = 50 // Base confidence
  
  // More data points = higher confidence
  confidence += Math.min(30, dataPoints * 2)
  
  // NDVI in optimal range = higher confidence
  if (avgNdvi >= 0.3 && avgNdvi <= 0.8) {
    confidence += 20
  }
  
  return Math.min(95, confidence)
}

function generateWeatherRecommendations(analytics: any) {
  const recommendations = {
    immediate: [] as string[],
    shortTerm: [] as string[],
    longTerm: [] as string[]
  }

  if (analytics.extremeEvents.heatWaves > 5) {
    recommendations.immediate.push('Implement heat stress mitigation measures')
  }
  
  if (analytics.extremeEvents.heavyRain > 3) {
    recommendations.immediate.push('Improve drainage systems')
  }
  
  if (analytics.temperature.trend === 'increasing') {
    recommendations.shortTerm.push('Plan for increased irrigation needs')
  }
  
  if (analytics.precipitation.total < 50) {
    recommendations.shortTerm.push('Consider drought-resistant crop varieties')
  }

  return recommendations
}

function generateIrrigationRecommendations(systemTypes: Record<string, number>, efficiencyScores: number[]) {
  const avgEfficiency = efficiencyScores.reduce((sum, score) => sum + score, 0) / efficiencyScores.length
  
  return {
    immediate: avgEfficiency < 60 ? ['Urgent: Upgrade irrigation systems'] : [],
    shortTerm: avgEfficiency < 80 ? ['Improve irrigation efficiency through better scheduling'] : [],
    longTerm: ['Consider smart irrigation technology implementation']
  }
}

function generateYieldRecommendations(predictions: any, avgNdvi: number) {
  const recommendations = {
    immediate: [] as string[],
    shortTerm: [] as string[],
    longTerm: [] as string[]
  }

  if (avgNdvi < 0.3) {
    recommendations.immediate.push('Investigate crop health issues immediately')
  }
  
  if (predictions.confidence < 70) {
    recommendations.shortTerm.push('Collect more monitoring data for better predictions')
  }
  
  if (predictions.realistic < predictions.optimistic * 0.8) {
    recommendations.longTerm.push('Optimize farming practices to reach yield potential')
  }

  return recommendations
}

function generateFinancialRecommendations(financials: any) {
  const recommendations = {
    immediate: [] as string[],
    shortTerm: [] as string[],
    longTerm: [] as string[]
  }

  if (financials.profit.margin < 20) {
    recommendations.immediate.push('Review cost structure and identify savings opportunities')
  }
  
  if (financials.costs.perHectare > 400) {
    recommendations.shortTerm.push('Optimize input usage and negotiate better prices')
  }
  
  if (financials.profit.trend === 'increasing') {
    recommendations.longTerm.push('Consider expanding operations')
  }

  return recommendations
}

function generateWeatherCharts(weatherData: any[], analytics: any) {
  return [
    {
      type: 'line',
      title: 'Temperature Trends',
      data: weatherData.map(w => ({ date: w.date, temperature: w.temperature })),
      xAxis: 'Date',
      yAxis: 'Temperature (°C)'
    },
    {
      type: 'bar',
      title: 'Precipitation by Day',
      data: weatherData.map(w => ({ date: w.date, precipitation: w.precipitation })),
      xAxis: 'Date',
      yAxis: 'Precipitation (mm)'
    }
  ]
}

function generateIrrigationCharts(analytics: any) {
  return [
    {
      type: 'pie',
      title: 'Irrigation System Distribution',
      data: Object.entries(analytics.systemDistribution).map(([key, value]) => ({
        name: key,
        value: value
      }))
    },
    {
      type: 'bar',
      title: 'Efficiency by System Type',
      data: Object.entries(analytics.systemDistribution).map(([key, value]) => ({
        system: key,
        efficiency: key === 'drip' ? 90 : key === 'sprinkler' ? 75 : key === 'flood' ? 60 : 50
      })),
      xAxis: 'System Type',
      yAxis: 'Efficiency (%)'
    }
  ]
}

function generateYieldCharts(predictions: any, cropMonitoring: any[]) {
  return [
    {
      type: 'bar',
      title: 'Yield Predictions',
      data: [
        { scenario: 'Optimistic', yield: predictions.optimistic },
        { scenario: 'Realistic', yield: predictions.realistic },
        { scenario: 'Pessimistic', yield: predictions.pessimistic }
      ],
      xAxis: 'Scenario',
      yAxis: 'Yield (kg)'
    },
    {
      type: 'line',
      title: 'NDVI Trends',
      data: cropMonitoring.map(c => ({ date: c.monitoring_date, ndvi: c.ndvi_value })),
      xAxis: 'Date',
      yAxis: 'NDVI Value'
    }
  ]
}

function generateFinancialCharts(financials: any) {
  return [
    {
      type: 'bar',
      title: 'Revenue vs Costs',
      data: [
        { category: 'Revenue', amount: financials.revenue.estimated },
        { category: 'Costs', amount: financials.costs.estimated },
        { category: 'Profit', amount: financials.profit.estimated }
      ],
      xAxis: 'Category',
      yAxis: 'Amount ($)'
    },
    {
      type: 'pie',
      title: 'Cost Breakdown',
      data: Object.entries(financials.costs.breakdown).map(([key, value]) => ({
        name: key,
        value: value
      }))
    }
  ]
}