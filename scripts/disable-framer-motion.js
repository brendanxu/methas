#!/usr/bin/env node

/**
 * Disable Framer Motion Animations
 * 
 * Temporarily disable framer-motion to fix build errors
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

// Create a mock framer-motion module
const mockFramerMotion = `
// Mock framer-motion for build compatibility
export const motion = {
  div: 'div',
  section: 'section',
  article: 'article',
  aside: 'aside',
  header: 'header',
  footer: 'footer',
  main: 'main',
  nav: 'nav',
  span: 'span',
  p: 'p',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  img: 'img',
  button: 'button',
  form: 'form',
  input: 'input',
  textarea: 'textarea',
  select: 'select',
  ul: 'ul',
  ol: 'ol',
  li: 'li'
};

export const AnimatePresence = ({ children }: { children: React.ReactNode }) => children;

export const useInView = () => [null, true];
export const useAnimation = () => ({});
export const useScroll = () => ({ scrollY: { get: () => 0 } });
export const useTransform = () => 0;
export const useSpring = () => 0;
export const useMotionValue = () => ({ get: () => 0, set: () => {} });
export const useMotionTemplate = () => '';
`;

// Write mock framer-motion file
const mockPath = path.join(__dirname, '../src/lib/mock-framer-motion.ts');
fs.writeFileSync(mockPath, mockFramerMotion, 'utf8');

// Find all TSX/TS files in src directory
const srcDir = path.join(__dirname, '../src');
const files = findFiles(srcDir);

console.log(`🔧 Disabling framer-motion in ${files.length} files...`);

let modifiedCount = 0;

files.forEach(file => {
  try {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    // Check if file contains framer-motion imports
    if (content.includes("'framer-motion'") || content.includes('"framer-motion"')) {
      // Replace framer-motion imports with mock
      content = content.replace(
        /import\s+\{([^}]+)\}\s+from\s+['"]framer-motion['"];?/g,
        "import { $1 } from '@/lib/mock-framer-motion';"
      );
      
      if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`✅ Disabled framer-motion in: ${path.relative(process.cwd(), file)}`);
        modifiedCount++;
      }
    }
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error.message);
  }
});

console.log(`🎉 Disabled framer-motion in ${modifiedCount} files!`);