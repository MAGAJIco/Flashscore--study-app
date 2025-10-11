
import { NextRequest, NextResponse } from 'next/server';
import PaymentManager from '@shared/libs/utils/paymentManager';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json(
        { error: 'No signature found' },
        { status: 400 }
      );
    }

    const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;
    if (!STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    // In production, verify the webhook signature
    // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    // const event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);

    // For now, parse the event directly
    const event = JSON.parse(body);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        
        // Process the successful payment
        await PaymentManager.handleWebhook('stripe', {
          type: 'payment_succeeded',
          transactionId: paymentIntent.id,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency,
          metadata: paymentIntent.metadata
        });
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        
        await PaymentManager.handleWebhook('stripe', {
          type: 'payment_failed',
          transactionId: failedPayment.id,
          error: failedPayment.last_payment_error?.message
        });
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
