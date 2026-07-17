import { BrainCircuit, Settings2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface QuizStartProps {
  onStart: () => void;
}

export default function QuizStart({ onStart }: QuizStartProps) {
  const { t } = useLanguage();

  return (
    <div className="glass-card w-full max-w-[42rem] p-8 md:p-12 rounded-[32px] text-center border-2 border-transparent shadow-xl slide-up">
      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
        <BrainCircuit className="w-10 h-10 text-primary" />
      </div>
      <h1 className="font-headline-xl text-headline-xl text-primary mb-4">{t("quiz.start.title")}</h1>
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-[36rem] mx-auto">
        {t("quiz.start.desc")}
      </p>
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <button 
          onClick={onStart}
          className="px-8 py-4 bg-primary text-on-primary rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg"
        >
          {t("quiz.start.btn")} <Settings2 className="w-5 h-5 rtl:-scale-x-100" />
        </button>
      </div>
    </div>
  );
}
