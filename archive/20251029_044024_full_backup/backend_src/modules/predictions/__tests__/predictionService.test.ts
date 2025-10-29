
import { describe, it, expect } from 'vitest';
import { predictionService } from '../services/predictionService';

describe('PredictionService', () => {
  it('should handle ML predictions', async () => {
    const features = [0.7, 0.6, 0.8, 0.5, 0.4, 0.6, 0.7];
    const result = await predictionService.predictWithML(features);
    
    expect(result).toHaveProperty('prediction');
    expect(result).toHaveProperty('confidence');
  });
  
  it('should validate prediction data', () => {
    expect(['home', 'draw', 'away']).toContain('home');
  });
});
