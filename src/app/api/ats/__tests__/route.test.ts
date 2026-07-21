// @vitest-environment node
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { POST } from "../route";
import { generateObject } from "ai";
import { verifyAuth } from "@/lib/auth-middleware";
import { ratelimit } from "@/lib/ratelimit";

// Mock dependencies
vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

vi.mock("@/lib/ai", () => ({
  google: vi.fn(),
  DEFAULT_MODEL: "gemini-2.0-flash",
}));

vi.mock("@/lib/auth-middleware", () => ({
  verifyAuth: vi.fn(),
}));

vi.mock("@/lib/ratelimit", () => ({
  ratelimit: {
    limit: vi.fn(),
  },
}));

vi.mock("pdf-parse", () => ({
  PDFParse: class {
    getText() { return Promise.resolve({ text: "Mocked resume content" }); }
    destroy() { return Promise.resolve(); }
  }
}));

describe("ATS API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if unauthorized", async () => {
    (verifyAuth as Mock).mockResolvedValue({ error: "Unauthorized", uid: null });

    const req = new Request("http://localhost/api/ats", { method: "POST" });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBeDefined();
  });

  it("returns 429 if rate limited", async () => {
    (verifyAuth as Mock).mockResolvedValue({ uid: "user123", error: null });
    (ratelimit.limit as Mock).mockResolvedValue({ success: false });

    const req = new Request("http://localhost/api/ats", { method: "POST" });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toBeDefined();
  });

  it("returns 400 if missing file or jobDescription", async () => {
    (verifyAuth as Mock).mockResolvedValue({ uid: "user123", error: null });
    (ratelimit.limit as Mock).mockResolvedValue({ success: true });

    const formData = new FormData();
    // Missing file and jobDescription
    const req = new Request("http://localhost/api/ats", { 
      method: "POST",
      body: formData
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it("processes file and returns AI response", async () => {
    (verifyAuth as Mock).mockResolvedValue({ uid: "user123", error: null });
    (ratelimit.limit as Mock).mockResolvedValue({ success: true });
    
    const mockOutput = {
      matchScore: 85,
      missingKeywords: ["React"],
      strengths: ["JavaScript"],
      improvementTips: ["Add React experience"]
    };

    (generateObject as Mock).mockResolvedValue({ object: mockOutput });

    const formData = new FormData();
    formData.append("jobDescription", "Frontend Developer");
    // Minimal valid PDF string
    const pdfContent = "%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj\ntrailer<</Root 1 0 R>>";
    formData.append("file", new File([pdfContent], "resume.pdf", { type: "application/pdf" }));
    
    const req = new Request("http://localhost/api/ats", { 
      method: "POST",
      body: formData
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockOutput);
  });
});
