import { Sparkles } from "lucide-react";
import { TranslationKey } from "@/context/LanguageContext";

interface StarMethodFeedbackProps {
  starMethodFeedback?: string;
  t: (_key: TranslationKey) => string;
}

export function StarMethodFeedback({ starMethodFeedback, t }: StarMethodFeedbackProps) {
  if (!starMethodFeedback) return null;

  return (
    <div className="glass-card p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/50">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/30">
        <div className="p-3 bg-amber-500/10 rounded-xl text-amber-500">
          <Sparkles className="w-6 h-6" />
        </div>
        <h3 className="font-headline-sm font-bold text-on-surface">{t("gapAnalyzer.starMethod")}</h3>
      </div>
      <div className="bg-surface p-5 rounded-2xl border border-outline-variant/30 text-on-surface-variant leading-relaxed">
        {starMethodFeedback}
      </div>
    </div>
  );
}
