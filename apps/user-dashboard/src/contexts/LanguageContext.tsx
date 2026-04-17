"use client";

import React, { useState, useEffect, createContext, useContext, ReactNode } from "react";

type Language = "en" | "ta";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ 
  children, 
  dictionary, 
  lang 
}: { 
  children: ReactNode; 
  dictionary: any;
  lang: Language;
}) => {
  const [language, setLanguage] = useState<Language>(lang);

  const t = (key: string): string => {
    // Handle nested keys like "settings.title"
    const keys = key.split('.');
    let value: any = dictionary;
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k];
      } else {
        // Fallback for flat keys that might still exist in the legacy code
        // Search in all categories as a best effort
        for (const category in dictionary) {
          if (dictionary[category][key]) {
            return dictionary[category][key];
          }
        }
        return key; // Return the key itself if no translation found
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
