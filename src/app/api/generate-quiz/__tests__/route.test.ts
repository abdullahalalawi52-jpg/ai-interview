// @vitest-environment node
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { POST } from "../route";
import { streamObject } from "ai";
import { ratelimit } from "@/lib/ratelimit";

vi.mock("ai", () => ({
  streamObject: vi.fn(),
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

describe("Generate Quiz API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 429 if rate limited", async () => {
    (ratelimit.limit as Mock).mockResolvedValue({ success: false });

    const req = new Request("http://localhost/api/generate-quiz", {
      method: "POST",
      body: JSON.stringify({ company: "Bank", jobTitle: "Accountant" }),
    });

    const response = await POST(req);
    expect(response.status).toBe(429);
  });

  it("returns 400 if missing company or jobTitle", async () => {
    (ratelimit.limit as Mock).mockResolvedValue({ success: true });

    const req = new Request("http://localhost/api/generate-quiz", {
      method: "POST",
      body: JSON.stringify({ company: "" }),
    });

    const response = await POST(req);
    expect(response.status).toBe(400);
  });

  it("calls streamObject and returns text stream response", async () => {
    (ratelimit.limit as Mock).mockResolvedValue({ success: true });
    
    const mockToTextStreamResponse = vi.fn().mockReturnValue(new Response("mock stream"));
    (streamObject as Mock).mockResolvedValue({
      toTextStreamResponse: mockToTextStreamResponse,
    });

    const req = new Request("http://localhost/api/generate-quiz", {
      method: "POST",
      body: JSON.stringify({ company: "Bank Muscat", jobTitle: "Accountant", count: 5, language: "ar" }),
    });

    const response = await POST(req);
    expect(response.status).toBe(200);
    expect(streamObject).toHaveBeenCalled();
  });
});
