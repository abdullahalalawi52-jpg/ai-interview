"use client";

import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function FloatingActionButton() {
  const { t } = useLanguage();

  return (
    <Link 
      href="/interview" 
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 lg:gap-3 bg-gradient-to-r from-[#A78BFA] to-[#818CF8] hover:from-[#8B5CF6] hover:to-[#6366F1] text-white p-2 ps-5 lg:p-2.5 lg:ps-6 rounded-full font-bold text-sm lg:text-base shadow-[0_8px_30px_rgb(139,92,246,0.35)] hover:shadow-[0_12px_40px_rgb(139,92,246,0.45)] hover:-translate-y-1 transition-all duration-300 active:scale-95 animate-pulse-glow group"
    >
      <span className="whitespace-nowrap leading-none pt-[2px]">{t("nav.startInterview")}</span>
      <div className="flex items-center justify-center w-8 h-8 lg:w-10 lg:h-10 bg-white/95 rounded-full group-hover:bg-white transition-colors shrink-0 shadow-sm">
        <ArrowUpLeft className="w-4 h-4 lg:w-5 lg:h-5 text-[#8B5CF6]" strokeWidth={2.5} />
      </div>
    </Link>
  );
}
