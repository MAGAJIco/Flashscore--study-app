export { usePerformanceMonitor } from '@/app/hooks/usePerformanceMonitor';

// Legacy compatibility exports
export const PerformanceMonitor = {
  mark: (name: string) => {
    if (typeof window !== 'undefined') {
      performance.mark(name);
    }
  },
  measure: (name: string, startMark: string) => {
    if (typeof window !== 'undefined') {
      try {
        performance.measure(name, startMark);
      } catch {}
    }
  },
  reportWebVitals: (metric: any) => {
    console.log(`[WebVitals] ${metric.name}: ${metric.value}`);
  }
};

export const reportWebVitals = PerformanceMonitor.reportWebVitals;
export const trackPrediction = (userId: string, predictionId: string, wasCorrect: boolean) => {
  console.log('[Performance] Prediction tracked:', { userId, predictionId, wasCorrect });
};
export const trackMLLatency = (modelName: string, latency: number) => {
  console.log('[Performance] ML latency:', { modelName, latency });
};
export const getPredictionPerformance = () => null;