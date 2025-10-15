import { generateText } from "ai"
import { createOpenAI } from "@ai-sdk/openai"
import { NextRequest } from "next/server"
import { withRateLimit, rateLimiters } from "@/lib/rate-limit"

async function handler(request: NextRequest) {
  try {
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

    // Validate input data
    if (
      typeof ph_level !== 'number' || ph_level < 0 || ph_level > 14 ||
      typeof nitrogen_ppm !== 'number' || nitrogen_ppm < 0 ||
      typeof phosphorus_ppm !== 'number' || phosphorus_ppm < 0 ||
      typeof potassium_ppm !== 'number' || potassium_ppm < 0
    ) {
      return Response.json(
        { error: "Invalid soil analysis data provided" },
        { status: 400 }
      )
    }

    const prompt =
      language === "ar"
        ? `أنت خبير زراعي متخصص في تحليل التربة في مصر. قم بتحليل نتائج تحليل التربة التالية وقدم توصيات عملية:

- مستوى الحموضة (pH): ${ph_level}
- النيتروجين: ${nitrogen_ppm} ppm
- الفوسفور: ${phosphorus_ppm} ppm
- البوتاسيوم: ${potassium_ppm} ppm
${organic_matter_percent ? `- المادة العضوية: ${organic_matter_percent}%` : ""}
${moisture_percent ? `- الرطوبة: ${moisture_percent}%` : ""}

قدم توصيات مفصلة حول:
1. تقييم حالة التربة الحالية (ممتازة، جيدة، متوسطة، ضعيفة)
2. الأسمدة الموصى بها وكمياتها بالكيلوجرام لكل فدان
3. التعديلات المطلوبة لتحسين التربة (الجير، الجبس، المواد العضوية)
4. المحاصيل المناسبة لهذه التربة في الموسم الحالي والقادم
5. نصائح للري والصيانة حسب نوع التربة
6. جدول زمني لإضافة الأسمدة والتعديلات

اجعل التوصيات عملية ومحددة للمزارعين المصريين مع مراعاة المناخ والظروف المحلية.`
        : `You are an agricultural expert specializing in soil analysis in Egypt. Analyze the following soil test results and provide practical recommendations:

- pH Level: ${ph_level}
- Nitrogen: ${nitrogen_ppm} ppm
- Phosphorus: ${phosphorus_ppm} ppm
- Potassium: ${potassium_ppm} ppm
${organic_matter_percent ? `- Organic Matter: ${organic_matter_percent}%` : ""}
${moisture_percent ? `- Moisture: ${moisture_percent}%` : ""}

Provide detailed recommendations on:
1. Current soil condition assessment (excellent, good, moderate, poor)
2. Recommended fertilizers and quantities in kg per feddan
3. Required amendments to improve soil (lime, gypsum, organic matter)
4. Suitable crops for this soil in current and next season
5. Irrigation and maintenance tips based on soil type
6. Timeline for applying fertilizers and amendments

Make the recommendations practical and specific for Egyptian farmers considering local climate and conditions.`

    // Configure AI provider
    let model: any
    if (process.env.OPENAI_API_KEY) {
      const openai = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
      model = openai("gpt-4-turbo-preview")
    } else if (process.env.GROQ_API_KEY) {
      const groq = createOpenAI({
        baseURL: "https://api.groq.com/openai/v1",
        apiKey: process.env.GROQ_API_KEY,
      })
      model = groq("llama-3.3-70b-versatile")
    } else {
      model = "groq/llama-3.3-70b-versatile"
    }

    const { text } = await generateText({
      model,
      prompt,
      temperature: 0.7,
      maxTokens: 1500,
    })

    // Structure the response
    const response = {
      recommendations: text,
      analysis_summary: {
        ph_status: ph_level < 6.0 ? "acidic" : ph_level > 7.5 ? "alkaline" : "neutral",
        nitrogen_status: nitrogen_ppm < 10 ? "low" : nitrogen_ppm > 25 ? "high" : "adequate",
        phosphorus_status: phosphorus_ppm < 15 ? "low" : phosphorus_ppm > 30 ? "high" : "adequate",
        potassium_status: potassium_ppm < 120 ? "low" : potassium_ppm > 280 ? "high" : "adequate",
      },
      timestamp: new Date().toISOString(),
    }

    return Response.json(response)
  } catch (error: any) {
    console.error("[Soil Analysis] Error generating recommendations:", error)
    
    if (error.message?.includes("API key")) {
      return Response.json(
        { error: "AI service configuration error" },
        { status: 503 }
      )
    }
    
    return Response.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    )
  }
}

export const POST = withRateLimit(handler, rateLimiters.ai)
