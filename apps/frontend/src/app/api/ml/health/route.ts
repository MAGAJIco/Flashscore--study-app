
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch('http://0.0.0.0:8000/health', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: 'ML service unavailable' },
        { status: 503 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to connect to ML service' },
      { status: 503 }
    );
  }
}
