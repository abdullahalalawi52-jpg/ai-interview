"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore/lite";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AlertTriangle, MinusCircle, CheckCircle2, TrendingUp, Sparkles, BookOpen } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

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
}

export default function GapAnalyzerClient() {
  const searchParams = useSearchParams();
  const interviewId = searchParams.get("interviewId");
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [loadingStep, setLoadingStep] = useState<'data' | 'ai' | null>('data');
  const [analysis, setAnalysis] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAndAnalyze() {

      if (!interviewId) {
        setLoadingStep(null);
        setError(t("gapAnalyzer.errors.noInterviewId"));
        return;
      }

      try {
        let data: { messages?: unknown[]; analysis?: unknown; [key: string]: unknown } | null = null;
        let docRef: ReturnType<typeof doc> | null = null;

        if (interviewId.startsWith("local_")) {
          const localDataStr = localStorage.getItem(`interview_${interviewId}`);
          if (!localDataStr) {
            setError(t("gapAnalyzer.errors.notFoundLocal"));
            setLoadingStep(null);
            return;
          }
          data = JSON.parse(localDataStr);
        } else {
          if (!user) {
            setError(t("gapAnalyzer.errors.loginRequired"));
            setLoadingStep(null);
            return;
          }
          docRef = doc(db, "users", user.uid, "interviews", interviewId);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            setError(t("gapAnalyzer.errors.notFound"));
            setLoadingStep(null);
            return;
          }
          data = docSnap.data();
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
          body: JSON.stringify({ messages, duration: data.duration, language }),
        });

        if (!res.ok) {
          throw new Error(t("gapAnalyzer.errors.aiError"));
        }

        const analysisData = await res.json();
        setAnalysis(analysisData);
        setLoadingStep(null);
        
        // حفظ التحليل
        try {
          if (docRef) {
            await updateDoc(docRef, { analysis: analysisData });
          } else {
            data.analysis = analysisData;
            localStorage.setItem(`interview_${interviewId}`, JSON.stringify(data));
          }
        } catch (e) {
          console.error("Failed to save analysis:", e);
        }
      } catch (err: unknown) {
        console.error(err);
        const msg = err instanceof Error ? err.message : "";
        if (msg === "Failed to fetch" || msg.includes("fetch")) {
          setError(t("errors.network"));
        } else {
          setError(msg || t("gapAnalyzer.errors.unexpected"));
        }
        setLoadingStep(null);
      }
    }

    fetchAndAnalyze();
  }, [interviewId, user, t, language]);

  return (
    <>
      <Navbar />

      <main id="main-content" className="min-h-screen flex flex-col items-center justify-start bg-surface text-on-surface p-4 md:p-8 pt-24 text-start" tabIndex={-1}>
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
            <div className="flex flex-col items-center justify-center py-20 glass-card rounded-3xl shadow-lg border border-primary/20">
              <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
              <p className="font-headline-md text-headline-md text-primary animate-pulse">
                {loadingStep === 'data' ? t("gapAnalyzer.loadingData") : t("gapAnalyzer.loadingAI")}
              </p>
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
                <h3 className="font-headline-sm font-bold text-on-surface mb-3">لا توجد بيانات للعرض</h3>
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
                <div className="glass-card p-8 rounded-3xl shadow-sm border-t-4 border-primary flex flex-col items-center text-center">
                  <div className="relative w-40 h-40 mb-6">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle className="text-surface-container-highest" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="12"></circle>
                      <circle 
                        className={`transition-all duration-1000 ease-out ${analysis.score >= 80 ? 'text-green-500' : analysis.score >= 50 ? 'text-yellow-500' : 'text-error'}`} 
                        cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" 
                        strokeDasharray="439.8" 
                        strokeDashoffset={439.8 - (439.8 * analysis.score) / 100} 
                        strokeWidth="12"
                      ></circle>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-headline-xl text-headline-xl font-bold">{analysis.score}%</span>
                    </div>
                  </div>
                  <h3 className="font-headline-md text-headline-md mb-2">{t("gapAnalyzer.score.title")}</h3>
                  <p className="font-body-sm text-on-surface-variant">{t("gapAnalyzer.score.desc")}</p>
                </div>

                <div className="bg-primary-container text-on-primary-container p-6 rounded-3xl shadow-md relative overflow-hidden group">
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-6 h-6 text-primary" />
                      <h4 className="font-bold text-lg">{t("gapAnalyzer.tip.title")}</h4>
                    </div>
                    <p className="font-body-md leading-relaxed">
                      {t("gapAnalyzer.tip.desc")}
                    </p>
                  </div>
                  <div className="absolute -bottom-10 -start-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-colors"></div>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="lg:col-span-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Strengths */}
                  <div className="glass-card p-6 rounded-3xl shadow-sm border border-outline-variant/50">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/30">
                      <div className="p-3 bg-green-500/10 rounded-xl text-green-500">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h3 className="font-headline-sm font-bold">{t("gapAnalyzer.strengths")}</h3>
                    </div>
                    <ul className="space-y-4">
                      {analysis.strengths?.map((strength: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                          <p className="font-body-md text-on-surface">{strength}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="glass-card p-6 rounded-3xl shadow-sm border border-outline-variant/50">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/30">
                      <div className="p-3 bg-error/10 rounded-xl text-error">
                        <MinusCircle className="w-6 h-6" />
                      </div>
                      <h3 className="font-headline-sm font-bold">{t("gapAnalyzer.weaknesses")}</h3>
                    </div>
                    <ul className="space-y-4">
                      {analysis.weaknesses?.map((weakness: string, i: number) => (
                        <li key={i} className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-error mt-2 flex-shrink-0" />
                          <p className="font-body-md text-on-surface">{weakness}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Tone & Emotion Analysis */}
                {analysis.toneAnalysis && (
                  <div className="glass-card p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/50 bg-gradient-to-br from-surface to-surface-variant/30">
                    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/30">
                      <div className="p-3 bg-primary/10 rounded-xl text-primary">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h3 className="font-headline-sm font-bold text-on-surface">{t("gapAnalyzer.tone.title")}</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                      <div className="bg-surface p-4 rounded-2xl border border-outline-variant/30 shadow-inner">
                        <p className="text-sm text-on-surface-variant font-bold mb-1">{t("gapAnalyzer.tone.confidence")}</p>
                        <p className="font-headline-sm text-primary font-black">{analysis.toneAnalysis.confidenceLevel}</p>
                      </div>
                      <div className="bg-surface p-4 rounded-2xl border border-outline-variant/30 shadow-inner">
                        <p className="text-sm text-on-surface-variant font-bold mb-1">{t("gapAnalyzer.tone.professionalism")}</p>
                        <p className="font-headline-sm text-primary font-black">{analysis.toneAnalysis.professionalism}</p>
                      </div>
                    </div>
                    <div className="bg-secondary-container/30 text-on-surface p-5 rounded-2xl border border-secondary/20 flex flex-col md:flex-row md:items-start">
                      <span className="font-bold text-secondary flex-shrink-0 md:ml-2 rtl:md:ml-2 ltr:md:mr-2 mb-2 md:mb-0">{t("gapAnalyzer.tone.aiNote")}</span>
                      <p className="font-body-md leading-relaxed">
                        {analysis.toneAnalysis.feedback}
                      </p>
                    </div>
                  </div>
                )}

                {/* Recommended Topics */}
                <div className="glass-card p-8 rounded-3xl shadow-sm border border-outline-variant/50">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/30">
                    <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="font-headline-md font-bold">{t("gapAnalyzer.topics")}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {analysis.recommendedTopics?.map((item: { topic: string; reason: string }, i: number) => (
                      <div key={i} className="bg-surface-variant p-5 rounded-2xl border border-outline-variant/30 hover:border-secondary/50 transition-colors">
                        <h4 className="font-bold text-lg mb-2 text-secondary">{item.topic}</h4>
                        <p className="text-sm text-on-surface-variant">{item.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
