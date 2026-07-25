import { Skeleton } from "@/components/ui/Skeleton";

export default function AtsScannerLoading() {
  return (
    <div className="flex flex-col flex-1 bg-surface min-h-screen p-4 md:p-8">
      <div className="max-w-3xl mx-auto w-full">
        <div className="text-center mb-8">
          <Skeleton className="h-12 w-64 mx-auto mb-4 rounded-lg" />
          <Skeleton className="h-6 w-96 mx-auto rounded-lg" />
        </div>
        
        <Skeleton className="h-64 w-full rounded-3xl border-2 border-dashed border-outline-variant mb-8" />
        
        <div className="flex justify-center">
          <Skeleton className="h-12 w-48 rounded-full" />
        </div>
      </div>
    </div>
  );
}
