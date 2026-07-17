import DashboardClient from "@/components/DashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة التحكم | تحضير المقابلة الذكية",
  description: "لوحة التحكم ومتابعة الأداء",
};

export default function Dashboard() {
  return <DashboardClient />;
}
