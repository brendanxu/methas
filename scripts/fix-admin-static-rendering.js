#!/usr/bin/env node

/**
 * Script to fix static rendering issues in admin pages
 * Converts 'use client' pages to server components that dynamically import client components
 */

const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, '../src/app/admin');

// Get all page.tsx files in admin directory
function findAdminPages(dir, pages = []) {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findAdminPages(filePath, pages);
    } else if (file === 'page.tsx') {
      pages.push(filePath);
    }
  }
  
  return pages;
}

// Check if file has 'use client' directive
function hasUseClientDirective(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.trim().startsWith("'use client'");
}

// Extract component name from export default
function extractComponentName(content) {
  const match = content.match(/export default function (\w+)/);
  return match ? match[1] : 'Component';
}

// Create server component that dynamically imports client component
function createServerComponent(componentName, relativePath) {
  return `import dynamicImport from 'next/dynamic'

// 强制动态渲染，避免静态生成时的事件处理器序列化问题
export const dynamic = 'force-dynamic'
export const revalidate = 0

// 动态导入客户端组件
const ${componentName}Client = dynamicImport(() => import('./client'), {
  loading: () => <div>Loading...</div>
})

export default function ${componentName}Page() {
  return <${componentName}Client />
}`;
}

// Create client component from original content
function createClientComponent(originalContent, componentName) {
  // Replace export default function ComponentName with ComponentNameClient
  return originalContent.replace(
    `export default function ${componentName}()`,
    `export default function ${componentName}Client()`
  );
}

// Process a single admin page
function processAdminPage(filePath) {
  if (!hasUseClientDirective(filePath)) {
    console.log(`Skipping ${filePath} - no 'use client' directive`);
    return;
  }

  console.log(`Processing ${filePath}...`);
  
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const componentName = extractComponentName(originalContent);
  
  // Create client.tsx in the same directory
  const dir = path.dirname(filePath);
  const clientPath = path.join(dir, 'client.tsx');
  
  // Skip if client.tsx already exists
  if (fs.existsSync(clientPath)) {
    console.log(`Skipping ${filePath} - client.tsx already exists`);
    return;
  }
  
  try {
    // Create client component
    const clientContent = createClientComponent(originalContent, componentName);
    fs.writeFileSync(clientPath, clientContent);
    
    // Create server component (replaces original page.tsx)
    const serverContent = createServerComponent(componentName, './client');
    fs.writeFileSync(filePath, serverContent);
    
    console.log(`✓ Converted ${filePath} to server/client architecture`);
  } catch (error) {
    console.error(`✗ Failed to process ${filePath}:`, error.message);
  }
}

// Main execution
function main() {
  console.log('🔧 Fixing admin static rendering issues...\n');
  
  const adminPages = findAdminPages(adminDir);
  console.log(`Found ${adminPages.length} admin pages:\n`);
  
  adminPages.forEach(page => {
    const relativePath = path.relative(adminDir, page);
    console.log(`  - ${relativePath}`);
  });
  
  console.log('\nProcessing pages...\n');
  
  adminPages.forEach(processAdminPage);
  
  console.log('\n✅ Admin static rendering fix complete!');
}

if (require.main === module) {
  main();
}

module.exports = { main };