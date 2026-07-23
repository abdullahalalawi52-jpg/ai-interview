import QuizClient from "@/components/QuizClient";

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
