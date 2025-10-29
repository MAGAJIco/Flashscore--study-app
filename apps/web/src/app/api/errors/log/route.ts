
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const errorData = await request.json();
    
    console.error('Client Error:', {
      timestamp: errorData.timestamp || new Date().toISOString(),
      message: errorData.message,
      stack: errorData.stack,
      componentStack: errorData.componentStack,
      url: request.url
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging failed:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
