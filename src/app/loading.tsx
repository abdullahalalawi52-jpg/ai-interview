"use client";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-surface text-on-surface">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="mt-6 text-on-surface-variant font-medium animate-pulse">
        جاري التحميل... / Loading...
      </p>
    </div>
  );
}
