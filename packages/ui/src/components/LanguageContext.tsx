"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { translateText } from "@/lib/translate";

type Lang = "en" | "ta";

interface LanguageContextType {
  lang: Lang;
  toggleLang: () => void;
  t: (text: string) => string;
  isTranslating: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggleLang: () => {},
  t: (text: string) => text,
  isTranslating: false,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [translations, setTranslations] = useState<Map<string, string>>(
    new Map()
  );
  const [isTranslating, setIsTranslating] = useState(false);
  const pendingTexts = useRef<Set<string>>(new Set());
  const batchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "ta" : "en"));
  }, []);

  // Batch translation: collects text requests and translates them together
  const requestTranslation = useCallback(
    (text: string) => {
      if (lang === "en") return;
      if (translations.has(text)) return;

      pendingTexts.current.add(text);

      if (batchTimeout.current) clearTimeout(batchTimeout.current);
      batchTimeout.current = setTimeout(async () => {
        const textsToTranslate = Array.from(pendingTexts.current);
        pendingTexts.current.clear();

        if (textsToTranslate.length === 0) return;

        setIsTranslating(true);

        const results = await Promise.allSettled(
          textsToTranslate.map(async (t) => {
            const translated = await translateText(t, lang);
            return { original: t, translated };
          })
        );

        setTranslations((prev) => {
          const newMap = new Map(prev);
          results.forEach((result) => {
            if (result.status === "fulfilled") {
              newMap.set(result.value.original, result.value.translated);
            }
          });
          return newMap;
        });

        setIsTranslating(false);
      }, 100);
    },
    [lang, translations]
  );

  // Reset translations when switching back to English
  useEffect(() => {
    if (lang === "en") {
      setTranslations(new Map());
      setIsTranslating(false);
    }
  }, [lang]);

  const t = useCallback(
    (text: string): string => {
      if (lang === "en") return text;
      
      // Request translation if not cached
      requestTranslation(text);
      
      // Return cached translation or original text while loading
      return translations.get(text) || text;
    },
    [lang, translations, requestTranslation]
  );

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t, isTranslating }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

