// Barrel exports for shared package

// Types - Export first for use in other modules
export * from './libs/types';
export * from './libs/types/match';
export * from './libs/types/user';
export * from './libs/types/news';
export * from './libs/types/prediction';

// Utils - Export everything from utils
export * from './libs/utils';
export * from './libs/utils/dateHelpers';
export * from './libs/utils/formatters';
export * from './libs/utils/validators';
export * from './libs/utils/parentalControls';

// Utils - Also create a utils namespace for direct imports
import * as utilsNamespace from './libs/utils';
export { utilsNamespace as utils };

// Services
export * from './libs/services';
export * from './libs/services/educationalAnalytics';

// Models (if needed)
// export * from './libs/models';