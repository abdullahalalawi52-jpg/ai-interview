import { useState, useRef, useEffect, useCallback } from "react";

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: {
    length: number;
    item(_index: number): {
      length: number;
      item(_index: number): {
        transcript: string;
      };
      [_index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    [_index: number]: {
      length: number;
      item(_index: number): {
        transcript: string;
      };
      [_index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionType extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((event: Event) => void) | null;
}

export function useSpeechRecognition(
  language: string,
  onTranscriptChange: (transcript: string) => void
) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      const win = window as unknown as { 
        SpeechRecognition: new () => SpeechRecognitionType; 
        webkitSpeechRecognition: new () => SpeechRecognitionType;
      };
      
      const SpeechRecognitionConstructor = win.SpeechRecognition || win.webkitSpeechRecognition;

      recognitionRef.current = new SpeechRecognitionConstructor();

      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = language === "en" ? "en-US" : "ar-SA";

        let finalTranscriptStr = "";

        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let interimTranscript = "";
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscriptStr += event.results[i][0].transcript + " ";
              onTranscriptChange(finalTranscriptStr);
            } else {
              interimTranscript += event.results[i][0].transcript;
              onTranscriptChange(finalTranscriptStr + interimTranscript);
            }
          }
        };

        recognitionRef.current.onerror = () => setIsListening(false);
        recognitionRef.current.onend = () => setIsListening(false);
      }
    }
  }, [language, onTranscriptChange]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const startListening = useCallback(() => {
    recognitionRef.current?.start();
    setIsListening(true);
  }, []);

  const toggleListening = useCallback(() => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [isListening, startListening, stopListening]);

  return { isListening, toggleListening, stopListening, startListening };
}
