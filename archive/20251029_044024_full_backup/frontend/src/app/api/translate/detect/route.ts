
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    const response = await fetch('https://libretranslate.com/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ q: text }),
    });

    if (!response.ok) {
      throw new Error('Language detection failed');
    }

    const data = await response.json();
    const topResult = data[0];

    return NextResponse.json({
      code: topResult.language,
      confidence: topResult.confidence,
    });
  } catch (error) {
    console.error('Language detection error:', error);
    return NextResponse.json(
      { code: 'en', confidence: 0 },
      { status: 500 }
    );
  }
}
