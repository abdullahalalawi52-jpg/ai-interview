import { CheckCircle2, MinusCircle } from "lucide-react";
import { TranslationKey } from "@/context/LanguageContext";

interface StrengthsWeaknessesProps {
  strengths: string[];
  weaknesses: string[];
  t: (_key: TranslationKey) => string;
}

export function StrengthsWeaknesses({ strengths, weaknesses, t }: StrengthsWeaknessesProps) {
  return (
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
          {strengths?.map((strength: string, i: number) => (
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
          {weaknesses?.map((weakness: string, i: number) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-error mt-2 flex-shrink-0" />
              <p className="font-body-md text-on-surface">{weakness}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
