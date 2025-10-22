import jsPDF from 'jspdf'
import 'jspdf-autotable'

export interface PDFReportData {
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
  farms: any[]
  analytics: {
    soilHealth: any
    cropPerformance: any
    weatherImpact: any
    irrigationEfficiency: any
  }
  recommendations: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
}

export class PDFReportGenerator {
  private doc: jsPDF
  private currentY: number = 20
  private pageHeight: number = 280
  private margin: number = 20

  constructor() {
    this.doc = new jsPDF()
  }

  generateReport(data: PDFReportData, title: string, lang: 'ar' | 'en' = 'en'): jsPDF {
    this.doc = new jsPDF()
    this.currentY = 20

    // Set font for Arabic support
    if (lang === 'ar') {
      this.doc.setFont('helvetica')
    }

    this.addHeader(title, data.summary.generatedAt, lang)
    this.addSummary(data.summary, lang)
    this.addAnalytics(data.analytics, lang)
    this.addFarms(data.farms, lang)
    this.addRecommendations(data.recommendations, lang)
    this.addFooter(lang)

    return this.doc
  }

  private addHeader(title: string, generatedAt: string, lang: 'ar' | 'en') {
    // Title
    this.doc.setFontSize(20)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(title, this.margin, this.currentY)
    this.currentY += 10

    // Generated date
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    const dateText = lang === 'ar' 
      ? `تم الإنشاء في: ${new Date(generatedAt).toLocaleDateString('ar-EG')}`
      : `Generated on: ${new Date(generatedAt).toLocaleDateString('en-US')}`
    this.doc.text(dateText, this.margin, this.currentY)
    this.currentY += 15

    // Line separator
    this.doc.setLineWidth(0.5)
    this.doc.line(this.margin, this.currentY, 190, this.currentY)
    this.currentY += 10
  }

  private addSummary(summary: any, lang: 'ar' | 'en') {
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    const summaryTitle = lang === 'ar' ? 'ملخص التقرير' : 'Report Summary'
    this.doc.text(summaryTitle, this.margin, this.currentY)
    this.currentY += 10

    // Summary table
    const summaryData = [
      [
        lang === 'ar' ? 'إجمالي المزارع' : 'Total Farms',
        summary.totalFarms.toString()
      ],
      [
        lang === 'ar' ? 'إجمالي الحقول' : 'Total Fields',
        summary.totalFields.toString()
      ],
      [
        lang === 'ar' ? 'المساحة الإجمالية' : 'Total Area',
        `${summary.totalArea} ha`
      ],
      [
        lang === 'ar' ? 'الفترة' : 'Period',
        `${new Date(summary.period.start).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')} - ${new Date(summary.period.end).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}`
      ]
    ]

    this.doc.autoTable({
      startY: this.currentY,
      head: [[lang === 'ar' ? 'المقياس' : 'Metric', lang === 'ar' ? 'القيمة' : 'Value']],
      body: summaryData,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: this.margin, right: this.margin }
    })

    this.currentY = (this.doc as any).lastAutoTable.finalY + 15
  }

  private addAnalytics(analytics: any, lang: 'ar' | 'en') {
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    const analyticsTitle = lang === 'ar' ? 'التحليلات' : 'Analytics'
    this.doc.text(analyticsTitle, this.margin, this.currentY)
    this.currentY += 10

    // Soil Health
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    const soilTitle = lang === 'ar' ? 'صحة التربة' : 'Soil Health'
    this.doc.text(soilTitle, this.margin, this.currentY)
    this.currentY += 8

    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    const phText = lang === 'ar' 
      ? `متوسط الأس الهيدروجيني: ${analytics.soilHealth?.averagePh?.toFixed(2) || 'N/A'}`
      : `Average pH Level: ${analytics.soilHealth?.averagePh?.toFixed(2) || 'N/A'}`
    this.doc.text(phText, this.margin + 10, this.currentY)
    this.currentY += 6

    // Crop Performance
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    const cropTitle = lang === 'ar' ? 'أداء المحاصيل' : 'Crop Performance'
    this.doc.text(cropTitle, this.margin, this.currentY)
    this.currentY += 8

    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    const ndviText = lang === 'ar'
      ? `متوسط مؤشر الغطاء النباتي: ${(analytics.cropPerformance?.averageNdvi * 100)?.toFixed(1) || 'N/A'}%`
      : `Average NDVI: ${(analytics.cropPerformance?.averageNdvi * 100)?.toFixed(1) || 'N/A'}%`
    this.doc.text(ndviText, this.margin + 10, this.currentY)
    this.currentY += 6

    // Weather Impact
    this.doc.setFontSize(12)
    this.doc.setFont('helvetica', 'bold')
    const weatherTitle = lang === 'ar' ? 'تأثير الطقس' : 'Weather Impact'
    this.doc.text(weatherTitle, this.margin, this.currentY)
    this.currentY += 8

    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    const tempText = lang === 'ar'
      ? `متوسط درجة الحرارة: ${analytics.weatherImpact?.avgTemperature?.toFixed(1) || 'N/A'}°C`
      : `Average Temperature: ${analytics.weatherImpact?.avgTemperature?.toFixed(1) || 'N/A'}°C`
    this.doc.text(tempText, this.margin + 10, this.currentY)
    this.currentY += 6

    const precipText = lang === 'ar'
      ? `إجمالي الهطول: ${analytics.weatherImpact?.totalPrecipitation?.toFixed(1) || 'N/A'} mm`
      : `Total Precipitation: ${analytics.weatherImpact?.totalPrecipitation?.toFixed(1) || 'N/A'} mm`
    this.doc.text(precipText, this.margin + 10, this.currentY)
    this.currentY += 15
  }

  private addFarms(farms: any[], lang: 'ar' | 'en') {
    if (!farms || farms.length === 0) return

    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    const farmsTitle = lang === 'ar' ? 'المزارع' : 'Farms'
    this.doc.text(farmsTitle, this.margin, this.currentY)
    this.currentY += 10

    farms.forEach((farm, index) => {
      if (this.currentY > this.pageHeight) {
        this.doc.addPage()
        this.currentY = 20
      }

      this.doc.setFontSize(12)
      this.doc.setFont('helvetica', 'bold')
      this.doc.text(`${farm.name}`, this.margin, this.currentY)
      this.currentY += 8

      this.doc.setFontSize(10)
      this.doc.setFont('helvetica', 'normal')
      
      const locationText = lang === 'ar' ? `الموقع: ${farm.location}` : `Location: ${farm.location}`
      this.doc.text(locationText, this.margin + 10, this.currentY)
      this.currentY += 6

      const areaText = lang === 'ar' ? `المساحة: ${farm.area} هكتار` : `Area: ${farm.area} hectares`
      this.doc.text(areaText, this.margin + 10, this.currentY)
      this.currentY += 6

      const healthText = lang === 'ar' ? `الصحة العامة: ${farm.overallHealth}` : `Overall Health: ${farm.overallHealth}`
      this.doc.text(healthText, this.margin + 10, this.currentY)
      this.currentY += 6

      if (farm.keyMetrics) {
        const soilHealthText = lang === 'ar' 
          ? `صحة التربة: ${farm.keyMetrics.avgSoilHealth?.toFixed(1) || 'N/A'}%`
          : `Soil Health: ${farm.keyMetrics.avgSoilHealth?.toFixed(1) || 'N/A'}%`
        this.doc.text(soilHealthText, this.margin + 10, this.currentY)
        this.currentY += 6

        const cropHealthText = lang === 'ar'
          ? `صحة المحاصيل: ${farm.keyMetrics.avgCropHealth?.toFixed(1) || 'N/A'}%`
          : `Crop Health: ${farm.keyMetrics.avgCropHealth?.toFixed(1) || 'N/A'}%`
        this.doc.text(cropHealthText, this.margin + 10, this.currentY)
        this.currentY += 6
      }

      this.currentY += 10
    })
  }

  private addRecommendations(recommendations: any, lang: 'ar' | 'en') {
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    const recTitle = lang === 'ar' ? 'التوصيات' : 'Recommendations'
    this.doc.text(recTitle, this.margin, this.currentY)
    this.currentY += 10

    // Immediate recommendations
    if (recommendations.immediate && recommendations.immediate.length > 0) {
      this.doc.setFontSize(12)
      this.doc.setFont('helvetica', 'bold')
      const immediateTitle = lang === 'ar' ? 'توصيات فورية' : 'Immediate Recommendations'
      this.doc.text(immediateTitle, this.margin, this.currentY)
      this.currentY += 8

      this.doc.setFontSize(10)
      this.doc.setFont('helvetica', 'normal')
      recommendations.immediate.forEach((rec: string) => {
        if (this.currentY > this.pageHeight) {
          this.doc.addPage()
          this.currentY = 20
        }
        this.doc.text(`• ${rec}`, this.margin + 10, this.currentY)
        this.currentY += 6
      })
      this.currentY += 5
    }

    // Short-term recommendations
    if (recommendations.shortTerm && recommendations.shortTerm.length > 0) {
      this.doc.setFontSize(12)
      this.doc.setFont('helvetica', 'bold')
      const shortTermTitle = lang === 'ar' ? 'توصيات قصيرة المدى' : 'Short-term Recommendations'
      this.doc.text(shortTermTitle, this.margin, this.currentY)
      this.currentY += 8

      this.doc.setFontSize(10)
      this.doc.setFont('helvetica', 'normal')
      recommendations.shortTerm.forEach((rec: string) => {
        if (this.currentY > this.pageHeight) {
          this.doc.addPage()
          this.currentY = 20
        }
        this.doc.text(`• ${rec}`, this.margin + 10, this.currentY)
        this.currentY += 6
      })
      this.currentY += 5
    }

    // Long-term recommendations
    if (recommendations.longTerm && recommendations.longTerm.length > 0) {
      this.doc.setFontSize(12)
      this.doc.setFont('helvetica', 'bold')
      const longTermTitle = lang === 'ar' ? 'توصيات طويلة المدى' : 'Long-term Recommendations'
      this.doc.text(longTermTitle, this.margin, this.currentY)
      this.currentY += 8

      this.doc.setFontSize(10)
      this.doc.setFont('helvetica', 'normal')
      recommendations.longTerm.forEach((rec: string) => {
        if (this.currentY > this.pageHeight) {
          this.doc.addPage()
          this.currentY = 20
        }
        this.doc.text(`• ${rec}`, this.margin + 10, this.currentY)
        this.currentY += 6
      })
    }
  }

  private addFooter(lang: 'ar' | 'en') {
    const pageCount = this.doc.getNumberOfPages()
    
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i)
      
      // Footer line
      this.doc.setLineWidth(0.5)
      this.doc.line(this.margin, 280, 190, 280)
      
      // Page number
      this.doc.setFontSize(8)
      this.doc.setFont('helvetica', 'normal')
      const pageText = lang === 'ar' ? `صفحة ${i} من ${pageCount}` : `Page ${i} of ${pageCount}`
      this.doc.text(pageText, 190 - this.doc.getTextWidth(pageText), 285)
      
      // Generated by text
      const generatedText = lang === 'ar' 
        ? 'تم إنشاؤه بواسطة نظام إدارة المزارع الذكي'
        : 'Generated by Smart Farm Management System'
      this.doc.text(generatedText, this.margin, 285)
    }
  }

  downloadPDF(data: PDFReportData, title: string, filename: string, lang: 'ar' | 'en' = 'en') {
    this.generateReport(data, title, lang)
    this.doc.save(filename)
  }

  getPDFBlob(data: PDFReportData, title: string, lang: 'ar' | 'en' = 'en'): Blob {
    this.generateReport(data, title, lang)
    return this.doc.output('blob')
  }
}