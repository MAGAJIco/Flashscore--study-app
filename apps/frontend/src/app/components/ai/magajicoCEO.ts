//app/frontend/src/app/components/ai/magajicoCEO.ts
// Enhanced CEO: Market Intelligence + Strategic Decision Making
// Integrates Kalshi prediction markets + Pinnacle sharp odds analysis

export interface EnhancedPrediction {
  match: string;
  prediction: string;
  confidence: number;
  probabilities: {
    home: number;
    draw: number;
    away: number;
  };
  market_analysis: {
    kalshi_probabilities: {
      home_win: number;
      draw: number;
      away_win: number;
    };
    pinnacle_odds: {
      home_win: number;
      draw: number;
      away_win: number;
    };
    sharp_confidence: number;
    line_movement: number;
  };
  risk_metrics: {
    probability_variance: number;
    market_volatility: number;
    confidence_spread: number;
    sharp_money_risk: number;
    overall_risk_score: number;
  };
  value_opportunities: Array<{
    outcome: string;
    edge_percentage: number;
    model_probability: number;
    market_probability: number;
    recommended_odds: number;
    confidence_level: 'high' | 'medium' | 'low';
  }>;
  magajico_analysis: {
    innovation_score: number;
    market_position: string;
    risk_level: string;
    execution_confidence: number;
    market_efficiency: number;
    value_detection: string;
    line_movement_impact: number;
    smart_money_indicator: boolean;
  };
}

export type EnhancedCEOAction =
  | { type: "MARKET_ALERT"; message: string; level: "info" | "success" | "warning" | "danger"; market_data: any }
  | { type: "VALUE_OPPORTUNITY"; prediction: EnhancedPrediction; value_score: number; edge: number }
  | { type: "SHARP_MONEY_SIGNAL"; match: string; confidence: number; direction: 'bullish' | 'bearish' }
  | { type: "LINE_MOVEMENT_ALERT"; match: string; movement: number; impact: 'significant' | 'moderate' | 'minimal' }
  | { type: "RISK_WARNING"; match: string; risk_factors: string[]; severity: 'high' | 'medium' | 'low' }
  | { type: "STRATEGIC_MOVE"; action: string; reasoning: string; expected_roi: number }
  | { type: "MARKET_DOMINATION"; opportunities: number; total_edge: number }
  | { type: "IGNORE" };

// Enhanced Strategic Frameworks
interface EnhancedStrategicThinking {
  // Existing patterns
  longTermVision: boolean;
  disruptiveInnovation: boolean;
  marketDomination: boolean;
  riskTolerance: number;
  executionSpeed: number;
  
  // New market intelligence patterns
  sharpMoneyDetection: boolean;
  valueHunting: boolean;
  marketEfficiencyAnalysis: boolean;
  lineMovementTracking: boolean;
  arbitrageOpportunities: boolean;
}

const ENHANCED_STRATEGIC_PATTERNS: EnhancedStrategicThinking = {
  // Original tech leader patterns
  longTermVision: true,
  disruptiveInnovation: true,
  marketDomination: true,
  riskTolerance: 0.7,
  executionSpeed: 0.9,
  
  // New betting market patterns
  sharpMoneyDetection: true,      // Follow the smart money
  valueHunting: true,             // Identify undervalued opportunities
  marketEfficiencyAnalysis: true, // Exploit market inefficiencies
  lineMovementTracking: true,     // Track and analyze line movements
  arbitrageOpportunities: true    // Find arbitrage possibilities
};

// Pinnacle-Style Sharp Money Detection
interface SharpMoneyIndicators {
  volumeSpike: boolean;
  lineMovement: number;
  marketConsensus: number;
  professionalAction: number;
  reverseLine: boolean;
  steamMove: boolean;
}

// Kalshi-Style Market Intelligence
interface KalshiMarketIntel {
  realWorldProbability: number;
  marketDepth: number;
  liquidityScore: number;
  newsImpact: number;
  informationEdge: number;
  crowdWisdom: number;
}

// MagajiCo 7(1) Enhanced Filter System
// Seven quality checks, one final decision (upgraded from 5(1))
interface MagajiCo7Filter {
  confidenceCheck: boolean;        // Model confidence > 70%
  marketValidation: boolean;       // Market analysis confirms
  sharpMoneyAlignment: boolean;    // Smart money agrees
  valueOpportunity: boolean;       // Positive expected value
  riskAssessment: boolean;         // Risk within tolerance
  liquidityCheck: boolean;         // Sufficient market depth
  informationEdge: boolean;        // Information advantage
  finalDecision: 'DOMINATE' | 'EXECUTE' | 'MONITOR' | 'AVOID';
}

// Enhanced MagajiCo 7(1) Filter Implementation
function apply7Filter(prediction: EnhancedPrediction): MagajiCo7Filter {
  const { confidence, market_analysis, risk_metrics, value_opportunities, magajico_analysis } = prediction;
  
  const filter: MagajiCo7Filter = {
    confidenceCheck: confidence > 0.70,
    marketValidation: market_analysis.sharp_confidence > 0.65,
    sharpMoneyAlignment: magajico_analysis.smart_money_indicator,
    valueOpportunity: value_opportunities.length > 0 && 
                     value_opportunities.some(v => v.edge_percentage > 10),
    riskAssessment: risk_metrics.overall_risk_score < 0.3,
    liquidityCheck: market_analysis.sharp_confidence > 0.5, // Proxy for liquidity
    informationEdge: magajico_analysis.market_efficiency < 90, // Market inefficiency = information edge
    finalDecision: 'MONITOR'
  };

  // Advanced decision matrix based on filter results
  const filterScore = [
    filter.confidenceCheck,
    filter.marketValidation,
    filter.sharpMoneyAlignment,
    filter.valueOpportunity,
    filter.riskAssessment,
    filter.liquidityCheck,
    filter.informationEdge
  ].filter(Boolean).length;

  // The "1" in 7(1) - Single strategic decision
  if (filterScore >= 6 && confidence > 0.85 && value_opportunities.some(v => v.edge_percentage > 20)) {
    filter.finalDecision = 'DOMINATE'; // Massive opportunity - go all in
  } else if (filterScore >= 5 && confidence > 0.75) {
    filter.finalDecision = 'EXECUTE'; // Strong opportunity - execute with size
  } else if (filterScore >= 3) {
    filter.finalDecision = 'MONITOR'; // Potential opportunity - watch closely
  } else {
    filter.finalDecision = 'AVOID'; // Poor opportunity - stay away
  }

  return filter;
}

// Warren Buffett Value Investing Integration
interface BuffettValueInvesting {
  intrinsicValue: number;        // True probability vs market price
  marginOfSafety: number;        // Buffer for errors
  businessQuality: number;       // Quality of underlying event
  longTermOutlook: boolean;      // Sustainable edge
  managementQuality: number;     // Information source reliability
  competitiveAdvantage: boolean; // Unique information/model edge
}

const BUFFETT_VALUE_PATTERNS: BuffettValueInvesting = {
  intrinsicValue: 0.8,          // Seek 80%+ accuracy
  marginOfSafety: 0.15,         // 15% margin of safety
  businessQuality: 0.85,        // High-quality predictions only
  longTermOutlook: true,        // Sustainable prediction edge
  managementQuality: 0.9,       // Trust in information sources
  competitiveAdvantage: true    // Unique model advantage
};

export function enhancedMagajicoCEO(predictions: EnhancedPrediction[]): EnhancedCEOAction[] {
  const actions: EnhancedCEOAction[] = [];
  let totalValueScore = 0;
  let dominationOpportunities = 0;

  predictions.forEach((prediction) => {
    const filter7 = apply7Filter(prediction);
    const buffettAnalysis = applyBuffettAnalysis(prediction);
    const sharpMoneySignal = analyzeSharpMoney(prediction);
    
    // DOMINATE level opportunities (Buffett + Zuckerberg + Pinnacle sharp money)
    if (filter7.finalDecision === 'DOMINATE' && buffettAnalysis.investmentGrade === 'BUY_HEAVY') {
      dominationOpportunities++;
      
      const bestValue = prediction.value_opportunities.reduce((best, current) => 
        current.edge_percentage > best.edge_percentage ? current : best
      );
      
      actions.push({
        type: "MARKET_DOMINATION",
        opportunities: 1,
        total_edge: bestValue.edge_percentage
      });
      
      actions.push({
        type: "VALUE_OPPORTUNITY",
        prediction,
        value_score: bestValue.edge_percentage,
        edge: bestValue.edge_percentage / 100
      });
      
      actions.push({
        type: "MARKET_ALERT",
        message: `🚀 DOMINATION OPPORTUNITY: ${prediction.match} | Edge: ${bestValue.edge_percentage.toFixed(1)}% | Confidence: ${(prediction.confidence * 100).toFixed(1)}% | Sharp Money: ${prediction.market_analysis.sharp_confidence > 0.8 ? '🟢' : '🟡'}`,
        level: "success",
        market_data: {
          filter_score: '7/7',
          buffett_grade: buffettAnalysis.investmentGrade,
          sharp_confidence: prediction.market_analysis.sharp_confidence,
          line_movement: prediction.market_analysis.line_movement
        }
      });
      
      actions.push({
        type: "STRATEGIC_MOVE",
        action: `MAXIMUM_ALLOCATION: ${prediction.match} - ${bestValue.outcome.toUpperCase()}`,
        reasoning: `Buffett Value + Zuckerberg Scale + Pinnacle Sharp Money convergence. 7(1) Filter: DOMINATE. Expected ROI: ${bestValue.edge_percentage.toFixed(1)}%`,
        expected_roi: bestValue.edge_percentage
      });
      
      totalValueScore += bestValue.edge_percentage;
    }
    
    // EXECUTE level opportunities (Strong value with confirmation)
    else if (filter7.finalDecision === 'EXECUTE' && prediction.value_opportunities.length > 0) {
      const topValue = prediction.value_opportunities[0];
      
      actions.push({
        type: "VALUE_OPPORTUNITY",
        prediction,
        value_score: topValue.edge_percentage,
        edge: topValue.edge_percentage / 100
      });
      
      if (sharpMoneySignal.strength > 0.7) {
        actions.push({
          type: "SHARP_MONEY_SIGNAL",
          match: prediction.match,
          confidence: sharpMoneySignal.strength,
          direction: sharpMoneySignal.direction
        });
      }
      
      actions.push({
        type: "MARKET_ALERT",
        message: `⚡ EXECUTE SIGNAL: ${prediction.match} | Edge: ${topValue.edge_percentage.toFixed(1)}% | Risk: ${prediction.magajico_analysis.risk_level} | Market Position: ${prediction.magajico_analysis.market_position}`,
        level: "success",
        market_data: {
          filter_score: `${Object.values(filter7).slice(0, 7).filter(Boolean).length}/7`,
          value_opportunities: prediction.value_opportunities.length,
          sharp_money: sharpMoneySignal.strength > 0.6
        }
      });
      
      actions.push({
        type: "STRATEGIC_MOVE",
        action: `STRATEGIC_ALLOCATION: ${prediction.match} - ${topValue.outcome.toUpperCase()}`,
        reasoning: `7(1) Filter: EXECUTE. Value detected with ${topValue.confidence_level} confidence. Buffett margin of safety: ${buffettAnalysis.marginOfSafety.toFixed(2)}`,
        expected_roi: topValue.edge_percentage
      });
      
      totalValueScore += topValue.edge_percentage * 0.7; // Weighted for execute vs dominate
    }
    
    // Line movement alerts (Pinnacle-style sharp money tracking)
    if (Math.abs(prediction.market_analysis.line_movement) > 0.1) {
      const movementImpact = Math.abs(prediction.market_analysis.line_movement) > 0.2 ? 'significant' : 
                           Math.abs(prediction.market_analysis.line_movement) > 0.05 ? 'moderate' : 'minimal';
      
      actions.push({
        type: "LINE_MOVEMENT_ALERT",
        match: prediction.match,
        movement: prediction.market_analysis.line_movement,
        impact: movementImpact
      });
      
      if (movementImpact === 'significant') {
        actions.push({
          type: "MARKET_ALERT",
          message: `📊 SIGNIFICANT LINE MOVEMENT: ${prediction.match} | Movement: ${(prediction.market_analysis.line_movement * 100).toFixed(1)}% | Sharp Money Indicator: ${prediction.magajico_analysis.smart_money_indicator ? 'YES' : 'NO'}`,
          level: "warning",
          market_data: {
            line_movement: prediction.market_analysis.line_movement,
            sharp_confidence: prediction.market_analysis.sharp_confidence,
            movement_impact: movementImpact
          }
        });
      }
    }
    
    // Risk warnings for high-risk situations
    if (prediction.risk_metrics.overall_risk_score > 0.4 || prediction.magajico_analysis.risk_level === 'high') {
      const riskFactors = [];
      if (prediction.risk_metrics.probability_variance > 0.15) riskFactors.push('High model uncertainty');
      if (prediction.risk_metrics.market_volatility > 0.15) riskFactors.push('Volatile market conditions');
      if (prediction.risk_metrics.sharp_money_risk > 0.4) riskFactors.push('Sharp money disagreement');
      if (prediction.magajico_analysis.market_efficiency > 95) riskFactors.push('Highly efficient market');
      
      actions.push({
        type: "RISK_WARNING",
        match: prediction.match,
        risk_factors: riskFactors,
        severity: prediction.risk_metrics.overall_risk_score > 0.6 ? 'high' : 
                 prediction.risk_metrics.overall_risk_score > 0.3 ? 'medium' : 'low'
      });
    }
    
    // MONITOR level - Kalshi-style market intelligence gathering
    else if (filter7.finalDecision === 'MONITOR') {
      actions.push({
        type: "MARKET_ALERT",
        message: `👁️ MONITORING: ${prediction.match} | Confidence: ${(prediction.confidence * 100).toFixed(1)}% | Market Efficiency: ${prediction.magajico_analysis.market_efficiency}% | 7(1) Score: ${Object.values(filter7).slice(0, 7).filter(Boolean).length}/7`,
        level: "info",
        market_data: {
          filter_decision: 'MONITOR',
          market_efficiency: prediction.magajico_analysis.market_efficiency,
          potential_value: prediction.value_opportunities.length > 0
        }
      });
    }
    
    // AVOID level - Warren Buffett style avoidance
    else if (filter7.finalDecision === 'AVOID') {
      if (prediction.confidence < 0.5 || prediction.risk_metrics.overall_risk_score > 0.5) {
        actions.push({
          type: "MARKET_ALERT",
          message: `❌ AVOID: ${prediction.match} | Poor risk/reward ratio | Confidence: ${(prediction.confidence * 100).toFixed(1)}% | Risk Score: ${(prediction.risk_metrics.overall_risk_score * 100).toFixed(1)}%`,
          level: "danger",
          market_data: {
            filter_decision: 'AVOID',
            confidence: prediction.confidence,
            risk_score: prediction.risk_metrics.overall_risk_score
          }
        });
      }
    }
  });

  // Portfolio-level strategic actions
  if (dominationOpportunities > 1) {
    actions.push({
      type: "STRATEGIC_MOVE",
      action: "PORTFOLIO_DOMINATION_MODE",
      reasoning: `Multiple domination opportunities detected (${dominationOpportunities}). Implementing aggressive portfolio allocation strategy.`,
      expected_roi: totalValueScore / dominationOpportunities
    });
  }

  if (totalValueScore > 50) {
    actions.push({
      type: "MARKET_DOMINATION",
      opportunities: predictions.filter(p => apply7Filter(p).finalDecision === 'DOMINATE' || 
                                           apply7Filter(p).finalDecision === 'EXECUTE').length,
      total_edge: totalValueScore
    });
  }

  // Meta-strategic oversight (Zuckerberg + Buffett integration)
  const strongOpportunities = predictions.filter(p => {
    const filter = apply7Filter(p);
    return filter.finalDecision === 'DOMINATE' || filter.finalDecision === 'EXECUTE';
  });

  if (strongOpportunities.length > 2) {
    actions.push({
      type: "STRATEGIC_MOVE",
      action: "META_SCALING_OPPORTUNITY",
      reasoning: `Zuckerberg Meta Strategy + Buffett Value Investing: ${strongOpportunities.length} high-value opportunities with combined edge of ${totalValueScore.toFixed(1)}%. Scale platform and dominate market.`,
      expected_roi: totalValueScore / strongOpportunities.length
    });
  }

  return actions;
}

// Buffett Value Analysis Implementation
function applyBuffettAnalysis(prediction: EnhancedPrediction): {
  investmentGrade: 'BUY_HEAVY' | 'BUY' | 'HOLD' | 'AVOID';
  marginOfSafety: number;
  intrinsicValue: number;
  qualityScore: number;
} {
  const { confidence, market_analysis, value_opportunities, magajico_analysis } = prediction;
  
  // Calculate intrinsic value (true probability)
  const intrinsicValue = confidence;
  
  // Calculate margin of safety
  const bestValue = value_opportunities.length > 0 ? 
    Math.max(...value_opportunities.map(v => v.edge_percentage / 100)) : 0;
  const marginOfSafety = bestValue;
  
  // Quality score based on multiple factors
  const qualityScore = (
    (confidence * 0.3) +
    (market_analysis.sharp_confidence * 0.2) +
    ((1 - prediction.risk_metrics.overall_risk_score) * 0.2) +
    (magajico_analysis.execution_confidence / 100 * 0.15) +
    (magajico_analysis.market_efficiency / 100 * 0.15)
  );
  
  let investmentGrade: 'BUY_HEAVY' | 'BUY' | 'HOLD' | 'AVOID';
  
  if (intrinsicValue > BUFFETT_VALUE_PATTERNS.intrinsicValue && 
      marginOfSafety > BUFFETT_VALUE_PATTERNS.marginOfSafety &&
      qualityScore > BUFFETT_VALUE_PATTERNS.businessQuality) {
    investmentGrade = 'BUY_HEAVY';
  } else if (intrinsicValue > 0.7 && marginOfSafety > 0.1 && qualityScore > 0.75) {
    investmentGrade = 'BUY';
  } else if (intrinsicValue > 0.6 && qualityScore > 0.6) {
    investmentGrade = 'HOLD';
  } else {
    investmentGrade = 'AVOID';
  }
  
  return {
    investmentGrade,
    marginOfSafety,
    intrinsicValue,
    qualityScore
  };
}

// Sharp Money Analysis (Pinnacle-style)
function analyzeSharpMoney(prediction: EnhancedPrediction): {
  strength: number;
  direction: 'bullish' | 'bearish';
  indicators: string[];
} {
  const { market_analysis, confidence, magajico_analysis } = prediction;
  const indicators: string[] = [];
  
  let strength = market_analysis.sharp_confidence;
  
  // Line movement analysis
  if (Math.abs(market_analysis.line_movement) > 0.1) {
    strength += 0.1;
    indicators.push('Significant line movement');
  }
  
  // Model vs market disagreement (often indicates sharp money)
  const modelImpliedOdds = 1 / confidence;
  const marketOdds = Math.min(...Object.values(market_analysis.pinnacle_odds));
  
  if (Math.abs(modelImpliedOdds - marketOdds) / marketOdds > 0.1) {
    strength += 0.15;
    indicators.push('Model-market divergence');
  }
  
  // Smart money indicator from analysis
  if (magajico_analysis.smart_money_indicator) {
    strength += 0.2;
    indicators.push('Smart money confirmation');
  }
  
  // Market efficiency suggests sharp money activity
  if (magajico_analysis.market_efficiency > 90) {
    strength += 0.1;
    indicators.push('High market efficiency');
  }
  
  const direction: 'bullish' | 'bearish' = market_analysis.line_movement > 0 ? 'bullish' : 'bearish';
  
  return {
    strength: Math.min(1.0, strength),
    direction,
    indicators
  };
}

// Enhanced Strategic Intelligence with Market Data
export function getEnhancedStrategicInsights(predictions: EnhancedPrediction[]): {
  // Original metrics
  totalOpportunities: number;
  marketDominanceScore: number;
  innovationIndex: number;
  riskManagementScore: number;
  
  // Enhanced market intelligence metrics
  sharpMoneyAlignment: number;
  totalEdgePercentage: number;
  averageMarketEfficiency: number;
  portfolioRiskScore: number;
  valueBetCount: number;
  dominationOpportunities: number;
  
  // Strategic indicators
  buffettScore: number;
  zuckerbergMetaScore: number;
  pinnacleSharpnessIndex: number;
  kalshiIntelligenceRating: number;
  
  // Recommendations
  recommendedStrategy: string;
  allocationSuggestion: string;
  riskWarnings: string[];
  marketOpportunities: string[];
} {
  const filter7Results = predictions.map(p => apply7Filter(p));
  const dominateCount = filter7Results.filter(f => f.finalDecision === 'DOMINATE').length;
  const executeCount = filter7Results.filter(f => f.finalDecision === 'EXECUTE').length;
  const valueBets = predictions.flatMap(p => p.value_opportunities);
  
  // Calculate enhanced metrics
  const totalEdge = valueBets.reduce((sum, bet) => sum + bet.edge_percentage, 0);
  const avgMarketEfficiency = predictions.reduce((sum, p) => sum + p.magajico_analysis.market_efficiency, 0) / predictions.length;
  const portfolioRisk = predictions.reduce((sum, p) => sum + p.risk_metrics.overall_risk_score, 0) / predictions.length;
  const sharpMoneyAlignment = predictions.filter(p => p.magajico_analysis.smart_money_indicator).length / predictions.length;
  
  // Strategic scoring
  const buffettScore = Math.round(predictions.filter(p => applyBuffettAnalysis(p).investmentGrade === 'BUY' || 
                                                          applyBuffettAnalysis(p).investmentGrade === 'BUY_HEAVY').length / predictions.length * 100);
  
  const zuckerbergMetaScore = Math.round((dominateCount + executeCount) / predictions.length * ZUCKERBERG_META_PATTERNS.platformScaling * 100);
  
  const pinnacleSharpnessIndex = Math.round(predictions.reduce((sum, p) => sum + p.market_analysis.sharp_confidence, 0) / predictions.length * 100);
  
  const kalshiIntelligenceRating = Math.round((100 - avgMarketEfficiency) + sharpMoneyAlignment * 20);
  
  // Strategic recommendations
  let recommendedStrategy = "MONITOR";
  let allocationSuggestion = "Conservative allocation";
  
  if (dominateCount > 2) {
    recommendedStrategy = "AGGRESSIVE_GROWTH";
    allocationSuggestion = "Maximum allocation to domination opportunities";
  } else if (dominateCount > 0 || executeCount > 1) {
    recommendedStrategy = "SELECTIVE_SCALING";
    allocationSuggestion = "Moderate to high allocation on selected opportunities";
  } else if (executeCount > 0) {
    recommendedStrategy = "CAREFUL_EXECUTION";
    allocationSuggestion = "Small to moderate positions on value opportunities";
  }
  
  // Risk warnings
  const riskWarnings: string[] = [];
  if (portfolioRisk > 0.4) riskWarnings.push("High portfolio risk detected");
  if (avgMarketEfficiency > 95) riskWarnings.push("Markets highly efficient - limited edge available");
  if (sharpMoneyAlignment < 0.3) riskWarnings.push("Low sharp money alignment - proceed with caution");
  if (totalEdge < 20) riskWarnings.push("Limited total edge available");
  
  // Market opportunities
  const marketOpportunities: string[] = [];
  if (dominateCount > 0) marketOpportunities.push(`${dominateCount} domination-level opportunities`);
  if (valueBets.filter(b => b.edge_percentage > 15).length > 0) marketOpportunities.push("High-edge value bets available");
  if (sharpMoneyAlignment > 0.7) marketOpportunities.push("Strong sharp money alignment");
  if (avgMarketEfficiency < 85) marketOpportunities.push("Market inefficiencies detected");
  
  return {
    // Original metrics (enhanced)
    totalOpportunities: dominateCount + executeCount,
    marketDominanceScore: Math.round((dominateCount * 2 + executeCount) * 10),
    innovationIndex: Math.round(predictions.filter(p => p.magajico_analysis.innovation_score > 90).length / predictions.length * 100),
    riskManagementScore: Math.round((1 - portfolioRisk) * 100),
    
    // Enhanced market metrics
    sharpMoneyAlignment: Math.round(sharpMoneyAlignment * 100),
    totalEdgePercentage: Math.round(totalEdge * 10) / 10,
    averageMarketEfficiency: Math.round(avgMarketEfficiency),
    portfolioRiskScore: Math.round(portfolioRisk * 100),
    valueBetCount: valueBets.length,
    dominationOpportunities: dominateCount,
    
    // Strategic scores
    buffettScore,
    zuckerbergMetaScore,
    pinnacleSharpnessIndex,
    kalshiIntelligenceRating,
    
    // Recommendations
    recommendedStrategy,
    allocationSuggestion,
    riskWarnings,
    marketOpportunities
  };
}