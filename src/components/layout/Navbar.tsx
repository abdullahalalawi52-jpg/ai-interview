"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BrainCircuit, Globe, Moon, Sun, Menu, X, LayoutDashboard, Trophy, FileSearch, Briefcase, Target, Brain } from "lucide-react";
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

  const isActiveMobile = (path: string) => {
    return pathname === path ? "text-primary font-bold bg-primary/10 rounded-xl" : "text-on-surface-variant hover:text-primary hover:bg-surface-variant rounded-xl transition-colors";
  };

  const toggleLanguage = () => {
    setLanguage(language === "ar" ? "en" : "ar");
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navLinks = [
    { path: "/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { path: "/leaderboard", label: t("nav.leaderboard"), icon: Trophy },
    { path: "/ats-scanner", label: t("nav.atsScanner"), icon: FileSearch },
    { path: "/linkedin-optimizer", label: t("nav.linkedinOptimizer"), icon: Briefcase },
    { path: "/gap-analyzer", label: t("nav.gapAnalyzer"), icon: Target },
    { path: "/quiz", label: t("nav.quiz"), icon: Brain }
  ];

  return (
    <header className="fixed w-full top-3 z-50 px-4">
      <nav className="flex items-center justify-between h-20 px-4 md:px-6 xl:px-8 w-full max-w-[1536px] mx-auto gap-4 bg-surface/95 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.08)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-outline-variant/20 transition-colors duration-300 rounded-[2.5rem]">
        
        {/* Logo (الجانب الأيمن) */}
        <div className="flex items-center shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex items-center justify-center w-11 h-11 rounded-full bg-primary/10 text-primary group-hover:scale-105 transition-transform duration-300">
              <BrainCircuit className="w-6 h-6" strokeWidth={2} />
            </div>
            <div className="hidden xl:flex flex-col">
              <span className="text-lg font-extrabold text-on-surface leading-tight">{t("nav.brand")}</span>
              <span className="text-[10px] text-on-surface-variant font-medium tracking-wide">{t("nav.brandSubtitle")}</span>
            </div>
          </Link>
        </div>
        
        {/* Desktop Nav (المنتصف) */}
        <div className="hidden xl:flex flex-1 justify-center items-center">
          <div className="flex items-center gap-2 lg:gap-3 px-5 py-2 bg-surface-container/50 rounded-full shadow-[inset_0_2px_10px_rgb(0,0,0,0.02)] border border-outline-variant/30">
            {navLinks.map((link, index) => {
              const active = pathname === link.path;
              return (
                <div key={link.path} className="flex items-center">
                  <Link 
                    href={link.path}
                    className={`relative flex flex-col items-center justify-center px-4 xl:px-5 py-2 gap-1.5 rounded-2xl transition-all ${active ? "text-primary" : "text-on-surface-variant hover:text-primary hover:bg-surface shadow-none hover:shadow-sm"}`}
                  >
                    <link.icon className={`w-[18px] h-[18px] ${active ? "text-primary" : "text-on-surface-variant"}`} strokeWidth={active ? 2.5 : 2} />
                    <span className="text-[11px] xl:text-xs font-bold tracking-wide whitespace-nowrap">{link.label}</span>
                    {active && (
                      <span className="absolute -bottom-0.5 w-1 h-1 rounded-full bg-primary" />
                    )}
                  </Link>
                  {index === 0 && (
                     <div className="h-8 w-px bg-outline-variant/30 mx-2" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Actions (الجانب الأيسر) */}
        <div className="flex items-center gap-3 shrink-0">
          
          {/* Settings / Toggles */}
          <div className="flex items-center gap-1 bg-surface-container rounded-full p-1 border border-outline-variant/30">
             {mounted && (
              <button 
                onClick={toggleTheme}
                className="relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-surface-variant hover:shadow-sm transition-all"
                aria-label="Toggle Theme"
                title="Toggle Theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4 text-on-surface-variant" /> : <Moon className="w-4 h-4 text-on-surface-variant" />}
              </button>
             )}
             <button 
                onClick={toggleLanguage}
                className="flex items-center justify-center gap-1.5 h-8 px-2.5 rounded-full hover:bg-surface-variant hover:shadow-sm transition-all" 
                aria-label="Toggle Language"
                title="Toggle Language"
              >
                <Globe className="w-4 h-4 text-on-surface-variant" />
                <span className="text-xs font-bold text-on-surface-variant pt-[1px]">{language === 'ar' ? 'EN' : 'AR'}</span>
              </button>
          </div>

          {!loading && !user && (
            <button onClick={openAuthModal} className="text-on-surface-variant hover:text-primary font-bold transition-colors hidden sm:block whitespace-nowrap text-sm px-2">
              {t("nav.login")}
            </button>
          )}
          {!loading && user && (
            <button onClick={logout} className="text-red-500 hover:text-red-600 font-bold transition-colors hidden sm:block whitespace-nowrap text-sm px-2">
              {t("nav.logout")}
            </button>
          )}

          {/* Mobile Menu Button */}
          <button 
            className="xl:hidden flex items-center justify-center w-11 h-11 bg-surface-container rounded-full shadow-[0_4px_15px_rgb(0,0,0,0.05)] border border-outline-variant/20 text-on-surface-variant hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? t("defaults.closeMenu") : t("defaults.openMenu")}
            title={isMobileMenuOpen ? t("defaults.closeMenu") : t("defaults.openMenu")}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0, y: -20 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -20 }}
            className="xl:hidden mt-4 mx-4 bg-surface/95 backdrop-blur-xl border border-outline-variant/20 rounded-3xl shadow-xl overflow-hidden pointer-events-auto"
          >
            <div className="flex flex-col px-4 py-4 gap-1">
              {navLinks.map((link) => (
                <Link 
                  key={link.path} 
                  href={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 ${isActiveMobile(link.path)}`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              
              <div className="h-px bg-outline-variant/20 my-2"></div>
              
              <div className="flex items-center justify-between px-4 py-2">
                <span className="font-bold text-on-surface-variant">{t("defaults.language")}</span>
                <button 
                  onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container text-on-surface-variant hover:text-primary transition-all text-sm font-bold" 
                >
                  <Globe className="w-4 h-4" />
                  <span>{language === "ar" ? "English" : "العربية"}</span>
                </button>
              </div>

              {mounted && (
                <div className="flex items-center justify-between px-4 py-2">
                  <span className="font-bold text-on-surface-variant">{t("defaults.theme")}</span>
                  <button 
                    onClick={() => { toggleTheme(); setIsMobileMenuOpen(false); }}
                    className="p-2.5 rounded-full text-on-surface-variant bg-surface-container hover:text-primary transition-colors"
                  >
                    {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  </button>
                </div>
              )}

              <div className="h-px bg-outline-variant/20 my-2"></div>

              {!loading && !user && (
                <button 
                  onClick={() => { openAuthModal(); setIsMobileMenuOpen(false); }} 
                  className="px-4 py-3 text-start font-bold text-on-surface-variant hover:bg-surface-variant rounded-xl"
                >
                  {t("nav.login")}
                </button>
              )}
              {!loading && user && (
                <button 
                  onClick={() => { logout(); setIsMobileMenuOpen(false); }} 
                  className="px-4 py-3 text-start font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl"
                >
                  {t("nav.logout")}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
