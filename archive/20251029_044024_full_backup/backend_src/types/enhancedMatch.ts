import { MatchData } from './match';

export interface AIAnalysisResult {
  prediction: "home" | "draw" | "away";
  confidence: number;
  reasoning: string;
  strategy: string;
  riskLevel: "low" | "medium" | "high";
  expectedScore?: string;
  keyFactors: string[];
  alternativeBets?: string[];
  timestamp: Date;
  analysisId: string;
}

export interface AnalysisCache {
  [key: string]: {
    result: AIAnalysisResult;
    timestamp: number;
    expiresAt: number;
  };
}

export interface AnalysisRequest {
  matchData: MatchData;
  useCache?: boolean;
}

export interface AnalysisResponse {
  success: boolean;
  data?: AIAnalysisResult;
  error?: string;
  cached?: boolean;
}