import { Sparkles } from "lucide-react";
import ScoreRing from "@/components/ScoreRing";
import { TranslationKey } from "@/context/LanguageContext";

interface ScoreOverviewProps {
  score: number;
  t: (_key: TranslationKey) => string;
}

export function ScoreOverview({ score, t }: ScoreOverviewProps) {
  return (
    <div className="space-y-8">
      <div className="glass-card p-8 rounded-3xl shadow-sm border-t-4 border-primary flex flex-col items-center text-center">
        <ScoreRing score={score} size="lg" />
        <h3 className="font-headline-md text-headline-md mb-2 mt-4">{t("gapAnalyzer.score.title")}</h3>
        <p className="font-body-sm text-on-surface-variant mb-4">{t("gapAnalyzer.score.desc")}</p>
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
  );
}
