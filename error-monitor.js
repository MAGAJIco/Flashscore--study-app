
#!/usr/bin/env node

/**
 * MagajiCo Monorepo Error Boundary
 * Monitors all services and keeps them alive
 */

const { spawn } = require('child_process');
const path = require('path');

class ServiceErrorBoundary {
  constructor(name, command, cwd) {
    this.name = name;
    this.command = command;
    this.cwd = cwd;
    this.process = null;
    this.restartCount = 0;
    this.maxRestarts = 10;
  }

  start() {
    console.log(`🚀 Starting ${this.name}...`);
    
    const [cmd, ...args] = this.command.split(' ');
    this.process = spawn(cmd, args, {
      cwd: this.cwd,
      stdio: 'inherit',
      shell: true
    });

    this.process.on('error', (error) => {
      console.error(`❌ ${this.name} error:`, error);
      this.restart();
    });

    this.process.on('exit', (code) => {
      if (code !== 0 && code !== null) {
        console.error(`⚠️ ${this.name} exited with code ${code}`);
        this.restart();
      }
    });
  }

  restart() {
    if (this.restartCount < this.maxRestarts) {
      this.restartCount++;
      console.log(`🔄 Restarting ${this.name} (attempt ${this.restartCount}/${this.maxRestarts})...`);
      setTimeout(() => this.start(), 2000);
    } else {
      console.error(`🚨 ${this.name} exceeded max restarts. Continuing with other services...`);
    }
  }

  stop() {
    if (this.process) {
      this.process.kill();
    }
  }
}

// Define all services
const services = [
  new ServiceErrorBoundary(
    'Backend',
    'npm run dev',
    path.join(__dirname, 'apps/backend')
  ),
  new ServiceErrorBoundary(
    'ML Service',
    'uv run python api.py',
    path.join(__dirname, 'apps/backend/ml')
  ),
  new ServiceErrorBoundary(
    'Frontend',
    'npm run dev',
    path.join(__dirname, 'apps/frontend')
  )
];

// Start all services with error boundaries
console.log('🛡️ MagajiCo Error Boundary System Starting...');
console.log('📍 All services will auto-restart on failure\n');

services.forEach(service => service.start());

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down all services...');
  services.forEach(service => service.stop());
  process.exit(0);
});

// Process-level error boundary
process.on('uncaughtException', (error) => {
  console.error('🚨 UNCAUGHT EXCEPTION in monitor:', error);
  // Don't exit - keep monitoring
});

process.on('unhandledRejection', (reason) => {
  console.error('🚨 UNHANDLED REJECTION in monitor:', reason);
  // Don't exit - keep monitoring
});

console.log('✅ Error boundary system active - MagajiCo will stay running!\n');
