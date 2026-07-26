// @vitest-environment jsdom
import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import InterviewClient from "../InterviewClient";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useInterview } from "@/hooks/useInterview";
import { useRouter } from "next/navigation";
import type { Message } from "ai";

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
    vi.mocked(useLanguage).mockReturnValue({
      language: "ar",
      t: (key: string) => key,
    });
    vi.mocked(useRouter).mockReturnValue({
      push: vi.fn(),
      replace: vi.fn(),
    });
  });

  it("renders setup phase by default", () => {
    vi.mocked(useAuth).mockReturnValue({ user: { uid: "123" } });
    vi.mocked(useInterview).mockReturnValue({
      setupComplete: false,
      hasStarted: false,
      interviewConfig: { company: "", jobTitle: "", specialization: "", interviewType: "technical" },
      setInterviewConfig: vi.fn(),
      setSetupComplete: vi.fn(),
      messages: [],
      input: "",
      setInput: vi.fn(),
      onSubmit: vi.fn(),
      isLoading: false,
      isFinished: false,
      isListening: false,
      elapsedTime: 0,
      toggleListening: vi.fn(),
      formatTime: vi.fn(),
      startInterview: vi.fn(),
      messagesEndRef: { current: null },
      interviewId: null,
    });

    render(<InterviewClient />);
    expect(screen.getByText("interview.setup.company")).toBeDefined();
    expect(screen.getByText("interview.setup.saveBtn")).toBeDefined();
  });

  it("renders interview phase when started", () => {
    vi.mocked(useAuth).mockReturnValue({ user: { uid: "123" } });
    vi.mocked(useInterview).mockReturnValue({
      setupComplete: true,
      hasStarted: true,
      interviewConfig: { company: "", jobTitle: "", specialization: "", interviewType: "technical" },
      setInterviewConfig: vi.fn(),
      setSetupComplete: vi.fn(),
      messages: [{ id: "1", role: "assistant", content: "", parts: [{ type: "text", text: "Hello" }] } as Message],
      input: "",
      setInput: vi.fn(),
      onSubmit: vi.fn(),
      isLoading: false,
      isFinished: true,
      isListening: false,
      elapsedTime: 0,
      toggleListening: vi.fn(),
      formatTime: vi.fn(),
      startInterview: vi.fn(),
      messagesEndRef: { current: null },
      interviewId: null,
    });

    render(<InterviewClient />);
    expect(screen.getByText("interview.status.finished")).toBeDefined();
  });
});
