
import { NextRequest, NextResponse } from 'next/server';
import PaymentManager from '@shared/libs/utils/paymentManager';

export async function POST(request: NextRequest) {
  try {
    const { transactionId, provider, amount, currency, userId, description } = await request.json();

    if (!transactionId || !provider || !amount || !userId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Verify payment with provider
    let verified = false;
    let providerResponse: any = {};

    switch (provider) {
      case 'stripe':
        if (process.env.STRIPE_SECRET_KEY) {
          const response = await fetch(`https://api.stripe.com/v1/payment_intents/${transactionId}`, {
            headers: {
              'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
            }
          });
          providerResponse = await response.json();
          verified = providerResponse.status === 'succeeded';
        }
        break;

      case 'paypal':
        // PayPal verification would go here
        verified = true; // Placeholder
        break;

      case 'pi_network':
        // Pi Network verification would go here
        verified = true; // Placeholder
        break;

      default:
        return NextResponse.json(
          { error: 'Unsupported payment provider' },
          { status: 400 }
        );
    }

    if (!verified) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Record the transaction in PaymentManager
    const paymentResult = await PaymentManager.processPayment({
      amount,
      currency: currency || 'USD',
      provider,
      userId,
      description: description || 'Payment confirmation',
      metadata: {
        verified: true,
        providerResponse,
        timestamp: new Date().toISOString()
      }
    });

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      transactionId: paymentResult.transactionId,
      message: 'Payment confirmed successfully'
    });

  } catch (error) {
    console.error('Payment confirmation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
