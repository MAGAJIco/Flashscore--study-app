import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { features, matchContext } = body;

    if (!features || !Array.isArray(features) || features.length !== 7) {
      return NextResponse.json(
        { error: 'Invalid features. Expected array of 7 numbers.' },
        { status: 400 }
      );
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001';

    const response = await fetch(`${BACKEND_URL}/ml/predict`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ features }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`ML service returned ${response.status}`);
    }

    const mlResult = await response.json();

    return NextResponse.json({
      success: true,
      prediction: mlResult.result || mlResult,
      matchContext,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('ML prediction failed:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Prediction failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'ML Prediction API',
    usage: 'POST with { features: [7 numbers], matchContext?: {} }',
    features: [
      'home_strength',
      'away_strength',
      'home_advantage',
      'recent_form_home',
      'recent_form_away',
      'head_to_head',
      'injuries'
    ]
  });
}