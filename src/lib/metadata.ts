import { cookies } from "next/headers";
import { Metadata } from "next";

export async function getI18nMetadata(arTitle: string, enTitle: string, arDesc: string, enDesc: string): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("NEXT_LOCALE")?.value || "ar";
  return {
    title: lang === "ar" ? arTitle : enTitle,
    description: lang === "ar" ? arDesc : enDesc,
  };
}
