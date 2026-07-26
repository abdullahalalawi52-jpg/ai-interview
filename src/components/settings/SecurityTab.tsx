import { TranslationKey } from "@/context/LanguageContext";

export interface SecurityUser {
  email?: string | null;
  emailVerified?: boolean;
  uid?: string;
}

export function SecurityTab({ t, user }: { t: (_translateKey: TranslationKey) => string; user: SecurityUser | null }) {
  return (
    <div className="space-y-xl fade-in max-w-[42rem] mx-auto">
      <div>
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-xs">{t("settingsModal.tabSecurity.title")}</h3>
        <p className="font-body-sm text-on-surface-variant">{t("settingsModal.tabSecurity.desc")}</p>
      </div>
      
      <div className="space-y-md">
        <div className="flex items-center justify-between p-md border border-surface-container-highest rounded-xl bg-surface-container/30">
          <div>
            <h4 className="font-label-md font-bold text-on-surface">{t("settingsModal.tabSecurity.provider")}</h4>
            <p className="font-body-sm text-on-surface-variant">Google OAuth 2.0</p>
          </div>
          <span className="px-sm py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">Google</span>
        </div>

        <div className="flex items-center justify-between p-md border border-surface-container-highest rounded-xl bg-surface-container/30">
          <div>
            <h4 className="font-label-md font-bold text-on-surface">{t("settingsModal.tabSecurity.verified")}</h4>
            <p className="font-body-sm text-on-surface-variant">{user?.email || "N/A"}</p>
          </div>
          <span className="px-sm py-1 bg-green-500/10 text-green-600 text-xs font-bold rounded-full">
            {t("settingsModal.tabSecurity.verifiedYes")}
          </span>
        </div>

        <div className="flex items-center justify-between p-md border border-surface-container-highest rounded-xl bg-surface-container/30">
          <div>
            <h4 className="font-label-md font-bold text-on-surface">{t("settingsModal.tabSecurity.accountSecured")}</h4>
            <p className="font-body-sm text-on-surface-variant">{t("settingsModal.tabSecurity.securedYes")}</p>
          </div>
          <span className="px-sm py-1 bg-green-500/10 text-green-600 text-xs font-bold rounded-full">Secure</span>
        </div>

        <div className="p-md border border-surface-container-highest rounded-xl bg-surface-container/10">
          <h4 className="font-label-sm font-bold text-on-surface mb-xs">{t("settingsModal.tabSecurity.uid")}</h4>
          <code className="text-xs text-on-surface-variant select-all block break-all font-mono p-sm bg-surface-container rounded border border-outline-variant/20">{user?.uid || "guest_user"}</code>
        </div>
      </div>
    </div>
  );
}
