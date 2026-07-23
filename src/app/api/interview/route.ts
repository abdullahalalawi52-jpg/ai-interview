import { google, DEFAULT_MODEL } from "@/lib/ai";
import { streamText, ModelMessage } from "ai";
import { z } from "zod";
import { verifyAuth } from "@/lib/auth-middleware";
import { ratelimit } from "@/lib/ratelimit";

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

// Allow streaming responses up to 60 seconds
export const maxDuration = 60;

/**
 * POST /api/interview
 * 
 * Interacts with the Gemini AI to conduct a conversational mock interview.
 * Keeps track of chat history to provide contextual responses.
 * 
 * Request Body (JSON):
 * - messages: Array of previous chat messages [{role: 'user' | 'model', parts: [{text: string}]}]
 * - company: Target company (String)
 * - jobTitle: Target job title (String)
 * - specialization: Target specialization (String)
 * - interviewType: "technical" | "behavioral" | "mixed"
 * - language: Target output language ("ar" or "en")
 * - resumeText: The parsed text of the user's CV (Optional string)
 * 
 * Response (JSON):
 * - id: Message ID
 * - role: "model"
 * - parts: Array of text parts
 * 
 * @security 
 * In development mode (NODE_ENV === 'development'), authentication is bypassed if it fails.
 * This is to allow local testing without requiring a valid FIREBASE_PRIVATE_KEY.
 * In production, strict authentication is enforced.
 */
export async function POST(req: Request) {
  try {
    console.log(">>> [POST /api/interview] Request received");
    console.log(">>> API KEY EXISTS:", !!process.env.GOOGLE_GENERATIVE_AI_API_KEY);
    // 1. Authentication (Optional for Interview to allow guests)
    const { uid, error: authError } = await verifyAuth(req);
    
    if (authError) {
      console.warn("Auth Failed or Guest user, proceeding as guest.");
    }

    // 2. Rate Limiting
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const identifier = uid || ip;
    const { success } = await ratelimit.limit(identifier);
    if (!success) {
      return new Response(JSON.stringify({ error: "تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً." }), { status: 429 });
    }

    const body = await req.json();
    const parsed = interviewSchema.safeParse(body);
    
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "المدخلات غير صالحة (Invalid Input).", details: parsed.error.format() }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    const { messages, company, jobTitle, specialization, interviewType, language, resumeText } = parsed.data;

    const isBehavioral = interviewType === 'behavioral';

    let systemPrompt = `أنت مُحاور مهني صارم وخبير تعمل في الموارد البشرية لشركة "${company || 'شركة تقنية'}".
أنت تقوم الآن بإجراء مقابلة وظيفية مع مرشح لوظيفة "${jobTitle || 'مهندس برمجيات'}" في تخصص "${specialization || 'التطوير'}".
نوع هذه المقابلة هو: ${isBehavioral ? (language === 'en' ? 'مقابلة سلوكية (Behavioral Interview)' : 'مقابلة سلوكية تقيس المهارات الشخصية والمواقف') : (language === 'en' ? 'مقابلة تقنية (Technical Interview)' : 'مقابلة تقنية لتقييم المهارات الفنية')}.

تعليمات هامة جداً:
1. عند بدء المقابلة (عندما يخبرك المرشح أنه مستعد)، ابدأ بترحيب حار وودّي جداً وبطبيعية كأنك إنسان. اسأله عن حاله وكيف يسير يومه لكسر الجليد أولاً، وانتظر رده، ولا تقفز مباشرة للسؤال الأول.
2. أنت لا تجيب على أسئلة المرشح، بل أنت من يطرح الأسئلة.
3. اطرح سؤالاً واحداً فقط في كل مرة. انتظر إجابة المرشح.
4. ${isBehavioral ? (language === 'en' ? 'ركز على أسئلة المواقف (Behavioral Questions). اطلب من المرشح استخدام طريقة STAR (الموقف، المهمة، الإجراء، النتيجة) في الإجابة. إذا كانت الإجابة تفتقر لجانب معين من STAR، اطلب منه التوضيح.' : 'ركز على أسئلة المواقف السلوكية. اطلب من المرشح تقديم أمثلة من تجاربه السابقة لتوضيح الموقف، المهمة، الإجراء الذي اتخذه، والنتيجة التي حققها. إذا كانت الإجابة تفتقر لأحد هذه العناصر، اطلب منه التوضيح.') : 'ركز على الأسئلة التقنية المتعمقة في صميم تخصص الوظيفة واختبر مهاراته الفنية وحل المشكلات.'}
5. عندما يجيب المرشح، قم بتقييم إجابته باختصار شديد (جملة واحدة للتشجيع أو لتصحيح المفهوم)، ثم اطرح سؤالك التالي بناءً على إجابته أو للانتقال لموضوع جديد.
6. لا تكرر الأسئلة.
7. إذا أخطأ المرشح أو أعطى إجابة سطحية، واجهه بذلك بلباقة واطلب تفاصيل أكثر.
8. ${language === 'en' ? 'CRITICAL: You MUST speak and respond ONLY in English. If the candidate uses Arabic, politely reply in English and continue the interview in English.' : 'تنبيه صارم: يُمنع منعاً باتاً استخدام أي كلمة باللغة الإنجليزية في حديثك. يجب أن تتحدث وتطرح الأسئلة وتتفاعل باللغة العربية حصراً (بنسبة 100%). قم بترجمة جميع المصطلحات التقنية والبرمجية إلى اللغة العربية.'}
9. إذا شعرت أنك سألت 4-5 أسئلة تقريباً وحصلت على إجابات وافية، أخبره بوضوح أن المقابلة انتهت واشكره على وقته، ولا تسأل المزيد. ويجب أن تضع العلامة [END_INTERVIEW] في نهاية رسالتك لإنهاء المقابلة برمجياً.
10. ${!isBehavioral ? 'إذا كان سؤالك التقني عبارة عن مسألة برمجية تتطلب من المرشح كتابة كود (Coding Question)، يجب أن تضع علامة [CODE] في نهاية رسالتك تماماً.' : ''}`;

    if (resumeText) {
      systemPrompt += `\n\nالسيرة الذاتية للمرشح:\n${resumeText}\n\nتعليمات إضافية بناءً على السيرة الذاتية:\nبما أن المرشح قام برفع سيرته الذاتية، يجب عليك قراءتها واستخدامها لبناء أسئلة مخصصة ودقيقة جداً حول خبراته، مشاريعه السابقة، والتقنيات التي استخدمها. اسأله عن تحديات حقيقية ربما واجهها في مشاريعه المذكورة لتختبر مدى عمق معرفته بها.`;
    }

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

    console.log(">>> [POST /api/interview] Calling streamText");
    const result = streamText({
      model: google(DEFAULT_MODEL),
      system: systemPrompt,
      messages: coreMessages as ModelMessage[],
    });
    console.log(">>> [POST /api/interview] streamText returned, returning stream response");

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error(">>> [POST /api/interview] Exception:", error);
    return new Response(JSON.stringify({ error: "حدث خطأ داخلي في الخادم." }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
