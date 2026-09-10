"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { en } from "@/locales/en";
import { ta } from "@/locales/ta";

export type Language = "en" | "ta";
export type TranslationDict = typeof en;

interface LanguageContextType {
  language: Language;
  t: TranslationDict;
  setLanguage: (lang: Language) => void;
  isLanguageSelected: boolean;
  selectLanguageAndEnter: (lang: Language) => void;
}

const STORAGE_KEY_LANG = "aegis_preferred_language_v1";

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("en");
  const [isLanguageSelected, setIsLanguageSelected] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem(STORAGE_KEY_LANG) as Language | null;
      if (savedLang === "en" || savedLang === "ta") {
        setLanguageState(savedLang);
        setIsLanguageSelected(true);
        document.documentElement.lang = savedLang;
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch (e) {}
  };

  const selectLanguageAndEnter = (lang: Language) => {
    setLanguage(lang);
    setIsLanguageSelected(true);
  };

  const currentTranslations = language === "ta" ? ta : en;

  return (
    <LanguageContext.Provider
      value={{
        language,
        t: currentTranslations,
        setLanguage,
        isLanguageSelected,
        selectLanguageAndEnter,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};