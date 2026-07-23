import HomeClient from "@/components/HomeClient";


import { getI18nMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getI18nMetadata(
    "AI Interview Prep",
    "AI Interview Prep",
    "تدرب على مقابلات العمل بتقنية الذكاء الاصطناعي مع تقييم فوري وتحليل للسيرة الذاتية",
    "Practice job interviews using AI with instant feedback and resume analysis"
  );
}

export default function Home() {
  return <HomeClient />;
}
