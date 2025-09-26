//app/frontend/src/app/components/ai/magajicoCEO.ts
// CEO: Decides what is important and what should happen
// Enhanced with strategic thinking patterns from tech leaders
export interface Prediction {
  match: string;
  prediction: string;
  confidence: number;
  marketValue?: number;
  riskFactor?: number;
}

export type CEOAction =
  | { type: "ALERT"; message: string; level: "info" | "success" | "warning" | "danger" }
  | { type: "HIGHLIGHT"; match: string }
  | { type: "STRATEGIC_MOVE"; action: string; reasoning: string }
  | { type: "MARKET_OPPORTUNITY"; prediction: Prediction; potential: number }
  | { type: "IGNORE" };

interface StrategicThinking {
  longTermVision: boolean;
  disruptiveInnovation: boolean;
  marketDomination: boolean;
  riskTolerance: number;
  executionSpeed: number;
}

// Strategic patterns inspired by tech leaders
const STRATEGIC_PATTERNS: StrategicThinking = {
  longTermVision: true, // Jeff Bezos - long-term thinking
  disruptiveInnovation: true, // Elon Musk - revolutionary approach  
  marketDomination: true, // Bill Gates - market positioning
  riskTolerance: 0.7, // Jack Ma - calculated risks
  executionSpeed: 0.9 // All leaders - fast execution
};

// Mark Zuckerberg Meta Strategic Framework
interface ZuckerbergMetaStrategy {
  metaverseVision: boolean; // Long-term virtual world dominance
  socialConnectionFocus: boolean; // Connect people globally
  platformScaling: number; // Scale fast and iterate
  dataIntelligence: number; // Data-driven decisions
  acquisitionStrategy: number; // Strategic acquisitions
}

const ZUCKERBERG_META_PATTERNS: ZuckerbergMetaStrategy = {
  metaverseVision: true, // Future of social interaction
  socialConnectionFocus: true, // Build communities
  platformScaling: 0.95, // Scale rapidly
  dataIntelligence: 0.9, // Analytics-driven
  acquisitionStrategy: 0.8 // Strategic partnerships
};

// MagajiCo 5(1) Filter System - Five quality checks, one final decision
interface MagajiCo5Filter {
  confidenceCheck: boolean;
  marketValueCheck: boolean;
  riskAssessment: boolean;
  strategicAlignment: boolean;
  executionFeasibility: boolean;
  finalDecision: 'PROCEED' | 'HOLD' | 'REJECT';
}

// MagajiCo 5(1) Filter System Implementation
function apply5Filter(prediction: Prediction): MagajiCo5Filter {
  const filter: MagajiCo5Filter = {
    confidenceCheck: prediction.confidence > 70, // Filter 1: Confidence threshold
    marketValueCheck: (prediction.marketValue || 0) > 50, // Filter 2: Market value potential
    riskAssessment: (prediction.riskFactor || 0) < 0.6, // Filter 3: Risk tolerance
    strategicAlignment: calculateStrategicValue(prediction) > 0.6, // Filter 4: Strategic fit
    executionFeasibility: prediction.confidence > 60, // Filter 5: Execution possibility
    finalDecision: 'HOLD'
  };

  // Zuckerberg Meta Decision Logic - Connect, Scale, Dominate
  const metaScore = (
    (filter.confidenceCheck ? 1 : 0) +
    (filter.marketValueCheck ? 1 : 0) +
    (filter.riskAssessment ? 1 : 0) +
    (filter.strategicAlignment ? 1 : 0) +
    (filter.executionFeasibility ? 1 : 0)
  );

  // The "1" in 5(1) - Single final decision based on all filters
  if (metaScore >= 4 && prediction.confidence > 80) {
    filter.finalDecision = 'PROCEED'; // Meta-level opportunity
  } else if (metaScore >= 3) {
    filter.finalDecision = 'HOLD'; // Monitor and iterate
  } else {
    filter.finalDecision = 'REJECT'; // Not aligned with strategy
  }

  return filter;
}

export function magajicoCEO(predictions: Prediction[]): CEOAction[] {
  const actions: CEOAction[] = [];

  // Enhanced strategic analysis with Zuckerberg Meta patterns and 5(1) filter
  predictions.forEach((p) => {
    const strategicValue = calculateStrategicValue(p);
    const filter5 = apply5Filter(p);
    
    // Apply Zuckerberg Meta Strategic Framework
    if (filter5.finalDecision === 'PROCEED' && ZUCKERBERG_META_PATTERNS.metaverseVision) {
      // Meta-level strategic opportunities (Zuckerberg-style future vision)
      actions.push({
        type: "MARKET_OPPORTUNITY",
        prediction: p,
        potential: strategicValue * 100 * ZUCKERBERG_META_PATTERNS.platformScaling
      });
      
      actions.push({
        type: "ALERT",
        message: `🌐 META OPPORTUNITY: ${p.match} - 5(1) Filter: PROCEED | Strategic Value: ${Math.round(strategicValue * 100)}% | Zuckerberg Score: ${Math.round(strategicValue * ZUCKERBERG_META_PATTERNS.dataIntelligence * 100)}%`,
        level: "success",
      });
      
      actions.push({ type: "HIGHLIGHT", match: p.match });
      
      actions.push({
        type: "STRATEGIC_MOVE",
        action: `META_SCALE: ${p.match}`,
        reasoning: `Zuckerberg Meta Strategy: Connect & Scale - Platform scaling opportunity detected`
      });
    } 
    else if (filter5.finalDecision === 'HOLD' && ZUCKERBERG_META_PATTERNS.socialConnectionFocus) {
      // Medium opportunities with community potential (Zuckerberg-style social connection)
      actions.push({
        type: "STRATEGIC_MOVE",
        action: `COMMUNITY_BUILD: ${p.match}`,
        reasoning: `Zuckerberg Social Strategy: Build connections and monitor engagement potential`
      });
      
      actions.push({
        type: "ALERT",
        message: `👥 Social Strategy: ${p.match} - 5(1) Filter: HOLD | Building community connections (${p.confidence}%)`,
        level: "info",
      });
    }
    else if (filter5.finalDecision === 'REJECT' || (p.riskFactor && p.riskFactor > 0.7)) {
      // High-risk scenarios (Meta-style data-driven rejection)
      actions.push({
        type: "STRATEGIC_MOVE",
        action: `DATA_ANALYSIS: ${p.match}`,
        reasoning: "Zuckerberg Data Strategy: Insufficient data signals - continue monitoring"
      });
      
      actions.push({
        type: "ALERT",
        message: `📊 Data Analysis: ${p.match} - 5(1) Filter: REJECT | Insufficient strategic alignment`,
        level: "warning",
      });
    } 
    else {
      // Standard monitoring with Meta intelligence
      actions.push({ type: "IGNORE" });
    }
  });

  // Add Meta strategic oversight actions
  if (predictions.length > 0) {
    const proceedCount = predictions.filter(p => apply5Filter(p).finalDecision === 'PROCEED').length;
    
    if (proceedCount > 2) {
      actions.push({
        type: "STRATEGIC_MOVE",
        action: "META_PLATFORM_EXPANSION",
        reasoning: `Zuckerberg Meta Strategy: ${proceedCount} high-value opportunities - scale platform and dominate market`
      });
    }
  }

  return actions;
}

function calculateStrategicValue(prediction: Prediction): number {
  let value = prediction.confidence / 100;
  
  // Market value consideration (Gates-style)
  if (prediction.marketValue) {
    value *= (1 + prediction.marketValue / 100);
  }
  
  // Risk adjustment (Bezos-style long-term thinking)
  if (prediction.riskFactor) {
    value *= (1 - prediction.riskFactor * STRATEGIC_PATTERNS.riskTolerance);
  }
  
  // Innovation bonus (Musk-style disruption)
  if (STRATEGIC_PATTERNS.disruptiveInnovation && prediction.confidence > 80) {
    value *= 1.2; // 20% bonus for high-confidence disruptive opportunities
  }
  
  // Execution speed factor (Ma-style rapid execution)
  value *= STRATEGIC_PATTERNS.executionSpeed;
  
  return Math.min(value, 1.0); // Cap at 100%
}

// Strategic intelligence metrics with Zuckerberg Meta Intelligence
export function getStrategicInsights(predictions: Prediction[]): {
  totalOpportunities: number;
  marketDominanceScore: number;
  innovationIndex: number;
  riskManagementScore: number;
  metaIntelligence?: number;
  zuckerbergStrategy?: string;
  filter5Score?: number;
} {
  const opportunities = predictions.filter(p => calculateStrategicValue(p) > 0.6);
  const proceedPredictions = predictions.filter(p => apply5Filter(p).finalDecision === 'PROCEED');
  
  // Meta Intelligence Score (Zuckerberg-style data analysis)
  const metaScore = Math.round(
    (proceedPredictions.length / predictions.length) * 
    ZUCKERBERG_META_PATTERNS.dataIntelligence * 
    ZUCKERBERG_META_PATTERNS.platformScaling * 100
  );
  
  // Determine Zuckerberg Strategy Phase
  let strategy = "MONITOR";
  if (proceedPredictions.length > 3) strategy = "SCALE_PLATFORM";
  else if (proceedPredictions.length > 1) strategy = "BUILD_CONNECTIONS";
  else if (opportunities.length > 0) strategy = "ANALYZE_DATA";
  
  return {
    totalOpportunities: opportunities.length,
    marketDominanceScore: Math.round(opportunities.reduce((sum, p) => sum + calculateStrategicValue(p), 0) * 10),
    innovationIndex: Math.round((opportunities.filter(p => p.confidence > 80).length / predictions.length) * 100),
    riskManagementScore: Math.round((1 - opportunities.filter(p => p.riskFactor && p.riskFactor > 0.5).length / predictions.length) * 100),
    metaIntelligence: metaScore,
    zuckerbergStrategy: strategy,
    filter5Score: Math.round((proceedPredictions.length / predictions.length) * 100)
  };
}
