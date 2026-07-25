import { google, DEFAULT_MODEL } from "@/lib/ai";
import { streamObject } from "ai";
import { z } from "zod";
import { ratelimit } from "@/lib/ratelimit";
import { getQuizSystemPrompt } from "@/lib/prompts/quizPrompt";

export const maxDuration = 60; // Allow up to 60 seconds for AI generation

// تعريف شكل البيانات (Schema) الذي نريده من الذكاء الاصطناعي
const questionSchema = z.object({
  questions: z.array(
    z.object({
      id: z.number(),
      category: z.string(),
      question: z.string(),
      options: z.array(z.string()),
      answer: z.number(),
    })
  ),
});

/**
 * POST /api/generate-quiz
 * 
 * Generates technical interview quiz questions based on the target job profile.
 * 
 * Request Body (JSON):
 * - company: Target company (String)
 * - jobTitle: Target job title (String)
 * - specialization: Target specialization/field (String)
 * - count: Number of questions to generate (Number)
 * - language: Target output language ("ar" or "en")
 * 
 * Response (JSON):
 * - Array of objects containing:
 *   - text: The question string
 *   - options: Array of 4 string options
 *   - answer: Index of the correct option (0-3)
 *   - explanation: Brief explanation of the correct answer
 * */
export async function POST(req: Request) {
  try {
    // 2. Rate Limiting (Using IP address since auth is optional)
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const identifier = ip;
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

    const { company, jobTitle, count = 5, language = 'ar' } = await req.json();

    if (!company || !jobTitle) {
      return new Response("Missing required fields", { status: 400 });
    }

    // طلب توليد الأسئلة من Gemini
    const result = await streamObject({
      model: google(DEFAULT_MODEL),
      schema: questionSchema,
      prompt: getQuizSystemPrompt(company, jobTitle, count, language),
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    console.error("AI Generation Error:", error instanceof Error ? error.message : "Unknown error");
    return new Response(JSON.stringify({ 
      error: "حدث خطأ داخلي في الخادم / Internal Server Error."
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
