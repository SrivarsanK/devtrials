const translationCache = new Map<string, string>();

export async function translateText(
  text: string,
  targetLang: string
): Promise<string> {
  if (targetLang === "en") return text;

  const cacheKey = `${targetLang}:${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)!;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch("https://libretranslate.com/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        q: text,
        source: "en",
        target: targetLang === "ta" ? "ta" : targetLang,
        format: "text",
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Translation API returned ${response.status}`);
    }

    const data = await response.json();
    const translated = data.translatedText || text;
    translationCache.set(cacheKey, translated);
    return translated;
  } catch {
    // Fallback to English on any error (network, timeout, API limit)
    return text;
  }
}

export function clearTranslationCache(): void {
  translationCache.clear();
}

