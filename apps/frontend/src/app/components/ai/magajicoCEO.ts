
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

const STRATEGIC_PATTERNS: StrategicThinking = {
  longTermVision: true,
  disruptiveInnovation: true,
  marketDomination: true,
  riskTolerance: 0.7,
  executionSpeed: 0.9
};

interface ZuckerbergMetaStrategy {
  metaverseVision: boolean;
  socialConnectionFocus: boolean;
  platformScaling: number;
  dataIntelligence: number;
  acquisitionStrategy: number;
}

const ZUCKERBERG_META_PATTERNS: ZuckerbergMetaStrategy = {
  metaverseVision: true,
  socialConnectionFocus: true,
  platformScaling: 0.95,
  dataIntelligence: 0.9,
  acquisitionStrategy: 0.8
};

interface MagajiCo5Filter {
  confidenceCheck: boolean;
  marketValueCheck: boolean;
  riskAssessment: boolean;
  strategicAlignment: boolean;
  executionFeasibility: boolean;
  finalDecision: 'PROCEED' | 'HOLD' | 'REJECT';
}

function apply5Filter(prediction: Prediction): MagajiCo5Filter {
  const filter: MagajiCo5Filter = {
    confidenceCheck: prediction.confidence > 70,
    marketValueCheck: (prediction.marketValue || 0) > 50,
    riskAssessment: (prediction.riskFactor || 0) < 0.6,
    strategicAlignment: calculateStrategicValue(prediction) > 0.6,
    executionFeasibility: prediction.confidence > 60,
    finalDecision: 'HOLD'
  };

  const metaScore = (
    (filter.confidenceCheck ? 1 : 0) +
    (filter.marketValueCheck ? 1 : 0) +
    (filter.riskAssessment ? 1 : 0) +
    (filter.strategicAlignment ? 1 : 0) +
    (filter.executionFeasibility ? 1 : 0)
  );

  if (metaScore >= 4 && prediction.confidence > 80) {
    filter.finalDecision = 'PROCEED';
  } else if (metaScore >= 3) {
    filter.finalDecision = 'HOLD';
  } else {
    filter.finalDecision = 'REJECT';
  }

  return filter;
}

export function magajicoCEO(predictions: Prediction[]): CEOAction[] {
  const actions: CEOAction[] = [];

  predictions.forEach((p) => {
    const strategicValue = calculateStrategicValue(p);
    const filter5 = apply5Filter(p);
    
    if (filter5.finalDecision === 'PROCEED' && ZUCKERBERG_META_PATTERNS.metaverseVision) {
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
      actions.push({ type: "IGNORE" });
    }
  });

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
  
  if (prediction.marketValue) {
    value *= (1 + prediction.marketValue / 100);
  }
  
  if (prediction.riskFactor) {
    value *= (1 - prediction.riskFactor * STRATEGIC_PATTERNS.riskTolerance);
  }
  
  if (STRATEGIC_PATTERNS.disruptiveInnovation && prediction.confidence > 80) {
    value *= 1.2;
  }
  
  value *= STRATEGIC_PATTERNS.executionSpeed;
  
  return Math.min(value, 1.0);
}

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
  
  const metaScore = Math.round(
    (proceedPredictions.length / (predictions.length || 1)) * 
    ZUCKERBERG_META_PATTERNS.dataIntelligence * 
    ZUCKERBERG_META_PATTERNS.platformScaling * 100
  );
  
  let strategy = "MONITOR";
  if (proceedPredictions.length > 3) strategy = "SCALE_PLATFORM";
  else if (proceedPredictions.length > 1) strategy = "BUILD_CONNECTIONS";
  else if (opportunities.length > 0) strategy = "ANALYZE_DATA";
  
  return {
    totalOpportunities: opportunities.length,
    marketDominanceScore: Math.round(opportunities.reduce((sum, p) => sum + calculateStrategicValue(p), 0) * 10),
    innovationIndex: Math.round((opportunities.filter(p => p.confidence > 80).length / (predictions.length || 1)) * 100),
    riskManagementScore: Math.round((1 - opportunities.filter(p => p.riskFactor && p.riskFactor > 0.5).length / (predictions.length || 1)) * 100),
    metaIntelligence: metaScore,
    zuckerbergStrategy: strategy,
    filter5Score: Math.round((proceedPredictions.length / (predictions.length || 1)) * 100)
  };
}
