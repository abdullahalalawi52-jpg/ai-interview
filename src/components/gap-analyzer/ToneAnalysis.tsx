import { Sparkles, CheckCircle2, BookOpen } from "lucide-react";
import { TranslationKey } from "@/context/LanguageContext";

interface ToneAnalysisProps {
  toneAnalysis?: {
    confidenceLevel: string;
    professionalism: string;
    feedback: string;
  };
  t: (_key: TranslationKey) => string;
}

export function ToneAnalysis({ toneAnalysis, t }: ToneAnalysisProps) {
  if (!toneAnalysis) return null;

  return (
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
          <p className="font-headline-sm text-primary font-black">{toneAnalysis.confidenceLevel}</p>
        </div>
        <div className="bg-surface p-4 rounded-2xl border border-outline-variant/30 shadow-inner">
          <p className="text-sm text-on-surface-variant font-bold mb-1">{t("gapAnalyzer.tone.professionalism")}</p>
          <p className="font-headline-sm text-primary font-black">{toneAnalysis.professionalism}</p>
        </div>
      </div>
      <div className="bg-secondary-container/30 text-on-surface p-5 rounded-2xl border border-secondary/20 flex flex-col md:flex-row md:items-start">
        <span className="font-bold text-secondary flex-shrink-0 md:ml-2 rtl:md:ml-2 ltr:md:mr-2 mb-2 md:mb-0">{t("gapAnalyzer.tone.aiNote")}</span>
        <p className="font-body-md leading-relaxed">
          {toneAnalysis.feedback}
        </p>
      </div>
    </div>
  );
}
