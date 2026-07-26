import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";

const QuizClient = dynamic(() => import("@/components/QuizClient"), { 
  loading: () => (
    <div className="flex flex-col flex-1 p-6 md:p-12 max-w-container-max mx-auto w-full">
      <Skeleton className="h-10 w-48 mb-6" />
      <Skeleton className="h-64 rounded-3xl" />
    </div>
  ) 
});

import { getI18nMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getI18nMetadata(
    "اختبار مهارات",
    "Skills Quiz",
    "اختبر مهاراتك الفنية والشخصية عبر أسئلة اختيار من متعدد سريعة وتفاعلية.",
    "Test your technical and soft skills through quick and interactive multiple-choice questions."
  );
}

export default function QuizPage() {
  return <QuizClient />;
}
