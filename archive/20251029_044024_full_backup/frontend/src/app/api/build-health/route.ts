
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const buildPath = path.join(process.cwd(), '.next');
  const cachePath = path.join(buildPath, 'cache');
  
  const health = {
    buildExists: fs.existsSync(buildPath),
    cacheExists: fs.existsSync(cachePath),
    timestamp: new Date().toISOString(),
  };

  if (health.buildExists) {
    const stats = fs.statSync(buildPath);
    health.buildAge = Math.floor((Date.now() - stats.mtimeMs) / 1000 / 60); // minutes
    health.buildSize = getDirectorySize(buildPath);
  }

  if (health.cacheExists) {
    const cacheStats = fs.statSync(cachePath);
    health.cacheAge = Math.floor((Date.now() - cacheStats.mtimeMs) / 1000 / 60);
    health.cacheSize = getDirectorySize(cachePath);
  }

  const status = health.buildExists && health.buildAge < 1440 ? 'healthy' : 'needs_rebuild';

  return NextResponse.json({
    status,
    ...health,
    recommendations: status === 'needs_rebuild' 
      ? ['Run: node scripts/smart-cache-manager.js --clear-selective', 'Rebuild application']
      : []
  });
}

function getDirectorySize(dirPath: string): string {
  let totalSize = 0;
  
  try {
    const files = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const file of files) {
      const filePath = path.join(dirPath, file.name);
      
      if (file.isDirectory()) {
        totalSize += parseInt(getDirectorySize(filePath).replace(/[^0-9]/g, '') || '0');
      } else {
        totalSize += fs.statSync(filePath).size;
      }
    }
  } catch (error) {
    return '0 MB';
  }
  
  return `${(totalSize / 1024 / 1024).toFixed(2)} MB`;
}
