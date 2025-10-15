import { streamText } from "ai"
import { rateLimit, RateLimitConfigs } from "@/lib/middleware/rate-limit"
import { handleAPIError, APIErrors } from "@/lib/errors/api-errors"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    // Apply rate limiting
    const rateLimitResult = await rateLimit(request, RateLimitConfigs.AI_ASSISTANT)
    if (!rateLimitResult.success) {
      return Response.json(rateLimitResult.error, { status: 429 })
    }

    // Verify authentication
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return Response.json(APIErrors.Unauthorized().toJSON(), { status: 401 })
    }

    // Validate request body
    const body = await request.json()
    const { messages, language } = body

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        APIErrors.ValidationError({ messages: "Messages array is required and must not be empty" }).toJSON(),
        { status: 400 }
      )
    }

    const systemPrompt =
      language === "ar"
        ? `أنت مساعد زراعي ذكي متخصص في الزراعة المصرية. تقدم نصائح عملية ومفصلة للمزارعين حول:
- زراعة المحاصيل المختلفة (القمح، الذرة، القطن، الأرز، الخضروات، الفواكه)
- إدارة التربة والأسمدة
- أنظمة الري والمياه
- مكافحة الآفات والأمراض
- الطقس وتأثيره على المحاصيل
- أفضل الممارسات الزراعية في المناخ المصري

قدم إجابات واضحة ومفيدة باللغة العربية الفصحى البسيطة.`
        : `You are an intelligent agricultural assistant specializing in Egyptian farming. You provide practical and detailed advice to farmers about:
- Growing different crops (wheat, corn, cotton, rice, vegetables, fruits)
- Soil management and fertilizers
- Irrigation systems and water management
- Pest and disease control
- Weather and its impact on crops
- Best agricultural practices in the Egyptian climate

Provide clear and helpful answers in English.`

    const result = await streamText({
      model: "groq/llama-3.3-70b-versatile",
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    return handleAPIError(error)
  }
}
