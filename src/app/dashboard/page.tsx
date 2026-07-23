import DashboardClient from "@/components/DashboardClient";
import { getI18nMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getI18nMetadata(
    "لوحة التحكم",
    "Dashboard",
    "لوحة التحكم ومتابعة الأداء",
    "Dashboard and performance tracking"
  );
}

export default function Dashboard() {
  return <DashboardClient />;
}
