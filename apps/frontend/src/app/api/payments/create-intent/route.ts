
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

const MINIMUM_AGE_FOR_PAYMENTS = 18;
const MINIMUM_AGE_WITH_CONSENT = 13;
const MAX_MINOR_TRANSACTION = 50;

interface PaymentRequestBody {
  amount: number;
  currency: string;
  description?: string;
  userAge?: number;
  isMinor?: boolean;
  parentalConsent?: boolean;
}

function calculateAge(dateOfBirth: string): number {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentRequestBody = await request.json();
    const { amount, currency, description, userAge, isMinor, parentalConsent } = body;

    // Get user session for age verification
    const session = await getServerSession() as any;
    
    // Calculate user age from session if available
    let verifiedAge = userAge;
    if (session?.user?.dateOfBirth && !verifiedAge) {
      verifiedAge = calculateAge(session.user.dateOfBirth);
    }

    // Age verification checks
    if (verifiedAge !== undefined) {
      // Users under 13 cannot make payments
      if (verifiedAge < MINIMUM_AGE_WITH_CONSENT) {
        return NextResponse.json(
          { 
            error: `Payment processing is not available for users under ${MINIMUM_AGE_WITH_CONSENT} years old`,
            code: 'AGE_RESTRICTION_UNDERAGE',
            requiredAge: MINIMUM_AGE_WITH_CONSENT
          },
          { status: 403 }
        );
      }

      // Users 13-17 require parental consent
      if (verifiedAge < MINIMUM_AGE_FOR_PAYMENTS) {
        const hasConsent = parentalConsent || session?.user?.parentalConsentGranted;
        
        if (!hasConsent) {
          return NextResponse.json(
            { 
              error: 'Parental consent required for payment processing',
              code: 'PARENTAL_CONSENT_REQUIRED',
              requiredAge: MINIMUM_AGE_FOR_PAYMENTS,
              currentAge: verifiedAge,
              action: 'REQUEST_PARENTAL_CONSENT'
            },
            { status: 403 }
          );
        }

        // Enforce transaction limits for minors with consent
        if (amount > MAX_MINOR_TRANSACTION) {
          return NextResponse.json(
            { 
              error: `Transaction amount exceeds limit for minors. Maximum: $${MAX_MINOR_TRANSACTION}`,
              code: 'MINOR_AMOUNT_LIMIT_EXCEEDED',
              maxAmount: MAX_MINOR_TRANSACTION,
              requestedAmount: amount
            },
            { status: 403 }
          );
        }
      }
    } else if (isMinor) {
      // Fallback check using isMinor flag
      if (!parentalConsent) {
        return NextResponse.json(
          { 
            error: 'Minors require parental consent for payment processing',
            code: 'MINOR_CONSENT_REQUIRED'
          },
          { status: 403 }
        );
      }
    }

    // Validate amount
    if (!amount || !currency) {
      return NextResponse.json(
        { error: 'Amount and currency are required' },
        { status: 400 }
      );
    }

    if (amount <= 0 || amount > 100000) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
    if (!STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe not configured' },
        { status: 500 }
      );
    }

    // Create payment intent with Stripe, including age verification metadata
    const response = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        amount: Math.round(amount * 100).toString(),
        currency: currency.toLowerCase(),
        description: description || 'MagajiCo Payment',
        'metadata[source]': 'magajico-app',
        'metadata[age_verified]': verifiedAge !== undefined ? 'true' : 'false',
        'metadata[is_minor_transaction]': (verifiedAge && verifiedAge < MINIMUM_AGE_FOR_PAYMENTS) ? 'true' : 'false',
        'metadata[parental_consent]': parentalConsent ? 'true' : 'false'
      })
    });

    const paymentIntent = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: paymentIntent.error?.message || 'Payment intent creation failed' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
      age_verified: verifiedAge !== undefined,
      is_minor_transaction: verifiedAge && verifiedAge < MINIMUM_AGE_FOR_PAYMENTS
    });

  } catch (error) {
    console.error('Payment intent creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
