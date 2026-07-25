// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import InterviewClient from "../InterviewClient";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useInterview } from "@/hooks/useInterview";
import { useRouter } from "next/navigation";

vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: vi.fn(),
}));

vi.mock("@/hooks/useInterview", () => ({
  useInterview: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: vi.fn(),
}));

vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, className }: any) => <div className={className}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("InterviewClient Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useLanguage as any).mockReturnValue({
      language: "ar",
      t: (key: string) => key,
    });
    (useRouter as any).mockReturnValue({
      push: vi.fn(),
      replace: vi.fn(),
    });
  });

  it("renders setup phase by default", () => {
    (useAuth as any).mockReturnValue({ user: { uid: "123" } });
    (useInterview as any).mockReturnValue({
      isStarted: false,
      messages: [],
      input: "",
      handleInputChange: vi.fn(),
      handleSubmit: vi.fn(),
      isLoading: false,
    });

    render(<InterviewClient />);
    expect(screen.getByText("company_name_label")).toBeDefined();
    expect(screen.getByText("start_interview")).toBeDefined();
  });

  it("renders interview phase when started", () => {
    (useAuth as any).mockReturnValue({ user: { uid: "123" } });
    (useInterview as any).mockReturnValue({
      isStarted: true,
      messages: [{ id: "1", role: "assistant", parts: [{ type: "text", text: "Hello" }] }],
      input: "",
      handleInputChange: vi.fn(),
      handleSubmit: vi.fn(),
      isLoading: false,
      stop: vi.fn(),
    });

    render(<InterviewClient />);
    expect(screen.getByText("end_interview")).toBeDefined();
    // Assuming message content is rendered
    expect(screen.getByText("Hello")).toBeDefined();
  });
});
