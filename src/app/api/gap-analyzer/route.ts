import { google, DEFAULT_MODEL } from "@/lib/ai";
import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-middleware";
import { ratelimit } from "@/lib/ratelimit";

const gapAnalyzerSchema = z.object({
  score: z.number().min(0).max(100).describe("درجة التقييم العام لأداء المرشح من 100"),
  strengths: z.array(z.string()).describe("قائمة بنقاط القوة التي أظهرها المرشح في المقابلة"),
  weaknesses: z.array(z.string()).describe("قائمة بالفجوات ونقاط الضعف التي تحتاج إلى تحسين"),
  recommendedTopics: z.array(
    z.object({
      topic: z.string().describe("اسم الموضوع التقني أو المهني المقترح"),
      reason: z.string().describe("سبب اقتراح هذا الموضوع بناءً على إجابات المرشح")
    })
  ).describe("مواضيع يجب على المرشح دراستها وتطوير نفسه فيها"),
  toneAnalysis: z.object({
    confidenceLevel: z.string().describe("مستوى الثقة (عالي، متوسط، منخفض)"),
    professionalism: z.string().describe("مدى احترافية المصطلحات (ممتاز، جيد، بحاجة لتحسين)"),
    feedback: z.string().describe("ملاحظة حول أسلوب الإجابة والتردد والتوتر إن وجد")
  }).describe("تحليل النبرة والمشاعر وثقة المرشح من خلال كلماته وسرعة إجابته"),
});

const gapAnalyzerInputSchema = z.object({
  messages: z.array(
    z.object({
      role: z.string(),
      content: z.string().optional(),
      parts: z.array(
        z.object({
          type: z.string(),
          text: z.string().optional(),
        }).passthrough()
      ).optional(),
    }).passthrough()
  ),
  duration: z.number().optional().nullable(),
  language: z.enum(["ar", "en"]).optional().default("ar"),
});

/**
 * POST /api/gap-analyzer
 * 
 * Analyzes an interview transcript using Gemini AI to provide structured feedback
 * on candidate performance, highlighting strengths and areas for improvement.
 * 
 * Request Body (JSON):
 * - messages: The interview transcript parts
 * - duration: Interview duration in seconds
 * - language: Target output language ("ar" or "en")
 * 
 * Response (JSON):
 * - score: Number between 0 and 100
 * - strengths: Array of strings highlighting strong points
 * - weaknesses: Array of strings highlighting areas for improvement
 * - recommendedTopics: Array of actionable recommendations
 * - toneAnalysis: Object containing confidence, professionalism, and feedback
 */
export async function POST(req: Request) {
  try {
    // 1. Authentication
    const { uid, error: authError } = await verifyAuth(req);
    if (authError) {
      return NextResponse.json({ error: "غير مصرح لك بالوصول (Unauthorized)" }, { status: 401 });
    }

    // 2. Rate Limiting
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const identifier = uid || ip;
    const { success } = await ratelimit.limit(identifier);
    if (!success) {
      return NextResponse.json({ error: "تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً." }, { status: 429 });
    }

    const body = await req.json();
    const parsed = gapAnalyzerInputSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: "المدخلات غير صالحة (Invalid Input)." }, { status: 400 });
    }

    const { messages, duration, language } = parsed.data;

    // تحويل الرسائل إلى نص واحد (Transcript) لتسهيل التحليل وتقليل التكلفة
    const transcript = messages
      .filter((m: { role: string }) => m.role !== "system")
      .map((m: { role: string; content?: string; parts?: { type: string; text?: string }[] }) => {
        const textPart = m.parts?.find((p: { type: string }) => p.type === 'text');
        const content = textPart ? textPart.text : m.content;
        return `${m.role === 'user' ? 'المرشح' : 'المُحاور'}: ${content}`;
      })
      .join('\n');

    const { object } = await generateObject({
      model: google(DEFAULT_MODEL),
      schema: gapAnalyzerSchema,
      prompt: `
        أنت خبير توظيف تقني ومُقيِّم مهارات ونفسي محترف.
        تم إجراء المقابلة التالية مع مرشح لوظيفة هندسة برمجيات (أو مجال تقني مشابه).
        مدة المقابلة (بالثواني): ${duration || "غير محدد"}
        قم بتحليل كامل وعميق للمقابلة واستخراج:
        1. درجة التقييم العام من 100.
        2. نقاط القوة التي أظهرها المرشح بوضوح.
        3. الفجوات ونقاط الضعف التي بحاجة لتحسين.
        4. المواضيع التي تنصح المرشح بدراستها مع ذكر السبب الدقيق.
        5. تحليل نبرة الصوت والمشاعر (Tone & Emotion Analysis) بالاعتماد على كلمات المرشح، حشو الكلام (أم، آه)، وسرعة الإجابة مقارنة بمدة المقابلة.

        يجب أن تكون إجابتك دقيقة ومبنية فقط على النص التالي:
        
        ${language === 'en' ? 'CRITICAL: Your entire JSON output (values) MUST be written in English.' : 'CRITICAL: Your entire JSON output (values) MUST be written in Arabic.'}

        نص المقابلة:
        ${transcript}
      `
    });

    return NextResponse.json(object, { status: 200 });
  } catch (error: unknown) {
    console.error("Gap analyzer error:", error);
    return NextResponse.json({ 
      error: "حدث خطأ داخلي في الخادم."
    }, { status: 500 });
  }
}
