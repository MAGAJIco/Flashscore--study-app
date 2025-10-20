
import { NextRequest, NextResponse } from 'next/server';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
  dbConnected: boolean;
  services: {
    frontend: string;
    backend: string;
    ml: string;
    database: string;
  };
  checks: {
    nextAuth: boolean;
    googleAuth: boolean;
  };
}

export async function GET(request: NextRequest) {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://0.0.0.0:3001';

  const services = {
    frontend: 'ok',
    backend: 'unknown',
    ml: 'unknown',
    database: 'unknown'
  };

  // Check backend health
  try {
    const backendRes = await fetch(`${BACKEND_URL}/health`, { 
      signal: AbortSignal.timeout(3000),
      headers: { 'Content-Type': 'application/json' }
    });
    const backendData = await backendRes.json();
    services.backend = backendRes.ok ? 'ok' : 'error';
    services.database = backendData.db?.status || 'unknown';
  } catch (error) {
    console.warn('Backend health check failed:', error instanceof Error ? error.message : 'Unknown error');
    services.backend = 'offline';
    services.database = 'offline';
  }

  // Check ML service health via backend proxy
  try {
    const mlRes = await fetch(`${BACKEND_URL}/ml-status`, { 
      signal: AbortSignal.timeout(3000),
      headers: { 'Content-Type': 'application/json' }
    });
    services.ml = mlRes.ok ? 'ok' : 'error';
  } catch (error) {
    console.warn('ML service health check failed:', error instanceof Error ? error.message : 'Unknown error');
    services.ml = 'offline';
  }

  const dbConnected = services.database === 'ok';
  
  const overallStatus = 
    services.backend === 'ok' && services.ml === 'ok' ? 'healthy' :
    services.backend === 'offline' || services.ml === 'offline' ? 'degraded' :
    'unhealthy';

  const healthData: HealthStatus = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    dbConnected,
    services,
    checks: {
      nextAuth: !!process.env.NEXTAUTH_SECRET,
      googleAuth: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
    }
  };

  return NextResponse.json(healthData, { 
    status: overallStatus === 'healthy' ? 200 : 503,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  });
}

export async function HEAD(request: NextRequest) {
  return new NextResponse(null, { status: 200 });
}
