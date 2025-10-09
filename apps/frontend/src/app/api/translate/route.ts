
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang, sourceLang } = await request.json();

    // Using a free translation API (LibreTranslate or similar)
    // For production, use Google Cloud Translation or DeepL API
    const response = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang || 'auto',
        target: targetLang,
        format: 'text',
      }),
    });

    if (!response.ok) {
      throw new Error('Translation service error');
    }

    const data = await response.json();

    return NextResponse.json({
      translatedText: data.translatedText,
      detectedLanguage: data.detectedLanguage?.language,
    });
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: 'Translation failed', translatedText: '' },
      { status: 500 }
    );
  }
}
