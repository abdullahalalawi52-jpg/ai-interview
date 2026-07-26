import { BookOpen } from "lucide-react";
import { TranslationKey } from "@/context/LanguageContext";

interface RecommendedTopicsProps {
  recommendedTopics: {
    topic: string;
    reason: string;
  }[];
  t: (_key: TranslationKey) => string;
}

export function RecommendedTopics({ recommendedTopics, t }: RecommendedTopicsProps) {
  return (
    <div className="glass-card p-8 rounded-3xl shadow-sm border border-outline-variant/50">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/30">
        <div className="p-3 bg-secondary/10 rounded-xl text-secondary">
          <BookOpen className="w-6 h-6" />
        </div>
        <h3 className="font-headline-md font-bold">{t("gapAnalyzer.topics")}</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {recommendedTopics?.map((item: { topic: string; reason: string }, i: number) => (
          <div key={i} className="bg-surface-variant p-5 rounded-2xl border border-outline-variant/30 hover:border-secondary/50 transition-colors">
            <h4 className="font-bold text-lg mb-2 text-secondary">{item.topic}</h4>
            <p className="text-sm text-on-surface-variant">{item.reason}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
