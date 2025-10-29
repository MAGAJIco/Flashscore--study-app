import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const mlUrl = process.env.ML_SERVICE_URL || 'http://0.0.0.0:8000';
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(`${mlUrl}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      cache: 'no-store'
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`ML service returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.error('ML health check timed out');
      return NextResponse.json(
        { success: false, error: 'ML service timeout' },
        { status: 503 }
      );
    }
    console.error('ML health check failed:', error);
    return NextResponse.json(
      { success: false, error: 'ML service unavailable' },
      { status: 503 }
    );
  }
}