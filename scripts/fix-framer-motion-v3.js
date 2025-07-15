#!/usr/bin/env node

/**
 * Fix Framer Motion Imports - Version 3
 * 
 * Comprehensive fix for all framer-motion import issues
 */

const fs = require('fs');
const path = require('path');

// Function to find all TypeScript/TSX files recursively
function findFiles(dir, files = []) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    
    try {
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        findFiles(fullPath, files);
      } else if (item.endsWith('.tsx') || item.endsWith('.ts')) {
        files.push(fullPath);
      }
    } catch (err) {
      // Skip files we can't access
      continue;
    }
  }
  
  return files;
}

// Find all TSX/TS files in src directory
const srcDir = path.join(__dirname, '../src');
const files = findFiles(srcDir);

console.log(`🔧 Fixing framer-motion imports in ${files.length} files...`);

let fixedCount = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // Check if file contains framer-motion imports
    if (content.includes('framer-motion')) {
      // Replace all default imports with named imports
      content = content.replace(/import\s+motion\s+from\s+['"]framer-motion['"];?\s*/g, "import { motion } from 'framer-motion';");
      content = content.replace(/import\s+AnimatePresence\s+from\s+['"]framer-motion['"];?\s*/g, "import { AnimatePresence } from 'framer-motion';");
      content = content.replace(/import\s+useInView\s+from\s+['"]framer-motion['"];?\s*/g, "import { useInView } from 'framer-motion';");
      content = content.replace(/import\s+useAnimation\s+from\s+['"]framer-motion['"];?\s*/g, "import { useAnimation } from 'framer-motion';");
      content = content.replace(/import\s+useScroll\s+from\s+['"]framer-motion['"];?\s*/g, "import { useScroll } from 'framer-motion';");
      content = content.replace(/import\s+useTransform\s+from\s+['"]framer-motion['"];?\s*/g, "import { useTransform } from 'framer-motion';");
      content = content.replace(/import\s+useSpring\s+from\s+['"]framer-motion['"];?\s*/g, "import { useSpring } from 'framer-motion';");
      
      // Fix mixed imports
      content = content.replace(/import\s+motion,\s*\{\s*([^}]+)\s*\}\s*from\s+['"]framer-motion['"];?\s*/g, "import { motion, $1 } from 'framer-motion';");
      content = content.replace(/import\s+AnimatePresence,\s*\{\s*([^}]+)\s*\}\s*from\s+['"]framer-motion['"];?\s*/g, "import { AnimatePresence, $1 } from 'framer-motion';");
      content = content.replace(/import\s+useInView,\s*\{\s*([^}]+)\s*\}\s*from\s+['"]framer-motion['"];?\s*/g, "import { useInView, $1 } from 'framer-motion';");
      
      // Clean up any duplicate imports
      const lines = content.split('\n');
      const framerImportLines = [];
      const nonFramerLines = [];
      
      for (const line of lines) {
        if (line.includes("from 'framer-motion'") || line.includes('from "framer-motion"')) {
          framerImportLines.push(line);
        } else {
          nonFramerLines.push(line);
        }
      }
      
      // Merge all framer-motion imports into one
      if (framerImportLines.length > 1) {
        const allImports = [];
        
        framerImportLines.forEach(line => {
          const match = line.match(/import\s+\{\s*([^}]+)\s*\}\s*from\s+['"]framer-motion['"];?/);
          if (match) {
            const imports = match[1].split(',').map(imp => imp.trim());
            allImports.push(...imports);
          }
        });
        
        // Remove duplicates
        const uniqueImports = [...new Set(allImports)];
        
        if (uniqueImports.length > 0) {
          const mergedImport = `import { ${uniqueImports.join(', ')} } from 'framer-motion';`;
          
          // Find where to insert the import (after other imports)
          let insertIndex = 0;
          for (let i = 0; i < nonFramerLines.length; i++) {
            if (nonFramerLines[i].trim().startsWith('import ')) {
              insertIndex = i + 1;
            } else if (nonFramerLines[i].trim() === '' && insertIndex > 0) {
              // Keep going through empty lines after imports
              continue;
            } else if (insertIndex > 0) {
              break;
            }
          }
          
          nonFramerLines.splice(insertIndex, 0, mergedImport);
          content = nonFramerLines.join('\n');
        }
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✅ Fixed: ${path.relative(process.cwd(), file)}`);
        fixedCount++;
      }
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log(`🎉 Fixed ${fixedCount} files with framer-motion import issues!`);