import React from 'react';
import { CheckCircle2, AlertTriangle, MinusCircle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export default function ScoreRing({ score, size = 'md', showLabel = true }: ScoreRingProps) {
  const { t } = useLanguage();

  const dimensions = {
    sm: { w: 20, r: 35, dash: 219.9, stroke: 6, textSize: 'text-2xl' },
    md: { w: 32, r: 55, dash: 345.5, stroke: 8, textSize: 'text-4xl' },
    lg: { w: 40, r: 70, dash: 439.8, stroke: 12, textSize: 'text-5xl' },
  };

  const dim = dimensions[size];
  const color = score >= 80 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-error';
  const bgColor = score >= 80 ? 'bg-green-500/10 border-green-500/20 text-green-600' : score >= 50 ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-600' : 'bg-error/10 border-error/20 text-error';

  return (
    <div className="flex flex-col items-center">
      <div className={`relative w-${dim.w} h-${dim.w} mb-4`}>
        <svg className="w-full h-full transform -rotate-90">
          <circle className="text-surface-container-highest" cx="50%" cy="50%" fill="transparent" r={dim.r} stroke="currentColor" strokeWidth={dim.stroke}></circle>
          <circle 
            className={`transition-all duration-1000 ease-out ${color}`} 
            cx="50%" cy="50%" fill="transparent" r={dim.r} stroke="currentColor" 
            strokeDasharray={dim.dash} 
            strokeDashoffset={dim.dash - (dim.dash * score) / 100} 
            strokeWidth={dim.stroke}
          ></circle>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-headline-xl font-bold ${dim.textSize}`}>{score}%</span>
        </div>
      </div>
      
      {showLabel && (
        <div className={`px-4 py-2 rounded-full font-bold text-sm border flex items-center gap-2 ${bgColor}`}>
          {score >= 80 && <CheckCircle2 className="w-4 h-4" aria-hidden="true" />}
          {score < 80 && score >= 50 && <AlertTriangle className="w-4 h-4" aria-hidden="true" />}
          {score < 50 && <MinusCircle className="w-4 h-4" aria-hidden="true" />}
          <span>
            {score >= 80 ? t("gapAnalyzer.score.excellent") || "ممتاز" : score >= 50 ? t("gapAnalyzer.score.good") || "جيد" : t("gapAnalyzer.score.needsImprovement") || "يحتاج تحسين"}
          </span>
        </div>
      )}
    </div>
  );
}
