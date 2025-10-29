
interface TranslationCache {
  [key: string]: string;
}

interface DetectedLanguage {
  code: string;
  confidence: number;
}

export class TranslationService {
  private static instance: TranslationService;
  private cache: TranslationCache = {};
  private apiEndpoint = '/api/translate';

  private constructor() {}

  static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  async translateText(text: string, targetLang: string, sourceLang?: string): Promise<string> {
    const cacheKey = `${sourceLang || 'auto'}_${targetLang}_${text}`;
    
    if (this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }

    try {
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetLang, sourceLang })
      });

      if (!response.ok) {
        throw new Error('Translation failed');
      }

      const data = await response.json();
      this.cache[cacheKey] = data.translatedText;
      return data.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return text; // Fallback to original text
    }
  }

  async detectLanguage(text: string): Promise<DetectedLanguage> {
    try {
      const response = await fetch('/api/translate/detect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      if (!response.ok) {
        throw new Error('Language detection failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Language detection error:', error);
      return { code: 'en', confidence: 0 };
    }
  }

  clearCache(): void {
    this.cache = {};
  }
}

export const translationServiceInstance = TranslationService.getInstance();
