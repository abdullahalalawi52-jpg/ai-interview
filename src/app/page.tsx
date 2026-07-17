import HomeClient from "@/components/HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Interview Prep | تحضير المقابلة الذكية",
  description: "تدرب على مقابلات العمل بتقنية الذكاء الاصطناعي مع تقييم فوري وتحليل للسيرة الذاتية",
};

export default function Home() {
  return <HomeClient />;
}
