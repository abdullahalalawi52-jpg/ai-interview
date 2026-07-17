import InterviewClient from "@/components/InterviewClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "محاكاة المقابلة | تحضير المقابلة الذكية",
  description: "تدرب على أسئلة المقابلة باستخدام الذكاء الاصطناعي الصوتي",
};

export default function InterviewPage() {
  return <InterviewClient />;
}
