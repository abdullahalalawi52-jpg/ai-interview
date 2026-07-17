"use client";


import { User, Bell, Palette, Shield, CreditCard, LogOut, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { t, language } = useLanguage();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const modalRef = useRef<HTMLDivElement>(null);

  const [firstName, ...lastNameParts] = (user?.displayName || "").split(" ");
  const lastName = lastNameParts.join(" ");

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Prevent background scrolling when modal is open and implement Focus Trap
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      
      if (e.key === "Tab" && modalRef.current) {
        const focusableElements = modalRef.current.querySelectorAll(
          'a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;
        
        if (focusableElements.length === 0) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement?.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement?.focus();
            e.preventDefault();
          }
        }
      }
    };

    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const tabs = [
    { id: "profile", label: t("settingsModal.tabs.profile"), icon: User },
    { id: "notifications", label: t("settingsModal.tabs.notifications"), icon: Bell },
    { id: "appearance", label: t("settingsModal.tabs.appearance"), icon: Palette },
    { id: "security", label: t("settingsModal.tabs.tabSecurity"), icon: Shield },
    { id: "billing", label: t("settingsModal.tabs.billing"), icon: CreditCard },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 fade-in" dir={language === 'ar' ? 'rtl' : 'ltr'} role="presentation">
      {/* Modal Container */}
      <div 
        ref={modalRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        className="bg-surface-container-lowest w-full max-w-[64rem] h-[85vh] md:h-[600px] rounded-2xl shadow-2xl flex flex-col overflow-hidden relative border border-surface-container-highest slide-up focus:outline-none"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-lg py-md border-b border-surface-container-highest shrink-0">
          <h2 id="settings-modal-title" className="font-headline-md text-headline-md font-bold text-on-surface">{t("settingsModal.title")}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-variant transition-colors group" aria-label={t("settingsModal.close") || "إغلاق"}>
            <X className="w-6 h-6 text-on-surface-variant group-hover:text-error transition-colors" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0 bg-surface border-l border-surface-container-highest overflow-y-auto p-4">
            <nav className="flex flex-col gap-xs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-md px-md py-sm rounded-lg font-label-md transition-all text-right ${
                      isActive 
                        ? "bg-primary/10 text-primary font-bold" 
                        : "text-on-surface-variant hover:bg-surface-variant"
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-on-surface-variant"}`} />
                    {tab.label}
                  </button>
                );
              })}
              
              <hr className="border-surface-container-highest my-sm" />
              
              <button 
                onClick={async () => {
                  await logout();
                  onClose();
                }}
                className="flex items-center gap-md px-md py-sm rounded-lg font-label-md transition-all text-right text-error hover:bg-error/10"
              >
                <LogOut className="w-5 h-5" />
                {t("settingsModal.logout")}
              </button>
            </nav>
          </aside>

          {/* Content Area */}
          <section className="flex-1 overflow-y-auto p-lg md:p-xl bg-surface-container-lowest">
            {activeTab === "profile" && (
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

                <form className="space-y-md" onSubmit={(e) => { e.preventDefault(); alert(t("settingsModal.profile.saveSuccess")); onClose(); }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="space-y-xs">
                      <label className="font-label-sm font-bold text-on-surface">{t("settingsModal.profile.firstName")}</label>
                      <input type="text" defaultValue={firstName} className="w-full px-md py-sm bg-surface rounded-lg border border-surface-container-highest focus:outline-none focus:border-primary transition-colors" />
                    </div>
                    <div className="space-y-xs">
                      <label className="font-label-sm font-bold text-on-surface">{t("settingsModal.profile.lastName")}</label>
                      <input type="text" defaultValue={lastName} className="w-full px-md py-sm bg-surface rounded-lg border border-surface-container-highest focus:outline-none focus:border-primary transition-colors" />
                    </div>
                  </div>
                  
                  <div className="space-y-xs">
                    <label className="font-label-sm font-bold text-on-surface">{t("settingsModal.profile.email")}</label>
                    <input type="email" defaultValue={user?.email || ""} className="w-full px-md py-sm bg-surface rounded-lg border border-surface-container-highest focus:outline-none focus:border-primary transition-colors text-left" dir="ltr" />
                  </div>

                  <div className="space-y-xs">
                    <label className="font-label-sm font-bold text-on-surface">{t("settingsModal.profile.jobTarget")}</label>
                    <input type="text" placeholder={t("settingsModal.profile.jobTargetPlaceholder") || "Software Engineer"} className="w-full px-md py-sm bg-surface rounded-lg border border-surface-container-highest focus:outline-none focus:border-primary transition-colors" />
                  </div>

                  <div className="pt-md flex justify-end">
                    <button type="submit" className="bg-primary text-on-primary px-lg py-sm rounded-lg font-label-md hover:bg-primary/90 transition-colors shadow-sm active:scale-95">
                      {t("settingsModal.profile.saveBtn")}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "notifications" && (
              <div className="space-y-xl fade-in max-w-[42rem] mx-auto">
                <div>
                  <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-xs">{t("settingsModal.notifications.title")}</h3>
                  <p className="font-body-sm text-on-surface-variant">{t("settingsModal.notifications.desc")}</p>
                </div>
                
                <div className="space-y-md">
                  {[
                    { title: t("settingsModal.notifications.items.0.title"), desc: t("settingsModal.notifications.items.0.desc") },
                    { title: t("settingsModal.notifications.items.1.title"), desc: t("settingsModal.notifications.items.1.desc") },
                    { title: t("settingsModal.notifications.items.2.title"), desc: t("settingsModal.notifications.items.2.desc") }
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
            )}

            {activeTab === "appearance" && (
              <AppearanceTab t={t} />
            )}

            {activeTab === "security" && (
              <SecurityTab t={t} user={user} />
            )}

            {activeTab === "billing" && (
              <BillingTab t={t} />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

// Settings Subcomponents
function AppearanceTab({ t }: { t: (_translateKey: string) => string }) {
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
                <span className="text-xs">{t(`settingsModal.appearance.themes.${tId}`)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface SecurityUser {
  email?: string | null;
  emailVerified?: boolean;
  uid?: string;
}

function SecurityTab({ t, user }: { t: (_translateKey: string) => string; user: SecurityUser | null }) {
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

function BillingTab({ t }: { t: (_translateKey: string) => string }) {
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
