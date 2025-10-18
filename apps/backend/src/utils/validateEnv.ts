
export function validateProductionEnv() {
  const required = ['MONGODB_URI', 'FRONTEND_URL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (process.env.NODE_ENV === 'production' && missing.length > 0) {
    console.error('❌ Missing required environment variables:', missing);
    console.error('Set these in your deployment environment settings');
    return false;
  }
  
  return true;
}

export function logEnvironmentStatus() {
  console.log('🔍 Environment Status:');
  console.log('  NODE_ENV:', process.env.NODE_ENV || 'development');
  console.log('  PORT:', process.env.PORT || '3001');
  console.log('  MONGODB_URI:', process.env.MONGODB_URI ? '✓ Set' : '✗ Not set');
  console.log('  FRONTEND_URL:', process.env.FRONTEND_URL ? '✓ Set' : '✗ Not set');
  console.log('  ML_SERVICE_URL:', process.env.ML_SERVICE_URL ? '✓ Set' : '✗ Not set');
}
