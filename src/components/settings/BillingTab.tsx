import { TranslationKey } from "@/context/LanguageContext";

export function BillingTab({ t }: { t: (_translateKey: TranslationKey) => string }) {
  return (
    <div className="space-y-xl fade-in max-w-[42rem] mx-auto">
      <div>
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-xs">{t("settingsModal.billing.title")}</h3>
        <p className="font-body-sm text-on-surface-variant">{t("settingsModal.billing.desc")}</p>
      </div>
      
      <div className="space-y-md">
        <div className="p-md border border-surface-container-highest rounded-xl bg-surface-container/30">
          <h4 className="font-label-md font-bold text-on-surface mb-xs">{t("settingsModal.billing.tier")}</h4>
          <span className="px-sm py-1 bg-secondary/15 text-secondary text-xs font-bold rounded-full">
            {t("settingsModal.billing.tierFree")}
          </span>
        </div>

        <div className="p-md border border-surface-container-highest rounded-xl space-y-sm bg-surface-container/10">
          <div className="flex justify-between font-label-md font-bold text-on-surface">
            <span>{t("settingsModal.billing.usage")}</span>
            <span>5 / 10 Credits</span>
          </div>
          
          <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden border border-outline-variant/30">
            <div className="w-1/2 h-full bg-primary rounded-full"></div>
          </div>
          <p className="font-body-sm text-on-surface-variant">{t("settingsModal.billing.usageDesc")}</p>
        </div>

        <button className="w-full py-md bg-gradient-to-r from-primary to-secondary text-on-primary font-bold rounded-xl transition-all hover:shadow-lg hover:brightness-105 active:scale-[0.98]">
          {t("settingsModal.billing.upgradeBtn")}
        </button>
      </div>
    </div>
  );
}
