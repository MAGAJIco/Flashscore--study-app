
// Barrel exports for shared package
// Models
export * from './libs/models';

// Services
export * from './libs/services';
export * from './libs/services/educationalAnalytics';

// Utils - Export everything from utils
export * from './libs/utils';
export * from './libs/utils/parentalControls';

// Utils - Also create a utils namespace for direct imports
import * as utilsNamespace from './libs/utils';
export { utilsNamespace as utils };

// Types
export * from './libs/types';

// API Client
export * from './libs/api';
