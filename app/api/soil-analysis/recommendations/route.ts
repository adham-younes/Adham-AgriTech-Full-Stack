import { generateText } from "ai"
import { rateLimit, RateLimitConfigs } from "@/lib/middleware/rate-limit"
import { handleAPIError, APIErrors, successResponse } from "@/lib/errors/api-errors"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, RateLimitConfigs.SOIL_ANALYSIS)
    if (!rateLimitResult.success) {
      return Response.json(rateLimitResult.error, { status: 429 })
    }

    // Verify authentication
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return Response.json(APIErrors.Unauthorized().toJSON(), { status: 401 })
    }

    const body = await request.json()
    const {
      ph_level,
      nitrogen_ppm,
      phosphorus_ppm,
      potassium_ppm,
      organic_matter_percent,
      moisture_percent,
      language,
    } = body

    // Validate required fields
    if (!ph_level || !nitrogen_ppm || !phosphorus_ppm || !potassium_ppm) {
      return Response.json(
        APIErrors.ValidationError({ 
          message: "Required fields: ph_level, nitrogen_ppm, phosphorus_ppm, potassium_ppm" 
        }).toJSON(),
        { status: 400 }
      )
    }

    // Validate ranges
    if (ph_level < 0 || ph_level > 14) {
      return Response.json(
        APIErrors.InvalidInput("ph_level (must be between 0 and 14)").toJSON(),
        { status: 400 }
      )
    }

    if (nitrogen_ppm < 0 || phosphorus_ppm < 0 || potassium_ppm < 0) {
      return Response.json(
        APIErrors.InvalidInput("nutrient values (must be positive)").toJSON(),
        { status: 400 }
      )
    }

    const prompt =
      language === "ar"
        ? `أنت خبير زراعي متخصص في تحليل التربة. قم بتحليل نتائج تحليل التربة التالية وقدم توصيات عملية:

- مستوى الحموضة (pH): ${ph_level}
- النيتروجين: ${nitrogen_ppm} ppm
- الفوسفور: ${phosphorus_ppm} ppm
- البوتاسيوم: ${potassium_ppm} ppm
${organic_matter_percent ? `- المادة العضوية: ${organic_matter_percent}%` : ""}
${moisture_percent ? `- الرطوبة: ${moisture_percent}%` : ""}

قدم توصيات مفصلة حول:
1. تقييم حالة التربة الحالية
2. الأسمدة الموصى بها وكمياتها
3. التعديلات المطلوبة لتحسين التربة
4. المحاصيل المناسبة لهذه التربة
5. نصائح للري والصيانة

اجعل التوصيات عملية ومحددة للمزارعين المصريين.`
        : `You are an agricultural expert specializing in soil analysis. Analyze the following soil test results and provide practical recommendations:

- pH Level: ${ph_level}
- Nitrogen: ${nitrogen_ppm} ppm
- Phosphorus: ${phosphorus_ppm} ppm
- Potassium: ${potassium_ppm} ppm
${organic_matter_percent ? `- Organic Matter: ${organic_matter_percent}%` : ""}
${moisture_percent ? `- Moisture: ${moisture_percent}%` : ""}

Provide detailed recommendations on:
1. Current soil condition assessment
2. Recommended fertilizers and quantities
3. Required amendments to improve soil
4. Suitable crops for this soil
5. Irrigation and maintenance tips

Make the recommendations practical and specific for Egyptian farmers.`

    const { text } = await generateText({
      model: "groq/llama-3.3-70b-versatile",
      prompt,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return successResponse(
      { recommendations: text },
      "Recommendations generated successfully",
      "تم إنشاء التوصيات بنجاح"
    )
  } catch (error) {
    return handleAPIError(error)
  }
}
