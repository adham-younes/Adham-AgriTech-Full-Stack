import { generateText } from "ai"
import { soilRecommendationsSchema, validateData } from "@/lib/validation/schemas"
import { aiLimiter, checkRateLimit } from "@/lib/security/rate-limiter"

export async function POST(request: Request) {
  try {
    // Rate limiting
    const identifier = request.headers.get("x-forwarded-for") || "anonymous"
    const rateLimitResponse = await checkRateLimit(identifier, aiLimiter, 10)
    if (rateLimitResponse) return rateLimitResponse

    const body = await request.json()
    
    // Validation
    const validation = validateData(soilRecommendationsSchema, body)
    if (!validation.success) {
      return Response.json(
        { error: "Invalid request data", details: validation.errors?.format() },
        { status: 400 }
      )
    }

    const {
      ph_level,
      nitrogen_ppm,
      phosphorus_ppm,
      potassium_ppm,
      organic_matter_percent,
      moisture_percent,
      language,
    } = validation.data

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

    return Response.json({ recommendations: text })
  } catch (error) {
    console.error("[v0] Error generating recommendations:", error)
    return Response.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
