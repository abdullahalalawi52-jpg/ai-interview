import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

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
    const uint8Array = new Uint8Array(arrayBuffer);

    // Parse the PDF using the v2 API
    const pdf = new PDFParse({ data: uint8Array });
    const result = await pdf.getText();
    const text = result.text;

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error parsing CV:", error);
    return NextResponse.json({ error: "Failed to parse CV: " + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
