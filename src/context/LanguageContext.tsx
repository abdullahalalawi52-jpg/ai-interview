"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import ar from "@/i18n/ar.json";
import en from "@/i18n/en.json";

export type Language = "ar" | "en";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const dictionaries = { ar, en };

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  children, 
  initialLanguage = "ar" 
}: { 
  children: React.ReactNode,
  initialLanguage?: Language 
}) {
  const [language, setLanguageState] = useState<Language>(initialLanguage);

  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000`;
  };

  const getPluralSuffix = (count: number, lang: Language): string => {
    if (lang === "en") {
      if (count === 0) return "zero";
      return count === 1 ? "one" : "other";
    }
    if (lang === "ar") {
      if (count === 0) return "zero";
      if (count === 1) return "one";
      if (count === 2) return "two";
      const mod100 = count % 100;
      if (mod100 >= 3 && mod100 <= 10) return "few";
      if (mod100 >= 11 && mod100 <= 99) return "many";
      return "other";
    }
    return "other";
  };

  const lookup = (kStr: string): unknown => {
    const keys = kStr.split(".");
    let value: unknown = dictionaries[language];
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return undefined;
      }
    }
    return value;
  };

  const t = (key: string, variables?: Record<string, string | number>) => {
    let value: unknown = undefined;

    if (variables && typeof variables.count === "number") {
      const suffix = getPluralSuffix(variables.count, language);
      value = lookup(`${key}.${suffix}`) ?? lookup(`${key}_${suffix}`);
      if (value === undefined) {
        value = lookup(`${key}.other`) ?? lookup(`${key}_other`);
      }
    }

    if (value === undefined) {
      value = lookup(key);
    }

    if (value === undefined) {
      return key;
    }

    if (typeof value === "string" && variables) {
      return value.replace(/\{\{(.*?)\}\}/g, (_, v) => String(variables[v.trim()] || ""));
    }

    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
