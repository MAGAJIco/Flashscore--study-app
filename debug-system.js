
const axios = require('axios');
const fs = require('fs');

const DEBUG_LOG_FILE = 'debug-results.json';

async function debugSystem() {
  console.log('🔧 MagajiCo Debug System\n');
  
  const results = {
    timestamp: new Date().toISOString(),
    checks: []
  };

  // 1. Check file structure
  console.log('📁 Checking File Structure...');
  const criticalFiles = [
    'apps/backend/src/main.ts',
    'apps/frontend/src/app/layout.tsx',
    'apps/frontend/src/app/page.tsx',
    'health-check.js'
  ];

  for (const file of criticalFiles) {
    const exists = fs.existsSync(file);
    results.checks.push({
      type: 'file',
      name: file,
      status: exists ? 'EXISTS' : 'MISSING'
    });
    console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  }

  // 2. Check package.json files
  console.log('\n📦 Checking Package Files...');
  const packageFiles = [
    'apps/backend/package.json',
    'apps/frontend/package.json',
    'package.json'
  ];

  for (const pkgFile of packageFiles) {
    if (fs.existsSync(pkgFile)) {
      const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));
      results.checks.push({
        type: 'package',
        name: pkgFile,
        status: 'FOUND',
        scripts: Object.keys(pkg.scripts || {}),
        dependencies: Object.keys(pkg.dependencies || {}).length,
        devDependencies: Object.keys(pkg.devDependencies || {}).length
      });
      console.log(`  ✅ ${pkgFile} - ${Object.keys(pkg.scripts || {}).length} scripts`);
    }
  }

  // 3. Check node_modules
  console.log('\n📚 Checking Dependencies...');
  const moduleChecks = [
    'apps/backend/node_modules',
    'apps/frontend/node_modules',
    'node_modules'
  ];

  for (const mod of moduleChecks) {
    const exists = fs.existsSync(mod);
    results.checks.push({
      type: 'modules',
      name: mod,
      status: exists ? 'INSTALLED' : 'MISSING'
    });
    console.log(`  ${exists ? '✅' : '❌'} ${mod}`);
  }

  // 4. Check environment variables
  console.log('\n🔐 Checking Environment...');
  const envVars = [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI',
    'DATABASE_URL',
    'NEXT_PUBLIC_BACKEND_URL'
  ];

  for (const envVar of envVars) {
    const exists = !!process.env[envVar];
    results.checks.push({
      type: 'env',
      name: envVar,
      status: exists ? 'SET' : 'MISSING',
      value: exists ? '***' : undefined
    });
    console.log(`  ${exists ? '✅' : '⚠️ '} ${envVar}`);
  }

  // 5. Test local endpoints (if running)
  console.log('\n🌐 Testing Endpoints...');
  const endpoints = [
    { url: 'http://localhost:3001/api/health', name: 'Backend Health' },
    { url: 'http://localhost:5000/api/health', name: 'Frontend Health' },
    { url: 'http://0.0.0.0:8000/health', name: 'ML Service Health' }
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(endpoint.url, { timeout: 2000 });
      results.checks.push({
        type: 'endpoint',
        name: endpoint.name,
        status: 'REACHABLE',
        statusCode: response.status
      });
      console.log(`  ✅ ${endpoint.name} - ${response.status}`);
    } catch (error) {
      results.checks.push({
        type: 'endpoint',
        name: endpoint.name,
        status: 'UNREACHABLE',
        error: error.message
      });
      console.log(`  ❌ ${endpoint.name} - ${error.message}`);
    }
  }

  // Save results
  fs.writeFileSync(DEBUG_LOG_FILE, JSON.stringify(results, null, 2));
  
  console.log(`\n📊 Debug Report saved to: ${DEBUG_LOG_FILE}`);
  console.log('\n🎯 Recommended Actions:');
  
  const missingModules = results.checks.filter(c => c.type === 'modules' && c.status === 'MISSING');
  if (missingModules.length > 0) {
    console.log('  1. Install dependencies: npm install');
  }
  
  const unreachableEndpoints = results.checks.filter(c => c.type === 'endpoint' && c.status === 'UNREACHABLE');
  if (unreachableEndpoints.length > 0) {
    console.log('  2. Start services that are down');
  }

  const missingEnv = results.checks.filter(c => c.type === 'env' && c.status === 'MISSING');
  if (missingEnv.length > 0) {
    console.log('  3. Configure missing environment variables');
  }

  return results;
}

if (require.main === module) {
  debugSystem().catch(console.error);
}

module.exports = { debugSystem };
