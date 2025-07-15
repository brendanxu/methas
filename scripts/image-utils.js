#!/usr/bin/env node

/**
 * Image Utilities
 * 
 * Collection of utility functions for image processing and optimization
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * Generate blur data URL from image
 */
async function generateBlurDataURL(imagePath, width = 10, height = 10) {
  try {
    const sharp = require('sharp');
    
    const blurBuffer = await sharp(imagePath)
      .resize(width, height, { fit: 'cover', position: 'center' })
      .blur(1)
      .jpeg({ quality: 50 })
      .toBuffer();

    return `data:image/jpeg;base64,${blurBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Error generating blur data URL:', error.message);
    return null;
  }
}

/**
 * Get image dimensions and metadata
 */
async function getImageMetadata(imagePath) {
  try {
    const sharp = require('sharp');
    const metadata = await sharp(imagePath).metadata();
    
    return {
      width: metadata.width,
      height: metadata.height,
      format: metadata.format,
      size: metadata.size,
      density: metadata.density,
      hasAlpha: metadata.hasAlpha,
      orientation: metadata.orientation
    };
  } catch (error) {
    console.error('Error getting image metadata:', error.message);
    return null;
  }
}

/**
 * Create responsive image srcset
 */
function createSrcSet(basePath, sizes, format = 'webp') {
  const srcSet = sizes
    .map(size => `${basePath}-${size.suffix}.${format} ${size.width}w`)
    .join(', ');
  
  return srcSet;
}

/**
 * Generate image component props
 */
async function generateImageProps(imagePath, alt, options = {}) {
  const {
    sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
    priority = false,
    quality = 85,
    generateBlur = true
  } = options;

  const metadata = await getImageMetadata(imagePath);
  if (!metadata) return null;

  const props = {
    src: imagePath,
    alt,
    width: metadata.width,
    height: metadata.height,
    sizes,
    priority,
    quality
  };

  if (generateBlur) {
    const blurDataURL = await generateBlurDataURL(imagePath);
    if (blurDataURL) {
      props.placeholder = 'blur';
      props.blurDataURL = blurDataURL;
    }
  }

  return props;
}

/**
 * Load image manifest
 */
async function loadImageManifest(manifestPath = './public/images/image-manifest.json') {
  try {
    const manifestContent = await fs.readFile(manifestPath, 'utf-8');
    return JSON.parse(manifestContent);
  } catch (error) {
    console.error('Error loading image manifest:', error.message);
    return null;
  }
}

/**
 * Get optimized image path
 */
function getOptimizedImagePath(baseName, format = 'webp', size = null) {
  const manifest = global.imageManifest;
  if (!manifest || !manifest.images[baseName]) {
    return null;
  }

  const imageInfo = manifest.images[baseName];
  
  if (size && imageInfo.sizes[size] && imageInfo.sizes[size][format]) {
    return `/images/${imageInfo.sizes[size][format]}`;
  }
  
  if (imageInfo.formats[format]) {
    return `/images/${imageInfo.formats[format]}`;
  }
  
  return null;
}

/**
 * Get blur placeholder data URL
 */
async function getBlurPlaceholder(baseName) {
  const manifest = global.imageManifest;
  if (!manifest || !manifest.images[baseName] || !manifest.images[baseName].blur) {
    return null;
  }

  try {
    const blurPath = path.join('./public/images', manifest.images[baseName].blur);
    const blurData = await fs.readFile(blurPath, 'utf-8');
    const blurInfo = JSON.parse(blurData);
    return blurInfo.dataUrl;
  } catch (error) {
    console.error('Error loading blur placeholder:', error.message);
    return null;
  }
}

/**
 * Create responsive image set
 */
function createResponsiveImageSet(baseName, format = 'webp', sizes = [
  { width: 640, suffix: 'sm' },
  { width: 768, suffix: 'md' },
  { width: 1024, suffix: 'lg' },
  { width: 1280, suffix: 'xl' },
  { width: 1920, suffix: '2xl' }
]) {
  const manifest = global.imageManifest;
  if (!manifest || !manifest.images[baseName]) {
    return null;
  }

  const imageInfo = manifest.images[baseName];
  const srcSet = [];
  
  sizes.forEach(size => {
    const imagePath = getOptimizedImagePath(baseName, format, size.suffix);
    if (imagePath) {
      srcSet.push(`${imagePath} ${size.width}w`);
    }
  });

  return {
    src: getOptimizedImagePath(baseName, format),
    srcSet: srcSet.join(', '),
    sizes: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
  };
}

/**
 * CLI tool for image utilities
 */
async function cli() {
  const args = process.argv.slice(2);
  const command = args[0];

  switch (command) {
    case 'blur':
      if (args.length < 2) {
        console.error('Usage: node image-utils.js blur <image-path>');
        process.exit(1);
      }
      const blurDataURL = await generateBlurDataURL(args[1]);
      if (blurDataURL) {
        console.log(blurDataURL);
      }
      break;

    case 'metadata':
      if (args.length < 2) {
        console.error('Usage: node image-utils.js metadata <image-path>');
        process.exit(1);
      }
      const metadata = await getImageMetadata(args[1]);
      if (metadata) {
        console.log(JSON.stringify(metadata, null, 2));
      }
      break;

    case 'props':
      if (args.length < 3) {
        console.error('Usage: node image-utils.js props <image-path> <alt-text>');
        process.exit(1);
      }
      const props = await generateImageProps(args[1], args[2]);
      if (props) {
        console.log(JSON.stringify(props, null, 2));
      }
      break;

    default:
      console.log('Image Utilities CLI');
      console.log('==================');
      console.log('');
      console.log('Commands:');
      console.log('  blur <image-path>           Generate blur data URL');
      console.log('  metadata <image-path>       Get image metadata');
      console.log('  props <image-path> <alt>    Generate Next.js Image props');
      console.log('');
      console.log('Examples:');
      console.log('  node image-utils.js blur ./hero.jpg');
      console.log('  node image-utils.js metadata ./logo.png');
      console.log('  node image-utils.js props ./hero.jpg "Hero image"');
  }
}

// Export functions for use in other modules
module.exports = {
  generateBlurDataURL,
  getImageMetadata,
  createSrcSet,
  generateImageProps,
  loadImageManifest,
  getOptimizedImagePath,
  getBlurPlaceholder,
  createResponsiveImageSet
};

// Run CLI if this script is executed directly
if (require.main === module) {
  cli();
}