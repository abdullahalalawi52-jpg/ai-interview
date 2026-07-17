"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { openAuthModal } = useAuth();

  useEffect(() => {
    openAuthModal();
    router.replace("/");
  }, [router, openAuthModal]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
    </div>
  );
}
