
interface TranslationCache {
  [key: string]: string;
}

interface TranslationRequest {
  text: string;
  sourceLang: string;
  targetLang: string;
}

class TranslationService {
  private cache: TranslationCache = {};
  private apiKey: string = '';
  private endpoint: string = 'https://translation.googleapis.com/language/translate/v2';

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadCache();
    }
  }

  private getCacheKey(text: string, sourceLang: string, targetLang: string): string {
    return `${sourceLang}_${targetLang}_${text}`;
  }

  private loadCache(): void {
    const cached = localStorage.getItem('translation_cache');
    if (cached) {
      this.cache = JSON.parse(cached);
    }
  }

  private saveCache(): void {
    localStorage.setItem('translation_cache', JSON.stringify(this.cache));
  }

  async translate(request: TranslationRequest): Promise<string> {
    const { text, sourceLang, targetLang } = request;

    // Return original if same language
    if (sourceLang === targetLang) {
      return text;
    }

    // Check cache first
    const cacheKey = this.getCacheKey(text, sourceLang, targetLang);
    if (this.cache[cacheKey]) {
      return this.cache[cacheKey];
    }

    try {
      // Use browser's built-in translation API if available
      if ('translation' in navigator) {
        const translator = await (navigator as any).translation.createTranslator({
          sourceLanguage: sourceLang,
          targetLanguage: targetLang
        });
        const result = await translator.translate(text);
        this.cache[cacheKey] = result;
        this.saveCache();
        return result;
      }

      // Fallback: Client-side rule-based translation for common phrases
      const translated = this.fallbackTranslation(text, sourceLang, targetLang);
      this.cache[cacheKey] = translated;
      this.saveCache();
      return translated;

    } catch (error) {
      console.warn('Translation failed, returning original text:', error);
      return text;
    }
  }

  private fallbackTranslation(text: string, sourceLang: string, targetLang: string): string {
    const commonPhrases: Record<string, Record<string, string>> = {
      'Hello': {
        es: 'Hola',
        fr: 'Bonjour',
        de: 'Hallo',
        pt: 'Olá'
      },
      'Good prediction!': {
        es: '¡Buena predicción!',
        fr: 'Bonne prédiction!',
        de: 'Gute Vorhersage!',
        pt: 'Boa previsão!'
      },
      'Great goal!': {
        es: '¡Gran gol!',
        fr: 'Superbe but!',
        de: 'Tolles Tor!',
        pt: 'Ótimo gol!'
      }
    };

    if (commonPhrases[text] && commonPhrases[text][targetLang]) {
      return commonPhrases[text][targetLang];
    }

    return text; // Return original if no translation available
  }

  async detectLanguage(text: string): Promise<string> {
    // Simple language detection based on character patterns
    const patterns = {
      es: /[áéíóúñ¿¡]/i,
      fr: /[àâäæçéèêëïîôœùûü]/i,
      de: /[äöüß]/i,
      pt: /[ãõçáéíóú]/i
    };

    for (const [lang, pattern] of Object.entries(patterns)) {
      if (pattern.test(text)) {
        return lang;
      }
    }

    return 'en'; // Default to English
  }
}

export const translationService = new TranslationService();
export default translationService;
