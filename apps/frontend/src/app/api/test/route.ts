
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'success',
    message: 'Frontend API is working!',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version
  });
}

export async function POST() {
  return NextResponse.json({ message: 'POST method' });
}
