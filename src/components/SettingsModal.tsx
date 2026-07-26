"use client";


import { User, Bell, Palette, Shield, CreditCard, LogOut, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "next-themes";
import { ProfileTab } from "./settings/ProfileTab";
import { NotificationsTab } from "./settings/NotificationsTab";
import { AppearanceTab } from "./settings/AppearanceTab";
import { SecurityTab } from "./settings/SecurityTab";
import { BillingTab } from "./settings/BillingTab";

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

  const [formData, setFormData] = useState({
    firstName: firstName || "",
    lastName: lastName || "",
    email: user?.email || "",
    jobTarget: ""
  });

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
          <button onClick={onClose} className="p-2 rounded-full hover:bg-surface-variant transition-colors group" aria-label={t("settingsModal.close")}>
            <X className="w-6 h-6 text-on-surface-variant group-hover:text-error transition-colors" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0 bg-surface border-s border-surface-container-highest overflow-y-auto p-4">
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
              <ProfileTab t={t} user={user} onClose={onClose} />
            )}

            {activeTab === "notifications" && (
              <NotificationsTab t={t} />
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
