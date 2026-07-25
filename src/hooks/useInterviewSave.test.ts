import { renderHook, waitFor } from "@testing-library/react";
import { useInterviewSave } from "./useInterviewSave";
import { expect, test, describe, vi, beforeEach } from "vitest";

// Define global localStorage mock for Node/JSDOM test runner
const store: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => { 
    store[key] = value; 
    (mockLocalStorage as Record<string, unknown>)[key] = value;
  },
  clear: () => { 
    for (const k in store) {
      delete store[k]; 
      delete (mockLocalStorage as Record<string, unknown>)[k];
    }
  },
  removeItem: (key: string) => { 
    delete store[key]; 
    delete (mockLocalStorage as Record<string, unknown>)[key];
  },
  key: (index: number) => Object.keys(store)[index] || null,
  get length() { return Object.keys(store).length; }
} as unknown as Storage;
Object.defineProperty(global, 'localStorage', { value: mockLocalStorage, writable: true, configurable: true });

// Mock firebase
vi.mock("@/lib/firebase", () => ({
  db: {}
}));

// Mock firestore functions
const mockAddDoc = vi.fn().mockResolvedValue({ id: "mock_firestore_id" });
const mockUpdateDoc = vi.fn().mockResolvedValue({});
vi.mock("firebase/firestore/lite", () => ({
  collection: vi.fn(),
  addDoc: (...args: any[]) => mockAddDoc(...args),
  serverTimestamp: vi.fn(),
  doc: vi.fn(),
  updateDoc: (...args: any[]) => mockUpdateDoc(...args),
  increment: vi.fn()
}));

// Mock Auth
let currentMockUser: { uid: string } | null = null;
let currentLoading = false;
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: currentMockUser,
    loading: currentLoading
  })
}));

describe("useInterviewSave hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    currentMockUser = null;
    currentLoading = false;
    mockAddDoc.mockResolvedValue({ id: "mock_firestore_id" });
  });

  const defaultConfig = {
    company: "Google",
    jobTitle: "Software Engineer",
    specialization: "Web",
    interviewType: "technical" as const
  };

  const defaultMessages: any[] = [
    { id: "1", role: "user", content: "Hi", parts: [{ type: 'text', text: 'Hi' }] },
    { id: "2", role: "assistant", content: "Hello", parts: [{ type: 'text', text: 'Hello' }] }
  ];

  test("does not save if not finished", () => {
    const { result } = renderHook(() => useInterviewSave(false, defaultMessages, defaultConfig, 10));
    expect(result.current.interviewId).toBeNull();
    expect(result.current.isSaving).toBe(false);
  });

  test("does not save while auth is loading", () => {
    currentLoading = true;
    const { result } = renderHook(() => useInterviewSave(true, defaultMessages, defaultConfig, 10));
    expect(result.current.interviewId).toBeNull();
  });

  test("saves locally if user is not logged in", async () => {
    const { result } = renderHook(() => useInterviewSave(true, defaultMessages, defaultConfig, 10));

    await waitFor(() => {
      expect(result.current.interviewId).not.toBeNull();
      expect(result.current.interviewId?.startsWith("local_")).toBe(true);
    });

    const localKeys = Object.keys(localStorage).filter(k => k.startsWith("interview_"));
    expect(localKeys.length).toBe(1);
    const savedData = JSON.parse(localStorage.getItem(localKeys[0])!);
    expect(savedData.company).toBe("Google");
    expect(savedData.messages.length).toBe(2);
    expect(savedData.messages[0].content).toBe("Hi");
  });

  test("saves to Firestore and updates score if user is logged in", async () => {
    currentMockUser = { uid: "user_123" };
    
    const { result } = renderHook(() => useInterviewSave(true, defaultMessages, defaultConfig, 10));

    await waitFor(() => {
      expect(result.current.interviewId).toBe("mock_firestore_id");
    });
    
    expect(mockAddDoc).toHaveBeenCalledTimes(1);
    expect(mockUpdateDoc).toHaveBeenCalledTimes(1);
  });

  test("handles Firestore save error gracefully", async () => {
    currentMockUser = { uid: "user_123" };
    mockAddDoc.mockRejectedValue(new Error("Firestore Error"));
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    const { result } = renderHook(() => useInterviewSave(true, defaultMessages, defaultConfig, 10));

    await waitFor(() => {
      expect(result.current.isSaving).toBe(false);
    });
    
    expect(result.current.interviewId).toBeNull();
    expect(consoleSpy).toHaveBeenCalledWith("Error saving interview: ", expect.any(Error));
    
    consoleSpy.mockRestore();
  });

  test("only saves once even if rerendered", async () => {
    currentMockUser = { uid: "user_123" };
    const { result, rerender } = renderHook(() => useInterviewSave(true, defaultMessages, defaultConfig, 10));

    await waitFor(() => {
      expect(result.current.interviewId).toBe("mock_firestore_id");
    });

    rerender();
    
    // Should still only be called once
    expect(mockAddDoc).toHaveBeenCalledTimes(1);
  });
});
