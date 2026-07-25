import { Skeleton } from "@/components/ui/Skeleton";

export default function ProfileLoading() {
  return (
    <div className="flex flex-col flex-1 bg-surface min-h-screen p-4 md:p-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header Profile Section */}
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
          <Skeleton className="w-32 h-32 rounded-full" />
          <div className="text-center md:text-start flex-1 w-full">
            <Skeleton className="h-10 w-64 mb-4 rounded-lg mx-auto md:mx-0" />
            <Skeleton className="h-6 w-48 rounded-lg mx-auto md:mx-0" />
          </div>
          <div className="w-full md:w-auto">
            <Skeleton className="h-12 w-full md:w-32 rounded-full" />
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
          <Skeleton className="h-24 rounded-2xl" />
        </div>
        
        {/* History List */}
        <div className="space-y-4">
          <Skeleton className="h-8 w-48 mb-6 rounded-lg" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
          <Skeleton className="h-20 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
