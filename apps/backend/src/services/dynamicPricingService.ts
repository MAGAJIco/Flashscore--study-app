
interface PricingTier {
  minConfidence: number;
  maxConfidence: number;
  price: number;
  label: string;
}

class DynamicPricingService {
  private tiers: PricingTier[] = [
    { minConfidence: 0, maxConfidence: 60, price: 0, label: 'Free - Low Confidence' },
    { minConfidence: 60, maxConfidence: 75, price: 2, label: 'Basic - Medium Confidence' },
    { minConfidence: 75, maxConfidence: 85, price: 5, label: 'Premium - High Confidence' },
    { minConfidence: 85, maxConfidence: 100, price: 10, label: 'Elite - Very High Confidence' }
  ];

  getPricing(confidence: number) {
    const tier = this.tiers.find(t => 
      confidence >= t.minConfidence && confidence < t.maxConfidence
    ) || this.tiers[0];

    return {
      ...tier,
      confidence,
      savings: confidence < 60 ? 'Free prediction!' : null,
      valueScore: this.calculateValueScore(confidence, tier.price)
    };
  }

  private calculateValueScore(confidence: number, price: number): number {
    if (price === 0) return 100;
    return Math.round((confidence / price) * 10);
  }

  getBulkDiscount(count: number, totalConfidence: number) {
    const avgConfidence = totalConfidence / count;
    const basePricing = this.getPricing(avgConfidence);
    
    let discount = 0;
    if (count >= 10) discount = 0.15;
    else if (count >= 5) discount = 0.10;

    return {
      ...basePricing,
      originalPrice: basePricing.price * count,
      discountedPrice: basePricing.price * count * (1 - discount),
      discount: discount * 100,
      perPrediction: (basePricing.price * (1 - discount)).toFixed(2)
    };
  }
}

export default new DynamicPricingService();
