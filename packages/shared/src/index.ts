
// Barrel exports for shared package
// Models
export * from './libs/models';

// Core Libraries
export * from './libs/api/client';
export * from './libs/models';
export * from './libs/services';
export * from './libs/types';

// Utils
export * from './libs/utils';

// API Client
export { SharedAPIClient, sharedAPIClient } from './libs/api/client';

// Re-export commonly used items
export { Author } from './libs/models/author';
export { 
  MLModelClient, 
  mlModelClient, 
  createMLModelClient, 
  PytorchModel, 
  pytorchModelInstance, 
  initializePytorchModel,
  type ModelConfig,
  type PredictionInput,
  type PredictionOutput,
  type ModelHealth,
  type FeatureExplanation,
  type AlternativeScenario,
  type StreamingPrediction
} from './libs/models/pytorchModel';
export { foundationApi } from './libs/utils/apifoundation';
export { mlEnhancement } from './libs/utils/mlEnhancement';
export { UserManager, userManager } from './libs/utils/userManager';
