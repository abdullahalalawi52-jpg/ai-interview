import { Settings2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

interface QuizResultProps {
  score: number;
  totalQuestions: number;
  jobTitle: string;
  companyName: string;
  specialization: string;
  onNewQuiz: () => void;
}

export default function QuizResult({
  score,
  totalQuestions,
  jobTitle,
  companyName,
  specialization,
  onNewQuiz
}: QuizResultProps) {
  const { t } = useLanguage();

  return (
    <div className="glass-card w-full max-w-[42rem] p-8 md:p-12 rounded-[32px] text-center shadow-xl border border-outline-variant/30 slide-up">
      <div className="mb-8 relative">
        <svg className="w-32 h-32 mx-auto transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-surface-container-highest"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <path
            className="text-primary transition-all duration-1000 ease-out"
            strokeDasharray={`${(score / totalQuestions) * 100}, 100`}
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-headline-lg text-headline-lg font-bold text-on-surface">{score}/{totalQuestions}</span>
        </div>
      </div>

      <h2 className="font-headline-lg text-headline-lg text-on-surface mb-2">
        {score === totalQuestions ? t("quiz.result.perfect") : score >= totalQuestions / 2 ? t("quiz.result.good") : t("quiz.result.needsPractice")}
      </h2>
      <p className="font-body-lg text-on-surface-variant mb-8 max-w-[36rem] mx-auto">
        {score === totalQuestions 
          ? t("quiz.result.perfectDesc").replace("{{job}}", jobTitle).replace("{{company}}", companyName)
          : t("quiz.result.practiceDesc").replace("{{spec}}", specialization)}
      </p>

      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button 
          onClick={onNewQuiz}
          className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          <Settings2 className="w-5 h-5" /> {t("quiz.result.newQuiz")}
        </button>
        <Link 
          href="/dashboard"
          className="px-6 py-3 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
        >
          {t("quiz.result.dashboard")}
        </Link>
      </div>
    </div>
  );
}
