import { google, DEFAULT_MODEL } from "@/lib/ai";
import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-middleware";
import { ratelimit } from "@/lib/ratelimit";
import { Buffer } from "buffer";

export async function POST(req: Request) {
  try {
    const { uid, error: authError } = await verifyAuth(req);
    if (authError) {
      console.warn("Auth Failed or Guest user in LinkedIn Optimizer, proceeding as guest.");
    }

    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const identifier = uid || ip;
    const { success } = await ratelimit.limit(identifier);
    if (!success) {
      return NextResponse.json({ error: "تم تجاوز الحد المسموح من الطلبات. يرجى المحاولة لاحقاً." }, { status: 429 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const language = formData.get("language") as string || 'ar';

    if (!file) {
      return NextResponse.json({ error: "الرجاء إرفاق السيرة الذاتية." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const linkedinSchema = z.object({
      headline: z.string().describe("A professional, catchy LinkedIn headline (e.g., 'Senior Frontend Engineer | React Specialist | Building Scalable UIs')"),
      aboutSection: z.string().describe("A story-driven, engaging 'About' section for LinkedIn. Not too robotic, written in first person."),
      keywords: z.array(z.string()).describe("Top 5-10 recommended skills to add to the LinkedIn profile"),
      experienceTips: z.array(z.string()).describe("Actionable tips on how the user should format their Experience bullet points on LinkedIn based on their specific resume")
    });

    try {
      const { object } = await generateObject({
        model: google(DEFAULT_MODEL),
        schema: linkedinSchema,
        temperature: 0.3,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `You are an expert LinkedIn Profile Optimizer and Personal Branding Coach.
Read the attached resume (PDF) and generate a highly optimized LinkedIn profile for this user.

${language === 'en' ? 'CRITICAL: The entire JSON output MUST be written in English.' : 'CRITICAL: The entire JSON output MUST be written in Arabic.'}`
              },
              {
                type: "file",
                data: buffer,
                mediaType: "application/pdf"
              }
            ]
          }
        ]
      });

      return NextResponse.json(object);
    } catch (error) {
      console.error("Failed to generate AI JSON response", error);
      return NextResponse.json({ error: "فشل في تحليل السيرة الذاتية من الذكاء الاصطناعي." }, { status: 500 });
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error("LinkedIn Optimizer API Error:", err);
    return NextResponse.json({ error: "حدث خطأ داخلي في الخادم." }, { status: 500 });
  }
}
