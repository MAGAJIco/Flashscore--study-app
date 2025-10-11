import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const mlServiceUrl = process.env.ML_SERVICE_URL || "http://0.0.0.0:8000";
    const response = await fetch(`${mlServiceUrl}/health`, {
      signal: AbortSignal.timeout(5000),
      headers: {
        'Accept': 'application/json',
      }
    });

    if (!response.ok) {
      throw new Error(`ML service returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ 
      success: true, 
      service: 'ml',
      timestamp: new Date().toISOString(),
      ...data 
    });
  } catch (error) {
    console.error("ML health check failed:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "ML service unavailable",
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}