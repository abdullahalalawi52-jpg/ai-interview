import LeaderboardClient from "@/components/LeaderboardClient";

import { getI18nMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getI18nMetadata(
    "لوحة الصدارة",
    "Leaderboard",
    "قائمة أفضل المحترفين في منصة تحضير المقابلة الذكية.",
    "List of top professionals in AI Interview Prep platform."
  );
}

export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
