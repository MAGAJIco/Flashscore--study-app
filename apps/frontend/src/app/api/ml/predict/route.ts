
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch('http://0.0.0.0:8000/predict', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      const errorData = await response.text();
      return NextResponse.json(
        { error: 'ML prediction failed', details: errorData },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('ML prediction proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to connect to ML service' },
      { status: 503 }
    );
  }
}
