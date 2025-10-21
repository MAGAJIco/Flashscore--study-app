
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001';
    const response = await fetch(`${BACKEND_URL}/health`, {
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
        { error: 'Backend service unavailable' },
        { status: 503 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to connect to backend service' },
      { status: 503 }
    );
  }
}
