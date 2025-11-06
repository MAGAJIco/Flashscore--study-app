import { NextRequest, NextResponse } from "next/server";

interface ApiKeyStatus {
  name: string;
  status: 'active' | 'error' | 'missing' | 'checking';
  message?: string;
  lastChecked: string;
}

export async function GET(request: NextRequest) {
  const results: ApiKeyStatus[] = [];
  const timestamp = new Date().toISOString();
  const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://0.0.0.0:3001';

  // === OpenAI Check ===
  const checkOpenAI = async (): Promise<ApiKeyStatus> => {
    if (!process.env.OPENAI_API_KEY) {
      return {
        name: 'OpenAI',
        status: 'missing',
        message: 'API key not configured',
        lastChecked: timestamp,
      };
    }

    try {
      const OpenAI = (await import("openai")).default;
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      await openai.models.list();

      return {
        name: 'OpenAI',
        status: 'active',
        message: 'Connected successfully',
        lastChecked: timestamp,
      };
    } catch (error: any) {
      let message = 'Connection failed';
      if (error.status === 401) message = 'Invalid API key';
      else if (error.status === 429) message = 'Quota exceeded - check billing';
      else if (error.message) message = error.message;

      return { name: 'OpenAI', status: 'error', message, lastChecked: timestamp };
    }
  };

  // === Stripe Check ===
  const checkStripe = async (): Promise<ApiKeyStatus> => {
    const hasPublic = !!process.env.STRIPE_PUBLISHABLE_KEY;
    const hasSecret = !!process.env.STRIPE_SECRET_KEY;

    if (!hasPublic && !hasSecret) {
      return { name: 'Stripe', status: 'missing', message: 'API keys not configured', lastChecked: timestamp };
    }

    if (!hasSecret) {
      return { name: 'Stripe', status: 'error', message: 'Secret key missing', lastChecked: timestamp };
    }

    try {
      const response = await fetch('https://api.stripe.com/v1/balance', {
        headers: { 'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}` },
      });

      if (response.ok) {
        return { name: 'Stripe', status: 'active', message: 'Connected successfully', lastChecked: timestamp };
      }

      const msg = response.status === 401 ? 'Invalid API key' : `HTTP ${response.status}`;
      return { name: 'Stripe', status: 'error', message: msg, lastChecked: timestamp };
    } catch (error: any) {
      return { name: 'Stripe', status: 'error', message: error.message || 'Connection failed', lastChecked: timestamp };
    }
  };

  // === MongoDB Check ===
  const checkMongoDB = async (): Promise<ApiKeyStatus> => {
    if (!process.env.MONGODB_URI) {
      return { name: 'MongoDB', status: 'missing', message: 'Connection URI not configured', lastChecked: timestamp };
    }

    try {
      const response = await fetch(`${BACKEND_API_URL}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        const msg = data.database === 'connected' ? 'Connected successfully' : 'Database disconnected';
        return { name: 'MongoDB', status: data.database === 'connected' ? 'active' : 'error', message: msg, lastChecked: timestamp };
      }
      return { name: 'MongoDB', status: 'error', message: 'Health check failed', lastChecked: timestamp };
    } catch (error: any) {
      return { name: 'MongoDB', status: 'error', message: error.message || 'Connection failed', lastChecked: timestamp };
    }
  };

  // === JWT Check ===
  const checkJWT = (): ApiKeyStatus => {
    const hasSecret = !!process.env.JWT_SECRET;
    const hasRefreshSecret = !!process.env.JWT_REFRESH_SECRET;

    if (!hasSecret && !hasRefreshSecret) {
      return { name: 'JWT Secrets', status: 'missing', message: 'JWT secrets not configured', lastChecked: timestamp };
    }

    if (hasSecret && hasRefreshSecret) {
      return { name: 'JWT Secrets', status: 'active', message: 'All secrets configured', lastChecked: timestamp };
    }

    return { name: 'JWT Secrets', status: 'error', message: 'Some secrets missing', lastChecked: timestamp };
  };

  // === Predictions / Matches APIs ===
  const checkAPI = async (name: string, path: string): Promise<ApiKeyStatus> => {
    try {
      const response = await fetch(`${BACKEND_API_URL}${path}`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        return { name, status: 'active', message: `Responding (${data.count || 0} items)`, lastChecked: timestamp };
      }
      return { name, status: 'error', message: `HTTP ${response.status}`, lastChecked: timestamp };
    } catch (error: any) {
      return { name, status: 'error', message: error.message || 'Not responding', lastChecked: timestamp };
    }
  };

  // === Backend Health Check ===
  const checkBackend = async (): Promise<ApiKeyStatus> => {
    try {
      const response = await fetch(`${BACKEND_API_URL}/health`, {
        cache: 'no-store',
        signal: AbortSignal.timeout(3000),
      });

      if (!response.ok) throw new Error('Backend unhealthy');
      const data = await response.json();
      return { name: 'Backend Server', status: 'active', message: 'Healthy', lastChecked: timestamp };
    } catch (error: any) {
      return { name: 'Backend Server', status: 'error', message: error.message || 'Unreachable', lastChecked: timestamp };
    }
  };

  // === Execute All Checks ===
  try {
    const [
      openaiStatus,
      stripeStatus,
      mongoStatus,
      predictionsStatus,
      liveMatchesStatus,
      upcomingMatchesStatus,
      backendStatus
    ] = await Promise.all([
      checkOpenAI(),
      checkStripe(),
      checkMongoDB(),
      checkAPI('Predictions API', '/api/predictions'),
      checkAPI('Live Matches API', '/api/matches/live'),
      checkAPI('Upcoming Matches API', '/api/matches/upcoming?limit=5'),
      checkBackend(),
    ]);

    results.push(
      openaiStatus,
      stripeStatus,
      mongoStatus,
      checkJWT(),
      predictionsStatus,
      liveMatchesStatus,
      upcomingMatchesStatus,
      backendStatus
    );

    return NextResponse.json({
      success: true,
      timestamp,
      keys: results,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message, timestamp },
      { status: 500 }
    );
  }
}