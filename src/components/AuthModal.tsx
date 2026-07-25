import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useRef } from "react";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signInWithGoogle } = useAuth();
  const { t, language } = useLanguage();
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAuthModalOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isAuthModalOpen]);

  // Focus Trap and Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeAuthModal();
        return;
      }
      
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    if (isAuthModalOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAuthModalOpen, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 fade-in" dir={language === 'ar' ? 'rtl' : 'ltr'} role="presentation">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-surface/80 backdrop-blur-sm"
          onClick={closeAuthModal}
        />
        <motion.div
          ref={modalRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-labelledby="auth-modal-title"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative glass-card p-8 md:p-12 rounded-[32px] w-full max-w-[28rem] text-center shadow-2xl border border-outline-variant/50 focus:outline-none"
        >
          <button 
            onClick={closeAuthModal}
            className="absolute top-6 start-6 p-2 bg-surface-variant hover:bg-surface-container rounded-3xl text-on-surface-variant transition-colors"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>

          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Sparkles className="w-10 h-10 text-primary" aria-hidden="true" />
          </div>
          <h2 id="auth-modal-title" className="font-headline-lg text-headline-lg text-primary mb-4">{t("authModal.title")}</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mb-10">
            {t("authModal.desc")}
          </p>

          <button
            onClick={async () => {
              await signInWithGoogle();
              closeAuthModal();
            }}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-surface text-on-surface border-2 border-outline-variant/50 rounded-full font-bold text-lg hover:bg-surface-variant transition-all hover:shadow-md active:scale-95"
          >
            <Image src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" width={24} height={24} />
            {t("authModal.google")}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
