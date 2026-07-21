import { google, DEFAULT_MODEL } from "@/lib/ai";
import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth-middleware";
import { ratelimit } from "@/lib/ratelimit";
// Dynamic import is used inside the handler to prevent Serverless crashing on load

/**
 * POST /api/ats
 * 
 * Analyzes a resume (PDF/DOCX) against a target job description and company using Gemini AI.
 * 
 * Request Body (FormData):
 * - file: The uploaded resume file (File)
 * - jobTitle: Target job title (String)
 * - company: Target company (String)
 * - language: Target output language ("ar" or "en")
 * 
 * Response (JSON):
 * - score: ATS match score out of 100
 * - summary: Brief analysis summary
 * - pros: Array of strong matching points
 * - cons: Array of missing requirements or weaknesses
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

    // Rate Limiting done
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const jobDescription = formData.get("jobDescription") as string;
    const language = formData.get("language") as string || 'ar';

    if (!file || !jobDescription) {
      return NextResponse.json({ error: "الرجاء إرفاق السيرة الذاتية والوصف الوظيفي." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let resumeText = "";
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const pdfParse = require("pdf-parse");
      const data = await pdfParse(buffer);
      resumeText = data.text;
    } catch (e: unknown) {
      const error = e as Error;
      console.error("Error parsing PDF", error);
      // Remove stack trace
      return NextResponse.json({ error: "حدث خطأ أثناء قراءة ملف الـ PDF." }, { status: 400 });
    }

    const prompt = `
    أنت خبير توظيف ونظام ATS (Applicant Tracking System).
    قم بتحليل السيرة الذاتية التالية مقارنة بالوصف الوظيفي المعطى.

    الوصف الوظيفي (Job Description):
    ${jobDescription}

    السيرة الذاتية (Resume):
    ${resumeText}

    ${language === 'en' ? 'CRITICAL: The entire JSON output, including all lists and strings (missingKeywords, strengths, improvementTips), MUST be written in English.' : 'CRITICAL: The entire JSON output, including all lists and strings, MUST be written in Arabic.'}
    `;

    const atsSchema = z.object({
      matchScore: z.number().describe("من 0 إلى 100"),
      missingKeywords: z.array(z.string()).describe("مصفوفة بالكلمات المفتاحية الناقصة في السيرة الذاتية والموجودة في الوصف"),
      strengths: z.array(z.string()).describe("نقاط القوة الموجودة في السيرة الذاتية ومطابقة للوصف"),
      improvementTips: z.array(z.string()).describe("نصائح محددة جداً وقابلة للتطبيق لتحسين السيرة الذاتية")
    });

    try {
      const { object } = await generateObject({
        model: google(DEFAULT_MODEL),
        schema: atsSchema,
        prompt,
        temperature: 0.1,
      });

      return NextResponse.json(object);
    } catch (error) {
      console.error("Failed to generate AI JSON response", error);
      return NextResponse.json({ error: "فشل في تحليل النتيجة من الذكاء الاصطناعي." }, { status: 500 });
    }
  } catch (error: unknown) {
    const err = error as Error;
    console.error("ATS API Error:", err);
    // Remove stack trace
    return NextResponse.json({ error: "حدث خطأ داخلي في الخادم." }, { status: 500 });
  }
}
