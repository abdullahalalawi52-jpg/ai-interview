// @vitest-environment node
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { POST } from "../route";
import { generateText } from "ai";
import { verifyAuth } from "@/lib/auth-middleware";

// Mock dependencies
vi.mock("ai", () => ({
  generateText: vi.fn(),
}));

vi.mock("@/lib/ai", () => ({
  google: vi.fn(),
  DEFAULT_MODEL: "gemini-2.0-flash",
}));

vi.mock("@/lib/auth-middleware", () => ({
  verifyAuth: vi.fn(),
}));

describe("Parse CV API Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 if unauthorized", async () => {
    (verifyAuth as Mock).mockResolvedValue({ uid: null, error: "Unauthorized" });

    const req = new Request("http://localhost/api/parse-cv", { method: "POST" });
    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBeDefined();
  });

  it("returns 400 if no file is provided", async () => {
    (verifyAuth as Mock).mockResolvedValue({ uid: "user123", error: null });

    const formData = new FormData();
    const req = new Request("http://localhost/api/parse-cv", { 
      method: "POST",
      body: formData
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("No file provided");
  });

  it("returns 400 if file is not a PDF", async () => {
    (verifyAuth as Mock).mockResolvedValue({ uid: "user123", error: null });

    const formData = new FormData();
    const blob = new Blob(["test"], { type: "text/plain" });
    formData.append("file", blob, "test.txt");

    const req = new Request("http://localhost/api/parse-cv", { 
      method: "POST",
      body: formData
    });

    const response = await POST(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("File must be a PDF");
  });

  it("processes valid PDF and returns text", async () => {
    (verifyAuth as Mock).mockResolvedValue({ uid: "user123", error: null });
    
    (generateText as Mock).mockResolvedValue({ text: "Mocked CV Text" });

    const formData = new FormData();
    const blob = new Blob(["%PDF-1.4..."], { type: "application/pdf" });
    formData.append("file", blob, "resume.pdf");

    const req = new Request("http://localhost/api/parse-cv", { 
      method: "POST",
      body: formData
    });

    const response = await POST(req);
    const data = await response.json();
    
    expect(generateText).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(data.text).toBe("Mocked CV Text");
  });
});
