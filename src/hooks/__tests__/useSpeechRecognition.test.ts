import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSpeechRecognition } from '../useSpeechRecognition';

describe('useSpeechRecognition hook', () => {
  let MockRecognition: unknown;

  beforeEach(() => {
    class MockRecognitionClass {
      start = vi.fn();
      stop = vi.fn();
      continuous = false;
      interimResults = false;
      lang = '';
    }
    MockRecognition = MockRecognitionClass;

    (global as unknown as { window: typeof window }).window = Object.create(window);
    (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition = MockRecognition;
  });

  it('should initialize successfully', () => {
    const onTranscriptChange = vi.fn();
    const { result } = renderHook(() => useSpeechRecognition('ar', onTranscriptChange));
    
    expect(result.current.isListening).toBe(false);
  });

  it('should start listening when startListening is called', () => {
    const onTranscriptChange = vi.fn();
    const { result } = renderHook(() => useSpeechRecognition('ar', onTranscriptChange));
    
    act(() => {
      result.current.startListening();
    });

    expect(result.current.isListening).toBe(true);
  });

  it('should toggle listening state', () => {
    const onTranscriptChange = vi.fn();
    const { result } = renderHook(() => useSpeechRecognition('ar', onTranscriptChange));
    
    act(() => {
      result.current.toggleListening(); // starts
    });
    expect(result.current.isListening).toBe(true);

    act(() => {
      result.current.toggleListening(); // stops
    });
    expect(result.current.isListening).toBe(false);
  });
});
