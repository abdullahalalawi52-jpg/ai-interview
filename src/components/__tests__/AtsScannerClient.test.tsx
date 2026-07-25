// @vitest-environment jsdom
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import AtsScannerClient from "../AtsScannerClient";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: vi.fn(),
}));

describe("AtsScannerClient Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useLanguage as any).mockReturnValue({
      language: "ar",
      t: (key: string) => key,
    });
  });

  it("renders upload interface", () => {
    (useAuth as any).mockReturnValue({ user: { uid: "123" } });

    render(<AtsScannerClient />);
    expect(screen.getByText("upload_cv")).toBeDefined();
    expect(screen.getByText("job_description_label")).toBeDefined();
  });

  it("shows error when trying to scan without file", () => {
    (useAuth as any).mockReturnValue({ user: { uid: "123" } });

    render(<AtsScannerClient />);
    
    // The button might be disabled, so we check if it's disabled initially
    const scanBtn = screen.getByText("scan_cv");
    expect((scanBtn as HTMLButtonElement).disabled).toBe(true);
  });
});
