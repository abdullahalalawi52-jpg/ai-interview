import Link from "next/link";
import { ArrowLeft, Sparkles, BrainCircuit, Activity } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TranslationKey } from "@/context/LanguageContext";

interface HeroSectionProps {
  t: (_translateKey: TranslationKey) => string;
  phrases: string[];
  phraseIndex: number;
  handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export function HeroSection({ t, phrases, phraseIndex, handleMouseMove }: HeroSectionProps) {
  return (
    <section className="relative pt-8 pb-32 overflow-hidden">
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
          <div 
            className="relative glass-panel spotlight-hover p-lg rounded-[32px] shadow-2xl border border-white/50"
            onMouseMove={handleMouseMove}
          >
            <div className="relative aspect-video bg-gradient-to-br from-[#0f172a] to-[#1e1b4b] rounded-2xl shadow-inner mb-md overflow-hidden flex flex-col items-center justify-center border border-white/10">
              {/* Background grid */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
              
              {/* AI Center Orb */}
              <motion.div
                animate={{ scale: [1, 1.05, 1], boxShadow: ["0px 0px 0px 0px rgba(99, 102, 241, 0)", "0px 0px 40px 10px rgba(99, 102, 241, 0.4)", "0px 0px 0px 0px rgba(99, 102, 241, 0)"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
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
                    transition={{ duration: 1.5 + (i % 4) * 0.3, repeat: Infinity, ease: "easeInOut", delay: (i % 5) * 0.1 }}
                    className="w-1.5 bg-cyan-400 rounded-t-full opacity-80"
                  />
                ))}
              </div>

              {/* Floating cards */}
              <motion.div
                animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-6 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-xl flex items-center gap-2 z-10"
              >
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <span className="text-white text-sm font-bold">{t("home.aiBadge1")}</span>
              </motion.div>

              <motion.div
                animate={{ y: [10, -10, 10], rotate: [2, -2, 2] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
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
  );
}
