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

describe("Gap Analyzer API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if unauthorized", async () => {
    (verifyAuth as Mock).mockResolvedValue({ uid: null, error: "Unauthorized" });

    const req = new Request("http://localhost/api/gap-analyzer", { method: "POST" });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBeDefined();
  });

  it("returns 429 if rate limited", async () => {
    (verifyAuth as Mock).mockResolvedValue({ uid: "user123", error: null });
    (ratelimit.limit as Mock).mockResolvedValue({ success: false });

    const req = new Request("http://localhost/api/gap-analyzer", { method: "POST" });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toBeDefined();
  });

  it("returns 400 if input is invalid", async () => {
    (verifyAuth as Mock).mockResolvedValue({ uid: "user123", error: null });
    (ratelimit.limit as Mock).mockResolvedValue({ success: true });

    // Missing required fields
    const req = new Request("http://localhost/api/gap-analyzer", { 
      method: "POST",
      body: JSON.stringify({ })
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it("processes valid request and returns AI analysis", async () => {
    (verifyAuth as Mock).mockResolvedValue({ uid: "user123", error: null });
    (ratelimit.limit as Mock).mockResolvedValue({ success: true });
    
    const mockOutput = {
      score: 85,
      strengths: ["Communication"],
      weaknesses: ["Technical Depth"],
      recommendedTopics: ["React Native"],
      overallFeedback: "Good job"
    };

    (generateObject as Mock).mockResolvedValue({ object: mockOutput });

    const req = new Request("http://localhost/api/gap-analyzer", { 
      method: "POST",
      body: JSON.stringify({ 
        messages: [{ role: "user", content: "Hello", duration: 10 }],
        duration: 10,
        language: "en"
      })
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockOutput);
  });
});
