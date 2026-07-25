"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [lang, setLang] = useState<"ar" | "en">("ar");

  useEffect(() => {
    console.error(error);
    const storedLang = localStorage.getItem("language");
    if (storedLang === "en") {
      // eslint-disable-next-line
      setLang("en");
    }
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-surface text-on-surface">
      <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mb-6">
        <AlertTriangle className="w-10 h-10 text-error" />
      </div>
      <h2 className="text-2xl font-bold mb-4">
        {lang === "ar" ? "عذراً، حدث خطأ غير متوقع" : "Something went wrong"}
      </h2>
      <p className="text-on-surface-variant max-w-md mb-8">
        {lang === "ar" ? "نعتذر عن هذا الخلل. يرجى المحاولة مرة أخرى." : "We apologize for the inconvenience. Please try again."}
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:bg-primary/90 transition-colors"
      >
        <RotateCcw className="w-5 h-5" />
        {lang === "ar" ? "المحاولة مرة أخرى" : "Try Again"}
      </button>
    </div>
  );
}
