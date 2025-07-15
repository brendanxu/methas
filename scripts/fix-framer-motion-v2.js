#!/usr/bin/env node

/**
 * Fix Framer Motion Imports - Version 2
 * 
 * Updates all framer-motion imports to use named imports instead of default imports
 */

const fs = require('fs');
const path = require('path');

// Function to find all TypeScript/TSX files recursively
function findFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
      findFiles(fullPath, files);
    } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// Find all TSX/TS files in src directory
const srcDir = path.join(__dirname, '../src');
const files = findFiles(srcDir);

console.log(`🔧 Fixing framer-motion imports in ${files.length} files...`);

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Check if file contains framer-motion imports with potential issues
    if (content.includes('framer-motion')) {
      // Look for problematic import patterns
      const problematicPatterns = [
        // Default motion import
        /import\s+motion\s+from\s+['"]framer-motion['"];?\s*$/gm,
        // Default AnimatePresence import
        /import\s+AnimatePresence\s+from\s+['"]framer-motion['"];?\s*$/gm,
        // Default useInView import
        /import\s+useInView\s+from\s+['"]framer-motion['"];?\s*$/gm,
        // Mixed default and named imports
        /import\s+motion,\s*\{\s*([^}]+)\s*\}\s*from\s+['"]framer-motion['"];?\s*$/gm,
        /import\s+AnimatePresence,\s*\{\s*([^}]+)\s*\}\s*from\s+['"]framer-motion['"];?\s*$/gm,
        /import\s+useInView,\s*\{\s*([^}]+)\s*\}\s*from\s+['"]framer-motion['"];?\s*$/gm,
      ];

      // Check if any problematic patterns exist
      const hasProblems = problematicPatterns.some(pattern => pattern.test(content));
      
      if (hasProblems) {
        // Fix the imports
        content = content.replace(/import\s+motion\s+from\s+['"]framer-motion['"];?\s*$/gm, "import { motion } from 'framer-motion';");
        content = content.replace(/import\s+AnimatePresence\s+from\s+['"]framer-motion['"];?\s*$/gm, "import { AnimatePresence } from 'framer-motion';");
        content = content.replace(/import\s+useInView\s+from\s+['"]framer-motion['"];?\s*$/gm, "import { useInView } from 'framer-motion';");
        content = content.replace(/import\s+motion,\s*\{\s*([^}]+)\s*\}\s*from\s+['"]framer-motion['"];?\s*$/gm, "import { motion, $1 } from 'framer-motion';");
        content = content.replace(/import\s+AnimatePresence,\s*\{\s*([^}]+)\s*\}\s*from\s+['"]framer-motion['"];?\s*$/gm, "import { AnimatePresence, $1 } from 'framer-motion';");
        content = content.replace(/import\s+useInView,\s*\{\s*([^}]+)\s*\}\s*from\s+['"]framer-motion['"];?\s*$/gm, "import { useInView, $1 } from 'framer-motion';");
        
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✅ Fixed: ${path.relative(process.cwd(), file)}`);
        modified = true;
      }
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log('🎉 Framer Motion import fixes completed!');