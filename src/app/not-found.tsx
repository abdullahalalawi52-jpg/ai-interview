"use client";

import Link from "next/link";
import { AlertCircle, Home } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-surface text-on-surface">
      <div className="w-24 h-24 bg-error/10 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <AlertCircle className="w-12 h-12 text-error" />
      </div>
      <h1 className="text-4xl md:text-5xl font-black mb-4 text-primary">404</h1>
      <h2 className="text-2xl font-bold mb-4">
        {t("errors.notFound") || "عذراً، الصفحة غير موجودة"}
      </h2>
      <p className="text-on-surface-variant max-w-md mb-8">
        {t("errors.notFoundDesc") || "يبدو أنك تبحث عن صفحة غير موجودة أو تم نقلها."}
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 px-8 py-4 bg-primary text-on-primary rounded-full font-bold hover:bg-primary/90 hover:scale-105 transition-all shadow-md"
      >
        <Home className="w-5 h-5" />
        {t("nav.home") || "العودة للرئيسية"}
      </Link>
    </div>
  );
}
