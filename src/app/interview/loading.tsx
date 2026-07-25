import { Skeleton } from "@/components/ui/Skeleton";

export default function InterviewLoading() {
  return (
    <div className="flex flex-col flex-1 bg-surface h-screen overflow-hidden text-on-surface">
      <header className="px-gutter h-16 border-b border-outline-variant/30 bg-surface/95 flex justify-between items-center shadow-sm">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </header>
      <main className="flex-1 flex flex-col items-center justify-center bg-surface-container-lowest p-4 md:p-8">
        <div className="w-full max-w-2xl">
          <Skeleton className="h-[400px] w-full rounded-3xl" />
        </div>
      </main>
    </div>
  );
}
