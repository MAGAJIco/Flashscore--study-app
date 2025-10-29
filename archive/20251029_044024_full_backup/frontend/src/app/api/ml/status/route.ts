
import { NextResponse } from 'next/server';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://0.0.0.0:8000';

export async function GET() {
  try {
    const response = await fetch(`${ML_SERVICE_URL}/health`, {
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        status: 'operational',
        ...data
      });
    }

    return NextResponse.json({
      success: false,
      status: 'unavailable',
      error: 'ML service not responding'
    }, { status: 503 });

  } catch (error) {
    return NextResponse.json({
      success: false,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
