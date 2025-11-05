import { NextRequest, NextResponse } from "next/server";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user

interface ApiKeyStatus {
  name: string;
  status: 'active' | 'error' | 'missing' | 'checking';
  message?: string;
  lastChecked: string;
}

export async function GET(request: NextRequest) {
  const results: ApiKeyStatus[] = [];
  const timestamp = new Date().toISOString();

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
      if (error.status === 401) {
        message = 'Invalid API key';
      } else if (error.status === 429) {
        message = 'Quota exceeded - check billing';
      } else if (error.message) {
        message = error.message;
      }
      
      return {
        name: 'OpenAI',
        status: 'error',
        message,
        lastChecked: timestamp,
      };
    }
  };

  const checkStripe = async (): Promise<ApiKeyStatus> => {
    const hasPublic = !!process.env.STRIPE_PUBLISHABLE_KEY;
    const hasSecret = !!process.env.STRIPE_SECRET_KEY;

    if (!hasPublic && !hasSecret) {
      return {
        name: 'Stripe',
        status: 'missing',
        message: 'API keys not configured',
        lastChecked: timestamp,
      };
    }

    if (!hasSecret) {
      return {
        name: 'Stripe',
        status: 'error',
        message: 'Secret key missing',
        lastChecked: timestamp,
      };
    }

    try {
      const response = await fetch('https://api.stripe.com/v1/balance', {
        headers: {
          'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        },
      });

      if (response.ok) {
        return {
          name: 'Stripe',
          status: 'active',
          message: 'Connected successfully',
          lastChecked: timestamp,
        };
      } else if (response.status === 401) {
        return {
          name: 'Stripe',
          status: 'error',
          message: 'Invalid API key',
          lastChecked: timestamp,
        };
      } else {
        return {
          name: 'Stripe',
          status: 'error',
          message: `HTTP ${response.status}`,
          lastChecked: timestamp,
        };
      }
    } catch (error: any) {
      return {
        name: 'Stripe',
        status: 'error',
        message: error.message || 'Connection failed',
        lastChecked: timestamp,
      };
    }
  };

  const checkMongoDB = async (): Promise<ApiKeyStatus> => {
    if (!process.env.MONGODB_URI) {
      return {
        name: 'MongoDB',
        status: 'missing',
        message: 'Connection URI not configured',
        lastChecked: timestamp,
      };
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${apiUrl}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.database === 'connected') {
          return {
            name: 'MongoDB',
            status: 'active',
            message: 'Connected successfully',
            lastChecked: timestamp,
          };
        } else {
          return {
            name: 'MongoDB',
            status: 'error',
            message: 'Database disconnected',
            lastChecked: timestamp,
          };
        }
      } else {
        return {
          name: 'MongoDB',
          status: 'error',
          message: 'Health check failed',
          lastChecked: timestamp,
        };
      }
    } catch (error: any) {
      return {
        name: 'MongoDB',
        status: 'error',
        message: error.message || 'Connection failed',
        lastChecked: timestamp,
      };
    }
  };

  const checkJWT = (): ApiKeyStatus => {
    const hasSecret = !!process.env.JWT_SECRET;
    const hasRefreshSecret = !!process.env.JWT_REFRESH_SECRET;

    if (!hasSecret && !hasRefreshSecret) {
      return {
        name: 'JWT Secrets',
        status: 'missing',
        message: 'JWT secrets not configured',
        lastChecked: timestamp,
      };
    }

    if (hasSecret && hasRefreshSecret) {
      return {
        name: 'JWT Secrets',
        status: 'active',
        message: 'All secrets configured',
        lastChecked: timestamp,
      };
    }

    return {
      name: 'JWT Secrets',
      status: 'error',
      message: 'Some secrets missing',
      lastChecked: timestamp,
    };
  };

  const checkPredictionsAPI = async (): Promise<ApiKeyStatus> => {
    try {
      const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/predictions`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          name: 'Predictions API',
          status: 'active',
          message: `Responding (${data.count || 0} predictions)`,
          lastChecked: timestamp,
        };
      } else {
        return {
          name: 'Predictions API',
          status: 'error',
          message: `HTTP ${response.status}`,
          lastChecked: timestamp,
        };
      }
    } catch (error: any) {
      return {
        name: 'Predictions API',
        status: 'error',
        message: error.message || 'Not responding',
        lastChecked: timestamp,
      };
    }
  };

  const checkLiveMatchesAPI = async (): Promise<ApiKeyStatus> => {
    try {
      const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/matches/live`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          name: 'Live Matches API',
          status: 'active',
          message: `Responding (${data.count || 0} live matches)`,
          lastChecked: timestamp,
        };
      } else {
        return {
          name: 'Live Matches API',
          status: 'error',
          message: `HTTP ${response.status}`,
          lastChecked: timestamp,
        };
      }
    } catch (error: any) {
      return {
        name: 'Live Matches API',
        status: 'error',
        message: error.message || 'Not responding',
        lastChecked: timestamp,
      };
    }
  };

  const checkUpcomingMatchesAPI = async (): Promise<ApiKeyStatus> => {
    try {
      const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:3001';
      const response = await fetch(`${backendUrl}/api/matches/upcoming?limit=5`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000),
      });

      if (response.ok) {
        const data = await response.json();
        return {
          name: 'Upcoming Matches API',
          status: 'active',
          message: `Responding (${data.count || 0} upcoming matches)`,
          lastChecked: timestamp,
        };
      } else {
        return {
          name: 'Upcoming Matches API',
          status: 'error',
          message: `HTTP ${response.status}`,
          lastChecked: timestamp,
        };
      }
    } catch (error: any) {
      return {
        name: 'Upcoming Matches API',
        status: 'error',
        message: error.message || 'Not responding',
        lastChecked: timestamp,
      };
    }
  };

  try {
    const [
      openaiStatus, 
      stripeStatus, 
      mongoStatus, 
      predictionsStatus,
      liveMatchesStatus,
      upcomingMatchesStatus
    ] = await Promise.all([
      checkOpenAI(),
      checkStripe(),
      checkMongoDB(),
      checkPredictionsAPI(),
      checkLiveMatchesAPI(),
      checkUpcomingMatchesAPI(),
    ]);

    results.push(
      openaiStatus, 
      stripeStatus, 
      mongoStatus, 
      checkJWT(),
      predictionsStatus,
      liveMatchesStatus,
      upcomingMatchesStatus
    );

    return NextResponse.json({
      success: true,
      timestamp,
      keys: results,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      timestamp,
    }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://0.0.0.0:3001';

export async function GET() {
  try {
    const response = await fetch(`${BACKEND_API_URL}/health`, {
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      throw new Error('Backend unhealthy');
    }

    const data = await response.json();
    return NextResponse.json({ 
      status: 'healthy',
      backend: data 
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'degraded',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 });
  }
}
