
/**
 * Stripe Environment Variable Validation
 * 
 * Ensures all required Stripe configuration is present before starting the server.
 */

interface StripeEnvConfig {
  secretKey: string;
  webhookSecret?: string;
}

export function validateStripeEnv(): StripeEnvConfig | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Secret key is optional in development
  if (!secretKey) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'STRIPE_SECRET_KEY is required in production. Get it from https://dashboard.stripe.com/apikeys'
      );
    }
    console.warn('⚠️  STRIPE_SECRET_KEY not set. Payment features will be disabled.');
    return null;
  }

  // Validate key format
  if (!secretKey.startsWith('sk_')) {
    throw new Error(
      'Invalid STRIPE_SECRET_KEY format. Should start with sk_test_ or sk_live_'
    );
  }

  // Webhook secret is optional for development but recommended
  if (!webhookSecret && process.env.NODE_ENV === 'production') {
    console.warn(
      '⚠️  STRIPE_WEBHOOK_SECRET not set. Webhooks will not work in production.'
    );
  }

  // Validate test vs live mode
  const isTestMode = secretKey.startsWith('sk_test_');
  const isProduction = process.env.NODE_ENV === 'production';

  if (isProduction && isTestMode) {
    console.warn(
      '⚠️  Using Stripe TEST mode in production. Switch to live keys before launch.'
    );
  }

  return {
    secretKey,
    webhookSecret,
  };
}

export function getStripeMode(): 'test' | 'live' {
  const secretKey = process.env.STRIPE_SECRET_KEY || '';
  return secretKey.startsWith('sk_test_') ? 'test' : 'live';
}
