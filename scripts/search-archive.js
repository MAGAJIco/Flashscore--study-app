
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ARCHIVE_PATH = path.join(__dirname, '../archive/20251029_044024_full_backup');

function searchInFile(filePath, searchTerm, caseSensitive = false) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const searchRegex = new RegExp(searchTerm, caseSensitive ? 'g' : 'gi');
    const matches = content.match(searchRegex);
    
    if (matches) {
      const lines = content.split('\n');
      const results = [];
      
      lines.forEach((line, index) => {
        if (searchRegex.test(line)) {
          results.push({
            line: index + 1,
            content: line.trim(),
            context: lines.slice(Math.max(0, index - 1), Math.min(lines.length, index + 2))
          });
        }
        searchRegex.lastIndex = 0;
      });
      
      return results;
    }
  } catch (err) {
    // Skip unreadable files
  }
  return null;
}

function searchDirectory(dir, searchTerm, caseSensitive = false, filePattern = null) {
  const results = [];
  
  function walk(currentPath) {
    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name);
      
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        // Filter by file pattern if provided
        if (filePattern && !new RegExp(filePattern).test(entry.name)) {
          continue;
        }
        
        const matches = searchInFile(fullPath, searchTerm, caseSensitive);
        if (matches && matches.length > 0) {
          results.push({
            file: path.relative(ARCHIVE_PATH, fullPath),
            matches: matches.slice(0, 5) // Limit to first 5 matches per file
          });
        }
      }
    }
  }
  
  walk(dir);
  return results;
}

// Parse command line arguments
const args = process.argv.slice(2);
const searchTerm = args[0];
const options = {
  caseSensitive: args.includes('--case-sensitive') || args.includes('-c'),
  filePattern: args.find(arg => arg.startsWith('--file='))?.split('=')[1] || null,
  backend: args.includes('--backend'),
  frontend: args.includes('--frontend')
};

if (!searchTerm) {
  console.log('Usage: node search-archive.js <search_term> [options]');
  console.log('Options:');
  console.log('  --case-sensitive, -c    Case sensitive search');
  console.log('  --file=<pattern>        File name pattern (regex)');
  console.log('  --backend               Search only in backend');
  console.log('  --frontend              Search only in frontend');
  console.log('\nExamples:');
  console.log('  node search-archive.js "newsAuthor"');
  console.log('  node search-archive.js "API_KEY" --backend --file="\\.ts$"');
  process.exit(1);
}

console.log(`\n🔍 Searching archive for: "${searchTerm}"\n`);

let searchPaths = [];
if (options.backend) {
  searchPaths.push(path.join(ARCHIVE_PATH, 'backend_src'));
} else if (options.frontend) {
  searchPaths.push(path.join(ARCHIVE_PATH, 'frontend'));
} else {
  searchPaths.push(ARCHIVE_PATH);
}

let totalMatches = 0;

searchPaths.forEach(searchPath => {
  if (!fs.existsSync(searchPath)) {
    console.log(`⚠️  Path not found: ${searchPath}`);
    return;
  }
  
  const results = searchDirectory(searchPath, searchTerm, options.caseSensitive, options.filePattern);
  
  if (results.length === 0) {
    console.log(`No matches found in ${path.relative(ARCHIVE_PATH, searchPath)}`);
  } else {
    results.forEach(result => {
      console.log(`\n📄 ${result.file}`);
      console.log('─'.repeat(60));
      
      result.matches.forEach(match => {
        console.log(`  Line ${match.line}: ${match.content}`);
        totalMatches++;
      });
    });
  }
});

console.log(`\n📊 Total files with matches: ${totalMatches > 0 ? 'Found' : 'None'}`);
console.log(`Total match count: ${totalMatches}\n`);
