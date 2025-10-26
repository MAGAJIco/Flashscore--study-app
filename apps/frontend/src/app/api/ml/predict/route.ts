import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'ML Prediction API',
    usage: 'POST with { features: [7 numbers], match_context?: {} }',
    features: [
      'home_strength',
      'away_strength',
      'home_advantage',
      'recent_form_home',
      'recent_form_away',
      'head_to_head',
      'injuries'
    ],
    endpoints: {
      predict: '/api/ml/predict',
      train: '/api/ml/train',
      health: '/api/ml/health',
      status: '/api/ml/status'
    }
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { features, match_context } = body;

    if (!features || !Array.isArray(features) || features.length !== 7) {
      return NextResponse.json({
        error: 'Invalid features. Must provide exactly 7 numerical features.',
        required: [
          'home_strength',
          'away_strength',
          'home_advantage',
          'recent_form_home',
          'recent_form_away',
          'head_to_head',
          'injuries'
        ]
      }, { status: 400 });
    }

    const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://0.0.0.0:8000';

    const response = await fetch(`${ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ features, match_context }),
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json({
        error: 'ML prediction failed',
        details: errorData,
        fallback: true,
        prediction: features[0] > features[1] ? 'home' : 'away',
        confidence: 60,
        probabilities: {
          home: features[0] > features[1] ? 65 : 35,
          draw: 20,
          away: features[0] > features[1] ? 15 : 45
        }
      }, { status: 200 });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('ML Prediction Error:', error);
    return NextResponse.json({
      error: 'Failed to generate prediction',
      message: error instanceof Error ? error.message : 'Unknown error',
      fallback: true,
      prediction: 'draw',
      confidence: 50,
      probabilities: {
        home: 40,
        draw: 30,
        away: 30
      }
    }, { status: 500 });
  }
}