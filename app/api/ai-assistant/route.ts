import { streamText } from "ai"

export async function POST(request: Request) {
  try {
    const { messages, language } = await request.json()

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

    const result = streamText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("[v0] Error in AI assistant:", error)
    return Response.json({ error: "Failed to process request" }, { status: 500 })
  }
}
