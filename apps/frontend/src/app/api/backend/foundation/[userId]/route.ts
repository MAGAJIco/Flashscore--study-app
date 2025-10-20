
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const response = await fetch(`${BACKEND_URL}/api/foundation/${userId}`);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Foundation API error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch foundation data' },
      { status: 500 }
    );
  }
}
