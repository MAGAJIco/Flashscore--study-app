
const axios = require('axios');

const BACKEND_URL = 'http://localhost:3001';
const FRONTEND_URL = 'http://localhost:5000';

async function checkHealth() {
  console.log('🏥 MagajiCo Health Check Started\n');
  
  const checks = [
    {
      name: 'Backend Fastify Health',
      url: `${BACKEND_URL}/api/health`,
      critical: true
    },
    {
      name: 'Backend Database Connection',
      url: `${BACKEND_URL}/api/matches/upcoming`,
      critical: false
    },
    {
      name: 'Backend Scraper Service',
      url: `${BACKEND_URL}/api/scraper/status`,
      critical: false
    },
    {
      name: 'Backend Predictions API',
      url: `${BACKEND_URL}/api/predictions`,
      critical: false
    },
    {
      name: 'Frontend Next.js Health',
      url: `${FRONTEND_URL}/api/health`,
      critical: false
    },
    {
      name: 'Frontend Health Check',
      url: `${FRONTEND_URL}/api/health-check`,
      critical: false
    }
  ];

  let overallHealth = 'healthy';
  const results = [];

  for (const check of checks) {
    try {
      console.log(`🔍 Checking ${check.name}...`);
      const response = await axios.get(check.url, { timeout: 5000 });
      
      const status = response.status === 200 ? '✅ Healthy' : '⚠️ Warning';
      console.log(`   ${status} (${response.status})`);
      
      results.push({
        service: check.name,
        status: 'healthy',
        responseTime: response.headers['x-response-time'] || 'N/A',
        data: response.data
      });
      
    } catch (error) {
      const status = check.critical ? '❌ Critical' : '⚠️ Warning';
      console.log(`   ${status} - ${error.message}`);
      
      if (check.critical) overallHealth = 'critical';
      else if (overallHealth !== 'critical') overallHealth = 'degraded';
      
      results.push({
        service: check.name,
        status: 'unhealthy',
        error: error.message
      });
    }
  }

  console.log('\n📊 Health Check Summary:');
  console.log(`Overall Status: ${overallHealth.toUpperCase()}`);
  console.log('\nService Details:');
  results.forEach(result => {
    console.log(`- ${result.service}: ${result.status}`);
    if (result.error) console.log(`  Error: ${result.error}`);
  });

  return { overallHealth, results };
}

// Run if called directly
if (require.main === module) {
  checkHealth().catch(console.error);
}

module.exports = { checkHealth };
