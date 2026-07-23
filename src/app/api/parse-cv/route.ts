import { NextRequest, NextResponse } from "next/server";


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
    // Parse the PDF
    
    // Polyfill DOMMatrix for pdf-parse (pdf.js dependency)
    if (typeof global.DOMMatrix === 'undefined') {
      // @ts-expect-error - Polyfill for older pdf.js
      global.DOMMatrix = class DOMMatrix {};
    }
    
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require("pdf-parse");
    const result = await pdfParse(Buffer.from(arrayBuffer));
    const text = result.text;

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Error parsing CV:", error);
    return NextResponse.json({ error: "Failed to parse CV: " + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}
