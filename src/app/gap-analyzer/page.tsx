import GapAnalyzerClient from "@/components/GapAnalyzerClient";

import { Suspense } from "react";

import { getI18nMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getI18nMetadata(
    "تقرير الأداء",
    "Performance Report",
    "تحليل أدائك في المقابلة ومعرفة نقاط القوة ومجالات التحسين.",
    "Analyze your interview performance and discover strengths and areas for improvement."
  );
}

export default function GapAnalyzerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface text-primary font-bold">جاري التحميل...</div>}>
      <GapAnalyzerClient />
    </Suspense>
  );
}
