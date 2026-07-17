import { Settings2, Building2, Briefcase, GraduationCap, CheckCircle2, BrainCircuit } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface QuizConfigProps {
  companyName: string;
  setCompanyName: (val: string) => void;
  jobTitle: string;
  setJobTitle: (val: string) => void;
  specialization: string;
  setSpecialization: (val: string) => void;
  selectedCount: number;
  setSelectedCount: (val: number) => void;
  onBack: () => void;
  onGenerate: () => void;
}

const QUESTION_COUNTS = [5, 10, 15];

export default function QuizConfig({
  companyName,
  setCompanyName,
  jobTitle,
  setJobTitle,
  specialization,
  setSpecialization,
  selectedCount,
  setSelectedCount,
  onBack,
  onGenerate
}: QuizConfigProps) {
  const { t, language } = useLanguage();

  return (
    <div className="glass-card w-full max-w-[42rem] p-8 md:p-12 rounded-[32px] border border-white/10 shadow-2xl slide-up text-start bg-surface/80 backdrop-blur-xl">
      <div className="flex items-center gap-4 mb-2">
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Settings2 className="w-6 h-6 text-primary" />
        </div>
        <h1 className="font-headline-lg text-headline-lg text-on-surface">{t("quiz.config.title")}</h1>
      </div>
      <p className="text-on-surface-variant font-body-md mb-8 ltr:pl-16 rtl:pr-16">
        {language === 'ar' ? 'قم بتعبئة بيانات الوظيفة المستهدفة ليقوم الذكاء الاصطناعي بتوليد أسئلة مخصصة لتقييم مهاراتك بدقة.' : 'Fill in the target job details so our AI can generate customized questions to accurately assess your skills.'}
      </p>
      
      <div className="space-y-5">
        <div>
          <label className="block font-label-lg mb-2 text-on-surface">{t("quiz.config.company")}</label>
          <div className="relative group">
            <input
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder={t("quiz.config.companyPlaceholder")}
              className="peer w-full bg-surface-container/50 hover:bg-surface-container border border-outline-variant/50 hover:border-outline-variant rounded-2xl py-4 px-12 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-surface transition-all duration-300 text-on-surface text-start shadow-sm focus:shadow-md"
            />
            <div className="absolute inset-y-0 end-0 w-12 flex items-center justify-center pointer-events-none text-on-surface-variant peer-focus:text-primary transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div>
          <label className="block font-label-lg mb-2 text-on-surface">{t("quiz.config.job")}</label>
          <div className="relative group">
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder={t("quiz.config.jobPlaceholder")}
              className="peer w-full bg-surface-container/50 hover:bg-surface-container border border-outline-variant/50 hover:border-outline-variant rounded-2xl py-4 px-12 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-surface transition-all duration-300 text-on-surface text-start shadow-sm focus:shadow-md"
            />
            <div className="absolute inset-y-0 end-0 w-12 flex items-center justify-center pointer-events-none text-on-surface-variant peer-focus:text-primary transition-colors">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
        </div>

        <div>
          <label className="block font-label-lg mb-2 text-on-surface">{t("quiz.config.spec")}</label>
          <div className="relative group">
            <input
              type="text"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              placeholder={t("quiz.config.specPlaceholder")}
              className="peer w-full bg-surface-container/50 hover:bg-surface-container border border-outline-variant/50 hover:border-outline-variant rounded-2xl py-4 px-12 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 focus:bg-surface transition-all duration-300 text-on-surface text-start shadow-sm focus:shadow-md"
            />
            <div className="absolute inset-y-0 end-0 w-12 flex items-center justify-center pointer-events-none text-on-surface-variant peer-focus:text-primary transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
          </div>
        </div>

        <hr className="my-8 border-outline-variant/20" />

        {/* Questions Count */}
        <div>
          <label className="block font-label-lg mb-4 text-on-surface">{t("quiz.config.count")}</label>
          <div className="grid grid-cols-3 gap-4">
            {QUESTION_COUNTS.map(count => (
              <button
                key={count}
                onClick={() => setSelectedCount(count)}
                className={`relative flex flex-col items-center justify-center py-4 px-2 rounded-2xl transition-all duration-300 border-2 overflow-hidden ${
                  selectedCount === count 
                    ? 'bg-primary/5 border-primary text-primary shadow-sm scale-[1.02]' 
                    : 'bg-surface-container/30 border-outline-variant/30 hover:bg-surface-container hover:border-outline-variant text-on-surface-variant'
                }`}
              >
                {selectedCount === count && (
                  <div className="absolute top-2 start-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                  </div>
                )}
                <span className="font-headline-sm font-bold mb-1">{count}</span>
                <span className="font-label-sm">{t("quiz.config.questions")}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-end gap-4 border-t border-outline-variant/20 pt-6">
        <button 
          onClick={onBack}
          className="px-6 py-3 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-xl font-bold transition-all"
        >
          {t("quiz.config.back")}
        </button>
        <button 
          onClick={onGenerate}
          className="group relative px-8 py-3 bg-primary text-on-primary rounded-xl font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out rtl:translate-x-[100%] rtl:group-hover:translate-x-[-100%]"></div>
          {t("quiz.config.generate")} <BrainCircuit className="w-5 h-5 group-hover:animate-pulse" />
        </button>
      </div>
    </div>
  );
}
