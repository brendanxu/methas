#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to recursively find all TypeScript files
function findTsFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and .next directories
      if (file !== 'node_modules' && file !== '.next' && file !== '.git') {
        findTsFiles(filePath, fileList);
      }
    } else if ((file.endsWith('.ts') || file.endsWith('.tsx')) && 
               !file.endsWith('.d.ts') && 
               !filePath.includes('node_modules') &&
               !filePath.includes('.next')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Check if file uses logError or logInfo without defining it
function needsLogFunctions(content) {
  const hasLogError = content.includes('logError(');
  const hasLogInfo = content.includes('logInfo(');
  const hasLogFunctionDef = content.includes('const logError') || content.includes('const logInfo');
  
  return (hasLogError || hasLogInfo) && !hasLogFunctionDef;
}

// Add log function definitions to file
function addLogFunctions(content) {
  // Find the imports section
  const lines = content.split('\n');
  let insertIndex = 0;
  
  // Find the last import or 'use client' directive
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('import ') || line.startsWith('export ') || line === "'use client';" || line === '"use client";') {
      insertIndex = i + 1;
    } else if (line === '' || line.startsWith('//') || line.startsWith('/*')) {
      // Skip empty lines and comments
      continue;
    } else {
      // Found first non-import/non-comment line
      break;
    }
  }
  
  // Insert log functions after imports
  const logFunctions = `
// Production logging utilities
const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(\`[INFO] \${new Date().toISOString()} - \${message}\`, data ? JSON.stringify(data) : '');
  }
};

const logError = (message: string, error?: any) => {
  console.error(\`[ERROR] \${new Date().toISOString()} - \${message}\`, error);
};`;

  lines.splice(insertIndex, 0, logFunctions);
  return lines.join('\n');
}

// Main execution
const srcDir = path.join(__dirname, '..', 'src');
const tsFiles = findTsFiles(srcDir);

console.log('Checking all TypeScript files for missing log functions...\n');

let fixedCount = 0;
const filesToFix = [];

// First pass: identify files that need fixing
tsFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (needsLogFunctions(content)) {
      filesToFix.push(filePath);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error.message);
  }
});

console.log(`Found ${filesToFix.length} files that need log function definitions:\n`);

// Second pass: fix the files
filesToFix.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = addLogFunctions(content);
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    console.log(`✅ Fixed: ${filePath.replace(process.cwd(), '')}`);
    fixedCount++;
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
});

console.log(`\n✅ Fixed ${fixedCount} files`);