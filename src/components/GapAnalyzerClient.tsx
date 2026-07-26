"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { interviewService } from "@/services/interview.service";
import { AlertTriangle, TrendingUp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { ScoreOverview } from "./gap-analyzer/ScoreOverview";
import { StrengthsWeaknesses } from "./gap-analyzer/StrengthsWeaknesses";
import { ToneAnalysis } from "./gap-analyzer/ToneAnalysis";
import { StarMethodFeedback } from "./gap-analyzer/StarMethodFeedback";
import { IdealAnswers } from "./gap-analyzer/IdealAnswers";
import { RecommendedTopics } from "./gap-analyzer/RecommendedTopics";

interface AnalysisData {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendedTopics: {
    topic: string;
    reason: string;
  }[];
  toneAnalysis?: {
    confidenceLevel: string;
    professionalism: string;
    feedback: string;
  };
  starMethodFeedback?: string;
  idealAnswers?: {
    question: string;
    userAnswerSummary: string;
    idealAnswer: string;
  }[];
}

export default function GapAnalyzerClient() {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [loadingStep, setLoadingStep] = useState<'data' | 'ai' | null>('data');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const languageRef = useRef(language);
  const tRef = useRef(t);
  
  useEffect(() => {
    languageRef.current = language;
    tRef.current = t;
  }, [language, t]);

  useEffect(() => {
    async function fetchAndAnalyze() {

      if (!interviewId) {
        setLoadingStep(null);
        setError(tRef.current("gapAnalyzer.errors.noInterviewId"));
        return;
      }

      try {
        let data: { messages?: unknown[]; analysis?: unknown; [key: string]: unknown } | null = null;
        if (interviewId.startsWith("local_")) {
          const localData = interviewService.getInterviewLocal(interviewId);
          if (!localData) {
            setError(tRef.current("gapAnalyzer.errors.notFoundLocal"));
            setLoadingStep(null);
            return;
          }
          data = localData;
        } else {
          if (!user) {
            setError(tRef.current("gapAnalyzer.errors.loginRequired"));
            setLoadingStep(null);
            return;
          }
          const remoteData = await interviewService.getInterview(user.uid, interviewId);

          if (!remoteData) {
            setError(tRef.current("gapAnalyzer.errors.notFound"));
            setLoadingStep(null);
            return;
          }
          data = remoteData;
        }

        if (!data) return;

        const messages = data.messages;

        // التحقق مما إذا كان هناك تقرير محفوظ مسبقاً (اختياري) يمكن إضافته لاحقاً
        if (data.analysis) {
          setAnalysis(data.analysis as AnalysisData);
          setLoadingStep(null);
          return;
        }

        setLoadingStep('ai');
        
        const token = user ? await user.getIdToken() : "";
        const res = await fetch("/api/gap-analyzer", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ messages, duration: data.duration, language: languageRef.current }),
        });

        if (!res.ok) {
          throw new Error(tRef.current("gapAnalyzer.errors.aiError"));
        }

        const analysisData = await res.json();
        setAnalysis(analysisData);
        setLoadingStep(null);
        
        // حفظ التحليل
        try {
          if (!interviewId.startsWith("local_") && user) {
            await interviewService.updateInterviewAnalysis(user.uid, interviewId, analysisData);
          } else {
            interviewService.updateInterviewAnalysisLocal(interviewId, analysisData);
          }
        } catch (e) {
          console.error("Failed to save analysis:", e);
        }
      } catch (err: unknown) {
        console.error(err);
        const msg = err instanceof Error ? err.message : "";
        if (msg === "Failed to fetch" || msg.includes("fetch")) {
          setError(tRef.current("errors.network"));
        } else {
          setError(msg || tRef.current("gapAnalyzer.errors.unexpected"));
        }
        setLoadingStep(null);
      }
    }

    fetchAndAnalyze();
  }, [interviewId, user]);

  return (
    <>

      <main id="main-content" className="min-h-screen flex flex-col items-center justify-start bg-surface text-on-surface p-4 md:p-8 pt-24 text-start focus:outline-none" tabIndex={-1}>
        <div className="w-full max-w-[64rem]">
          <div className="mb-12 text-center">
            <h1 className="font-headline-xl text-headline-xl text-primary mb-4 flex items-center justify-center gap-3">
              <TrendingUp className="w-10 h-10" /> {t("gapAnalyzer.hero.title")}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[42rem] mx-auto">
              {t("gapAnalyzer.hero.desc")}
            </p>
            {!user && (
              <div className="mt-4 inline-flex items-center gap-2 bg-secondary-container text-on-secondary-container px-4 py-2 rounded-full font-bold shadow-sm text-start">
                <Sparkles className="w-5 h-5 text-secondary shrink-0" />
                <p>{t("gapAnalyzer.hero.loginPrompt")}</p>
              </div>
            )}
          </div>

          {loadingStep && (
            <div className="w-full max-w-4xl mx-auto space-y-6 animate-pulse my-12">
              <div className="h-40 bg-surface-variant/40 rounded-3xl w-full border border-outline-variant/30"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-surface-variant/40 rounded-3xl w-full border border-outline-variant/30"></div>
                <div className="h-64 bg-surface-variant/40 rounded-3xl w-full border border-outline-variant/30"></div>
              </div>
              <div className="h-32 bg-surface-variant/40 rounded-3xl w-full border border-outline-variant/30"></div>
            </div>
          )}

          {error && error === t("gapAnalyzer.errors.noInterviewId") ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-2xl mx-auto my-12"
            >
              <div className="w-full glass-card border border-primary/20 p-10 rounded-3xl flex flex-col items-center text-center shadow-lg bg-surface/50 backdrop-blur-xl">
                <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl flex items-center justify-center mb-6 relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-3xl animate-ping opacity-50 duration-1000"></div>
                  <Sparkles className="w-10 h-10 relative z-10" />
                </div>
                <h3 className="font-headline-sm font-bold text-on-surface mb-3">{t("gapAnalyzer.noData")}</h3>
                <p className="font-body-lg text-on-surface-variant w-full whitespace-normal leading-relaxed">
                  {error}
                </p>
              </div>
            </motion.div>
          ) : error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-2xl mx-auto my-8"
            >
              <div className="relative overflow-hidden bg-error/5 border border-error/20 p-6 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-5 shadow-sm backdrop-blur-md">
                <div className="absolute top-0 right-0 w-1.5 h-full bg-error"></div>
                <div className="p-3 bg-error/10 text-error rounded-full flex-shrink-0 relative">
                  <AlertTriangle className="w-7 h-7 relative z-10" />
                </div>
                <div className="flex-1 text-center sm:text-start w-full">
                  <h3 className="font-bold text-lg text-error mb-1">{t("gapAnalyzer.errorTitle")}</h3>
                  <p className="text-on-surface-variant w-full whitespace-normal">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {analysis && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              {/* Score and Overview */}
              <div className="lg:col-span-4 space-y-8">
                <ScoreOverview score={analysis.score} t={t} />
              </div>

              {/* Strengths & Weaknesses */}
              <div className="lg:col-span-8 space-y-8">
                <StrengthsWeaknesses 
                  strengths={analysis.strengths} 
                  weaknesses={analysis.weaknesses} 
                  t={t} 
                />

                {/* Tone & Emotion Analysis */}
                <ToneAnalysis toneAnalysis={analysis.toneAnalysis} t={t} />

                {/* STAR Method Feedback */}
                <StarMethodFeedback starMethodFeedback={analysis.starMethodFeedback} t={t} />

                {/* Ideal Answers */}
                <IdealAnswers idealAnswers={analysis.idealAnswers} t={t} />

                {/* Recommended Topics */}
                <RecommendedTopics recommendedTopics={analysis.recommendedTopics} t={t} />
              </div>
            </motion.div>
          )}
        </div>
      </main>

    </>
  );
}
