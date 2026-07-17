"use client";

import Link from "next/link";
import { BrainCircuit, Share2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="full-width py-12 bg-surface-container dark:bg-surface-container-low border-t border-outline-variant mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between px-gutter max-w-container-max mx-auto gap-md">
        
        {/* Brand & Copyright */}
        <div className="flex flex-col items-center md:items-start gap-sm">
          <div className="flex items-center gap-sm">
            <BrainCircuit className="w-8 h-8 text-primary" />
            <span className="text-headline-sm font-headline-sm text-primary">{t("nav.brand")}</span>
          </div>
          <p className="font-label-md text-label-md text-on-surface-variant mt-xs">
            © {new Date().getFullYear()} {t("nav.brand")}. {t("footer.rights")}
          </p>
        </div>

        {/* Links */}
        <nav className="flex flex-wrap justify-center md:justify-end items-center gap-4">
          <Link href="/privacy" className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md">{t("footer.privacy")}</Link>
          <span className="text-outline-variant text-sm font-bold opacity-50">·</span>
          <Link href="/terms" className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md">{t("footer.terms")}</Link>
          <span className="text-outline-variant text-sm font-bold opacity-50">·</span>
          <Link href="/contact" className="text-on-surface-variant hover:text-primary transition-colors font-label-md text-label-md">{t("footer.contact")}</Link>
        </nav>

        {/* Social / Extra Icons */}
        <div className="flex gap-md">
          <button 
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: t("footer.shareTitle"),
                  text: t("footer.shareText"),
                  url: window.location.origin,
                }).catch(console.error);
              } else {
                navigator.clipboard.writeText(window.location.origin);
                alert(t("footer.copied"));
              }
            }}
            className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-on-surface-variant hover:text-primary hover:bg-surface-variant transition-all" 
            aria-label="Share"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
