
// Service Layer Exports - Global Services Only
// Feature-specific services have been moved to their respective modules

// Core ML Service (used across multiple modules)
export * from './mlPredictionService';

// Shared AI Enhancement Service
export * from './aiEnhancementService';

// Shared Sports Data Service
export * from './enhancedSportsService';

// Named exports for convenience
export { aiEnhancementService } from './aiEnhancementService';
export { mlPredictionService } from './mlPredictionService';
