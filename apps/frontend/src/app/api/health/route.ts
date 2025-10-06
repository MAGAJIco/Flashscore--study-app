import { NextRequest, NextResponse } from 'next/server';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  services: {
    frontend: string;
    backend: string;
    ml: string;
  };
}

export async function GET(request: NextRequest) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001';
  const mlUrl = process.env.NEXT_PUBLIC_ML_URL || 'http://0.0.0.0:8000';

  const services = {
    frontend: 'ok',
    backend: 'unknown',
    ml: 'unknown'
  };

  // Check backend health
  try {
    const backendRes = await fetch(`${backendUrl}/api/health`, { 
      signal: AbortSignal.timeout(3000),
      headers: { 'Content-Type': 'application/json' }
    });
    services.backend = backendRes.ok ? 'ok' : 'error';
  } catch (error) {
    console.warn('Backend health check failed:', error instanceof Error ? error.message : 'Unknown error');
    services.backend = 'offline';
  }

  // Check ML service health
  try {
    const mlRes = await fetch(`${mlUrl}/health`, { 
      signal: AbortSignal.timeout(3000),
      headers: { 'Content-Type': 'application/json' }
    });
    services.ml = mlRes.ok ? 'ok' : 'error';
  } catch (error) {
    console.warn('ML service health check failed:', error instanceof Error ? error.message : 'Unknown error');
    services.ml = 'offline';
  }

  return NextResponse.json({
    status: services.backend === 'ok' && services.ml === 'ok' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    services
  });
}

export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 });
}