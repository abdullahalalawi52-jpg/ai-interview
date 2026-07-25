import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col flex-1 bg-surface min-h-screen">
      <main className="flex-1 p-6 md:p-12 max-w-container-max mx-auto w-full">
        <Skeleton className="h-10 w-64 mb-8 rounded-lg" />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-8 w-48 mb-4 rounded-md" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
            <Skeleton className="h-24 rounded-2xl" />
          </div>
          
          <div className="space-y-4">
            <Skeleton className="h-8 w-48 mb-4 rounded-md" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        </div>
      </main>
    </div>
  );
}
