
export interface PaymentProvider {
  id: string;
  name: string;
  initialize(): Promise<boolean>;
  createPayment(amount: number, currency: string, description: string): Promise<PaymentResult>;
  confirmPayment(paymentId: string): Promise<PaymentResult>;
}

export interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  redirectUrl?: string;
  requiresAction?: boolean;
  clientSecret?: string;
}

export class StripePaymentProvider implements PaymentProvider {
  id = 'stripe';
  name = 'Stripe';
  private stripe: any;
  private publishableKey: string;

  constructor(publishableKey: string) {
    this.publishableKey = publishableKey;
  }

  async initialize(): Promise<boolean> {
    try {
      if (typeof window === 'undefined') return false;
      
      if (!(window as any).Stripe) {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        document.head.appendChild(script);
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      this.stripe = (window as any).Stripe(this.publishableKey);
      return !!this.stripe;
    } catch (error) {
      console.error('Stripe initialization failed:', error);
      return false;
    }
  }

  async createPayment(amount: number, currency: string, description: string): Promise<PaymentResult> {
    try {
      // In production, this would call your backend to create a PaymentIntent
      const response = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(amount * 100),
          currency: currency.toLowerCase(),
          description
        })
      });

      const { client_secret, error } = await response.json();

      if (error) {
        return { success: false, error };
      }

      return {
        success: true,
        clientSecret: client_secret,
        requiresAction: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment creation failed'
      };
    }
  }

  async confirmPayment(clientSecret: string, paymentMethodId?: string): Promise<PaymentResult> {
    try {
      const result = await this.stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethodId ? { id: paymentMethodId } : undefined
      });

      if (result.error) {
        return {
          success: false,
          error: result.error.message
        };
      }

      return {
        success: true,
        transactionId: result.paymentIntent.id
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment confirmation failed'
      };
    }
  }
}

export class PayPalPaymentProvider implements PaymentProvider {
  id = 'paypal';
  name = 'PayPal';
  private paypal: any;
  private clientId: string;
  private sandbox: boolean;

  constructor(clientId: string, sandbox = true) {
    this.clientId = clientId;
    this.sandbox = sandbox;
  }

  async initialize(): Promise<boolean> {
    try {
      if (typeof window === 'undefined') return false;

      const scriptId = 'paypal-js';
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.src = `https://www.paypal.com/sdk/js?client-id=${this.clientId}&currency=USD${this.sandbox ? '&disable-funding=credit,card' : ''}`;
        document.head.appendChild(script);
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      this.paypal = (window as any).paypal;
      return !!this.paypal;
    } catch (error) {
      console.error('PayPal initialization failed:', error);
      return false;
    }
  }

  async createPayment(amount: number, currency: string, description: string): Promise<PaymentResult> {
    try {
      const order = await this.paypal.Orders.create({
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: currency,
            value: amount.toFixed(2)
          },
          description
        }]
      });

      return {
        success: true,
        transactionId: order.id,
        requiresAction: true
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PayPal order creation failed'
      };
    }
  }

  async confirmPayment(orderId: string): Promise<PaymentResult> {
    try {
      const capture = await this.paypal.Orders.capture(orderId);
      
      return {
        success: capture.status === 'COMPLETED',
        transactionId: capture.id
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'PayPal capture failed'
      };
    }
  }
}

export class PiNetworkPaymentProvider implements PaymentProvider {
  id = 'pi_network';
  name = 'Pi Network';
  private pi: any;

  async initialize(): Promise<boolean> {
    try {
      if (typeof window === 'undefined') return false;
      this.pi = (window as any).Pi;
      return !!this.pi;
    } catch (error) {
      console.error('Pi Network initialization failed:', error);
      return false;
    }
  }

  async createPayment(amount: number, currency: string, description: string): Promise<PaymentResult> {
    try {
      const payment = await this.pi.createPayment({
        amount: amount * 0.1, // Convert to Pi (example rate)
        memo: description,
        metadata: { currency, originalAmount: amount }
      });

      return {
        success: true,
        transactionId: payment.identifier
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Pi Network payment failed'
      };
    }
  }

  async confirmPayment(paymentId: string): Promise<PaymentResult> {
    // Pi Network handles confirmation automatically
    return {
      success: true,
      transactionId: paymentId
    };
  }
}

export class PaymentIntegrationService {
  private providers: Map<string, PaymentProvider> = new Map();
  private initialized = false;

  constructor() {
    this.initializeProviders();
  }

  private initializeProviders(): void {
    // Initialize providers based on environment variables
    if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      this.providers.set('stripe', new StripePaymentProvider(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      ));
    }

    if (process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID) {
      this.providers.set('paypal', new PayPalPaymentProvider(
        process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
        process.env.NODE_ENV !== 'production'
      ));
    }

    this.providers.set('pi_network', new PiNetworkPaymentProvider());
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    const initPromises = Array.from(this.providers.values()).map(provider => 
      provider.initialize().catch(error => {
        console.warn(`Failed to initialize ${provider.name}:`, error);
        return false;
      })
    );

    await Promise.all(initPromises);
    this.initialized = true;
  }

  getAvailableProviders(): PaymentProvider[] {
    return Array.from(this.providers.values());
  }

  getProvider(id: string): PaymentProvider | undefined {
    return this.providers.get(id);
  }

  async processPayment(
    providerId: string, 
    amount: number, 
    currency: string, 
    description: string
  ): Promise<PaymentResult> {
    const provider = this.providers.get(providerId);
    if (!provider) {
      return {
        success: false,
        error: `Provider ${providerId} not found`
      };
    }

    try {
      await this.initialize();
      return await provider.createPayment(amount, currency, description);
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed'
      };
    }
  }
}

// Singleton instance
export const paymentIntegration = new PaymentIntegrationService();
