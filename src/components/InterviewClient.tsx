"use client";

import { useState, useEffect, useRef, FormEvent, useMemo, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useInterviewSave } from "@/hooks/useInterviewSave";
import { useLanguage } from "@/context/LanguageContext";
import { InterviewConfig } from "@/types/interview";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { Skeleton } from "@/components/ui/Skeleton";
import toast from "react-hot-toast";


import InterviewSetup from "@/components/interview/InterviewSetup";
import InterviewIdle from "@/components/interview/InterviewIdle";
import InterviewChat from "@/components/interview/InterviewChat";

export default function InterviewClient() {
  const { user, loading } = useAuth();
  const { t, language } = useLanguage();
  const router = useRouter();

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

  // Handle chat errors
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

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isFinished = messages.some(m => {
    const textPart = m.parts?.find((p: { type: string }) => p.type === 'text') as { type: 'text', text: string } | undefined;
    return textPart && textPart.text.includes("[END_INTERVIEW]");
  });

  // Timer logic
  useEffect(() => {
    if (hasStarted && !isFinished) {
      timerRef.current = setInterval(() => {
        setElapsedTime(prev => prev + 1);
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
  }, [setInput]);

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
      toast.error(language === 'ar' ? "يجب عليك تسجيل الدخول أولاً للبدء" : "You must log in first to start");
      router.push('/login');
      return;
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

  if (loading) {
    return (
      <div className="flex flex-col flex-1 bg-surface h-screen overflow-hidden text-on-surface">
        <header className="px-gutter h-16 border-b border-outline-variant/30 bg-surface/95 flex justify-between items-center shadow-sm">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-8 w-24 rounded-full" />
        </header>
        <main className="flex-1 flex flex-col items-center justify-center bg-surface-container-lowest p-4 md:p-8">
          <div className="w-full max-w-2xl">
            <Skeleton className="h-[400px] w-full rounded-3xl" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-surface h-screen overflow-hidden text-on-surface">
      <header className="px-gutter h-16 border-b border-outline-variant/30 bg-surface/95 backdrop-blur-md flex justify-between items-center z-50 sticky top-0 shadow-sm transition-all duration-200">
        <Link href="/dashboard" className="flex items-center gap-sm text-on-surface-variant hover:text-primary transition-colors font-label-md group">
          {language === 'ar' ? (
            <ArrowRight className="w-5 h-5 rtl:-scale-x-100 group-hover:-translate-x-1 transition-transform" />
          ) : (
            <ArrowLeft className="w-5 h-5 rtl:-scale-x-100 group-hover:-translate-x-1 transition-transform" />
          )}
          {t("interview.backToDashboard")}
        </Link>
        <div className="flex items-center gap-2.5 text-label-sm font-medium bg-surface/60 backdrop-blur-md border border-outline-variant/30 text-on-surface-variant px-4 py-1.5 rounded-full shadow-sm transition-all">
          <div className={`relative flex items-center justify-center w-2.5 h-2.5`}>
            <div className={`absolute w-full h-full rounded-full opacity-40 animate-ping ${isLoading ? 'bg-primary' : isListening ? 'bg-error' : 'bg-success'}`} />
            <div className={`relative w-2 h-2 rounded-full shadow-sm ${isLoading ? 'bg-primary' : isListening ? 'bg-error' : 'bg-success'}`} />
          </div>
          <span className="tracking-wide">
            {!setupComplete ? t("interview.status.setup") : 
             !hasStarted ? t("interview.status.ready") : 
             isLoading ? t("interview.status.thinking") : 
             isListening ? t("interview.status.listening") : 
             isFinished ? t("interview.status.finished") : t("interview.status.yourTurn")}
          </span>
        </div>
      </header>

      <main id="main-content" className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-surface-container-lowest p-4 md:p-8">
        <AnimatePresence mode="wait">
          
          {!setupComplete && (
            <motion.div 
              key="setup"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <InterviewSetup 
                config={interviewConfig} 
                setConfig={setInterviewConfig} 
                onSave={() => setSetupComplete(true)} 
              />
            </motion.div>
          )}

          {setupComplete && !hasStarted && (
            <motion.div 
              key="idle"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <InterviewIdle 
                config={interviewConfig}
                onEdit={() => setSetupComplete(false)}
                onStart={startInterview}
              />
            </motion.div>
          )}

          {hasStarted && (
            <motion.div 
              key="chat"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`w-full h-full ${interviewConfig.interviewType === 'technical' ? 'max-w-[90rem]' : 'max-w-[64rem]'}`}
            >
              <InterviewChat 
                config={interviewConfig}
                messages={messages}
                isLoading={isLoading}
                isListening={isListening}
                isFinished={isFinished}
                elapsedTime={elapsedTime}
                input={input}
                setInput={setInput}
                onSubmit={onSubmit}
                toggleListening={toggleListening}
                formatTime={formatTime}
                messagesEndRef={messagesEndRef}
                interviewId={interviewId}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
