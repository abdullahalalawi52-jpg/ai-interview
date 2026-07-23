import LinkedinOptimizerClient from "@/components/LinkedinOptimizerClient";
import { Suspense } from "react";
import { getI18nMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getI18nMetadata(
    "مُحسّن لينكد إن",
    "LinkedIn Optimizer",
    "استخدم الذكاء الاصطناعي لتحويل سيرتك الذاتية إلى حساب لينكد إن احترافي وجذاب.",
    "Use AI to transform your resume into a professional and attractive LinkedIn profile."
  );
}

export default function LinkedinOptimizerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface text-primary font-bold">جاري التحميل...</div>}>
      <LinkedinOptimizerClient />
    </Suspense>
  );
}
