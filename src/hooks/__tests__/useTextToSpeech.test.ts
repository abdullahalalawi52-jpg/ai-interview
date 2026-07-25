// @vitest-environment jsdom
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useTextToSpeech } from "../useTextToSpeech";

describe("useTextToSpeech", () => {
  let speakMock: ReturnType<typeof vi.fn>;
  let cancelMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    speakMock = vi.fn();
    cancelMock = vi.fn();

    // Mock window.speechSynthesis
    Object.defineProperty(window, "speechSynthesis", {
      value: {
        speak: speakMock,
        cancel: cancelMock,
      },
      writable: true,
    });

    // Mock SpeechSynthesisUtterance
    class MockUtterance {
      text = "";
      lang = "";
      onend: (() => void) | null = null;
      onerror: (() => void) | null = null;
    }
    Object.defineProperty(window, "SpeechSynthesisUtterance", {
      value: MockUtterance,
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("does not speak if there are no messages", () => {
    renderHook(() => useTextToSpeech([], false, "en"));
    expect(speakMock).not.toHaveBeenCalled();
  });

  it("does not speak if last message is from user", () => {
    const messages = [{ id: "1", role: "user" as const, parts: [{ type: "text" as const, text: "Hello" }] }];
    renderHook(() => useTextToSpeech(messages, false, "en"));
    expect(speakMock).not.toHaveBeenCalled();
  });

  it("speaks complete sentences from assistant message", () => {
    const messages = [{ 
      id: "2", 
      role: "assistant" as const, 
      parts: [{ type: "text" as const, text: "Hello there. How are you?" }] 
    }];
    
    renderHook(() => useTextToSpeech(messages, false, "en"));
    
    // Should enqueue and speak sentences
    expect(speakMock).toHaveBeenCalled();
  });

  it("speaks remaining text when loading finishes", () => {
    const messages = [{ 
      id: "3", 
      role: "assistant" as const, 
      parts: [{ type: "text" as const, text: "Almost done" }] 
    }];
    
    // isLoading = false, no punctuation at end
    renderHook(() => useTextToSpeech(messages, false, "en"));
    
    expect(speakMock).toHaveBeenCalled();
  });

  it("cancels previous speech when new message arrives", () => {
    const { rerender } = renderHook(
      ({ msgs }) => useTextToSpeech(msgs, false, "en"),
      {
        initialProps: {
          msgs: [{ id: "1", role: "assistant" as const, parts: [{ type: "text" as const, text: "Message 1." }] }]
        }
      }
    );

    // Initial speak
    expect(speakMock).toHaveBeenCalled();

    // Rerender with new message
    rerender({
      msgs: [
        { id: "1", role: "assistant" as const, parts: [{ type: "text" as const, text: "Message 1." }] },
        { id: "2", role: "assistant" as const, parts: [{ type: "text" as const, text: "Message 2." }] }
      ]
    });

    expect(cancelMock).toHaveBeenCalled();
  });
});
