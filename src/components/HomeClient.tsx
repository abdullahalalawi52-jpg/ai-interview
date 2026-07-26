"use client";
import { useState, useEffect } from "react";
import { HeroSection } from "./home/HeroSection";
import { FeaturesSection } from "./home/FeaturesSection";
import { CtaSection } from "./home/CtaSection";
import { useLanguage } from "@/context/LanguageContext";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Suspense } from "react";

function HomeContent() {
  const { language, t } = useLanguage();
  const [phraseIndex, setPhraseIndex] = useState(0);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { openAuthModal } = useAuth();

  useEffect(() => {
    if (searchParams?.get("login") === "true") {
      openAuthModal();
      // Remove the query parameter so it doesn't trigger again on refresh
      router.replace(pathname, { scroll: false });
    }
  }, [searchParams, openAuthModal, router, pathname]);

  const phrases = language === "ar" ? [
    "تدرب في بيئة آمنة خالية من التوتر 🎯",
    "اكتشف الفجوات في سيرتك الذاتية 📄",
    "احصل على تقييم فوري ومفصل لأدائك ⚡",
    "تجاوز رهبة المقابلات بثقة تامة 🚀"
  ] : [
    "Practice in a safe, stress-free environment 🎯",
    "Discover gaps in your resume 📄",
    "Get instant, detailed feedback on your performance ⚡",
    "Overcome interview anxiety with full confidence 🚀"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [phrases.length]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <>
      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/10 blur-[100px] animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-cyan-400/10 blur-[150px] animate-blob animation-delay-4000"></div>
      </div>

      <main id="main-content" className="hero-gradient relative z-10" tabIndex={-1}>
        <HeroSection 
          t={t}
          phrases={phrases}
          phraseIndex={phraseIndex}
          handleMouseMove={handleMouseMove}
        />

        <FeaturesSection t={t} />

        <CtaSection t={t} />
      </main>

    </>
  );
}

export default function HomeClient() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
