import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";

const GapAnalyzerClient = dynamic(() => import("@/components/GapAnalyzerClient"), { 
  loading: () => (
    <div className="flex flex-col flex-1 p-6 md:p-12 max-w-container-max mx-auto w-full">
      <Skeleton className="h-10 w-48 mb-6" />
      <Skeleton className="h-64 rounded-3xl" />
    </div>
  ) 
});

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
