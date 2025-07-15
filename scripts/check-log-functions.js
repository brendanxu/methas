#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// API files that use logInfo or logError
const apiFiles = [
  '/src/app/api/forms/contact/route.ts',
  '/src/app/api/forms/newsletter/route.ts',
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

const missingLogFunctions = [];

apiFiles.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if file uses logInfo or logError
    const usesLogFunctions = content.includes('logInfo(') || content.includes('logError(');
    
    // Check if file defines the log functions
    const hasLogFunctionDefinition = content.includes('const logInfo =') || content.includes('const logError =');
    
    if (usesLogFunctions && !hasLogFunctionDefinition) {
      missingLogFunctions.push(file);
    }
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
});

console.log('Files missing log function definitions:');
console.log('========================================');
missingLogFunctions.forEach(file => {
  console.log(file);
});

console.log(`\nTotal: ${missingLogFunctions.length} files`);

// Generate fix script
if (missingLogFunctions.length > 0) {
  console.log('\n\nFix script:');
  console.log('===========');
  console.log(`
const logFunctions = \`// Production logging utilities
const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(\\\`[INFO] \\\${new Date().toISOString()} - \\\${message}\\\`, data ? JSON.stringify(data) : '');
  }
};

const logError = (message: string, error?: any) => {
  console.error(\\\`[ERROR] \\\${new Date().toISOString()} - \\\${message}\\\`, error);
};\`;

// Add to each file after imports
`);
}