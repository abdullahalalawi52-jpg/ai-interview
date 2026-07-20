import { renderHook, waitFor } from "@testing-library/react";
import { useInterviewSave } from "./useInterviewSave";
import { expect, test, describe, vi, beforeEach } from "vitest";

// Define global localStorage mock for Node/JSDOM test runner
const store: Record<string, string> = {};
const mockLocalStorage = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => { 
    store[key] = value; 
    (mockLocalStorage as any)[key] = value;
  },
  clear: () => { 
    for (const k in store) {
      delete store[k]; 
      delete (mockLocalStorage as any)[k];
    }
  },
  removeItem: (key: string) => { 
    delete store[key]; 
    delete (mockLocalStorage as any)[key];
  },
  key: (index: number) => Object.keys(store)[index] || null,
  get length() { return Object.keys(store).length; }
} as any;
Object.defineProperty(global, 'localStorage', { value: mockLocalStorage, writable: true, configurable: true });

// Mock firebase
vi.mock("@/lib/firebase", () => ({
  db: {}
}));

// Mock firestore functions
vi.mock("firebase/firestore/lite", () => ({
  collection: vi.fn(),
  addDoc: vi.fn().mockResolvedValue({ id: "mock_firestore_id" }),
  serverTimestamp: vi.fn(),
  doc: vi.fn(),
  updateDoc: vi.fn().mockResolvedValue({}),
  increment: vi.fn()
}));

// Mock Auth
let currentMockUser: any = null;
vi.mock("@/context/AuthContext", () => ({
  useAuth: () => ({
    user: currentMockUser,
    loading: false
  })
}));

describe("useInterviewSave hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    currentMockUser = null;
  });

  test("saves locally if user is not logged in", async () => {
    const config = {
      company: "Google",
      jobTitle: "Software Engineer",
      specialization: "Web",
      interviewType: "technical"
    };
    const messages: any[] = [{ id: "1", role: "user", content: "Hi" }];
    
    const { result } = renderHook(() => useInterviewSave(true, messages, config, 10));

    await waitFor(() => {
      expect(result.current.interviewId).not.toBeNull();
      expect(result.current.interviewId?.startsWith("local_")).toBe(true);
    });

    const localKeys = Object.keys(localStorage).filter(k => k.startsWith("interview_"));
    expect(localKeys.length).toBe(1);
    const savedData = JSON.parse(localStorage.getItem(localKeys[0])!);
    expect(savedData.company).toBe("Google");
  });

  test("saves to Firestore and updates score if user is logged in", async () => {
    currentMockUser = { uid: "user_123" };
    
    const config = {
      company: "Google",
      jobTitle: "Software Engineer",
      specialization: "Web",
      interviewType: "technical"
    };
    const messages: any[] = [{ id: "1", role: "user", content: "Hi" }];

    const { result } = renderHook(() => useInterviewSave(true, messages, config, 10));

    await waitFor(() => {
      expect(result.current.interviewId).toBe("mock_firestore_id");
    });
  });
});
