"use client";

import { useState } from "react";
import { Upload, FileText, Briefcase, CheckCircle2, AlertCircle, TrendingUp, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { AnimatedCounter } from "@/components/ui/AnimatedCounter";

export default function AtsScannerPage() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<{
    matchScore: number;
    missingKeywords: string[];
    strengths: string[];
    improvementTips: string[];
  } | null>(null);
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        setError(t("atsScanner.errorPdfOnly"));
        setFile(null);
        return;
      }
      setError("");
      setFile(selectedFile);
    }
  };

  const handleScan = async () => {
    if (!file || !jobDescription.trim()) {
      setError(t("atsScanner.errorMissing"));
      return;
    }
    setError("");
    setIsScanning(true);
    setResult(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jobDescription);
    formData.append("language", language);

    try {
      const token = user ? await user.getIdToken() : "";
      const response = await fetch("/api/ats", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || t("atsScanner.errorDefault"));
      }

      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg === "Failed to fetch" || msg.includes("fetch")) {
        setError(t("errors.network"));
      } else {
        setError(msg || t("errors.default"));
      }
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-surface">
      
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner">
            <FileText className="w-10 h-10 text-primary" />
          </div>
          <h1 className="font-headline-xl text-headline-xl text-on-surface mb-4">{t("atsScanner.title")}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            {t("atsScanner.subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl shadow-sm border border-outline-variant/30">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-primary" />
                {t("atsScanner.step1")}
              </h2>
              
              <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-2xl cursor-pointer transition-colors ${file ? 'border-primary bg-primary/5' : 'border-outline-variant hover:bg-surface-variant/50'}`}>
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {file ? (
                    <>
                      <CheckCircle2 className="w-10 h-10 text-primary mb-3" />
                      <p className="text-sm font-bold text-on-surface">{file.name}</p>
                      <p className="text-xs text-on-surface-variant mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-on-surface-variant mb-3 opacity-50" />
                      <p className="text-sm text-on-surface-variant mb-1"><span className="font-bold">{t("atsScanner.clickToUpload")}</span> {t("atsScanner.orDrag")}</p>
                      <p className="text-xs text-on-surface-variant opacity-70">{t("atsScanner.maxSize")}</p>
                    </>
                  )}
                </div>
                <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
              </label>
            </div>

            <div className="glass-card p-6 rounded-3xl shadow-sm border border-outline-variant/30">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary" />
                {t("atsScanner.step2")}
              </h2>
              <textarea 
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder={t("atsScanner.placeholder")}
                className="w-full bg-surface-container border border-outline-variant rounded-xl p-4 focus:outline-none focus:border-primary transition-colors resize-none text-sm"
              />
            </div>

            {error && (
              <div className="bg-error/10 text-error p-4 rounded-xl flex items-center gap-2 text-sm font-bold border border-error/20">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}

            <button 
              onClick={handleScan}
              disabled={isScanning || !file || !jobDescription.trim()}
              className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-lg shadow-md hover:shadow-lg transition-all disabled:opacity-50 hover:-translate-y-1 active:scale-95 flex justify-center items-center gap-2"
            >
              {isScanning ? (
                <>
                  <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin" />
                  {t("atsScanner.analyzing")}
                </>
              ) : t("atsScanner.scanBtn")}
            </button>
          </div>

          {/* Results Section */}
          <div className="glass-card p-6 md:p-8 rounded-3xl shadow-xl border border-outline-variant/30 bg-surface-container-lowest relative overflow-hidden min-h-[500px]">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            {!result && !isScanning && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <TrendingUp className="w-16 h-16 mb-4 text-on-surface-variant" />
                <p className="font-bold">{t("atsScanner.resultsPlaceholderTitle")}</p>
                <p className="text-sm mt-2">{t("atsScanner.resultsPlaceholderDesc")}</p>
              </div>
            )}

            {isScanning && (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 mb-6">
                  <div className="w-full h-full border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
                <h3 className="font-bold text-lg animate-pulse text-primary">{t("atsScanner.aiReading")}</h3>
                <p className="text-sm text-on-surface-variant mt-2">{t("atsScanner.matchingSkills")}</p>
              </div>
            )}

            {result && !isScanning && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8 relative z-10"
              >
                <div className="text-center">
                  <h3 className="font-bold text-xl mb-6 text-on-surface">{t("atsScanner.matchScore")}</h3>
                  
                  {/* Circular Progress */}
                  <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-surface-variant" strokeWidth="3"></circle>
                      <circle cx="18" cy="18" r="16" fill="none" className={`stroke-current ${result.matchScore >= 80 ? 'text-green-500' : result.matchScore >= 50 ? 'text-amber-500' : 'text-error'}`} strokeWidth="3" strokeDasharray="100" strokeDashoffset={100 - result.matchScore} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}></circle>
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className={`text-4xl font-black ${result.matchScore >= 80 ? 'text-green-600' : result.matchScore >= 50 ? 'text-amber-600' : 'text-error'}`}>
                        <AnimatedCounter value={result.matchScore} />%
                      </span>
                      <span className="text-xs font-bold text-on-surface-variant mt-1 uppercase tracking-wider">
                        {result.matchScore >= 80 ? t("atsScanner.excellent") : result.matchScore >= 50 ? t("atsScanner.good") : t("atsScanner.poor")}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-2xl">
                    <h4 className="font-bold text-green-700 flex items-center gap-2 mb-3">
                      <CheckCircle2 className="w-4 h-4" /> {t("atsScanner.strengths")}
                    </h4>
                    <ul className="space-y-2 text-sm text-on-surface">
                      {result.strengths.map((item, i) => (
                        <li key={i} className="flex gap-2 items-start"><span className="text-green-500 mt-1">•</span> {item}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-error/10 border border-error/20 p-4 rounded-2xl">
                    <h4 className="font-bold text-error flex items-center gap-2 mb-3">
                      <XCircle className="w-4 h-4" /> {t("atsScanner.missingKeywords")}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {result.missingKeywords.map((keyword, i) => (
                        <span key={i} className="px-2 py-1 bg-surface rounded-md text-xs font-bold text-error border border-error/20">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 border border-primary/20 p-5 rounded-2xl">
                  <h4 className="font-bold text-primary flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4" /> {t("atsScanner.tips")}
                  </h4>
                  <ul className="space-y-3 text-sm text-on-surface">
                    {result.improvementTips.map((tip, i) => (
                      <li key={i} className="flex gap-3 items-start">
                        <div className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">{i+1}</div>
                        <span className="leading-relaxed">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </main>
      
    </div>
  );
}
