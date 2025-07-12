#!/usr/bin/env node

/**
 * Fix Framer Motion Imports
 * 
 * Updates all framer-motion imports to use named imports instead of default imports
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

// Find all TSX files
const pattern = path.join(__dirname, '../src/**/*.tsx');

glob(pattern, (err, files) => {
  if (err) {
    console.error('Error finding files:', err);
    return;
  }

  console.log(`🔧 Fixing framer-motion imports in ${files.length} files...`);

  files.forEach(file => {
    try {
      let content = fs.readFileSync(file, 'utf8');
      let modified = false;

      // Fix common problematic import patterns
      const fixes = [
        // Fix default motion import
        {
          pattern: /import\s+motion\s+from\s+['"]framer-motion['"];?/g,
          replacement: "import { motion } from 'framer-motion';"
        },
        // Fix default AnimatePresence import
        {
          pattern: /import\s+AnimatePresence\s+from\s+['"]framer-motion['"];?/g,
          replacement: "import { AnimatePresence } from 'framer-motion';"
        },
        // Fix default useInView import
        {
          pattern: /import\s+useInView\s+from\s+['"]framer-motion['"];?/g,
          replacement: "import { useInView } from 'framer-motion';"
        },
        // Fix mixed default and named imports
        {
          pattern: /import\s+motion,\s*\{\s*([^}]+)\s*\}\s*from\s+['"]framer-motion['"];?/g,
          replacement: "import { motion, $1 } from 'framer-motion';"
        },
        // Fix AnimatePresence mixed imports
        {
          pattern: /import\s+AnimatePresence,\s*\{\s*([^}]+)\s*\}\s*from\s+['"]framer-motion['"];?/g,
          replacement: "import { AnimatePresence, $1 } from 'framer-motion';"
        }
      ];

      fixes.forEach(fix => {
        if (fix.pattern.test(content)) {
          content = content.replace(fix.pattern, fix.replacement);
          modified = true;
        }
      });

      if (modified) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✅ Fixed: ${path.relative(process.cwd(), file)}`);
      }
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });

  console.log('🎉 Framer Motion import fixes completed!');
});