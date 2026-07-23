import { NextRequest, NextResponse } from "next/server";
import { generateText } from "ai";
import { google, DEFAULT_MODEL } from "@/lib/ai";
import { Buffer } from "buffer";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Using Gemini natively to extract text from PDF ensures no Node.js/Edge bundling issues with pdf-parse
    const { text } = await generateText({
      model: google(DEFAULT_MODEL),
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "You are an expert ATS (Applicant Tracking System). Extract and return all the raw text from this resume PDF accurately. Maintain the logical flow of information (experience, education, skills, etc.). Do not summarize, just return the text content. Do not add markdown blocks." 
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

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error parsing CV:", error);
    return NextResponse.json({ error: "Failed to parse CV: " + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
