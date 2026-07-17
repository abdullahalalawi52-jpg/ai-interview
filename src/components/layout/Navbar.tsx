"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BrainCircuit, Globe, Moon, Sun, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout, openAuthModal } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const isActive = (path: string) => {
    return pathname === path ? "text-primary font-bold border-b-2 border-primary pb-1" : "text-on-surface-variant hover:text-primary transition-colors";
  };
  
  const isActiveMobile = (path: string) => {
    return pathname === path ? "text-primary font-bold bg-primary/10 rounded-lg" : "text-on-surface-variant hover:text-primary hover:bg-surface-variant rounded-lg transition-colors";
  };

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navLinks = [
    ...(user ? [{ path: "/dashboard", label: t("nav.dashboard") }] : []),
    { path: "/leaderboard", label: t("nav.leaderboard") },
    { path: "/ats-scanner", label: t("nav.atsScanner") },
    { path: "/gap-analyzer", label: t("nav.gapAnalyzer") },
    { path: "/quiz", label: t("nav.quiz") }
  ];

  return (
    <header className="docked full-width top-0 z-50 sticky bg-surface/95 dark:bg-surface-dim/95 backdrop-blur-md shadow-sm border-b border-outline-variant/30 transition-colors duration-300">
      <nav className="flex items-center justify-between px-gutter w-full max-w-container-max mx-auto h-16">
        
        {/* Brand & Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <button 
            className="md:hidden p-2 text-on-surface-variant hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "إغلاق القائمة" : "فتح القائمة"}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link href="/" className="flex items-center gap-sm group">
            <span className="text-headline-md font-headline-md text-primary hidden sm:block">{t("nav.brand")}</span>
            <BrainCircuit className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
          </Link>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-xl font-body-md text-body-md">
          {navLinks.map((link) => (
             <Link key={link.path} className={isActive(link.path)} href={link.path}>{link.label}</Link>
          ))}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-md">
          {mounted && (
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          )}

          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-all text-sm font-bold border border-outline-variant/30" 
            aria-label="Language"
          >
            <Globe className="w-4 h-4" />
            <span className="hidden sm:inline">{language === "ar" ? "English" : "العربية"}</span>
            <span className="sm:hidden">{language === "ar" ? "EN" : "AR"}</span>
          </button>

          {!loading && !user && (
            <button onClick={openAuthModal} className="text-on-surface-variant hover:text-primary font-bold transition-colors hidden sm:block">
              {t("nav.login")}
            </button>
          )}
          {!loading && user && (
            <button onClick={logout} className="text-error hover:text-error/80 font-bold transition-colors hidden sm:block">
              {t("nav.logout")}
            </button>
          )}
          
          <Link href="/interview" className="bg-primary text-on-primary px-3 sm:px-lg py-1.5 sm:py-sm rounded-lg font-label-md transition-all duration-200 active:scale-95 hover:bg-primary/90 shadow-md hover:shadow-lg whitespace-nowrap">
            {t("nav.startInterview")}
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-outline-variant/30 bg-surface/95 backdrop-blur-md overflow-hidden"
          >
            <div className="flex flex-col px-4 py-4 gap-2">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-4 py-3 ${isActiveMobile(link.path)}`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px bg-outline-variant/30 my-2"></div>
              
              <div className="flex items-center justify-between px-4 py-2">
                <span className="font-bold text-on-surface-variant">{language === "ar" ? "اللغة" : "Language"}</span>
                <button 
                  onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-all text-sm font-bold border border-outline-variant/30" 
                  aria-label={language === "ar" ? "تغيير اللغة" : "Change Language"}
                >
                  <Globe className="w-4 h-4" />
                  <span>{language === "ar" ? "English" : "العربية"}</span>
                </button>
              </div>

              {mounted && (
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="font-bold text-on-surface-variant">{language === "ar" ? "المظهر" : "Theme"}</span>
                  <button 
                    onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                    className="p-2 rounded-full text-on-surface-variant bg-surface-container border border-outline-variant/30 hover:text-primary hover:bg-surface-variant transition-colors"
                    aria-label={theme === "dark" ? "الوضع الفاتح" : "الوضع المظلم"}
                  >
                    {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>
              )}

              <div className="h-px bg-outline-variant/30 my-2"></div>

              {!loading && !user && (
                <button 
                  onClick={() => { openAuthModal(); setIsMobileMenuOpen(false); }} 
                  className="px-4 py-3 text-start font-bold text-on-surface-variant hover:bg-surface-variant rounded-lg"
                >
                  {t("nav.login")}
                </button>
              )}
              {!loading && user && (
                <button 
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }} 
                  className="px-4 py-3 text-start font-bold text-error hover:bg-error-container rounded-lg"
                >
                  {t("nav.logout")}
                </button>
              )}

              <Link 
                href="/interview" 
                onClick={() => setIsMobileMenuOpen(false)}
                className="mt-2 text-center bg-primary text-on-primary py-3 rounded-lg font-bold shadow-md active:scale-95 transition-all"
              >
                {t("nav.startInterview")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
