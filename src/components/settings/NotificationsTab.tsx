import { TranslationKey } from "@/context/LanguageContext";

export function NotificationsTab({ t }: { t: (_translateKey: TranslationKey) => string }) {
  return (
    <div className="space-y-xl fade-in max-w-[42rem] mx-auto">
      <div>
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-xs">{t("settingsModal.notifications.title")}</h3>
        <p className="font-body-sm text-on-surface-variant">{t("settingsModal.notifications.desc")}</p>
      </div>
      
      <div className="space-y-md">
        {[
          { title: t("settingsModal.notifications.items.reminders.title"), desc: t("settingsModal.notifications.items.reminders.desc") },
          { title: t("settingsModal.notifications.items.tips.title"), desc: t("settingsModal.notifications.items.tips.desc") },
          { title: t("settingsModal.notifications.items.updates.title"), desc: t("settingsModal.notifications.items.updates.desc") }
        ].map((item, idx) => (
          <div key={idx} className="flex items-center justify-between p-md border border-surface-container-highest rounded-xl hover:border-primary/30 transition-colors">
            <div>
              <h4 className="font-label-md font-bold text-on-surface">{item.title}</h4>
              <p className="font-body-sm text-on-surface-variant">{item.desc}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked={idx !== 1} />
              <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
