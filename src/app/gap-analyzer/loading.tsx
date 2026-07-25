import { Skeleton } from "@/components/ui/Skeleton";

export default function GapAnalyzerLoading() {
  return (
    <div className="flex flex-col flex-1 bg-surface min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto w-full">
        <Skeleton className="h-10 w-64 mb-4 rounded-lg" />
        <Skeleton className="h-6 w-96 mb-8 rounded-lg" />
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Skeleton className="h-32 rounded-2xl md:col-span-1" />
          <Skeleton className="h-32 rounded-2xl md:col-span-2" />
        </div>
        
        <Skeleton className="h-64 rounded-3xl w-full" />
      </div>
    </div>
  );
}
