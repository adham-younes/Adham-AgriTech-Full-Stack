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
      userId 
    } = body

    if (!userId || !reportType || !startDate || !endDate) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    const reportGenerator = new ReportGenerator()
    let reportData

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
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const reportId = searchParams.get('reportId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      )
    }

    let query = supabase
      .from('reports')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (reportId) {
      query = query.eq('id', reportId)
    }

    const { data: reports, error } = await query

    if (error) {
      console.error('Error fetching reports:', error)
      return NextResponse.json(
        { error: 'Failed to fetch reports' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      reports: reportId ? reports[0] : reports
    })

  } catch (error) {
    console.error('Error fetching reports:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}