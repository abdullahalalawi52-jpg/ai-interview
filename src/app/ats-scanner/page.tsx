import AtsScannerClient from "@/components/AtsScannerClient";
import { Metadata } from "next";

export const metadata: Metadata = { 
  title: "فاحص السيرة الذاتية ATS | AI Interview Prep", 
  description: "تأكد من أن سيرتك الذاتية قادرة على تخطي روبوتات الفرز الآلي بنجاح." 
};

export default function AtsScannerPage() {
  return <AtsScannerClient />;
}
