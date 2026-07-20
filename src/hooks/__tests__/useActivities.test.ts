import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useActivities } from '../useActivities';
import * as firestoreLite from 'firebase/firestore/lite';

// Mock Firebase and firestore/lite
vi.mock('@/lib/firebase', () => ({
  db: {}
}));

vi.mock('firebase/firestore/lite', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  getDocs: vi.fn(),
  Timestamp: {
    now: vi.fn()
  }
}));

describe('useActivities hook', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return empty activities immediately if userId is undefined', async () => {
    const { result } = renderHook(() => useActivities(undefined));
    
    expect(result.current.loading).toBe(false);
    expect(result.current.activities).toEqual([]);
    expect(result.current.error).toBeNull();
  });

  it('should fetch and merge activities successfully', async () => {
    const mockInterviews = {
      docs: [
        {
          id: 'int-1',
          data: () => ({ company: 'Google', analysis: { score: 90 }, createdAt: { toMillis: () => 2000 } })
        }
      ]
    };
    const mockQuizzes = {
      docs: [
        {
          id: 'quiz-1',
          data: () => ({ score: 8, total: 10, createdAt: { toMillis: () => 1000 } })
        }
      ]
    };

    (firestoreLite.getDocs as any).mockResolvedValueOnce(mockInterviews).mockResolvedValueOnce(mockQuizzes);

    const { result } = renderHook(() => useActivities('user123'));
    
    // Initially loading
    expect(result.current.loading).toBe(true);

    // Wait for the hook to finish fetching
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.activities).toHaveLength(2);
    expect(result.current.activities[0].type).toBe('interview');
    expect(result.current.activities[1].type).toBe('quiz');
    expect(result.current.error).toBeNull();
  });

  it('should handle errors gracefully', async () => {
    (firestoreLite.getDocs as any).mockRejectedValueOnce(new Error('Firebase Error'));

    const { result } = renderHook(() => useActivities('user123'));
    
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBeTruthy();
    expect(result.current.error?.message).toBe('Firebase Error');
    expect(result.current.activities).toEqual([]);
  });
});
