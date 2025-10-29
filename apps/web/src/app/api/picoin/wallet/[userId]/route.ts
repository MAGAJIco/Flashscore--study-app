
import { NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:3001';

export async function GET(
  request: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const response = await fetch(`${BACKEND_API_URL}/api/picoin/wallet/${params.userId}`, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching wallet:', error);
    
    // Return mock wallet if backend is down
    return NextResponse.json({
      success: true,
      data: {
        userId: params.userId,
        balance: 50,
        totalEarned: 50,
        totalSpent: 0,
        level: 1,
        achievements: ['new_user']
      }
    });
  }
}
