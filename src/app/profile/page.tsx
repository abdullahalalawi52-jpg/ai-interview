import ProfileClient from "@/components/ProfileClient";

import { getI18nMetadata } from "@/lib/metadata";

export async function generateMetadata() {
  return getI18nMetadata(
    "الملف الشخصي",
    "Profile",
    "إدارة ملفك الشخصي وإحصائيات المقابلات",
    "Manage your profile and interview statistics"
  );
}

export default function ProfilePage() {
  return <ProfileClient />;
}
