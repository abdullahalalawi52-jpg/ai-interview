// @vitest-environment node
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { POST } from "../route";
import { generateObject } from "ai";
import { ratelimit } from "@/lib/ratelimit";

// Mock dependencies
vi.mock("ai", () => ({
  generateObject: vi.fn(),
}));

vi.mock("@/lib/ai", () => ({
  google: vi.fn(),
  DEFAULT_MODEL: "gemini-2.0-flash",
}));

vi.mock("@/lib/ratelimit", () => ({
  ratelimit: {
    limit: vi.fn(),
  },
}));

describe("LinkedIn Optimizer API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 429 if rate limited", async () => {
    (ratelimit.limit as Mock).mockResolvedValue({ success: false });

    const req = new Request("http://localhost/api/linkedin", { method: "POST" });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toBeDefined();
  });

  it("returns 400 if missing file", async () => {
    (ratelimit.limit as Mock).mockResolvedValue({ success: true });

    const formData = new FormData();
    // Missing file
    const req = new Request("http://localhost/api/linkedin", { 
      method: "POST",
      body: formData
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it("processes file and returns AI response", async () => {
    (ratelimit.limit as Mock).mockResolvedValue({ success: true });
    
    const mockOutput = {
      headline: "Senior Developer",
      about: "I am a developer",
      experience: [],
      skills: ["React"],
      recommendations: ["Get endorsed"]
    };

    (generateObject as Mock).mockResolvedValue({ object: mockOutput });

    const formData = new FormData();
    const pdfContent = "%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj\ntrailer<</Root 1 0 R>>";
    formData.append("file", new File([pdfContent], "resume.pdf", { type: "application/pdf" }));
    
    const req = new Request("http://localhost/api/linkedin", { 
      method: "POST",
      body: formData
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockOutput);
  });
});
