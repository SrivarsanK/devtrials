"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";

interface TranslateProps {
  text: string;
  className?: string;
  as?: React.ElementType;
}

export function Translate({ text, className, as: Component = "span" }: TranslateProps) {
  const { t } = useLanguage();
  
  return React.createElement(Component, { className }, t(text));
}
