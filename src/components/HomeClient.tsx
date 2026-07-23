"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

import { ArrowLeft, Mic, Activity, Sparkles, BrainCircuit } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function HomeClient() {
  const { language, t } = useLanguage();
  const [phraseIndex, setPhraseIndex] = useState(0);

  const phrases = language === "ar" ? [
    "تدرب في بيئة آمنة خالية من التوتر 🎯",
    "اكتشف الفجوات في سيرتك الذاتية 📄",
    "احصل على تقييم فوري ومفصل لأدائك ⚡",
    "تجاوز رهبة المقابلات بثقة تامة 🚀"
  ] : [
    "Practice in a safe, stress-free environment 🎯",
    "Discover gaps in your resume 📄",
    "Get instant, detailed feedback on your performance ⚡",
    "Overcome interview anxiety with full confidence 🚀"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [phrases.length]);

  return (
    <>

      <main id="main-content" className="hero-gradient" tabIndex={-1}>
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-container-max mx-auto px-gutter grid lg:grid-cols-2 gap-xl items-center">
            <div className="flex flex-col gap-lg z-10 min-w-0 w-full">
              <h1 className="font-headline-xl text-headline-xl text-primary leading-tight">{t("home.title")}</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-[36rem]">{t("home.subtitle")}</p>
              <div className="flex flex-wrap gap-md mt-sm">
                <Link href="/interview" className="px-xl py-md bg-primary text-on-primary rounded-xl font-bold flex items-center gap-sm transition-all hover:shadow-lg active:scale-95">
                  {t("home.startBtn")}
                  <ArrowLeft className="w-5 h-5 rtl:-scale-x-100" />
                </Link>
                <Link href="/gap-analyzer" className="px-xl py-md border-2 border-outline text-on-surface rounded-xl font-bold transition-all hover:bg-on-surface/5 active:scale-95 hover:border-on-surface">
                  {t("home.analyzeBtn")}
                </Link>
              </div>
              
              <div className="mt-4 h-8 relative overflow-hidden flex items-center w-full max-w-[36rem]">
                <AnimatePresence>
                  <motion.div
                    key={phraseIndex}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="text-on-surface-variant font-bold text-sm flex items-center gap-2 absolute w-full"
                  >
                    <Sparkles className="w-4 h-4 text-primary shrink-0" />
                    <p className="m-0">{phrases[phraseIndex]}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
            <div className="relative hidden lg:block min-w-0 w-full">
              <div className="absolute inset-0 bg-secondary-fixed/10 blur-3xl rounded-full"></div>
              <div className="relative glass-card p-lg rounded-[32px] shadow-2xl border border-white/50">
                <div className="relative aspect-video bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] rounded-2xl shadow-inner mb-md overflow-hidden flex flex-col items-center justify-center border border-white/10">
                  {/* Background grid */}
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                  
                  {/* AI Center Orb */}
                  <motion.div
                    animate={{ scale: [1, 1.05, 1], boxShadow: ["0px 0px 0px 0px rgba(99, 102, 241, 0)", "0px 0px 40px 10px rgba(99, 102, 241, 0.4)", "0px 0px 0px 0px rgba(99, 102, 241, 0)"] }}
                    transition={{ duration: 3, repeat: 2, ease: "easeInOut" }}
                    className="relative z-10 w-24 h-24 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <BrainCircuit className="w-12 h-12 text-white" />
                  </motion.div>

                  {/* Audio Waveform */}
                  <div className="flex items-end gap-1 mt-8 z-10 h-12">
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: ["20%", "100%", "30%", "80%", "20%"] }}
                        transition={{ duration: 1.5 + (i % 4) * 0.3, repeat: 3, ease: "easeInOut", delay: (i % 5) * 0.1 }}
                        className="w-1.5 bg-cyan-400 rounded-t-full opacity-80"
                      />
                    ))}
                  </div>

                  {/* Floating cards */}
                  <motion.div
                    animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
                    transition={{ duration: 5, repeat: 2, ease: "easeInOut" }}
                    className="absolute top-6 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl flex items-center gap-2 z-10"
                  >
                    <Sparkles className="w-5 h-5 text-yellow-400" />
                    <span className="text-white text-sm font-bold">{t("home.aiBadge1")}</span>
                  </motion.div>

                  <motion.div
                    animate={{ y: [10, -10, 10], rotate: [2, -2, 2] }}
                    transition={{ duration: 6, repeat: 2, ease: "easeInOut" }}
                    className="absolute bottom-16 left-8 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl flex items-center gap-2 z-10"
                  >
                    <Activity className="w-5 h-5 text-green-400" />
                    <span className="text-white text-sm font-bold">{t("home.aiBadge2")}</span>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-surface-container/50">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="text-center mb-16 flex flex-col items-center">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-sm">{t("home.featuresTitle")}</h2>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[42rem]">{t("home.featuresSubtitle")}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg">
              {/* Voice Interview Card */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="glass-card rounded-3xl overflow-hidden flex flex-col transition-all hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12),0_0_20px_rgba(99,102,241,0.2)] group border-transparent hover:border-primary/50 border-2"
              >
                <div className="w-full h-48 bg-gradient-to-br from-primary/5 to-primary/10 relative flex items-center justify-center overflow-hidden">
                  <div className="relative z-10 w-24 h-24 bg-white dark:bg-surface rounded-full shadow-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-500 border border-outline-variant/20">
                    <Mic className="w-10 h-10 text-primary relative z-20" />
                    <div className="absolute inset-0 border-2 border-primary/40 rounded-full animate-ping" style={{ animationDuration: '2s' }}></div>
                    <div className="absolute inset-[-15px] border-2 border-primary/20 rounded-full animate-ping" style={{ animationDuration: '2.5s' }}></div>
                  </div>
                  <div className="absolute bottom-0 w-full flex justify-center items-end gap-1 px-8 h-16 opacity-30">
                    {[...Array(15)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="flex-1 bg-primary rounded-t-sm"
                        animate={{ height: ["10%", "80%", "30%", "60%", "10%"] }}
                        transition={{ duration: 1.5, repeat: 3, delay: i * 0.1, ease: "easeInOut" }}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="p-8 md:p-10 flex flex-col gap-4">
                  <h3 className="font-headline-md text-headline-md text-primary m-0">{t("home.f1Title")}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed m-0">{t("home.f1Desc")}</p>
                </div>
              </motion.div>

              {/* Performance Reports Card */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="glass-card rounded-3xl overflow-hidden flex flex-col transition-all hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12),0_0_20px_rgba(244,63,94,0.2)] group border-transparent hover:border-tertiary/50 border-2"
              >
                <div className="w-full h-48 bg-gradient-to-br from-tertiary/5 to-tertiary/10 relative flex items-center justify-center overflow-hidden">
                  <div className="relative z-10 w-36 h-24 bg-white dark:bg-surface rounded-xl shadow-lg flex items-end justify-between p-4 transform group-hover:scale-105 transition-transform duration-500 border border-outline-variant/20">
                    <motion.div className="w-4 bg-error/70 rounded-t-md" animate={{ height: ["30%", "60%", "30%"] }} transition={{ duration: 2, repeat: 2 }} />
                    <motion.div className="w-4 bg-tertiary-fixed-dim/60 rounded-t-md" animate={{ height: ["50%", "30%", "50%"] }} transition={{ duration: 2, repeat: 2, delay: 0.3 }} />
                    <motion.div className="w-4 bg-tertiary/80 rounded-t-md" animate={{ height: ["70%", "90%", "70%"] }} transition={{ duration: 2, repeat: 2, delay: 0.6 }} />
                    <motion.div className="w-4 bg-primary/80 rounded-t-md" animate={{ height: ["90%", "40%", "90%"] }} transition={{ duration: 2, repeat: 2, delay: 0.9 }} />
                    <div className="absolute top-3 right-3 w-8 h-8 bg-tertiary/10 rounded-full flex items-center justify-center shadow-inner">
                      <div className="w-3 h-3 bg-tertiary rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 md:p-10 flex flex-col gap-4">
                  <h3 className="font-headline-md text-headline-md text-primary m-0">{t("home.f3Title")}</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed m-0">{t("home.f3Desc")}</p>
                </div>
              </motion.div>

              {/* CV Analysis Bento Card */}
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="lg:col-span-2 glass-card rounded-3xl grid grid-cols-1 md:grid-cols-5 overflow-hidden transition-all hover:-translate-y-2 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12),0_0_20px_rgba(20,184,166,0.2)] group border-transparent hover:border-secondary/50 border-2"
              >
                {/* Illustration Area */}
                <div className="w-full md:col-span-2 min-h-[300px] relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-100/80 to-blue-50/50 dark:from-cyan-900/30 dark:to-blue-900/20 p-8">
                  <div className="relative w-48 h-64 bg-white dark:bg-surface rounded-xl shadow-2xl p-5 flex flex-col gap-4 transform group-hover:scale-105 transition-transform duration-500 z-10 border border-outline-variant/10">
                    {/* Scanner Corners */}
                    <div className="absolute -top-3 -left-3 w-8 h-8 border-t-[5px] border-l-[5px] border-primary rounded-tl-lg opacity-80"></div>
                    <div className="absolute -top-3 -right-3 w-8 h-8 border-t-[5px] border-r-[5px] border-primary rounded-tr-lg opacity-80"></div>
                    <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-[5px] border-l-[5px] border-primary rounded-bl-lg opacity-80"></div>
                    <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-[5px] border-r-[5px] border-primary rounded-br-lg opacity-80"></div>
                    
                    {/* CV Content Mockup */}
                    <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden shrink-0">
                         <div className="w-5 h-5 rounded-full bg-primary mb-1"></div>
                         <div className="w-7 h-4 rounded-t-full bg-primary absolute bottom-0"></div>
                      </div>
                      <div className="flex-1 space-y-2 w-full">
                        <div className="h-2.5 bg-surface-container-highest rounded w-full"></div>
                        <div className="h-2 bg-surface-container rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="space-y-3 mt-2">
                      <div className="h-2 bg-error/40 rounded w-full"></div>
                      <div className="h-2 bg-surface-container rounded w-5/6"></div>
                      <div className="h-2 bg-surface-container rounded w-4/6"></div>
                    </div>
                    <div className="space-y-3 mt-auto flex flex-col items-end">
                      <div className="h-2 bg-surface-container rounded w-full"></div>
                      <div className="h-2 bg-surface-container rounded w-11/12"></div>
                      <div className="flex justify-between w-full items-center mt-2">
                        <div className="h-2 bg-success/40 rounded w-1/2"></div>
                        <div className="w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center">
                          <div className="w-2.5 h-2.5 bg-secondary rounded-full"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Scan Line Animation */}
                    <motion.div 
                      animate={{ top: ["0%", "100%", "0%"] }}
                      transition={{ duration: 3, repeat: 3, ease: "easeInOut" }}
                      className="absolute left-[-10%] right-[-10%] h-1 bg-secondary shadow-[0_0_15px_rgba(0,106,97,0.8)] z-20"
                    />
                  </div>
                </div>

                {/* Text Content */}
                <div className="w-full md:col-span-3 p-8 md:p-12 flex flex-col justify-center gap-6 relative">
                  <h3 className="font-headline-lg text-headline-lg text-primary m-0">{t("home.f2Title")}</h3>
                  <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed m-0">{t("home.f2Desc")}</p>
                  
                  <div className="mt-2">
                    <Link href="/ats-scanner" className="inline-flex items-center gap-2 text-secondary font-bold hover:text-secondary-fixed transition-colors">
                      {t("home.analyzeBtn")}
                      <ArrowLeft className="w-5 h-5 rtl:-scale-x-100" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stats & CTA Section */}
        <section className="py-24 relative">
          <div className="max-w-container-max mx-auto px-gutter">
            <div className="bg-primary rounded-[40px] p-xl lg:p-32 text-center text-on-primary relative overflow-hidden shadow-xl">
              <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
              <div className="relative z-10 flex flex-col items-center gap-lg">
                <h2 className="font-headline-xl text-headline-xl leading-tight">{t("home.ctaTitle")}</h2>
                <p className="font-body-lg text-body-lg opacity-90 max-w-[42rem]">{t("home.ctaDesc")}</p>
                <div className="flex flex-wrap justify-center gap-md mt-sm">
                  <Link href="/login" className="px-xl py-md bg-on-primary text-primary rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2">
                    {t("home.ctaBtn")} <ArrowLeft className="w-5 h-5 rtl:-scale-x-100" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

    </>
  );
}
