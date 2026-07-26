import { useTheme } from "next-themes";
import { TranslationKey } from "@/context/LanguageContext";

export function AppearanceTab({ t }: { t: (_translateKey: TranslationKey) => string }) {
  const { theme, setTheme } = useTheme();
  return (
    <div className="space-y-xl fade-in max-w-[42rem] mx-auto">
      <div>
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-xs">{t("settingsModal.appearance.title")}</h3>
        <p className="font-body-sm text-on-surface-variant">{t("settingsModal.appearance.desc")}</p>
      </div>
      
      <div className="space-y-md">
        <label className="font-label-md font-bold text-on-surface">{t("settingsModal.appearance.themeLabel")}</label>
        <p className="font-body-sm text-on-surface-variant mb-sm">{t("settingsModal.appearance.selectTheme")}</p>
        
        <div className="grid grid-cols-3 gap-md">
          {(["light", "dark", "system"] as const).map((tId) => {
            const isSel = theme === tId;
            return (
              <button
                key={tId}
                onClick={() => setTheme(tId)}
                className={`p-md rounded-xl border flex flex-col items-center gap-sm transition-all ${
                  isSel 
                    ? "border-primary bg-primary/5 text-primary shadow-sm font-bold" 
                    : "border-outline-variant/30 bg-surface-container hover:bg-surface-variant text-on-surface-variant"
                }`}
              >
                <span className="text-2xl">
                  {tId === "light" ? "☀️" : tId === "dark" ? "🌙" : "🖥️"}
                </span>
                <span className="text-xs">{t(`settingsModal.appearance.themes.${tId}` as any)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
