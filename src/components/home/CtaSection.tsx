import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { TranslationKey } from "@/context/LanguageContext";

interface CtaSectionProps {
  t: (_translateKey: TranslationKey) => string;
}

export function CtaSection({ t }: CtaSectionProps) {
  return (
    <section className="py-24 relative">
      <div className="max-w-container-max mx-auto px-gutter">
        <div className="bg-primary rounded-[40px] p-xl lg:p-32 text-center text-on-primary relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "30px 30px" }}></div>
          <div className="relative z-10 flex flex-col items-center gap-lg">
            <h2 className="font-headline-xl text-headline-xl leading-tight">{t("home.ctaTitle")}</h2>
            <p className="font-body-lg text-body-lg opacity-90 max-w-[42rem]">{t("home.ctaDesc")}</p>
            <div className="flex flex-wrap justify-center gap-md mt-sm">
              <Link href="/login" className="px-xl py-md bg-on-primary text-primary rounded-xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2">
                {t("home.ctaBtn")} <ArrowLeft className="w-5 h-5 rtl:-scale-x-100" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
