// @vitest-environment node
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { POST } from "../route";
import { streamText } from "ai";
import { verifyAuth } from "@/lib/auth-middleware";
import { ratelimit } from "@/lib/ratelimit";

// Mock dependencies
vi.mock("ai", () => ({
  streamText: vi.fn(),
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

describe("Interview API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if unauthorized", async () => {
    (verifyAuth as Mock).mockResolvedValue({ uid: null, error: "Unauthorized" });

    const req = new Request("http://localhost/api/interview", { method: "POST" });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBeDefined();
  });

  it("returns 429 if rate limited", async () => {
    (verifyAuth as Mock).mockResolvedValue({ uid: "user123", error: null });
    (ratelimit.limit as Mock).mockResolvedValue({ success: false });

    const req = new Request("http://localhost/api/interview", { method: "POST" });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(429);
    expect(data.error).toBeDefined();
  });

  it("returns 400 if input is invalid", async () => {
    (verifyAuth as Mock).mockResolvedValue({ uid: "user123", error: null });
    (ratelimit.limit as Mock).mockResolvedValue({ success: true });

    // Missing 'messages' field
    const req = new Request("http://localhost/api/interview", { 
      method: "POST",
      body: JSON.stringify({ company: "Test" })
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it("processes valid request and returns stream response", async () => {
    (verifyAuth as Mock).mockResolvedValue({ uid: "user123", error: null });
    (ratelimit.limit as Mock).mockResolvedValue({ success: true });
    
    // Mock streamText to return an object with toUIMessageStreamResponse
    const mockStreamResponse = new Response("mock-stream");
    (streamText as Mock).mockReturnValue({
      toUIMessageStreamResponse: vi.fn().mockReturnValue(mockStreamResponse)
    });

    const req = new Request("http://localhost/api/interview", { 
      method: "POST",
      body: JSON.stringify({ 
        messages: [{ role: "user", content: "Hello" }],
        company: "Google",
        jobTitle: "SWE",
        language: "en"
      })
    });

    const response = await POST(req);
    
    expect(streamText).toHaveBeenCalled();
    expect(response).toBe(mockStreamResponse);
  });
});
