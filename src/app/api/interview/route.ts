import { google, DEFAULT_MODEL } from "@/lib/ai";
import { streamText, ModelMessage } from "ai";
import { z } from "zod";
import { verifyAuth } from "@/lib/auth-middleware";
import { ratelimit } from "@/lib/ratelimit";
import { getInterviewSystemPrompt } from "@/lib/prompts/interviewPrompt";

const messageSchema = z.object({
  role: z.enum(["user", "assistant", "system", "tool", "data"]),
  content: z.union([z.string(), z.array(z.any())]).optional(),
  parts: z.array(z.any()).optional(),
  id: z.string().optional(),
  createdAt: z.any().optional(),
}).passthrough();

const interviewSchema = z.object({
  messages: z.array(messageSchema),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  specialization: z.string().optional(),
  interviewType: z.enum(["technical", "behavioral", "mixed"]).optional(),
  language: z.enum(["ar", "en"]).optional().default("ar"),
  resumeText: z.string().optional(),
});

// Removed maxDuration as it may cause build failures on Vercel Hobby plan

/**
 * POST /api/interview
 * 
 * Interacts with the Gemini AI to conduct a conversational mock interview.
 * Keeps track of chat history to provide contextual responses.
 */
export async function POST(req: Request) {
  try {
    // 1. Authentication (Strict)
    const { uid, error: authError } = await verifyAuth(req);
    
    if (authError || !uid) {
      return new Response(JSON.stringify({ error: "Unauthorized. Authentication is required to use this feature." }), { status: 401 });
    }

    // 2. Rate Limiting
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const identifier = uid || ip;
    const { success, reset } = await ratelimit.limit(identifier);
    if (!success) {
      const retryAfter = reset ? Math.ceil((reset - Date.now()) / 1000) : 60;
      return new Response(JSON.stringify({ error: "تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً. / Rate limit exceeded. Please try again later." }), { 
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": retryAfter.toString()
        }
      });
    }

    const body = await req.json();
    const parsed = interviewSchema.safeParse(body);
    
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "المدخلات غير صالحة / Invalid Input.", details: parsed.error.format() }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const { messages, company, jobTitle, specialization, interviewType, language, resumeText } = parsed.data;

    const isBehavioral = interviewType === 'behavioral';

    const systemPrompt = getInterviewSystemPrompt(company, jobTitle, specialization, isBehavioral, language, resumeText);

    const coreMessages = messages.map((msg: z.infer<typeof messageSchema>) => {
      let textContent = typeof msg.content === 'string' ? msg.content : "";
      if (!textContent && msg.parts && Array.isArray(msg.parts)) {
        textContent = msg.parts
          .filter((p: { type?: string; text?: string }) => p && p.type === 'text')
          .map((p: { type?: string; text?: string }) => p.text || "")
          .join('\n');
      }
      return {
        role: msg.role as 'user' | 'assistant' | 'system' | 'tool',
        content: textContent,
      };
    });

    const result = streamText({
      model: google(DEFAULT_MODEL),
      system: systemPrompt,
      messages: coreMessages as ModelMessage[],
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error(">>> [POST /api/interview] Exception:", error instanceof Error ? error.message : "Unknown error");
    return new Response(JSON.stringify({ error: "حدث خطأ داخلي في الخادم / Internal Server Error." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
