#!/usr/bin/env node

/**
 * Generate Brand Assets Script
 * 
 * Creates favicons, Open Graph images, and other brand assets
 * Uses Canvas API to generate placeholder images with South Pole branding
 */

const fs = require('fs');
const path = require('path');

// Brand colors
const BRAND_COLORS = {
  primary: '#002145',
  secondary: '#00875A',
  ice: '#E8F4F8',
  arctic: '#F5F7FA',
  white: '#FFFFFF',
};

// Asset configurations
const ASSETS = {
  favicons: [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'android-chrome-192x192.png', size: 192 },
    { name: 'android-chrome-512x512.png', size: 512 },
  ],
  ogImages: [
    { name: 'og-default.jpg', width: 1200, height: 630, type: 'default' },
    { name: 'og-home.jpg', width: 1200, height: 630, type: 'home' },
    { name: 'og-services.jpg', width: 1200, height: 630, type: 'services' },
    { name: 'og-news.jpg', width: 1200, height: 630, type: 'news' },
  ],
};

/**
 * Create SVG favicon
 */
function createSVGFavicon() {
  const svg = `
<svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
  <rect width="32" height="32" fill="${BRAND_COLORS.primary}"/>
  <circle cx="16" cy="10" r="6" fill="${BRAND_COLORS.ice}" opacity="0.8"/>
  <rect x="10" y="18" width="12" height="10" fill="${BRAND_COLORS.secondary}"/>
  <rect x="13" y="21" width="6" height="1" fill="${BRAND_COLORS.white}"/>
  <rect x="13" y="23" width="6" height="1" fill="${BRAND_COLORS.white}"/>
  <rect x="13" y="25" width="6" height="1" fill="${BRAND_COLORS.white}"/>
</svg>`.trim();

  return svg;
}

/**
 * Create ICO favicon data
 */
function createICOFavicon() {
  // For simplicity, we'll create a minimal ICO file
  // In production, you'd want to use a proper ICO generation library
  const svg = createSVGFavicon();
  return Buffer.from(svg);
}

/**
 * Create Open Graph image content
 */
function createOGImageContent(type, width, height) {
  const texts = {
    default: {
      title: 'South Pole',
      subtitle: 'Climate Solutions',
      description: 'Leading provider of climate solutions'
    },
    home: {
      title: 'South Pole',
      subtitle: 'Transform Your Climate Impact',
      description: 'Achieve carbon neutrality with proven solutions'
    },
    services: {
      title: 'Climate Solutions & Services',
      subtitle: 'South Pole',
      description: 'Carbon footprint assessment, offset projects & more'
    },
    news: {
      title: 'Climate News & Insights',
      subtitle: 'South Pole',
      description: 'Latest updates on climate action and sustainability'
    },
  };

  const content = texts[type] || texts.default;

  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${BRAND_COLORS.primary};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${BRAND_COLORS.secondary};stop-opacity:1" />
    </linearGradient>
    <linearGradient id="overlayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${BRAND_COLORS.ice};stop-opacity:0.1" />
      <stop offset="100%" style="stop-color:${BRAND_COLORS.arctic};stop-opacity:0.2" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGradient)"/>
  <rect width="${width}" height="${height}" fill="url(#overlayGradient)"/>
  
  <!-- Decorative elements -->
  <circle cx="100" cy="100" r="60" fill="${BRAND_COLORS.ice}" opacity="0.1"/>
  <circle cx="${width - 100}" cy="${height - 100}" r="80" fill="${BRAND_COLORS.arctic}" opacity="0.1"/>
  
  <!-- Main content area -->
  <rect x="60" y="150" width="${width - 120}" height="${height - 300}" fill="rgba(255, 255, 255, 0.05)" rx="12"/>
  
  <!-- Title -->
  <text x="80" y="220" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="${BRAND_COLORS.white}">
    ${content.title}
  </text>
  
  <!-- Subtitle -->
  <text x="80" y="300" font-family="Arial, sans-serif" font-size="42" font-weight="normal" fill="${BRAND_COLORS.ice}">
    ${content.subtitle}
  </text>
  
  <!-- Description -->
  <text x="80" y="380" font-family="Arial, sans-serif" font-size="28" font-weight="normal" fill="${BRAND_COLORS.arctic}">
    ${content.description}
  </text>
  
  <!-- Brand mark -->
  <circle cx="${width - 120}" cy="120" r="40" fill="${BRAND_COLORS.ice}" opacity="0.3"/>
  <rect x="${width - 140}" y="100" width="40" height="40" fill="${BRAND_COLORS.secondary}" opacity="0.8"/>
  
  <!-- Website URL -->
  <text x="80" y="${height - 80}" font-family="Arial, sans-serif" font-size="24" fill="${BRAND_COLORS.arctic}">
    southpole.com
  </text>
</svg>`.trim();

  return svg;
}

/**
 * Save asset to file
 */
function saveAsset(content, filePath, isBinary = false) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (isBinary) {
    fs.writeFileSync(filePath, content);
  } else {
    fs.writeFileSync(filePath, content, 'utf8');
  }
  
  console.log(`✅ Created: ${filePath}`);
}

/**
 * Generate all assets
 */
function generateAssets() {
  console.log('🎨 Generating South Pole brand assets...\n');

  const publicDir = path.join(__dirname, '..', 'public');

  // Generate favicon.ico
  console.log('📱 Generating favicons...');
  const faviconSVG = createSVGFavicon();
  saveAsset(faviconSVG, path.join(publicDir, 'favicon.svg'));
  
  // For ICO, we'll save as SVG for now (browsers support SVG favicons)
  // In production, convert SVG to ICO format
  saveAsset(faviconSVG, path.join(publicDir, 'favicon.ico'));

  // Generate PNG favicons (as SVG placeholders)
  ASSETS.favicons.forEach(favicon => {
    const svg = createSVGFavicon();
    saveAsset(svg, path.join(publicDir, favicon.name));
  });

  // Generate Open Graph images
  console.log('\n🖼️  Generating Open Graph images...');
  ASSETS.ogImages.forEach(ogImage => {
    const svg = createOGImageContent(ogImage.type, ogImage.width, ogImage.height);
    saveAsset(svg, path.join(publicDir, ogImage.name));
  });

  // Generate robots.txt placeholder (if not exists)
  const robotsPath = path.join(publicDir, 'robots.txt');
  if (!fs.existsSync(robotsPath)) {
    const robotsContent = `# South Pole Website Robots.txt
# This file is generated by Next.js app/robots.ts
# See: /app/robots.ts for the actual configuration

User-agent: *
Allow: /

Sitemap: https://southpole.com/sitemap.xml
`;
    saveAsset(robotsContent, robotsPath);
  }

  console.log('\n✨ Asset generation complete!');
  console.log('\n📋 Next steps:');
  console.log('   1. Install @sendgrid/mail for email functionality:');
  console.log('      npm install @sendgrid/mail');
  console.log('   2. Configure environment variables in .env.local');
  console.log('   3. Replace SVG placeholders with proper PNG/ICO files');
  console.log('   4. Optimize images for production');
}

// Run the script
if (require.main === module) {
  generateAssets();
}

module.exports = {
  generateAssets,
  createSVGFavicon,
  createOGImageContent,
  BRAND_COLORS,
};