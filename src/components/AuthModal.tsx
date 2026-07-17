import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, signInWithGoogle } = useAuth();
  const { t } = useLanguage();

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-surface/80 backdrop-blur-sm"
          onClick={closeAuthModal}
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative glass-card p-8 md:p-12 rounded-[32px] w-full max-w-[28rem] text-center shadow-2xl border border-outline-variant/50"
        >
          <button 
            onClick={closeAuthModal}
            className="absolute top-6 start-6 p-2 bg-surface-variant hover:bg-surface-container rounded-3xl text-on-surface-variant transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-4">{t("authModal.title")}</h2>
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
