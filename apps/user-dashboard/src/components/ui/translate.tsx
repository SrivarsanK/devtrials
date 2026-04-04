"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

interface TranslateProps {
  text: string;
  className?: string;
  as?: React.ElementType;
}

export function Translate({ text, className, as: Component = "span" }: TranslateProps) {
  const { language, translateText } = useLanguage();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    let isMounted = true;
    
    if (language === "en") {
      setTranslated(text);
      return;
    }

    const translate = async () => {
      try {
        const result = await translateText(text);
        if (isMounted) setTranslated(result);
      } catch (e) {
        if (isMounted) setTranslated(text);
      }
    };

    translate();

    return () => {
      isMounted = false;
    };
  }, [text, language, translateText]);

  return <Component className={className}>{translated}</Component>;
}
