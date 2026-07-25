import { useState, useEffect, useRef, FormEvent, useMemo, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useInterviewSave } from "@/hooks/useInterviewSave";
import { useLanguage } from "@/context/LanguageContext";
import { InterviewConfig } from "@/types/interview";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import toast from "react-hot-toast";

export function useInterview() {
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [setupComplete, setSetupComplete] = useState(false);
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig>({
    company: "",
    jobTitle: "",
    specialization: "",
    interviewType: "technical"
  });

  const [input, setInput] = useState('');
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    if (user) {
      user.getIdToken().then(setToken).catch(console.error);
    } else {
      Promise.resolve().then(() => setToken(""));
    }
  }, [user]);

  const transport = useMemo(() => new DefaultChatTransport({
    api: "/api/interview",
    body: { ...interviewConfig, language },
    headers: token ? { "Authorization": `Bearer ${token}` } : undefined
  }), [token, interviewConfig, language]);

  const { messages, sendMessage, status, error } = useChat({
    transport
  });
  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    if (error) {
      console.error("Chat error:", error);
      toast.error(language === 'ar' ? "حدث خطأ أثناء التواصل مع الذكاء الاصطناعي. قد يكون مفتاح API غير صالح." : "Error communicating with AI. The API key might be invalid.");
    }
  }, [error, language]);

  const [hasStarted, setHasStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isFinished = messages.some(m => {
    const textPart = m.parts?.find((p: { type: string }) => p.type === 'text') as { type: 'text', text: string } | undefined;
    return textPart && textPart.text.includes("[END_INTERVIEW]");
  });

  useEffect(() => {
    if (hasStarted && !isFinished) {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev: number) => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasStarted, isFinished]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleTranscriptChange = useCallback((transcript: string) => {
    setInput(transcript);
  }, []);

  const { isListening, toggleListening: originalToggleListening, stopListening } = useSpeechRecognition(language, handleTranscriptChange);

  const toggleListening = useCallback(() => {
    if (!isListening) {
      setInput("");
    }
    originalToggleListening();
  }, [isListening, originalToggleListening]);

  useTextToSpeech(messages, isLoading, language);

  const startInterview = () => {
    if (!user) {
      toast(language === 'ar' ? "أنت تستخدم المنصة كزائر. سيتم حفظ المقابلة محلياً فقط." : "You are using the platform as a guest. The interview will be saved locally.", {
        icon: 'ℹ️',
      });
    }
    setHasStarted(true);
    const startMsg = t("interview.startMessage").replace("{{company}}", interviewConfig.company || "the selected company");
    sendMessage({ text: startMsg });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isListening) {
      stopListening();
    }
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  const { interviewId } = useInterviewSave(isFinished, messages, interviewConfig, elapsedTime);

  return {
    setupComplete,
    setSetupComplete,
    interviewConfig,
    setInterviewConfig,
    input,
    setInput,
    messages,
    isLoading,
    hasStarted,
    elapsedTime,
    isFinished,
    isListening,
    toggleListening,
    formatTime,
    messagesEndRef,
    startInterview,
    onSubmit,
    interviewId
  };
}
