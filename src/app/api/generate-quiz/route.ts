import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { verifyAuth } from "@/lib/auth-middleware";
import { ratelimit } from "@/lib/ratelimit";

// تعريف شكل البيانات (Schema) الذي نريده من الذكاء الاصطناعي
const questionSchema = z.object({
  questions: z.array(
    z.object({
      id: z.number(),
      category: z.string(),
      question: z.string(),
      options: z.array(z.string()).length(4, "يجب أن تكون هناك 4 خيارات بالضبط"),
      answer: z.number().min(0).max(3, "الإجابة الصحيحة يجب أن تكون الفهرس (من 0 إلى 3)"),
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
 */
export async function POST(req: Request) {
  try {
    // 1. Authentication (Optional)
    const { uid } = await verifyAuth(req);

    // 2. Rate Limiting
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const identifier = uid || ip;
    const { success } = await ratelimit.limit(identifier);
    if (!success) {
      return new Response(JSON.stringify({ error: "تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً." }), { status: 429, headers: { "Content-Type": "application/json" } });
    }

    const { company, jobTitle, count = 5, language = 'ar' } = await req.json();

    if (!company || !jobTitle) {
      return new Response("Missing required fields", { status: 400 });
    }

    // طلب توليد الأسئلة من Gemini
    const { object } = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: questionSchema,
      prompt: `أنت مُحاور تقني ومهني خبير تعمل في وظيفة إجراء مقابلات وظيفية دقيقة.
      مهمتك هي كتابة ${count} أسئلة خيارات متعددة (Multiple Choice) لاختبار مرشح يتقدم لوظيفة "${jobTitle}" في شركة "${company}".
      
      شروط الأسئلة:
      1. يجب أن تكون الأسئلة احترافية، متعمقة، ومرتبطة ببيئة العمل الواقعية في شركة ${company}.
      2. يجب أن تتحدى فهم المرشح وليس فقط حفظه للمعلومات.
      3. اذكر اسم الشركة "${company}" واسم الوظيفة "${jobTitle}" بشكل طبيعي في بعض الأسئلة إن أمكن.
      4. قدم 4 خيارات لكل سؤال، واحد منها فقط صحيح.
      5. ${language === 'en' ? 'CRITICAL: The questions and all options MUST be written in English.' : 'يجب أن تكون اللغة عربية فصحى واضحة.'}
      
      تأكد من إرجاع الإجابة الصحيحة (answer) كفهرس (0، 1، 2، أو 3) يتطابق مع موقع الخيار الصحيح في مصفوفة الخيارات.`,
    });

    return new Response(JSON.stringify(object.questions), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("AI Generation Error:", error);
    return new Response(JSON.stringify({ 
      error: "حدث خطأ داخلي في الخادم."
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
