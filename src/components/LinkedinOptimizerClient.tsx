"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X, Sparkles, CheckCircle2, TrendingUp, AlertTriangle, Copy, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

interface LinkedinResult {
  headline: string;
  aboutSection: string;
  keywords: string[];
  experienceTips: string[];
}

export default function LinkedinOptimizerClient() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LinkedinResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [copiedHeadline, setCopiedHeadline] = useState(false);
  const [copiedAbout, setCopiedAbout] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf") {
        setFile(droppedFile);
        setError(null);
      } else {
        setError(t("linkedinOptimizer.errorPdfOnly"));
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type === "application/pdf") {
        setFile(selectedFile);
        setError(null);
      } else {
        setError(t("linkedinOptimizer.errorPdfOnly"));
      }
    }
  };

  const handleScan = async () => {
    if (!file) {
      setError(t("linkedinOptimizer.errorMissing"));
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    setCopiedHeadline(false);
    setCopiedAbout(false);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("language", language);

      const token = user ? await user.getIdToken() : "";

      const res = await fetch("/api/linkedin", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to process");
      }

      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(t("errors.default"));
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string, type: 'headline' | 'about') => {
    navigator.clipboard.writeText(text);
    if (type === 'headline') {
      setCopiedHeadline(true);
      setTimeout(() => setCopiedHeadline(false), 2000);
    } else {
      setCopiedAbout(true);
      setTimeout(() => setCopiedAbout(false), 2000);
    }
    toast.success(t("linkedinOptimizer.copied"));
  };

  return (
    <>

      <main className="min-h-screen flex flex-col items-center justify-start bg-surface text-on-surface p-4 md:p-8 pt-24 text-start relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-[-10%] start-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] end-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="w-full max-w-[80rem] relative z-10 grid grid-cols-1 xl:grid-cols-12 gap-8">
          
          {/* Left Column: Input Form */}
          <div className="xl:col-span-5 flex flex-col gap-6 h-full">
            <div className="mb-6">
              <h1 className="font-headline-lg text-headline-lg font-bold text-primary mb-3 flex items-center gap-3">
                <Sparkles className="w-8 h-8" />
                {t("linkedinOptimizer.title")}
              </h1>
              <p className="text-body-lg text-on-surface-variant leading-relaxed">
                {t("linkedinOptimizer.subtitle")}
              </p>
            </div>

            <div className="glass-card p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/50 flex flex-col flex-1">
              
              <div className="mb-8">
                <h3 className="font-headline-sm font-bold mb-4 text-on-surface flex items-center gap-2">
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                  {t("linkedinOptimizer.step1")}
                </h3>
                
                <div 
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all duration-300 cursor-pointer h-48
                    ${isDragging ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-outline-variant hover:border-primary/50 hover:bg-surface-variant'}
                    ${file ? 'border-success bg-success/5' : ''}
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="application/pdf" 
                    className="hidden" 
                  />
                  
                  {file ? (
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-success/20 text-success rounded-full flex items-center justify-center mb-3">
                        <FileText className="w-8 h-8" />
                      </div>
                      <p className="font-bold text-on-surface truncate max-w-[200px]">{file.name}</p>
                      <p className="text-xs text-success font-medium mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      <button 
                        className="mt-4 text-xs text-error hover:underline flex items-center gap-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                      >
                        <X className="w-3 h-3" /> إزالة
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-surface-container-high text-on-surface-variant rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                        <Upload className="w-8 h-8" />
                      </div>
                      <p className="font-bold text-on-surface mb-1">{t("linkedinOptimizer.clickToUpload")}</p>
                      <p className="text-on-surface-variant text-sm">{t("linkedinOptimizer.orDrag")}</p>
                      <p className="text-xs text-on-surface-variant/70 mt-4">{t("linkedinOptimizer.maxSize")}</p>
                    </>
                  )}
                </div>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-error/10 text-error rounded-xl flex items-start gap-3 border border-error/20"
                >
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{error}</p>
                </motion.div>
              )}

              <div className="mt-auto pt-4 border-t border-outline-variant/30">
                <button
                  onClick={handleScan}
                  disabled={!file || loading}
                  className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold shadow-md hover:shadow-lg active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                      {t("linkedinOptimizer.analyzing")}
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      {t("linkedinOptimizer.scanBtn")}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="xl:col-span-7 h-full flex flex-col">
            <AnimatePresence mode="wait">
              {!result && !loading ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 glass-card p-12 rounded-3xl border border-outline-variant/30 flex flex-col items-center justify-center text-center bg-surface-container-lowest/50 min-h-[600px]"
                >
                  <div className="w-32 h-32 mb-6 relative">
                    <div className="absolute inset-0 bg-primary/5 rounded-full blur-xl animate-pulse"></div>
                    <div className="w-full h-full border-2 border-dashed border-primary/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-12 h-12 text-primary/30" />
                    </div>
                  </div>
                  <h3 className="font-headline-sm font-bold text-on-surface-variant mb-2">{t("linkedinOptimizer.resultsPlaceholderTitle")}</h3>
                  <p className="text-on-surface-variant/70">{t("linkedinOptimizer.resultsPlaceholderDesc")}</p>
                </motion.div>
              ) : loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex-1 glass-card p-8 md:p-12 rounded-3xl border border-outline-variant/30 flex flex-col items-center justify-center text-center bg-surface-container-lowest/50 min-h-[600px]"
                >
                  <div className="relative w-32 h-32 mb-8">
                    <div className="absolute inset-0 border-4 border-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                    </div>
                  </div>
                  <h3 className="font-headline-sm font-bold text-primary mb-3">{t("linkedinOptimizer.aiReading")}</h3>
                  <div className="w-48 h-2 bg-surface-variant rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-pulse w-full"></div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex-1 space-y-6"
                >
                  {/* Headline */}
                  <div className="glass-card p-6 md:p-8 rounded-3xl shadow-sm border border-primary/30 relative overflow-hidden group">
                    <div className="absolute top-0 end-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-headline-sm font-bold text-primary flex items-center gap-2">
                        <TrendingUp className="w-6 h-6" />
                        {t("linkedinOptimizer.headline")}
                      </h3>
                      <button 
                        onClick={() => copyToClipboard(result!.headline, 'headline')}
                        className="p-2 rounded-xl bg-surface-variant text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2 text-sm font-bold"
                      >
                        {copiedHeadline ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                        <span className="hidden sm:inline">{copiedHeadline ? t("linkedinOptimizer.copied") : t("linkedinOptimizer.copy")}</span>
                      </button>
                    </div>
                    <p className="font-body-xl font-bold text-on-surface leading-relaxed relative z-10">
                      {result?.headline}
                    </p>
                  </div>

                  {/* About Section */}
                  <div className="glass-card p-6 md:p-8 rounded-3xl shadow-sm border border-outline-variant/50">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-headline-sm font-bold text-on-surface flex items-center gap-2">
                        <FileText className="w-6 h-6 text-secondary" />
                        {t("linkedinOptimizer.about")}
                      </h3>
                      <button 
                        onClick={() => copyToClipboard(result!.aboutSection, 'about')}
                        className="p-2 rounded-xl bg-surface-variant text-on-surface-variant hover:text-secondary transition-colors flex items-center gap-2 text-sm font-bold"
                      >
                        {copiedAbout ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
                        <span className="hidden sm:inline">{copiedAbout ? t("linkedinOptimizer.copied") : t("linkedinOptimizer.copy")}</span>
                      </button>
                    </div>
                    <div className="bg-surface p-5 rounded-2xl border border-outline-variant/30 text-on-surface-variant leading-relaxed whitespace-pre-wrap font-body-lg">
                      {result?.aboutSection}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Keywords */}
                    <div className="glass-card p-6 rounded-3xl shadow-sm border border-outline-variant/50">
                      <h3 className="font-headline-sm font-bold mb-4 flex items-center gap-2 text-on-surface">
                        <CheckCircle2 className="w-5 h-5 text-success" />
                        {t("linkedinOptimizer.keywords")}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {result?.keywords.map((keyword, i) => (
                          <span key={i} className="px-3 py-1.5 bg-success/10 text-success border border-success/20 rounded-full text-sm font-bold">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Experience Tips */}
                    <div className="glass-card p-6 rounded-3xl shadow-sm border border-outline-variant/50">
                      <h3 className="font-headline-sm font-bold mb-4 flex items-center gap-2 text-on-surface">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        {t("linkedinOptimizer.experienceTips")}
                      </h3>
                      <ul className="space-y-3">
                        {result?.experienceTips.map((tip, i) => (
                          <li key={i} className="flex items-start gap-3">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                            <p className="text-sm text-on-surface-variant leading-relaxed">{tip}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

    </>
  );
}
