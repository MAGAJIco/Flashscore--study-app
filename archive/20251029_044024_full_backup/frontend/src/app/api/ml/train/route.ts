import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, labels } = body;

    if (!data || !labels || !Array.isArray(data) || !Array.isArray(labels)) {
      return NextResponse.json(
        { error: 'Invalid training data. Expected { data: number[][], labels: number[] }' },
        { status: 400 }
      );
    }

    if (data.length !== labels.length) {
      return NextResponse.json(
        { error: 'Data and labels must have the same length' },
        { status: 400 }
      );
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001';

    const response = await fetch(`${BACKEND_URL}/ml/train`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data, labels }),
      signal: AbortSignal.timeout(60000), // 60 seconds for training
    });

    if (!response.ok) {
      throw new Error(`ML service returned ${response.status}`);
    }

    const result = await response.json();

    return NextResponse.json({
      success: true,
      training: result,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('ML training failed:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Training failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}