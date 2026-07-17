import GapAnalyzerClient from "@/components/GapAnalyzerClient";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "تقرير الأداء | تحضير المقابلة الذكية",
  description: "تحليل أدائك في المقابلة ومعرفة نقاط القوة ومجالات التحسين.",
};

export default function GapAnalyzerPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-surface text-primary font-bold">جاري التحميل...</div>}>
      <GapAnalyzerClient />
    </Suspense>
  );
}
