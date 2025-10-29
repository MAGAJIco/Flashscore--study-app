
interface PaymentProvider {
  id: string;
  name: string;
  enabled: boolean;
  config: Record<string, any>;
}

interface PaymentRequest {
  amount: number;
  currency: string;
  provider: string;
  userId: string;
  description: string;
  metadata?: Record<string, any>;
}

interface PaymentResult {
  success: boolean;
  transactionId?: string;
  error?: string;
  redirectUrl?: string;
  metadata?: Record<string, any>;
}

interface Subscription {
  id: string;
  userId: string;
  plan: string;
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
  amount: number;
  interval: 'monthly' | 'yearly';
}

export class PaymentManager {
  private static instance: PaymentManager;
  private providers: Map<string, PaymentProvider> = new Map();
  private transactions: Map<string, any> = new Map();
  private subscriptions: Map<string, Subscription> = new Map();

  private constructor() {
    this.initializeProviders();
    this.loadFromStorage();
  }

  public static getInstance(): PaymentManager {
    if (!PaymentManager.instance) {
      PaymentManager.instance = new PaymentManager();
    }
    return PaymentManager.instance;
  }

  private initializeProviders(): void {
    // Pi Network provider
    this.providers.set('pi_network', {
      id: 'pi_network',
      name: 'Pi Network',
      enabled: true,
      config: {
        apiKey: process.env.PI_NETWORK_API_KEY,
        sandbox: process.env.NODE_ENV !== 'production',
        appId: process.env.PI_NETWORK_APP_ID
      }
    });

    // PayPal provider
    this.providers.set('paypal', {
      id: 'paypal',
      name: 'PayPal',
      enabled: !!process.env.PAYPAL_CLIENT_ID,
      config: {
        clientId: process.env.PAYPAL_CLIENT_ID,
        clientSecret: process.env.PAYPAL_CLIENT_SECRET,
        sandbox: process.env.NODE_ENV !== 'production'
      }
    });

    // Stripe provider
    this.providers.set('stripe', {
      id: 'stripe',
      name: 'Stripe',
      enabled: !!process.env.STRIPE_PUBLISHABLE_KEY,
      config: {
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        secretKey: process.env.STRIPE_SECRET_KEY
      }
    });
  }

  private loadFromStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('paymentTransactions');
        if (stored) {
          const data = JSON.parse(stored);
          this.transactions = new Map(Object.entries(data));
        }

        const storedSubs = localStorage.getItem('subscriptions');
        if (storedSubs) {
          const subData = JSON.parse(storedSubs);
          this.subscriptions = new Map(Object.entries(subData));
        }
      }
    } catch (error) {
      console.error('Error loading payment data:', error);
    }
  }

  private saveToStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        const transactionsObj = Object.fromEntries(this.transactions);
        localStorage.setItem('paymentTransactions', JSON.stringify(transactionsObj));

        const subscriptionsObj = Object.fromEntries(this.subscriptions);
        localStorage.setItem('subscriptions', JSON.stringify(subscriptionsObj));
      }
    } catch (error) {
      console.error('Error saving payment data:', error);
    }
  }

  // Process payment
  async processPayment(paymentRequest: PaymentRequest): Promise<PaymentResult> {
    const provider = this.providers.get(paymentRequest.provider);
    if (!provider || !provider.enabled) {
      return {
        success: false,
        error: `Payment provider ${paymentRequest.provider} not available`
      };
    }

    try {
      let result: PaymentResult;

      switch (paymentRequest.provider) {
        case 'pi_network':
          result = await this.processPiNetworkPayment(paymentRequest);
          break;
        case 'paypal':
          result = await this.processPayPalPayment(paymentRequest);
          break;
        case 'stripe':
          result = await this.processStripePayment(paymentRequest);
          break;
        default:
          return {
            success: false,
            error: 'Unsupported payment provider'
          };
      }

      // Store transaction
      if (result.success && result.transactionId) {
        this.transactions.set(result.transactionId, {
          id: result.transactionId,
          ...paymentRequest,
          status: 'completed',
          timestamp: new Date(),
          result
        });
        this.saveToStorage();
      }

      return result;
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Payment processing failed'
      };
    }
  }

  // Pi Network payment processing
  private async processPiNetworkPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      const transactionId = `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Check if Pi Network is available
      if (typeof window !== 'undefined' && (window as any).Pi) {
        try {
          const piPayment = await (window as any).Pi.createPayment({
            amount: request.amount * 0.1, // Conversion rate to Pi
            memo: request.description,
            metadata: request.metadata
          });
          
          return {
            success: true,
            transactionId: piPayment.identifier,
            metadata: {
              provider: 'pi_network',
              piAmount: request.amount * 0.1,
              piPaymentId: piPayment.identifier
            }
          };
        } catch (piError) {
          console.error('Pi Network payment error:', piError);
          return {
            success: false,
            error: 'Pi Network payment failed'
          };
        }
      }
      
      // Fallback simulation for development
      return {
        success: true,
        transactionId,
        metadata: {
          provider: 'pi_network',
          piAmount: request.amount * 0.1,
          simulated: true
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Pi Network processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // PayPal payment processing
  private async processPayPalPayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      const provider = this.providers.get('paypal');
      if (!provider?.config.clientId) {
        return {
          success: false,
          error: 'PayPal not configured'
        };
      }

      const transactionId = `pp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create PayPal order
      const orderData = {
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: request.currency,
            value: request.amount.toFixed(2)
          },
          description: request.description
        }],
        application_context: {
          return_url: `${window.location.origin}/payment/success`,
          cancel_url: `${window.location.origin}/payment/cancel`
        }
      };

      // In production, make actual API call to PayPal
      const apiUrl = provider.config.sandbox 
        ? 'https://api.sandbox.paypal.com/v2/checkout/orders'
        : 'https://api.paypal.com/v2/checkout/orders';

      // For now, return redirect URL (would need server-side implementation)
      return {
        success: true,
        transactionId,
        redirectUrl: `https://www.paypal.com/checkoutnow?token=${transactionId}`,
        metadata: {
          provider: 'paypal',
          orderId: transactionId,
          sandbox: provider.config.sandbox
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `PayPal processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Stripe payment processing
  private async processStripePayment(request: PaymentRequest): Promise<PaymentResult> {
    try {
      const provider = this.providers.get('stripe');
      if (!provider?.config.publishableKey) {
        return {
          success: false,
          error: 'Stripe not configured'
        };
      }

      // Load Stripe.js if not already loaded
      if (typeof window !== 'undefined' && !(window as any).Stripe) {
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        document.head.appendChild(script);
        await new Promise(resolve => script.onload = resolve);
      }

      const stripe = (window as any).Stripe?.(provider.config.publishableKey);
      if (!stripe) {
        throw new Error('Stripe failed to initialize');
      }

      // Create payment intent (this would typically be done server-side)
      const paymentIntent = {
        id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        client_secret: `pi_${Date.now()}_secret_${Math.random().toString(36).substr(2, 9)}`,
        amount: Math.round(request.amount * 100), // Convert to cents
        currency: request.currency.toLowerCase()
      };

      // Confirm payment
      const result = await stripe.confirmCardPayment(paymentIntent.client_secret, {
        payment_method: {
          card: {
            // This would come from Stripe Elements in a real implementation
          },
          billing_details: {
            name: request.userId
          }
        }
      });

      if (result.error) {
        return {
          success: false,
          error: result.error.message
        };
      }

      return {
        success: true,
        transactionId: result.paymentIntent.id,
        metadata: {
          provider: 'stripe',
          paymentIntentId: result.paymentIntent.id,
          status: result.paymentIntent.status
        }
      };
    } catch (error) {
      return {
        success: false,
        error: `Stripe processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  // Subscription management
  async createSubscription(
    userId: string,
    plan: string,
    amount: number,
    interval: 'monthly' | 'yearly'
  ): Promise<Subscription> {
    const subscription: Subscription = {
      id: `sub_${Date.now()}_${userId}`,
      userId,
      plan,
      status: 'active',
      startDate: new Date(),
      endDate: new Date(Date.now() + (interval === 'monthly' ? 30 : 365) * 24 * 60 * 60 * 1000),
      amount,
      interval
    };

    this.subscriptions.set(subscription.id, subscription);
    this.saveToStorage();
    
    return subscription;
  }

  // Get user subscriptions
  getUserSubscriptions(userId: string): Subscription[] {
    return Array.from(this.subscriptions.values())
      .filter(sub => sub.userId === userId);
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return false;

    subscription.status = 'cancelled';
    this.subscriptions.set(subscriptionId, subscription);
    this.saveToStorage();
    
    return true;
  }

  // Get transaction history
  getTransactionHistory(userId: string, limit: number = 50): any[] {
    return Array.from(this.transactions.values())
      .filter(tx => tx.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Webhook handler for payment confirmations
  async handleWebhook(provider: string, payload: any): Promise<boolean> {
    try {
      switch (provider) {
        case 'paypal':
          return this.handlePayPalWebhook(payload);
        case 'stripe':
          return this.handleStripeWebhook(payload);
        default:
          console.error('Unknown webhook provider:', provider);
          return false;
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
      return false;
    }
  }

  private async handlePayPalWebhook(payload: any): Promise<boolean> {
    // Process PayPal webhook
    console.log('PayPal webhook:', payload);
    return true;
  }

  private async handleStripeWebhook(payload: any): Promise<boolean> {
    // Process Stripe webhook
    console.log('Stripe webhook:', payload);
    return true;
  }

  // Get available providers
  getAvailableProviders(): PaymentProvider[] {
    return Array.from(this.providers.values()).filter(p => p.enabled);
  }

  // Validate payment amount
  static validateAmount(amount: number): boolean {
    return amount > 0 && amount <= 10000 && Number.isFinite(amount);
  }

  // Format currency
  static formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  }

  // Calculate fees
  calculateFees(amount: number, provider: string): number {
    const feeRates = {
      pi_network: 0.02, // 2%
      paypal: 0.029, // 2.9%
      stripe: 0.029 // 2.9%
    };
    
    return amount * (feeRates[provider as keyof typeof feeRates] || 0.03);
  }
}

export const paymentManagerInstance = PaymentManager.getInstance();
