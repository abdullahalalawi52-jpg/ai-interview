import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/Skeleton";

const AtsScannerClient = dynamic(() => import("@/components/AtsScannerClient"), { 
  loading: () => (
    <div className="flex flex-col flex-1 p-6 md:p-12 max-w-container-max mx-auto w-full">
      <Skeleton className="h-10 w-64 mb-6" />
      <Skeleton className="h-80 rounded-3xl" />
    </div>
  ) 
});
import { Metadata } from "next";

export const metadata: Metadata = { 
  title: "فاحص السيرة الذاتية ATS | AI Interview Prep", 
  description: "تأكد من أن سيرتك الذاتية قادرة على تخطي روبوتات الفرز الآلي بنجاح." 
};

export default function AtsScannerPage() {
  return <AtsScannerClient />;
}
