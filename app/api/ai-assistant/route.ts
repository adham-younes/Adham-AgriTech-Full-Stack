import { streamText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createOpenAI } from "@ai-sdk/openai"

// Rate limiting configuration
const requestCounts = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 10 // requests per minute
const RATE_WINDOW = 60 * 1000 // 1 minute in milliseconds

function checkRateLimit(clientIp: string): boolean {
  const now = Date.now()
  const clientData = requestCounts.get(clientIp)
  
  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientIp, { count: 1, resetTime: now + RATE_WINDOW })
    return true
  }
  
  if (clientData.count >= RATE_LIMIT) {
    return false
  }
  
  clientData.count++
  return true
}

export async function POST(request: Request) {
  try {
    // Extract client IP for rate limiting
    const clientIp = request.headers.get("x-forwarded-for") || 
                    request.headers.get("x-real-ip") || 
                    "unknown"
    
    // Check rate limit
    if (!checkRateLimit(clientIp)) {
      return Response.json(
        { error: "Rate limit exceeded. Please try again later." },
        { status: 429 }
      )
    }

    const { messages, language } = await request.json()

    // Validate input
    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: "Invalid request format. Messages array is required." },
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
- تحليل البيانات الزراعية والتوصيات المخصصة
- التقنيات الحديثة في الزراعة الذكية

قدم إجابات واضحة ومفيدة باللغة العربية الفصحى البسيطة. استخدم الأمثلة العملية من الزراعة المصرية.`
        : `You are an intelligent agricultural assistant specializing in Egyptian farming. You provide practical and detailed advice to farmers about:
- Growing different crops (wheat, corn, cotton, rice, vegetables, fruits)
- Soil management and fertilizers
- Irrigation systems and water management
- Pest and disease control
- Weather and its impact on crops
- Best agricultural practices in the Egyptian climate
- Agricultural data analysis and personalized recommendations
- Modern smart farming techniques

Provide clear and helpful answers in English. Use practical examples from Egyptian agriculture.`

    // Configure AI provider based on environment
    const aiProvider = process.env.AI_PROVIDER || "groq"
    let model: any

    if (aiProvider === "openai" && process.env.OPENAI_API_KEY) {
      const openaiClient = createOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      })
      model = openaiClient("gpt-4-turbo-preview")
    } else if (process.env.GROQ_API_KEY) {
      const groq = createOpenAI({
        baseURL: "https://api.groq.com/openai/v1",
        apiKey: process.env.GROQ_API_KEY,
      })
      model = groq("llama-3.3-70b-versatile")
    } else {
      // Fallback configuration
      model = "groq/llama-3.3-70b-versatile"
    }

    const result = await streamText({
      model,
      system: systemPrompt,
      messages,
      temperature: 0.7,
      maxTokens: 2000, // Increased for more detailed responses
    })

    return result.toDataStreamResponse()
  } catch (error: any) {
    console.error("[AI Assistant] Error:", error)
    
    // More specific error messages
    if (error.message?.includes("API key")) {
      return Response.json(
        { error: "AI service configuration error. Please contact support." },
        { status: 503 }
      )
    }
    
    if (error.message?.includes("rate limit")) {
      return Response.json(
        { error: "AI service rate limit reached. Please try again later." },
        { status: 429 }
      )
    }
    
    return Response.json(
      { error: "Failed to process request. Please try again." },
      { status: 500 }
    )
  }
}
