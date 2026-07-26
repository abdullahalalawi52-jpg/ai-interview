import { TranslationKey } from "@/context/LanguageContext";
import { User, Palette } from "lucide-react";
import { useState } from "react";

export function ProfileTab({ 
  t, 
  user,
  onClose
}: { 
  t: (_translateKey: TranslationKey) => string;
  user: any;
  onClose: () => void;
}) {
  const [firstName, ...lastNameParts] = (user?.displayName || "").split(" ");
  const lastName = lastNameParts.join(" ");

  const [formData, setFormData] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
    email: user?.email || "",
    jobTarget: ""
  });

  return (
    <div className="space-y-xl fade-in max-w-[42rem] mx-auto">
      <div>
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-xs">{t("settingsModal.profile.title")}</h3>
        <p className="font-body-sm text-on-surface-variant">{t("settingsModal.profile.desc")}</p>
      </div>
      
      <div className="flex items-center gap-lg">
        <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary relative shrink-0">
          <User className="w-10 h-10" />
          <button className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors">
            <Palette className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h4 className="font-label-md font-bold text-on-surface">{t("settingsModal.profile.avatar")}</h4>
          <p className="font-body-sm text-on-surface-variant mb-sm">{t("settingsModal.profile.avatarDesc")}</p>
        </div>
      </div>

      <form className="space-y-md" onSubmit={(e) => { 
        e.preventDefault(); 
        // In a real app we would save formData to backend here
        console.log("Saving data:", formData);
        onClose(); 
      }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
          <div className="space-y-xs">
            <label className="font-label-sm font-bold text-on-surface">{t("settingsModal.profile.firstName")}</label>
            <input type="text" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} className="w-full px-md py-sm bg-surface rounded-lg border border-surface-container-highest focus:outline-none focus:border-primary transition-colors" />
          </div>
          <div className="space-y-xs">
            <label className="font-label-sm font-bold text-on-surface">{t("settingsModal.profile.lastName")}</label>
            <input type="text" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} className="w-full px-md py-sm bg-surface rounded-lg border border-surface-container-highest focus:outline-none focus:border-primary transition-colors" />
          </div>
        </div>
        
        <div className="space-y-xs">
          <label className="font-label-sm font-bold text-on-surface">{t("settingsModal.profile.email")}</label>
          <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full px-md py-sm bg-surface rounded-lg border border-surface-container-highest focus:outline-none focus:border-primary transition-colors text-left" dir="ltr" />
        </div>

        <div className="space-y-xs">
          <label className="font-label-sm font-bold text-on-surface">{t("settingsModal.profile.jobTarget")}</label>
          <input type="text" value={formData.jobTarget} onChange={(e) => setFormData({...formData, jobTarget: e.target.value})} placeholder={t("settingsModal.profile.jobTargetPlaceholder")} className="w-full px-md py-sm bg-surface rounded-lg border border-surface-container-highest focus:outline-none focus:border-primary transition-colors" />
        </div>

        <div className="pt-md flex justify-end">
          <button type="submit" className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md hover:bg-primary/90 transition-colors shadow-sm active:scale-95">
            {t("settingsModal.profile.saveBtn")}
          </button>
        </div>
      </form>
    </div>
  );
}
