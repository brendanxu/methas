#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Log functions to add
const logFunctionsCode = `
// Production logging utilities
const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(\`[INFO] \${new Date().toISOString()} - \${message}\`, data ? JSON.stringify(data) : '');
  }
};

const logError = (message: string, error?: any) => {
  console.error(\`[ERROR] \${new Date().toISOString()} - \${message}\`, error);
};`;

// Files that need fixing
const filesToFix = [
  '/src/app/api/forms/download/route.ts',
  '/src/app/api/search/route.ts',
  '/src/app/api/users/route.ts',
  '/src/app/api/users/[id]/route.ts',
  '/src/app/api/upload/route.ts',
  '/src/app/api/upload/[id]/route.ts',
  '/src/app/api/search/suggestions/route.ts',
  '/src/app/api/public/team/route.ts',
  '/src/app/api/newsletter/route.ts',
  '/src/app/api/forms/submit/route.ts',
  '/src/app/api/forms/route.ts',
  '/src/app/api/forms/[id]/route.ts',
  '/src/app/api/content/[id]/route.ts',
  '/src/app/api/auth/register/route.ts',
  '/src/app/api/analytics/vitals/route.ts',
  '/src/app/api/admin/exports/route.ts',
  '/src/app/api/admin/exports/download/[filename]/route.ts',
];

let fixedCount = 0;

filesToFix.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Check if already has log functions
    if (content.includes('const logInfo =') || content.includes('const logError =')) {
      console.log(`✓ ${file} - Already has log functions`);
      return;
    }
    
    // Find the last import statement
    const importRegex = /^import\s+.*?;$/gm;
    let lastImportIndex = -1;
    let match;
    
    while ((match = importRegex.exec(content)) !== null) {
      lastImportIndex = match.index + match[0].length;
    }
    
    if (lastImportIndex === -1) {
      console.log(`✗ ${file} - No imports found, adding at beginning`);
      content = logFunctionsCode + '\n' + content;
    } else {
      // Insert after the last import
      content = content.slice(0, lastImportIndex) + logFunctionsCode + content.slice(lastImportIndex);
    }
    
    // Write the file back
    fs.writeFileSync(filePath, content);
    console.log(`✅ ${file} - Fixed`);
    fixedCount++;
    
  } catch (err) {
    console.error(`❌ ${file} - Error: ${err.message}`);
  }
});

console.log(`\n✅ Fixed ${fixedCount} files`);