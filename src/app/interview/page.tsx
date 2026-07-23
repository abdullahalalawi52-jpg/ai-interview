import InterviewClient from "@/components/InterviewClient";
import { getI18nMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getI18nMetadata(
    "محاكاة المقابلة",
    "Interview Simulation",
    "تدرب على أسئلة المقابلة باستخدام الذكاء الاصطناعي الصوتي",
    "Practice interview questions using Voice AI"
  );
}

export default function InterviewPage() {
  return <InterviewClient />;
}
