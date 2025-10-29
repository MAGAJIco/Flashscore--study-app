// hooks/useAIAnalysis.ts
import { useState, useCallback } from 'react';
import { analyzeMatch, AIAnalysisResult, MatchData } from '../utils/aiAnalysis';

export const useAIAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [aiInsights, setAiInsights] = useState<string | null>(null);

  const analyze = useCallback(async (matchData: MatchData, useCache: boolean = true, enableAI: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const analysisResult = await analyzeMatch(matchData, useCache, enableAI);
      setResult(analysisResult);

      if (enableAI && analysisResult.aiInsights) {
        setAiInsights(analysisResult.aiInsights);
      }

      return analysisResult;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
    setResult(null);
  }, []);

  return {
    analyze,
    loading,
    error,
    result,
    reset,
  };
};