
interface MonetizationTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly' | 'lifetime';
  features: string[];
  limits: {
    predictions?: number;
    aiAnalysis?: number;
    liveMatches?: number;
    storage?: number; // in MB
  };
  discount?: number; // percentage
  popular?: boolean;
}

interface Subscription {
  id: string;
  userId: string;
  tierId: string;
  status: 'active' | 'cancelled' | 'expired' | 'trial' | 'suspended';
  startDate: Date;
  endDate: Date;
  autoRenew: boolean;
  paymentMethod: string;
  nextBillingDate?: Date;
  trialEndsAt?: Date;
}

interface Revenue {
  total: number;
  monthly: number;
  yearly: number;
  byTier: Record<string, number>;
  byPaymentMethod: Record<string, number>;
}

interface MonetizationAnalytics {
  totalSubscribers: number;
  activeSubscribers: number;
  churnRate: number;
  conversionRate: number;
  averageRevenuePerUser: number;
  lifetimeValue: number;
  revenue: Revenue;
}

interface PricingExperiment {
  id: string;
  name: string;
  variants: Array<{
    id: string;
    price: number;
    conversionRate: number;
    revenue: number;
  }>;
  status: 'active' | 'completed' | 'paused';
}

export class MonetizationManager {
  private static instance: MonetizationManager;
  private subscriptions: Map<string, Subscription> = new Map();
  private tiers: Map<string, MonetizationTier> = new Map();
  private experiments: Map<string, PricingExperiment> = new Map();
  private analytics: MonetizationAnalytics;

  private constructor() {
    this.initializeTiers();
    this.loadSubscriptions();
    this.analytics = this.initializeAnalytics();
  }

  public static getInstance(): MonetizationManager {
    if (!MonetizationManager.instance) {
      MonetizationManager.instance = new MonetizationManager();
    }
    return MonetizationManager.instance;
  }

  private initializeTiers(): void {
    // Free Tier
    this.tiers.set('free', {
      id: 'free',
      name: 'Free',
      price: 0,
      currency: 'USD',
      interval: 'monthly',
      features: [
        'Basic predictions',
        '5 predictions per day',
        'Community features',
        'Basic stats'
      ],
      limits: {
        predictions: 5,
        aiAnalysis: 0,
        liveMatches: 3,
        storage: 10
      }
    });

    // Starter Tier
    this.tiers.set('starter', {
      id: 'starter',
      name: 'Starter',
      price: 9.99,
      currency: 'USD',
      interval: 'monthly',
      features: [
        'Unlimited basic predictions',
        '20 AI-powered predictions/day',
        'Live match tracking',
        'Advanced statistics',
        'No ads'
      ],
      limits: {
        predictions: -1, // unlimited
        aiAnalysis: 20,
        liveMatches: -1,
        storage: 100
      }
    });

    // Pro Tier
    this.tiers.set('pro', {
      id: 'pro',
      name: 'Pro',
      price: 19.99,
      currency: 'USD',
      interval: 'monthly',
      features: [
        'Everything in Starter',
        'Unlimited AI predictions',
        'Real-time odds comparison',
        'Custom alerts',
        'Export data',
        'Priority support'
      ],
      limits: {
        predictions: -1,
        aiAnalysis: -1,
        liveMatches: -1,
        storage: 500
      },
      popular: true
    });

    // Elite Tier
    this.tiers.set('elite', {
      id: 'elite',
      name: 'Elite',
      price: 49.99,
      currency: 'USD',
      interval: 'monthly',
      features: [
        'Everything in Pro',
        'Exclusive AI models',
        'Personal analytics dashboard',
        'API access',
        'White-label options',
        '1-on-1 consultation',
        'Early feature access'
      ],
      limits: {
        predictions: -1,
        aiAnalysis: -1,
        liveMatches: -1,
        storage: 2000
      }
    });

    // Yearly discounts
    ['starter', 'pro', 'elite'].forEach(tierId => {
      const tier = this.tiers.get(tierId)!;
      this.tiers.set(`${tierId}_yearly`, {
        ...tier,
        id: `${tierId}_yearly`,
        interval: 'yearly',
        price: tier.price * 10, // 2 months free
        discount: 17
      });
    });
  }

  private loadSubscriptions(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem('monetization_subscriptions');
        if (stored) {
          const data = JSON.parse(stored);
          this.subscriptions = new Map(Object.entries(data).map(([k, v]: [string, any]) => [
            k,
            {
              ...v,
              startDate: new Date(v.startDate),
              endDate: new Date(v.endDate),
              nextBillingDate: v.nextBillingDate ? new Date(v.nextBillingDate) : undefined,
              trialEndsAt: v.trialEndsAt ? new Date(v.trialEndsAt) : undefined
            }
          ]));
        }
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error);
    }
  }

  private saveSubscriptions(): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const data = Object.fromEntries(this.subscriptions);
        localStorage.setItem('monetization_subscriptions', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error saving subscriptions:', error);
    }
  }

  private initializeAnalytics(): MonetizationAnalytics {
    return {
      totalSubscribers: 0,
      activeSubscribers: 0,
      churnRate: 0,
      conversionRate: 0,
      averageRevenuePerUser: 0,
      lifetimeValue: 0,
      revenue: {
        total: 0,
        monthly: 0,
        yearly: 0,
        byTier: {},
        byPaymentMethod: {}
      }
    };
  }

  // Subscription Management
  async createSubscription(
    userId: string,
    tierId: string,
    paymentMethod: string,
    startTrial: boolean = false
  ): Promise<Subscription> {
    const tier = this.tiers.get(tierId);
    if (!tier) {
      throw new Error(`Tier ${tierId} not found`);
    }

    const now = new Date();
    const subscription: Subscription = {
      id: `sub_${Date.now()}_${userId}`,
      userId,
      tierId,
      status: startTrial ? 'trial' : 'active',
      startDate: now,
      endDate: this.calculateEndDate(now, tier.interval),
      autoRenew: true,
      paymentMethod,
      nextBillingDate: this.calculateNextBillingDate(now, tier.interval),
      trialEndsAt: startTrial ? new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) : undefined
    };

    this.subscriptions.set(subscription.id, subscription);
    this.saveSubscriptions();
    this.updateAnalytics();

    return subscription;
  }

  private calculateEndDate(startDate: Date, interval: string): Date {
    const end = new Date(startDate);
    switch (interval) {
      case 'monthly':
        end.setMonth(end.getMonth() + 1);
        break;
      case 'yearly':
        end.setFullYear(end.getFullYear() + 1);
        break;
      case 'lifetime':
        end.setFullYear(end.getFullYear() + 100);
        break;
    }
    return end;
  }

  private calculateNextBillingDate(currentDate: Date, interval: string): Date {
    return this.calculateEndDate(currentDate, interval);
  }

  getUserSubscription(userId: string): Subscription | null {
    for (const sub of this.subscriptions.values()) {
      if (sub.userId === userId && (sub.status === 'active' || sub.status === 'trial')) {
        return sub;
      }
    }
    return null;
  }

  hasAccess(userId: string, feature: string): boolean {
    const subscription = this.getUserSubscription(userId);
    if (!subscription) {
      return this.checkFreeAccess(feature);
    }

    const tier = this.tiers.get(subscription.tierId);
    if (!tier) return false;

    return tier.features.includes(feature);
  }

  private checkFreeAccess(feature: string): boolean {
    const freeTier = this.tiers.get('free');
    return freeTier ? freeTier.features.includes(feature) : false;
  }

  checkLimit(userId: string, limitType: keyof MonetizationTier['limits']): {
    allowed: boolean;
    remaining: number;
    limit: number;
  } {
    const subscription = this.getUserSubscription(userId);
    const tier = subscription 
      ? this.tiers.get(subscription.tierId)
      : this.tiers.get('free');

    if (!tier || !tier.limits[limitType]) {
      return { allowed: false, remaining: 0, limit: 0 };
    }

    const limit = tier.limits[limitType]!;
    if (limit === -1) {
      return { allowed: true, remaining: -1, limit: -1 };
    }

    // Track usage (simplified - would be tracked in database)
    const usage = this.getUsage(userId, limitType);
    const remaining = Math.max(0, limit - usage);

    return {
      allowed: usage < limit,
      remaining,
      limit
    };
  }

  private getUsage(userId: string, limitType: string): number {
    // In production, fetch from database
    try {
      if (typeof localStorage !== 'undefined') {
        const key = `usage_${userId}_${limitType}`;
        return parseInt(localStorage.getItem(key) || '0');
      }
    } catch (error) {
      console.error('Error getting usage:', error);
    }
    return 0;
  }

  incrementUsage(userId: string, limitType: string): void {
    try {
      if (typeof localStorage !== 'undefined') {
        const key = `usage_${userId}_${limitType}`;
        const current = parseInt(localStorage.getItem(key) || '0');
        localStorage.setItem(key, (current + 1).toString());
      }
    } catch (error) {
      console.error('Error incrementing usage:', error);
    }
  }

  async cancelSubscription(subscriptionId: string): Promise<boolean> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) return false;

    subscription.status = 'cancelled';
    subscription.autoRenew = false;
    this.saveSubscriptions();
    this.updateAnalytics();

    return true;
  }

  async upgradeSubscription(userId: string, newTierId: string): Promise<Subscription | null> {
    const currentSub = this.getUserSubscription(userId);
    if (!currentSub) return null;

    await this.cancelSubscription(currentSub.id);
    return this.createSubscription(userId, newTierId, currentSub.paymentMethod);
  }

  // Pricing & Revenue
  getTiers(): MonetizationTier[] {
    return Array.from(this.tiers.values());
  }

  getRecommendedTier(userProfile: {
    predictionsPerDay: number;
    needsAI: boolean;
    needsAPI: boolean;
  }): MonetizationTier {
    if (userProfile.needsAPI) {
      return this.tiers.get('elite')!;
    }
    if (userProfile.needsAI && userProfile.predictionsPerDay > 20) {
      return this.tiers.get('pro')!;
    }
    if (userProfile.predictionsPerDay > 5) {
      return this.tiers.get('starter')!;
    }
    return this.tiers.get('free')!;
  }

  calculateDiscount(tierId: string, promoCode?: string): number {
    const tier = this.tiers.get(tierId);
    if (!tier) return 0;

    let discount = tier.discount || 0;

    // Apply promo codes
    if (promoCode) {
      const promoDiscount = this.getPromoDiscount(promoCode);
      discount = Math.max(discount, promoDiscount);
    }

    return Math.min(discount, 90); // Max 90% discount
  }

  private getPromoDiscount(code: string): number {
    const promoCodes: Record<string, number> = {
      'WELCOME20': 20,
      'SAVE30': 30,
      'EARLY50': 50
    };
    return promoCodes[code.toUpperCase()] || 0;
  }

  calculateFinalPrice(tierId: string, promoCode?: string): number {
    const tier = this.tiers.get(tierId);
    if (!tier) return 0;

    const discount = this.calculateDiscount(tierId, promoCode);
    return tier.price * (1 - discount / 100);
  }

  // Analytics & Reporting
  private updateAnalytics(): void {
    const now = new Date();
    const activeSubscriptions = Array.from(this.subscriptions.values()).filter(
      sub => sub.status === 'active' && sub.endDate > now
    );

    this.analytics.totalSubscribers = this.subscriptions.size;
    this.analytics.activeSubscribers = activeSubscriptions.length;

    // Calculate revenue
    let totalRevenue = 0;
    const revenueByTier: Record<string, number> = {};

    activeSubscriptions.forEach(sub => {
      const tier = this.tiers.get(sub.tierId);
      if (tier) {
        totalRevenue += tier.price;
        revenueByTier[tier.id] = (revenueByTier[tier.id] || 0) + tier.price;
      }
    });

    this.analytics.revenue.total = totalRevenue;
    this.analytics.revenue.byTier = revenueByTier;
    this.analytics.averageRevenuePerUser = activeSubscriptions.length > 0
      ? totalRevenue / activeSubscriptions.length
      : 0;
  }

  getAnalytics(): MonetizationAnalytics {
    return { ...this.analytics };
  }

  getSubscriberGrowth(days: number = 30): Array<{ date: string; count: number }> {
    const growth: Array<{ date: string; count: number }> = [];
    const now = new Date();

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const count = Array.from(this.subscriptions.values()).filter(sub => {
        const subDate = new Date(sub.startDate);
        return subDate.toISOString().split('T')[0] <= dateStr;
      }).length;

      growth.push({ date: dateStr, count });
    }

    return growth;
  }

  // A/B Testing
  createPricingExperiment(
    name: string,
    variants: Array<{ id: string; price: number }>
  ): PricingExperiment {
    const experiment: PricingExperiment = {
      id: `exp_${Date.now()}`,
      name,
      variants: variants.map(v => ({ ...v, conversionRate: 0, revenue: 0 })),
      status: 'active'
    };

    this.experiments.set(experiment.id, experiment);
    return experiment;
  }

  getOptimalPrice(experimentId: string): number {
    const experiment = this.experiments.get(experimentId);
    if (!experiment) return 0;

    const bestVariant = experiment.variants.reduce((best, current) => 
      current.revenue > best.revenue ? current : best
    );

    return bestVariant.price;
  }

  // Utility Methods
  formatPrice(price: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(price);
  }

  getDaysUntilRenewal(subscriptionId: string): number {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription || !subscription.nextBillingDate) return 0;

    const now = new Date();
    const diff = subscription.nextBillingDate.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}

export const monetizationManagerInstance = MonetizationManager.getInstance();
