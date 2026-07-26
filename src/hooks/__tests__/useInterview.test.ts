// @vitest-environment jsdom
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useInterview } from "../useInterview";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useChat } from "@ai-sdk/react";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useInterviewSave } from "@/hooks/useInterviewSave";
import { extractMessageText } from "@/utils/messageUtils";

// Mock dependencies
vi.mock("@/context/AuthContext", () => ({
  useAuth: vi.fn(),
}));

vi.mock("@/context/LanguageContext", () => ({
  useLanguage: vi.fn(),
}));

vi.mock("@ai-sdk/react", () => ({
  useChat: vi.fn(),
}));

vi.mock("@/hooks/useSpeechRecognition", () => ({
  useSpeechRecognition: vi.fn(),
}));

vi.mock("@/hooks/useTextToSpeech", () => ({
  useTextToSpeech: vi.fn(),
}));

vi.mock("@/hooks/useInterviewSave", () => ({
  useInterviewSave: vi.fn(),
}));

vi.mock("@/utils/messageUtils", () => ({
  extractMessageText: vi.fn(),
}));

describe("useInterview hook", () => {
  const mockSendMessage = vi.fn();
  const mockStopListening = vi.fn();
  const mockToggleListening = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuth).mockReturnValue({
      user: { uid: "user123", getIdToken: vi.fn().mockResolvedValue("mock-token") },
      loading: false,
      loginWithGoogle: vi.fn(),
      logout: vi.fn(),
    });

    vi.mocked(useLanguage).mockReturnValue({
      language: "en",
      setLanguage: vi.fn(),
      t: (key: string) => key,
    });

    vi.mocked(useChat).mockReturnValue({
      messages: [],
      sendMessage: mockSendMessage,
      status: "ready",
      error: undefined,
      append: vi.fn(),
      reload: vi.fn(),
      stop: vi.fn(),
      setMessages: vi.fn(),
      input: "",
      setInput: vi.fn(),
      handleInputChange: vi.fn(),
      handleSubmit: vi.fn(),
    } as any);

    vi.mocked(useSpeechRecognition).mockReturnValue({
      isListening: false,
      toggleListening: mockToggleListening,
      stopListening: mockStopListening,
      hasRecognitionSupport: true,
      error: null,
    });

    vi.mocked(useTextToSpeech).mockReturnValue(undefined);

    vi.mocked(useInterviewSave).mockReturnValue({
      interviewId: null,
    });

    vi.mocked(extractMessageText).mockReturnValue("");
  });

  it("should initialize with default state", () => {
    const { result } = renderHook(() => useInterview());

    expect(result.current.setupComplete).toBe(false);
    expect(result.current.hasStarted).toBe(false);
    expect(result.current.isFinished).toBe(false);
    expect(result.current.input).toBe("");
    expect(result.current.interviewConfig).toEqual({
      company: "",
      jobTitle: "",
      specialization: "",
      interviewType: "technical",
    });
  });

  it("should start the interview and send initial message", () => {
    const { result } = renderHook(() => useInterview());

    act(() => {
      result.current.setInterviewConfig({
        company: "Google",
        jobTitle: "Frontend",
        specialization: "React",
        interviewType: "technical",
      });
    });

    act(() => {
      result.current.startInterview();
    });

    expect(result.current.hasStarted).toBe(true);
    expect(mockSendMessage).toHaveBeenCalledWith(
      expect.objectContaining({
        text: expect.stringContaining("interview.startMessage"),
      })
    );
  });

  it("should handle form submission correctly", () => {
    const { result } = renderHook(() => useInterview());

    act(() => {
      result.current.setInput("Hello AI");
    });

    const mockEvent = {
      preventDefault: vi.fn(),
    } as unknown as React.FormEvent<HTMLFormElement>;

    act(() => {
      result.current.onSubmit(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(mockSendMessage).toHaveBeenCalledWith({ text: "Hello AI" });
    expect(result.current.input).toBe("");
  });

  it("should stop listening on form submit if currently listening", () => {
    vi.mocked(useSpeechRecognition).mockReturnValue({
      isListening: true,
      toggleListening: mockToggleListening,
      stopListening: mockStopListening,
      hasRecognitionSupport: true,
      error: null,
    });

    const { result } = renderHook(() => useInterview());

    act(() => {
      result.current.setInput("Test");
    });

    const mockEvent = { preventDefault: vi.fn() } as any;

    act(() => {
      result.current.onSubmit(mockEvent);
    });

    expect(mockStopListening).toHaveBeenCalled();
  });
});
