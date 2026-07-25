"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Skeleton } from "@/components/ui/Skeleton";
import { useInterview } from "@/hooks/useInterview";

import InterviewSetup from "@/components/interview/InterviewSetup";
import InterviewIdle from "@/components/interview/InterviewIdle";
import InterviewChat from "@/components/interview/InterviewChat";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function InterviewClient() {
  const { loading } = useAuth();
  const { t, language } = useLanguage();

  const {
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
  } = useInterview();

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

      <main id="main-content" className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-surface-container-lowest p-4 md:p-8 focus:outline-none" tabIndex={-1}>
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
              <ErrorBoundary>
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
              </ErrorBoundary>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
