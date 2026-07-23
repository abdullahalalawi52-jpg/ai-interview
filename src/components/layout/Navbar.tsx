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
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

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
    { path: "/linkedin-optimizer", label: t("nav.linkedinOptimizer") },
    { path: "/gap-analyzer", label: t("nav.gapAnalyzer") },
    { path: "/quiz", label: t("nav.quiz") }
  ];

  return (
    <header className="docked full-width top-0 z-50 sticky bg-surface/95 dark:bg-surface-dim/95 backdrop-blur-md shadow-sm border-b border-outline-variant/30 transition-colors duration-300">
      <nav className="flex items-center justify-between gap-4 xl:gap-8 px-gutter w-full max-w-container-max mx-auto h-16">
        
        {/* Brand & Mobile Menu Toggle */}
        <div className="flex items-center gap-2">
          <button 
            className="xl:hidden p-2 text-on-surface-variant hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? t("defaults.closeMenu") : t("defaults.openMenu")}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <Link href="/" className="flex items-center gap-sm group">
            <BrainCircuit className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-lg font-bold text-primary hidden xl:block whitespace-nowrap">{t("nav.brand")}</span>
          </Link>
        </div>
        
        {/* Desktop Nav */}
        <div className="hidden xl:flex flex-1 justify-center items-center gap-1 min-w-0" onMouseLeave={() => setHoveredPath(null)}>
          {navLinks.map((link) => {
            const active = pathname === link.path;
            const isHovered = hoveredPath === link.path;
            return (
              <Link 
                key={link.path} 
                href={link.path}
                onMouseEnter={() => setHoveredPath(link.path)}
                className={`relative px-2 2xl:px-4 py-1.5 text-sm font-bold transition-colors whitespace-nowrap z-10 ${active ? "text-primary" : "text-on-surface-variant hover:text-primary"}`}
              >
                {active && !isHovered && (
                  <div className="absolute inset-0 bg-primary/10 rounded-full -z-10" />
                )}
                {isHovered && (
                  <motion.div
                    layoutId="nav-hover-pill"
                    className="absolute inset-0 bg-surface-variant/50 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          {mounted && (
            <button 
              onClick={toggleTheme}
              className="relative flex items-center bg-surface-variant/50 border border-outline-variant/30 rounded-full p-0.5"
              aria-label="Toggle Theme"
            >
              <span className={`relative z-10 flex items-center justify-center w-7 h-7 rounded-full transition-colors ${theme !== "dark" ? "text-primary" : "text-on-surface-variant hover:text-primary"}`}>
                {theme !== "dark" && (
                  <motion.div layoutId="theme-pill" className="absolute inset-0 bg-surface shadow-sm rounded-full -z-10" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                )}
                <Sun className="w-4 h-4" />
              </span>
              <span className={`relative z-10 flex items-center justify-center w-7 h-7 rounded-full transition-colors ${theme === "dark" ? "text-primary" : "text-on-surface-variant hover:text-primary"}`}>
                {theme === "dark" && (
                  <motion.div layoutId="theme-pill" className="absolute inset-0 bg-surface shadow-sm rounded-full -z-10" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                )}
                <Moon className="w-4 h-4" />
              </span>
            </button>
          )}

          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-outline-variant/50 text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-all text-sm font-bold overflow-hidden" 
            aria-label="Language"
          >
            <motion.div
              key={language}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Globe className="w-4 h-4" />
            </motion.div>
            <div className="relative flex items-center justify-center">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={language}
                  initial={{ y: -15, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 15, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="block whitespace-nowrap"
                >
                  <span className="hidden sm:inline">{language === "ar" ? "English" : "العربية"}</span>
                  <span className="sm:hidden">{language === "ar" ? "EN" : "AR"}</span>
                </motion.span>
              </AnimatePresence>
            </div>
          </button>

          {!loading && !user && (
            <button onClick={openAuthModal} className="text-on-surface-variant hover:text-primary font-bold transition-colors hidden sm:block whitespace-nowrap text-sm">
              {t("nav.login")}
            </button>
          )}
          {!loading && user && (
            <button onClick={logout} className="text-error hover:text-error/80 font-bold transition-colors hidden sm:block whitespace-nowrap text-sm">
              {t("nav.logout")}
            </button>
          )}
          <Link href="/interview" className="bg-primary text-on-primary px-3 sm:px-4 py-1.5 rounded-full font-bold text-sm transition-all duration-200 active:scale-95 hover:bg-primary/90 shadow-md hover:shadow-lg whitespace-nowrap">
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
            className="xl:hidden border-t border-outline-variant/30 bg-surface/95 backdrop-blur-md overflow-hidden"
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
                <span className="font-bold text-on-surface-variant">{t("defaults.language")}</span>
                <button 
                  onClick={() => { toggleLanguage(); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-container text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-all text-sm font-bold border border-outline-variant/30" 
                  aria-label={t("defaults.changeLanguage")}
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
                    className="p-2 rounded-full text-on-surface-variant bg-surface-container border border-outline-variant/30 hover:text-primary hover:bg-surface-variant transition-colors"
                    aria-label={theme === "dark" ? t("defaults.lightMode") : t("defaults.darkMode")}
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
