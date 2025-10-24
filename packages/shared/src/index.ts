
// Barrel exports for shared package
// Models
export * from './libs/models';

// Services
export * from './libs/services';

// Types
export * from './libs/types';

// Utils
export * from './libs/utils';

// API Client
export { SharedAPIClient, sharedAPIClient } from './libs/api/client';

// Re-export commonly used items
export { Author } from './libs/models/author';
export { MLModelClient, mlModelClient, createMLModelClient, PytorchModel, pytorchModelInstance, initializePytorchModel } from './libs/models/pytorchModel';
export { foundationApi } from './libs/utils/apifoundation';
export { mlEnhancement } from './libs/utils/mlEnhancement';
export { UserManager, userManager } from './libs/utils/userManager';
