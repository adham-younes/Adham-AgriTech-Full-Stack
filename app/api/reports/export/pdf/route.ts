import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { PDFReportGenerator } from '@/lib/services/pdf-generator'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { reportId, lang = 'en' } = body

    if (!reportId) {
      return NextResponse.json(
        { error: 'Report ID required' },
        { status: 400 }
      )
    }

    // Fetch report data
    const { data: report, error } = await supabase
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single()

    if (error || !report) {
      return NextResponse.json(
        { error: 'Report not found' },
        { status: 404 }
      )
    }

    // Generate PDF
    const pdfGenerator = new PDFReportGenerator()
    const pdfBlob = pdfGenerator.getPDFBlob(report.data, report.title, lang as 'ar' | 'en')

    // Convert blob to base64
    const arrayBuffer = await pdfBlob.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString('base64')

    return NextResponse.json({
      success: true,
      pdf: base64,
      filename: `${report.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}