import { Play, Video } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { InterviewConfig } from "@/types/interview";

interface InterviewIdleProps {
  config: InterviewConfig;
  onEdit: () => void;
  onStart: () => void;
}

export default function InterviewIdle({ config, onEdit, onStart }: InterviewIdleProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center text-center glass-card p-xl rounded-3xl max-w-[32rem] border-2 border-transparent hover:border-primary/20 transition-colors shadow-xl">
      <div className="w-24 h-24 bg-primary/10 rounded-3xl flex items-center justify-center mb-6 shadow-inner">
        <Video className="w-12 h-12 text-primary" />
      </div>
      <h2 className="font-headline-xl text-headline-xl text-primary mb-4">{t("interview.idle.title")}</h2>
      <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
        {t("interview.idle.desc1")} <strong>{config.jobTitle}</strong> {t("interview.idle.desc2")} <strong>{config.company}</strong>.
        <br/><br/>
        {t("interview.idle.desc3")}
      </p>
      <div className="flex gap-4">
        <button 
          onClick={onEdit}
          className="px-6 py-4 bg-surface-variant text-on-surface-variant rounded-full font-bold text-lg hover:bg-surface-container transition-all"
        >
          {t("interview.idle.editBtn")}
        </button>
        <button 
          onClick={onStart}
          className="px-8 py-4 bg-primary text-on-primary rounded-full font-bold text-lg hover:bg-primary/90 transition-all flex items-center gap-sm shadow-lg hover:-translate-y-1 hover:shadow-xl active:scale-95"
        >
          <Play className="w-6 h-6 fill-current" /> {t("interview.idle.startBtn")}
        </button>
      </div>
    </div>
  );
}
