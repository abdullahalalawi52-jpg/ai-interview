import { BrainCircuit, CheckCircle2, Circle, ArrowLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Question } from "@/types/quiz";

interface QuizPlayingProps {
  activeQuestions: Question[];
  currentQuestionIndex: number;
  score: number;
  selectedOption: number | null;
  setSelectedOption: (val: number | null) => void;
  onNext: () => void;
  onCancel: () => void;
}

export default function QuizPlaying({
  activeQuestions,
  currentQuestionIndex,
  score,
  selectedOption,
  setSelectedOption,
  onNext,
  onCancel
}: QuizPlayingProps) {
  const { t } = useLanguage();
  const currentQuestion = activeQuestions[currentQuestionIndex];

  return (
    <div className="w-full max-w-[42rem] slide-up">
      {/* Progress Bar */}
      <div className="mb-8 flex items-center justify-between">
        <span className="font-label-lg text-on-surface-variant">
          {t("quiz.playing.progress").replace("{{current}}", (currentQuestionIndex + 1).toString()).replace("{{total}}", activeQuestions.length.toString())}
        </span>
        <span className="font-label-lg text-primary">{t("quiz.playing.score").replace("{{score}}", score.toString())}</span>
      </div>
      <div className="w-full bg-surface-container-highest rounded-full h-2.5 mb-10 overflow-hidden">
        <div 
          className="bg-primary h-2.5 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Display */}
      <div className="glass-card p-8 md:p-10 rounded-[32px] mb-8 shadow-lg border border-outline-variant/30 relative">
        <div className="absolute top-4 start-6 bg-secondary/10 text-secondary px-3 py-1 rounded-full text-label-sm font-bold flex items-center gap-1">
          <BrainCircuit className="w-3 h-3" /> {t("quiz.playing.badge")}
        </div>
        <h2 className="font-headline-md text-headline-md text-on-surface leading-tight mb-8 mt-4 text-start">
          {currentQuestion.question}
        </h2>

        <div className="space-y-4">
          {currentQuestion.options.map((option: string, idx: number) => (
            <button
              key={idx}
              onClick={() => setSelectedOption(idx)}
              className={`w-full text-start p-5 rounded-2xl border-2 transition-all flex items-center gap-4 group ${
                selectedOption === idx 
                  ? "border-primary bg-primary/5 text-primary shadow-sm" 
                  : "border-outline-variant/40 hover:border-primary/40 bg-surface-container-lowest hover:bg-surface-container"
              }`}
            >
              <div className={`shrink-0 transition-colors ${selectedOption === idx ? "text-primary" : "text-outline"}`}>
                {selectedOption === idx ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
              </div>
              <span className="font-body-lg">{option}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={onCancel}
          className="text-on-surface-variant hover:text-error flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-label-lg"
        >
          {t("quiz.playing.cancel")}
        </button>

        <button
          onClick={onNext}
          disabled={selectedOption === null}
          className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
            selectedOption !== null 
              ? "bg-primary text-on-primary shadow-md hover:scale-105 active:scale-95" 
              : "bg-surface-container-high text-on-surface-variant/50 cursor-not-allowed"
          }`}
        >
          {currentQuestionIndex === activeQuestions.length - 1 ? t("quiz.playing.finish") : t("quiz.playing.next")} 
          <ArrowLeft className="w-5 h-5 rtl:-scale-x-100" />
        </button>
      </div>
    </div>
  );
}
