
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Developer Portal API',
    endpoints: {
      health: '/api/health',
      predictions: '/api/predictions',
      matches: '/api/matches',
    }
  });
}

interface DeveloperApplication {
  id: string;
  name: string;
  email: string;
  company: string;
  useCase: string;
  tier: 'basic' | 'professional' | 'enterprise';
  status: 'pending' | 'approved' | 'rejected';
  apiKey?: string;
  createdAt: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, company, useCase, tier } = body;

    // Validate input
    if (!name || !email || !company || !useCase || !tier) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Generate application
    const application: DeveloperApplication = {
      id: `dev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      company,
      useCase,
      tier,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // In production, save to database
    // await saveApplication(application);

    // Send welcome email with API documentation
    // await sendWelcomeEmail(application);

    return NextResponse.json({
      success: true,
      applicationId: application.id,
      message: 'Application submitted successfully. You will receive API credentials within 24 hours.',
      estimatedApprovalTime: tier === 'enterprise' ? '2-3 business days' : '24 hours'
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');

    if (action === 'pricing') {
      return NextResponse.json({
        tiers: [
          {
            id: 'basic',
            name: 'Basic Developer',
            price: 99,
            currency: 'USD',
            billing: 'monthly',
            limits: {
              requests_per_month: 10000,
              rate_limit: '100/hour'
            },
            features: [
              'Basic predictions API',
              'Live scores',
              'Standard support',
              'API documentation',
              'Community forum access'
            ],
            ideal_for: 'Small apps, personal projects'
          },
          {
            id: 'professional',
            name: 'Professional',
            price: 499,
            currency: 'USD',
            billing: 'monthly',
            limits: {
              requests_per_month: 100000,
              rate_limit: '1000/hour'
            },
            features: [
              'Advanced predictions',
              'Odds data access',
              'Analytics endpoints',
              'Priority support',
              'Custom webhooks',
              'Historical data access'
            ],
            ideal_for: 'Medium sports platforms, startups'
          },
          {
            id: 'enterprise',
            name: 'Enterprise',
            price: 2499,
            currency: 'USD',
            billing: 'monthly',
            limits: {
              requests_per_month: 1000000,
              rate_limit: '10000/hour'
            },
            features: [
              'Full API access',
              'Custom endpoints',
              'White-label solutions',
              '24/7 dedicated support',
              'SLA guarantees',
              'Custom data feeds',
              'Advanced analytics',
              'Real-time streaming'
            ],
            ideal_for: 'Large media companies, betting operators'
          }
        ]
      });
    }

    if (action === 'documentation') {
      return NextResponse.json({
        baseUrl: 'https://api.sportscentral.app/v1',
        authentication: 'API Key in header: X-API-Key',
        endpoints: [
          {
            path: '/predictions',
            method: 'GET',
            description: 'Get AI-powered sports predictions',
            parameters: [
              { name: 'sport', type: 'string', required: false, description: 'Filter by sport (football, basketball, etc.)' },
              { name: 'confidence', type: 'number', required: false, description: 'Minimum confidence threshold (0-100)' },
              { name: 'date', type: 'string', required: false, description: 'Date filter (YYYY-MM-DD)' }
            ],
            example_response: {
              data: [
                {
                  id: 'pred_123',
                  match: 'Manchester United vs Arsenal',
                  sport: 'football',
                  prediction: 'Over 2.5 Goals',
                  confidence: 84,
                  reasoning: 'Both teams have high-scoring recent form',
                  odds: { home: 2.1, away: 3.2, draw: 3.0 }
                }
              ]
            }
          },
          {
            path: '/live-scores',
            method: 'GET',
            description: 'Get real-time sports scores',
            parameters: [
              { name: 'sport', type: 'string', required: false },
              { name: 'live_only', type: 'boolean', required: false }
            ]
          },
          {
            path: '/odds',
            method: 'GET',
            description: 'Get betting odds from multiple bookmakers',
            tier_required: 'professional'
          }
        ]
      });
    }

    return NextResponse.json({
      message: 'Sports Central Developer Portal API',
      version: '1.0.0',
      available_actions: ['pricing', 'documentation']
    });

  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch developer information' },
      { status: 500 }
    );
  }
}
