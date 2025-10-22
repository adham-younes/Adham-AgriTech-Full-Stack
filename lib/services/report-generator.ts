import { createClient } from '@supabase/supabase-js'

export interface ReportData {
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

export interface FarmReport {
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

export interface FieldReport {
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

export interface SoilAnalysisReport {
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

export interface CropMonitoringReport {
  ndvi: number
  evi: number
  ndwi: number
  healthStatus: string
  growthStage: string
  satelliteImageUrl?: string
}

export interface IrrigationReport {
  type: string
  efficiency: number
  waterUsage: number
  recommendations: string[]
}

export interface WeatherImpactReport {
  avgTemperature: number
  totalPrecipitation: number
  humidity: number
  impactScore: number
  recommendations: string[]
}

export interface SoilAnalytics {
  averagePh: number
  nutrientLevels: {
    nitrogen: { avg: number; trend: 'up' | 'down' | 'stable' }
    phosphorus: { avg: number; trend: 'up' | 'down' | 'stable' }
    potassium: { avg: number; trend: 'up' | 'down' | 'stable' }
  }
  organicMatterTrend: 'up' | 'down' | 'stable'
  healthDistribution: Record<string, number>
}

export interface CropAnalytics {
  averageNdvi: number
  healthDistribution: Record<string, number>
  growthStages: Record<string, number>
  yieldProjections: {
    optimistic: number
    realistic: number
    pessimistic: number
  }
}

export interface WeatherAnalytics {
  avgTemperature: number
  totalPrecipitation: number
  extremeWeatherEvents: number
  impactOnCrops: 'positive' | 'neutral' | 'negative'
}

export interface IrrigationAnalytics {
  averageEfficiency: number
  waterUsageTrend: 'up' | 'down' | 'stable'
  systemDistribution: Record<string, number>
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'scatter'
  title: string
  data: any[]
  xAxis?: string
  yAxis?: string
}

export class ReportGenerator {
  private supabase: any

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  async generateComprehensiveReport(
    userId: string,
    startDate: string,
    endDate: string,
    farmIds?: string[]
  ): Promise<ReportData> {
    try {
      // Fetch all data in parallel
      const [farms, fields, soilAnalyses, cropMonitoring, weatherData] = await Promise.all([
        this.getFarms(userId, farmIds),
        this.getFields(userId, farmIds),
        this.getSoilAnalyses(userId, startDate, endDate, farmIds),
        this.getCropMonitoring(userId, startDate, endDate, farmIds),
        this.getWeatherData(userId, startDate, endDate, farmIds)
      ])

      // Calculate analytics
      const analytics = this.calculateAnalytics(soilAnalyses, cropMonitoring, weatherData, fields)
      
      // Generate farm reports
      const farmReports = this.generateFarmReports(farms, fields, soilAnalyses, cropMonitoring, weatherData)
      
      // Generate recommendations
      const recommendations = this.generateRecommendations(analytics, farmReports)
      
      // Generate charts
      const charts = this.generateCharts(analytics, farmReports)

      return {
        summary: {
          totalFarms: farms.length,
          totalFields: fields.length,
          totalArea: farms.reduce((sum, farm) => sum + farm.area, 0),
          period: { start: startDate, end: endDate },
          generatedAt: new Date().toISOString()
        },
        farms: farmReports,
        analytics,
        recommendations,
        charts
      }
    } catch (error) {
      console.error('Error generating comprehensive report:', error)
      throw error
    }
  }

  async generateFarmSummaryReport(
    userId: string,
    farmId: string,
    startDate: string,
    endDate: string
  ): Promise<ReportData> {
    return this.generateComprehensiveReport(userId, startDate, endDate, [farmId])
  }

  async generateSoilAnalysisReport(
    userId: string,
    startDate: string,
    endDate: string,
    farmIds?: string[]
  ): Promise<ReportData> {
    const soilAnalyses = await this.getSoilAnalyses(userId, startDate, endDate, farmIds)
    const fields = await this.getFields(userId, farmIds)
    const farms = await this.getFarms(userId, farmIds)

    const analytics = this.calculateSoilAnalytics(soilAnalyses)
    const charts = this.generateSoilCharts(analytics, soilAnalyses)

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
        soilHealth: analytics,
        cropPerformance: {} as CropAnalytics,
        weatherImpact: {} as WeatherAnalytics,
        irrigationEfficiency: {} as IrrigationAnalytics
      },
      recommendations: this.generateSoilRecommendations(analytics),
      charts
    }
  }

  async generateCropMonitoringReport(
    userId: string,
    startDate: string,
    endDate: string,
    farmIds?: string[]
  ): Promise<ReportData> {
    const cropMonitoring = await this.getCropMonitoring(userId, startDate, endDate, farmIds)
    const fields = await this.getFields(userId, farmIds)
    const farms = await this.getFarms(userId, farmIds)

    const analytics = this.calculateCropAnalytics(cropMonitoring)
    const charts = this.generateCropCharts(analytics, cropMonitoring)

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
        soilHealth: {} as SoilAnalytics,
        cropPerformance: analytics,
        weatherImpact: {} as WeatherAnalytics,
        irrigationEfficiency: {} as IrrigationAnalytics
      },
      recommendations: this.generateCropRecommendations(analytics),
      charts
    }
  }

  private async getFarms(userId: string, farmIds?: string[]) {
    let query = this.supabase
      .from('farms')
      .select('*')
      .eq('owner_id', userId)

    if (farmIds && farmIds.length > 0) {
      query = query.in('id', farmIds)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  private async getFields(userId: string, farmIds?: string[]) {
    let query = this.supabase
      .from('fields')
      .select(`
        *,
        farms!inner(owner_id)
      `)
      .eq('farms.owner_id', userId)

    if (farmIds && farmIds.length > 0) {
      query = query.in('farm_id', farmIds)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  private async getSoilAnalyses(userId: string, startDate: string, endDate: string, farmIds?: string[]) {
    let query = this.supabase
      .from('soil_analysis')
      .select(`
        *,
        fields!inner(
          *,
          farms!inner(owner_id)
        )
      `)
      .eq('fields.farms.owner_id', userId)
      .gte('analysis_date', startDate)
      .lte('analysis_date', endDate)

    if (farmIds && farmIds.length > 0) {
      query = query.in('fields.farm_id', farmIds)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  private async getCropMonitoring(userId: string, startDate: string, endDate: string, farmIds?: string[]) {
    let query = this.supabase
      .from('crop_monitoring')
      .select(`
        *,
        fields!inner(
          *,
          farms!inner(owner_id)
        )
      `)
      .eq('fields.farms.owner_id', userId)
      .gte('monitoring_date', startDate)
      .lte('monitoring_date', endDate)

    if (farmIds && farmIds.length > 0) {
      query = query.in('fields.farm_id', farmIds)
    }

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  private async getWeatherData(userId: string, startDate: string, endDate: string, farmIds?: string[]) {
    let query = this.supabase
      .from('weather_data')
      .select('*')
      .eq('farm_id', farmIds?.[0] || '')
      .gte('date', startDate)
      .lte('date', endDate)

    const { data, error } = await query
    if (error) throw error
    return data || []
  }

  private calculateAnalytics(
    soilAnalyses: any[],
    cropMonitoring: any[],
    weatherData: any[],
    fields: any[]
  ) {
    return {
      soilHealth: this.calculateSoilAnalytics(soilAnalyses),
      cropPerformance: this.calculateCropAnalytics(cropMonitoring),
      weatherImpact: this.calculateWeatherAnalytics(weatherData),
      irrigationEfficiency: this.calculateIrrigationAnalytics(fields)
    }
  }

  private calculateSoilAnalytics(soilAnalyses: any[]): SoilAnalytics {
    if (soilAnalyses.length === 0) {
      return {
        averagePh: 0,
        nutrientLevels: {
          nitrogen: { avg: 0, trend: 'stable' },
          phosphorus: { avg: 0, trend: 'stable' },
          potassium: { avg: 0, trend: 'stable' }
        },
        organicMatterTrend: 'stable',
        healthDistribution: {}
      }
    }

    const avgPh = soilAnalyses.reduce((sum, s) => sum + (s.ph_level || 0), 0) / soilAnalyses.length
    const avgNitrogen = soilAnalyses.reduce((sum, s) => sum + (s.nitrogen || 0), 0) / soilAnalyses.length
    const avgPhosphorus = soilAnalyses.reduce((sum, s) => sum + (s.phosphorus || 0), 0) / soilAnalyses.length
    const avgPotassium = soilAnalyses.reduce((sum, s) => sum + (s.potassium || 0), 0) / soilAnalyses.length

    return {
      averagePh: avgPh,
      nutrientLevels: {
        nitrogen: { avg: avgNitrogen, trend: 'stable' },
        phosphorus: { avg: avgPhosphorus, trend: 'stable' },
        potassium: { avg: avgPotassium, trend: 'stable' }
      },
      organicMatterTrend: 'stable',
      healthDistribution: this.calculateHealthDistribution(soilAnalyses, 'soil')
    }
  }

  private calculateCropAnalytics(cropMonitoring: any[]): CropAnalytics {
    if (cropMonitoring.length === 0) {
      return {
        averageNdvi: 0,
        healthDistribution: {},
        growthStages: {},
        yieldProjections: { optimistic: 0, realistic: 0, pessimistic: 0 }
      }
    }

    const avgNdvi = cropMonitoring.reduce((sum, c) => sum + (c.ndvi_value || 0), 0) / cropMonitoring.length

    return {
      averageNdvi: avgNdvi,
      healthDistribution: this.calculateHealthDistribution(cropMonitoring, 'crop'),
      growthStages: this.calculateGrowthStages(cropMonitoring),
      yieldProjections: this.calculateYieldProjections(avgNdvi)
    }
  }

  private calculateWeatherAnalytics(weatherData: any[]): WeatherAnalytics {
    if (weatherData.length === 0) {
      return {
        avgTemperature: 0,
        totalPrecipitation: 0,
        extremeWeatherEvents: 0,
        impactOnCrops: 'neutral'
      }
    }

    const avgTemp = weatherData.reduce((sum, w) => sum + (w.temperature || 0), 0) / weatherData.length
    const totalPrecip = weatherData.reduce((sum, w) => sum + (w.precipitation || 0), 0)
    const extremeEvents = weatherData.filter(w => 
      w.temperature > 35 || w.temperature < 5 || w.precipitation > 50
    ).length

    return {
      avgTemperature: avgTemp,
      totalPrecipitation: totalPrecip,
      extremeWeatherEvents: extremeEvents,
      impactOnCrops: this.assessWeatherImpact(avgTemp, totalPrecip, extremeEvents)
    }
  }

  private calculateIrrigationAnalytics(fields: any[]): IrrigationAnalytics {
    if (fields.length === 0) {
      return {
        averageEfficiency: 0,
        waterUsageTrend: 'stable',
        systemDistribution: {}
      }
    }

    const systemCounts = fields.reduce((acc, field) => {
      const type = field.irrigation_type || 'unknown'
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      averageEfficiency: 75, // Mock calculation
      waterUsageTrend: 'stable',
      systemDistribution: systemCounts
    }
  }

  private calculateHealthDistribution(data: any[], type: 'soil' | 'crop'): Record<string, number> {
    const distribution: Record<string, number> = {}
    
    data.forEach(item => {
      let status: string
      if (type === 'soil') {
        const ph = item.ph_level || 7
        if (ph >= 6.5 && ph <= 7.5) status = 'excellent'
        else if (ph >= 6.0 && ph <= 8.0) status = 'good'
        else if (ph >= 5.5 && ph <= 8.5) status = 'fair'
        else status = 'poor'
      } else {
        status = item.health_status || 'unknown'
      }
      
      distribution[status] = (distribution[status] || 0) + 1
    })

    return distribution
  }

  private calculateGrowthStages(cropMonitoring: any[]): Record<string, number> {
    const stages: Record<string, number> = {}
    
    cropMonitoring.forEach(crop => {
      const ndvi = crop.ndvi_value || 0
      let stage: string
      
      if (ndvi < 0.2) stage = 'dormant'
      else if (ndvi < 0.4) stage = 'emergence'
      else if (ndvi < 0.6) stage = 'vegetative'
      else if (ndvi < 0.8) stage = 'reproductive'
      else stage = 'maturity'
      
      stages[stage] = (stages[stage] || 0) + 1
    })

    return stages
  }

  private calculateYieldProjections(avgNdvi: number): { optimistic: number; realistic: number; pessimistic: number } {
    const baseYield = 1000 // kg/hectare base yield
    const ndviMultiplier = Math.max(0.5, Math.min(1.5, avgNdvi))
    
    return {
      optimistic: Math.round(baseYield * ndviMultiplier * 1.2),
      realistic: Math.round(baseYield * ndviMultiplier),
      pessimistic: Math.round(baseYield * ndviMultiplier * 0.8)
    }
  }

  private assessWeatherImpact(avgTemp: number, totalPrecip: number, extremeEvents: number): 'positive' | 'neutral' | 'negative' {
    if (extremeEvents > 5) return 'negative'
    if (avgTemp > 30 || totalPrecip > 200) return 'negative'
    if (avgTemp >= 15 && avgTemp <= 25 && totalPrecip >= 50 && totalPrecip <= 150) return 'positive'
    return 'neutral'
  }

  private generateFarmReports(
    farms: any[],
    fields: any[],
    soilAnalyses: any[],
    cropMonitoring: any[],
    weatherData: any[]
  ): FarmReport[] {
    return farms.map(farm => {
      const farmFields = fields.filter(field => field.farm_id === farm.id)
      const farmSoilAnalyses = soilAnalyses.filter(s => 
        farmFields.some(field => field.id === s.field_id)
      )
      const farmCropMonitoring = cropMonitoring.filter(c => 
        farmFields.some(field => field.id === c.field_id)
      )

      return {
        id: farm.id,
        name: farm.name,
        location: farm.location,
        area: farm.area,
        fields: this.generateFieldReports(farmFields, farmSoilAnalyses, farmCropMonitoring, weatherData),
        overallHealth: this.calculateOverallHealth(farmSoilAnalyses, farmCropMonitoring),
        keyMetrics: this.calculateKeyMetrics(farmSoilAnalyses, farmCropMonitoring, farmFields)
      }
    })
  }

  private generateFieldReports(
    fields: any[],
    soilAnalyses: any[],
    cropMonitoring: any[],
    weatherData: any[]
  ): FieldReport[] {
    return fields.map(field => {
      const fieldSoilAnalyses = soilAnalyses.filter(s => s.field_id === field.id)
      const fieldCropMonitoring = cropMonitoring.filter(c => c.field_id === field.id)
      const latestSoil = fieldSoilAnalyses[fieldSoilAnalyses.length - 1]
      const latestCrop = fieldCropMonitoring[fieldCropMonitoring.length - 1]

      return {
        id: field.id,
        name: field.name,
        cropType: field.crop_type || 'Unknown',
        area: field.area,
        plantingDate: field.planting_date || '',
        expectedHarvest: field.expected_harvest_date || '',
        soilAnalysis: this.generateSoilAnalysisReport(latestSoil),
        cropMonitoring: this.generateCropMonitoringReport(latestCrop),
        irrigation: this.generateIrrigationReport(field),
        weatherImpact: this.generateWeatherImpactReport(weatherData)
      }
    })
  }

  private generateSoilAnalysisReport(soilAnalysis: any): SoilAnalysisReport {
    if (!soilAnalysis) {
      return {
        ph: 0,
        nutrients: { nitrogen: 0, phosphorus: 0, potassium: 0 },
        organicMatter: 0,
        moisture: 0,
        healthScore: 0,
        recommendations: ['No soil analysis data available']
      }
    }

    const ph = soilAnalysis.ph_level || 0
    const healthScore = this.calculateSoilHealthScore(ph, soilAnalysis.organic_matter || 0)

    return {
      ph,
      nutrients: {
        nitrogen: soilAnalysis.nitrogen || 0,
        phosphorus: soilAnalysis.phosphorus || 0,
        potassium: soilAnalysis.potassium || 0
      },
      organicMatter: soilAnalysis.organic_matter || 0,
      moisture: soilAnalysis.moisture || 0,
      healthScore,
      recommendations: this.generateSoilRecommendations(soilAnalysis)
    }
  }

  private generateCropMonitoringReport(cropMonitoring: any): CropMonitoringReport {
    if (!cropMonitoring) {
      return {
        ndvi: 0,
        evi: 0,
        ndwi: 0,
        healthStatus: 'unknown',
        growthStage: 'unknown',
        satelliteImageUrl: undefined
      }
    }

    const ndvi = cropMonitoring.ndvi_value || 0
    const growthStage = this.determineGrowthStage(ndvi)

    return {
      ndvi,
      evi: cropMonitoring.evi_value || 0,
      ndwi: cropMonitoring.ndwi_value || 0,
      healthStatus: cropMonitoring.health_status || 'unknown',
      growthStage,
      satelliteImageUrl: cropMonitoring.satellite_image_url
    }
  }

  private generateIrrigationReport(field: any): IrrigationReport {
    return {
      type: field.irrigation_type || 'unknown',
      efficiency: this.calculateIrrigationEfficiency(field.irrigation_type),
      waterUsage: this.calculateWaterUsage(field.area, field.irrigation_type),
      recommendations: this.generateIrrigationRecommendations(field.irrigation_type)
    }
  }

  private generateWeatherImpactReport(weatherData: any[]): WeatherImpactReport {
    if (weatherData.length === 0) {
      return {
        avgTemperature: 0,
        totalPrecipitation: 0,
        humidity: 0,
        impactScore: 0,
        recommendations: ['No weather data available']
      }
    }

    const avgTemp = weatherData.reduce((sum, w) => sum + (w.temperature || 0), 0) / weatherData.length
    const totalPrecip = weatherData.reduce((sum, w) => sum + (w.precipitation || 0), 0)
    const avgHumidity = weatherData.reduce((sum, w) => sum + (w.humidity || 0), 0) / weatherData.length

    return {
      avgTemperature: avgTemp,
      totalPrecipitation: totalPrecip,
      humidity: avgHumidity,
      impactScore: this.calculateWeatherImpactScore(avgTemp, totalPrecip, avgHumidity),
      recommendations: this.generateWeatherRecommendations(avgTemp, totalPrecip, avgHumidity)
    }
  }

  private calculateOverallHealth(soilAnalyses: any[], cropMonitoring: any[]): 'excellent' | 'good' | 'fair' | 'poor' | 'critical' {
    const soilHealth = this.calculateAverageSoilHealth(soilAnalyses)
    const cropHealth = this.calculateAverageCropHealth(cropMonitoring)
    const overallScore = (soilHealth + cropHealth) / 2

    if (overallScore >= 80) return 'excellent'
    if (overallScore >= 60) return 'good'
    if (overallScore >= 40) return 'fair'
    if (overallScore >= 20) return 'poor'
    return 'critical'
  }

  private calculateKeyMetrics(soilAnalyses: any[], cropMonitoring: any[], fields: any[]) {
    return {
      avgSoilHealth: this.calculateAverageSoilHealth(soilAnalyses),
      avgCropHealth: this.calculateAverageCropHealth(cropMonitoring),
      waterEfficiency: this.calculateWaterEfficiency(fields),
      yieldProjection: this.calculateYieldProjection(cropMonitoring, fields)
    }
  }

  private calculateSoilHealthScore(ph: number, organicMatter: number): number {
    let score = 50 // Base score
    
    // pH scoring (optimal range 6.5-7.5)
    if (ph >= 6.5 && ph <= 7.5) score += 30
    else if (ph >= 6.0 && ph <= 8.0) score += 20
    else if (ph >= 5.5 && ph <= 8.5) score += 10
    
    // Organic matter scoring
    if (organicMatter >= 3) score += 20
    else if (organicMatter >= 2) score += 15
    else if (organicMatter >= 1) score += 10
    
    return Math.min(100, Math.max(0, score))
  }

  private determineGrowthStage(ndvi: number): string {
    if (ndvi < 0.2) return 'dormant'
    if (ndvi < 0.4) return 'emergence'
    if (ndvi < 0.6) return 'vegetative'
    if (ndvi < 0.8) return 'reproductive'
    return 'maturity'
  }

  private calculateIrrigationEfficiency(type: string): number {
    const efficiencyMap: Record<string, number> = {
      'drip': 90,
      'sprinkler': 75,
      'flood': 60,
      'manual': 50
    }
    return efficiencyMap[type] || 50
  }

  private calculateWaterUsage(area: number, type: string): number {
    const baseUsage = area * 10 // liters per hectare per day
    const typeMultiplier: Record<string, number> = {
      'drip': 0.6,
      'sprinkler': 0.8,
      'flood': 1.2,
      'manual': 1.0
    }
    return baseUsage * (typeMultiplier[type] || 1.0)
  }

  private calculateWeatherImpactScore(temp: number, precip: number, humidity: number): number {
    let score = 50
    
    // Temperature impact
    if (temp >= 15 && temp <= 25) score += 20
    else if (temp >= 10 && temp <= 30) score += 10
    else if (temp < 5 || temp > 35) score -= 20
    
    // Precipitation impact
    if (precip >= 50 && precip <= 150) score += 20
    else if (precip >= 25 && precip <= 200) score += 10
    else if (precip < 10 || precip > 300) score -= 20
    
    // Humidity impact
    if (humidity >= 40 && humidity <= 70) score += 10
    else if (humidity < 20 || humidity > 90) score -= 10
    
    return Math.min(100, Math.max(0, score))
  }

  private calculateAverageSoilHealth(soilAnalyses: any[]): number {
    if (soilAnalyses.length === 0) return 0
    
    const scores = soilAnalyses.map(s => 
      this.calculateSoilHealthScore(s.ph_level || 0, s.organic_matter || 0)
    )
    return scores.reduce((sum, score) => sum + score, 0) / scores.length
  }

  private calculateAverageCropHealth(cropMonitoring: any[]): number {
    if (cropMonitoring.length === 0) return 0
    
    const healthScores = cropMonitoring.map(c => {
      const ndvi = c.ndvi_value || 0
      if (ndvi >= 0.7) return 90
      if (ndvi >= 0.5) return 70
      if (ndvi >= 0.3) return 50
      if (ndvi >= 0.1) return 30
      return 10
    })
    
    return healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length
  }

  private calculateWaterEfficiency(fields: any[]): number {
    if (fields.length === 0) return 0
    
    const efficiencies = fields.map(field => 
      this.calculateIrrigationEfficiency(field.irrigation_type)
    )
    return efficiencies.reduce((sum, eff) => sum + eff, 0) / efficiencies.length
  }

  private calculateYieldProjection(cropMonitoring: any[], fields: any[]): number {
    if (cropMonitoring.length === 0 || fields.length === 0) return 0
    
    const avgNdvi = cropMonitoring.reduce((sum, c) => sum + (c.ndvi_value || 0), 0) / cropMonitoring.length
    const totalArea = fields.reduce((sum, f) => sum + f.area, 0)
    const baseYield = 1000 // kg/hectare
    const ndviMultiplier = Math.max(0.5, Math.min(1.5, avgNdvi))
    
    return Math.round(totalArea * baseYield * ndviMultiplier)
  }

  private generateRecommendations(analytics: any, farmReports: FarmReport[]) {
    const recommendations = {
      immediate: [] as string[],
      shortTerm: [] as string[],
      longTerm: [] as string[]
    }

    // Soil recommendations
    if (analytics.soilHealth.averagePh < 6.0) {
      recommendations.immediate.push('Apply lime to increase soil pH')
    }
    if (analytics.soilHealth.nutrientLevels.nitrogen.avg < 20) {
      recommendations.shortTerm.push('Apply nitrogen fertilizer')
    }

    // Crop recommendations
    if (analytics.cropPerformance.averageNdvi < 0.5) {
      recommendations.immediate.push('Check for pest or disease issues')
    }

    // Weather recommendations
    if (analytics.weatherImpact.impactOnCrops === 'negative') {
      recommendations.immediate.push('Implement protective measures against extreme weather')
    }

    // Irrigation recommendations
    if (analytics.irrigationEfficiency.averageEfficiency < 70) {
      recommendations.shortTerm.push('Consider upgrading irrigation system')
    }

    return recommendations
  }

  private generateSoilRecommendations(analytics: any): string[] {
    const recommendations: string[] = []
    
    if (analytics.averagePh < 6.0) {
      recommendations.push('Apply lime to increase soil pH to optimal range (6.5-7.5)')
    } else if (analytics.averagePh > 8.0) {
      recommendations.push('Apply sulfur or organic matter to lower soil pH')
    }
    
    if (analytics.nutrientLevels.nitrogen.avg < 20) {
      recommendations.push('Apply nitrogen fertilizer to improve plant growth')
    }
    
    if (analytics.nutrientLevels.phosphorus.avg < 15) {
      recommendations.push('Apply phosphorus fertilizer to enhance root development')
    }
    
    if (analytics.nutrientLevels.potassium.avg < 100) {
      recommendations.push('Apply potassium fertilizer to improve plant health')
    }
    
    return recommendations
  }

  private generateCropRecommendations(analytics: any): string[] {
    const recommendations: string[] = []
    
    if (analytics.averageNdvi < 0.3) {
      recommendations.push('Investigate potential issues: pests, diseases, or nutrient deficiencies')
    } else if (analytics.averageNdvi < 0.5) {
      recommendations.push('Monitor crop health closely and consider additional fertilization')
    }
    
    if (analytics.healthDistribution.poor > analytics.healthDistribution.good) {
      recommendations.push('Focus on improving overall crop health through better management practices')
    }
    
    return recommendations
  }

  private generateIrrigationRecommendations(type: string): string[] {
    const recommendations: string[] = []
    
    switch (type) {
      case 'manual':
        recommendations.push('Consider upgrading to automated irrigation system')
        recommendations.push('Implement soil moisture monitoring')
        break
      case 'flood':
        recommendations.push('Consider switching to drip irrigation for better efficiency')
        break
      case 'sprinkler':
        recommendations.push('Schedule irrigation during early morning to reduce evaporation')
        break
      case 'drip':
        recommendations.push('Maintain system regularly to prevent clogging')
        break
    }
    
    return recommendations
  }

  private generateWeatherRecommendations(temp: number, precip: number, humidity: number): string[] {
    const recommendations: string[] = []
    
    if (temp > 30) {
      recommendations.push('Increase irrigation frequency during hot weather')
      recommendations.push('Consider shade cloth for sensitive crops')
    }
    
    if (precip > 200) {
      recommendations.push('Improve drainage to prevent waterlogging')
      recommendations.push('Monitor for fungal diseases')
    }
    
    if (precip < 50) {
      recommendations.push('Increase irrigation to compensate for low rainfall')
    }
    
    if (humidity > 80) {
      recommendations.push('Improve air circulation to prevent fungal diseases')
    }
    
    return recommendations
  }

  private generateCharts(analytics: any, farmReports: FarmReport[]): ChartData[] {
    return [
      {
        type: 'bar',
        title: 'Soil Health Distribution',
        data: Object.entries(analytics.soilHealth.healthDistribution).map(([key, value]) => ({
          category: key,
          value: value
        })),
        xAxis: 'Health Status',
        yAxis: 'Number of Fields'
      },
      {
        type: 'line',
        title: 'Crop Health Over Time',
        data: farmReports.flatMap(farm => 
          farm.fields.map(field => ({
            farm: farm.name,
            field: field.name,
            ndvi: field.cropMonitoring.ndvi
          }))
        ),
        xAxis: 'Fields',
        yAxis: 'NDVI Value'
      },
      {
        type: 'pie',
        title: 'Irrigation System Distribution',
        data: Object.entries(analytics.irrigationEfficiency.systemDistribution).map(([key, value]) => ({
          name: key,
          value: value
        }))
      }
    ]
  }

  private generateSoilCharts(analytics: any, soilAnalyses: any[]): ChartData[] {
    return [
      {
        type: 'bar',
        title: 'Soil pH Distribution',
        data: soilAnalyses.map((s, index) => ({
          field: `Field ${index + 1}`,
          ph: s.ph_level || 0
        })),
        xAxis: 'Fields',
        yAxis: 'pH Level'
      },
      {
        type: 'scatter',
        title: 'Nutrient Levels',
        data: soilAnalyses.map(s => ({
          nitrogen: s.nitrogen || 0,
          phosphorus: s.phosphorus || 0,
          potassium: s.potassium || 0
        })),
        xAxis: 'Nitrogen',
        yAxis: 'Phosphorus'
      }
    ]
  }

  private generateCropCharts(analytics: any, cropMonitoring: any[]): ChartData[] {
    return [
      {
        type: 'line',
        title: 'NDVI Trends',
        data: cropMonitoring.map((c, index) => ({
          date: c.monitoring_date,
          ndvi: c.ndvi_value || 0
        })),
        xAxis: 'Date',
        yAxis: 'NDVI Value'
      },
      {
        type: 'bar',
        title: 'Crop Health Distribution',
        data: Object.entries(analytics.healthDistribution).map(([key, value]) => ({
          status: key,
          count: value
        })),
        xAxis: 'Health Status',
        yAxis: 'Number of Fields'
      }
    ]
  }
}