import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { useActivities } from "../useActivities";

// Mock Firebase dependencies
vi.mock("@/lib/firebase", () => ({
  db: {}
}));

vi.mock("firebase/firestore/lite", () => {
  return {
    collection: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
    getDocs: vi.fn(),
  };
});

import { getDocs } from "firebase/firestore/lite";

describe("useActivities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns empty array and no loading state when userId is not provided", async () => {
    const { result } = renderHook(() => useActivities(undefined));

    expect(result.current.loading).toBe(false);
    expect(result.current.activities).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it("fetches and merges interviews and quizzes, sorting by date", async () => {
    // Mock getDocs to return predefined data
    const mockGetDocs = getDocs as Mock;
    
    // First call for interviews, second for quizzes
    mockGetDocs.mockResolvedValueOnce({
      docs: [
        {
          id: "interview-1",
          data: () => ({ company: "Google", createdAt: { toMillis: () => 1000 } })
        }
      ]
    }).mockResolvedValueOnce({
      docs: [
        {
          id: "quiz-1",
          data: () => ({ score: 8, total: 10, createdAt: { toMillis: () => 2000 } })
        }
      ]
    });

    const { result } = renderHook(() => useActivities("user123"));

    // Initially it should be loading
    expect(result.current.loading).toBe(true);

    // Wait for the hook to finish fetching
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // It should have merged and sorted the activities (newest first, so 2000 then 1000)
    expect(result.current.activities).toHaveLength(2);
    expect(result.current.activities[0].id).toBe("quiz-1");
    expect(result.current.activities[1].id).toBe("interview-1");
    expect(result.current.error).toBeNull();
  });

  it("handles errors gracefully", async () => {
    const mockGetDocs = getDocs as Mock;
    mockGetDocs.mockRejectedValue(new Error("Firestore error"));

    const { result } = renderHook(() => useActivities("user123"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.activities).toEqual([]);
    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe("Firestore error");
  });
});
