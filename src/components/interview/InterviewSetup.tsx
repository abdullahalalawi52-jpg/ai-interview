import { useState } from "react";
import { Settings, Upload, CheckCircle } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { InterviewConfig } from "@/types/interview";

interface InterviewSetupProps {
  config: InterviewConfig;
  setConfig: (config: InterviewConfig) => void;
  onSave: () => void;
}

export default function InterviewSetup({ config, setConfig, onSave }: InterviewSetupProps) {
  const { t } = useLanguage();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || file.type !== 'application/pdf') return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const res = await fetch('/api/parse-cv', {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) throw new Error('Upload failed');
      
      const data = await res.json();
      setConfig({ ...config, resumeText: data.text });
    } catch (err) {
      console.error(err);
      // Minimal error handling for MVP
      alert("Failed to parse PDF. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl w-full max-w-[42rem] shadow-xl">
      <div className="flex items-center gap-3 mb-5 border-b border-outline-variant/30 pb-4">
        <Settings className="w-6 h-6 text-primary" />
        <h2 className="font-headline-md text-headline-md text-on-surface">{t("interview.setup.title")}</h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-on-surface mb-2">{t("interview.setup.company")}</label>
          <input 
            type="text" 
            value={config.company}
            onChange={(e) => setConfig({...config, company: e.target.value})}
            placeholder={t("interview.setup.companyPlaceholder")} 
            className="w-full bg-surface border border-outline-variant rounded-xl p-3 focus:outline-none focus:border-primary transition-colors text-start" 
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-on-surface mb-2">{t("interview.setup.job")}</label>
          <input 
            type="text" 
            value={config.jobTitle}
            onChange={(e) => setConfig({...config, jobTitle: e.target.value})}
            placeholder={t("interview.setup.jobPlaceholder")} 
            className="w-full bg-surface border border-outline-variant rounded-xl p-3 focus:outline-none focus:border-primary transition-colors text-start" 
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-bold text-on-surface mb-2">{t("interview.setup.spec")}</label>
          <input 
            type="text" 
            value={config.specialization}
            onChange={(e) => setConfig({...config, specialization: e.target.value})}
            placeholder={t("interview.setup.specPlaceholder")} 
            className="w-full bg-surface border border-outline-variant rounded-xl p-3 focus:outline-none focus:border-primary transition-colors text-start" 
          />
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-bold text-on-surface mb-2">{t("interview.setup.type")}</label>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setConfig({...config, interviewType: "technical"})}
              className={`p-3 rounded-xl border transition-colors flex flex-col items-center justify-center text-center gap-1 ${config.interviewType === 'technical' ? 'bg-primary text-on-primary border-primary' : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-variant'}`}
            >
              <span className="text-sm font-bold">{t("interview.setup.typeTech")}</span>
              <span className={`text-xs ${config.interviewType === 'technical' ? 'text-on-primary/80' : 'text-on-surface-variant/80'}`}>{t("interview.setup.typeTechDesc")}</span>
            </button>
            <button 
              onClick={() => setConfig({...config, interviewType: "behavioral"})}
              className={`p-3 rounded-xl border transition-colors flex flex-col items-center justify-center text-center gap-1 ${config.interviewType === 'behavioral' ? 'bg-primary text-on-primary border-primary' : 'bg-surface border-outline-variant text-on-surface-variant hover:bg-surface-variant'}`}
            >
              <span className="text-sm font-bold">{t("interview.setup.typeBehav")}</span>
              <span className={`text-xs ${config.interviewType === 'behavioral' ? 'text-on-primary/80' : 'text-on-surface-variant/80'}`}>{t("interview.setup.typeBehavDesc")}</span>
            </button>
          </div>
        </div>
        
        {/* CV Upload */}
        <div className="sm:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
            <div>
              <label className="block text-sm font-bold text-on-surface">{t("interview.setup.cvUpload")}</label>
              <p className="text-xs text-on-surface-variant">{t("interview.setup.cvUploadDesc")}</p>
            </div>
          </div>
          <div className="relative">
            <input 
              type="file" 
              accept="application/pdf"
              onChange={handleFileUpload}
              disabled={isUploading || !!config.resumeText}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
            <div className={`w-full border-2 border-dashed rounded-xl p-3 flex flex-row items-center justify-center gap-3 transition-colors ${config.resumeText ? 'border-success bg-success/10' : 'border-outline-variant hover:border-primary bg-surface'}`}>
              {isUploading ? (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              ) : config.resumeText ? (
                <CheckCircle className="w-5 h-5 text-success" />
              ) : (
                <Upload className="w-5 h-5 text-on-surface-variant" />
              )}
              <span className={`text-sm font-bold ${config.resumeText ? 'text-success' : 'text-on-surface-variant'}`}>
                {isUploading ? t("interview.setup.cvUploading") : config.resumeText ? t("interview.setup.cvParsed") : "PDF"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={onSave}
        disabled={!config.company || !config.jobTitle}
        className="w-full mt-6 py-3 bg-primary text-on-primary rounded-xl font-bold disabled:opacity-50 hover:bg-primary/90 transition-colors"
      >
        {t("interview.setup.saveBtn")}
      </button>
    </div>
  );
}
