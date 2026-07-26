import { CheckCircle2 } from "lucide-react";
import { TranslationKey } from "@/context/LanguageContext";

interface IdealAnswersProps {
  idealAnswers?: {
    question: string;
    userAnswerSummary: string;
    idealAnswer: string;
  }[];
  t: (_key: TranslationKey) => string;
}

export function IdealAnswers({ idealAnswers, t }: IdealAnswersProps) {
  if (!idealAnswers || idealAnswers.length === 0) return null;

  return (
    <div className="glass-card p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/50">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-outline-variant/30">
        <div className="p-3 bg-success/10 rounded-xl text-success">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="font-headline-sm font-bold text-on-surface">{t("gapAnalyzer.idealAnswers")}</h3>
      </div>
      <div className="space-y-6">
        {idealAnswers.map((item, index) => (
          <div key={index} className="bg-surface-variant p-5 rounded-2xl border border-outline-variant/30 hover:border-success/50 transition-colors flex flex-col gap-3">
            <p className="font-bold text-lg text-primary">{t("gapAnalyzer.question")} <span className="text-on-surface font-normal">{item.question}</span></p>
            <div className="bg-surface p-4 rounded-xl border border-outline-variant/20">
              <p className="text-sm font-bold text-error mb-1">{t("gapAnalyzer.yourAnswer")}</p>
              <p className="text-on-surface-variant">{item.userAnswerSummary}</p>
            </div>
            <div className="bg-success/5 p-4 rounded-xl border border-success/20">
              <p className="text-sm font-bold text-success mb-1">{t("gapAnalyzer.ideal")}</p>
              <p className="text-on-surface leading-relaxed">{item.idealAnswer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
