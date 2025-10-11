
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001';
    const { searchParams } = new URL(request.url);
    const kidsMode = searchParams.get('kidsMode') === 'true';

    const response = await fetch(
      `${backendUrl}/api/payments/transactions${kidsMode ? '?kidsMode=true' : ''}`,
      {
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      throw new Error(`Backend returned ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch payments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001';
    const body = await request.json();
    const { searchParams } = new URL(request.url);
    const kidsMode = searchParams.get('kidsMode') === 'true';

    const response = await fetch(
      `${backendUrl}/api/payments/process${kidsMode ? '?kidsMode=true' : ''}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json(
      { success: false, error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}
