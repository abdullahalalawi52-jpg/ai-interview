import { Skeleton } from "@/components/ui/Skeleton";

export default function LeaderboardLoading() {
  return (
    <div className="flex flex-col flex-1 bg-surface min-h-screen p-4 md:p-8">
      <div className="max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <Skeleton className="h-12 w-64 mx-auto mb-4 rounded-lg" />
          <Skeleton className="h-6 w-96 mx-auto rounded-lg" />
        </div>

        {/* Top 3 Podium */}
        <div className="flex items-end justify-center gap-4 mb-12 h-64">
          <Skeleton className="w-1/4 h-3/4 rounded-t-2xl" />
          <Skeleton className="w-1/4 h-full rounded-t-2xl" />
          <Skeleton className="w-1/4 h-1/2 rounded-t-2xl" />
        </div>

        {/* List */}
        <div className="space-y-4 max-w-3xl mx-auto">
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
          <Skeleton className="h-16 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
