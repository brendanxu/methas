#!/usr/bin/env node

/**
 * Image Optimization Script
 * 
 * This script optimizes images for web usage by:
 * - Converting to WebP and AVIF formats
 * - Generating multiple sizes for responsive images
 * - Creating blur data URLs for placeholders
 * - Compressing images for optimal file size
 * 
 * Usage:
 * node scripts/optimize-images.js [input-dir] [output-dir]
 * npm run optimize-images
 */

const fs = require('fs').promises;
const path = require('path');
const sharp = require('sharp');

// Configuration
const CONFIG = {
  // Input and output directories
  inputDir: process.argv[2] || './public/images/raw',
  outputDir: process.argv[3] || './public/images',
  
  // Supported input formats
  inputFormats: ['.jpg', '.jpeg', '.png', '.tiff', '.webp'],
  
  // Output formats and quality settings
  formats: {
    webp: { quality: 85, effort: 6 },
    avif: { quality: 80, effort: 6 },
    jpeg: { quality: 85, mozjpeg: true },
    png: { compressionLevel: 9, adaptiveFiltering: true }
  },
  
  // Responsive image sizes
  sizes: [
    { width: 640, suffix: '-sm' },
    { width: 768, suffix: '-md' },
    { width: 1024, suffix: '-lg' },
    { width: 1280, suffix: '-xl' },
    { width: 1920, suffix: '-2xl' },
    { width: 2560, suffix: '-3xl' }
  ],
  
  // Thumbnail sizes
  thumbnails: [
    { width: 150, height: 150, suffix: '-thumb' },
    { width: 300, height: 300, suffix: '-thumb-2x' }
  ],
  
  // Blur placeholder settings
  blurPlaceholder: {
    width: 10,
    height: 10,
    quality: 50
  }
};

class ImageOptimizer {
  constructor() {
    this.stats = {
      processed: 0,
      optimized: 0,
      errors: 0,
      totalSizeOriginal: 0,
      totalSizeOptimized: 0
    };
  }

  async init() {
    console.log('🖼️  Image Optimization Tool');
    console.log('================================');
    console.log(`Input:  ${CONFIG.inputDir}`);
    console.log(`Output: ${CONFIG.outputDir}`);
    console.log('');

    // Ensure output directory exists
    await this.ensureDirectory(CONFIG.outputDir);
    
    // Start optimization
    await this.optimizeDirectory(CONFIG.inputDir);
    
    // Generate image manifest
    await this.generateManifest();
    
    // Print statistics
    this.printStats();
  }

  async ensureDirectory(dir) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (error) {
      if (error.code !== 'EEXIST') {
        throw error;
      }
    }
  }

  async optimizeDirectory(dir) {
    try {
      const files = await fs.readdir(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isDirectory()) {
          // Recursively process subdirectories
          const outputSubDir = path.join(CONFIG.outputDir, path.relative(CONFIG.inputDir, filePath));
          await this.ensureDirectory(outputSubDir);
          await this.optimizeDirectory(filePath);
        } else if (this.isImageFile(file)) {
          await this.optimizeImage(filePath);
        }
      }
    } catch (error) {
      console.error(`❌ Error processing directory ${dir}:`, error.message);
    }
  }

  isImageFile(filename) {
    const ext = path.extname(filename).toLowerCase();
    return CONFIG.inputFormats.includes(ext);
  }

  async optimizeImage(inputPath) {
    try {
      console.log(`📸 Processing: ${path.basename(inputPath)}`);
      
      const inputStat = await fs.stat(inputPath);
      this.stats.totalSizeOriginal += inputStat.size;
      this.stats.processed++;

      // Get image metadata
      const image = sharp(inputPath);
      const metadata = await image.metadata();
      
      const baseName = path.parse(inputPath).name;
      const relativePath = path.relative(CONFIG.inputDir, path.dirname(inputPath));
      const outputDir = path.join(CONFIG.outputDir, relativePath);
      
      await this.ensureDirectory(outputDir);

      // Generate blur placeholder
      await this.generateBlurPlaceholder(image, outputDir, baseName);

      // Generate responsive sizes
      await this.generateResponsiveSizes(image, metadata, outputDir, baseName);

      // Generate thumbnails
      await this.generateThumbnails(image, outputDir, baseName);

      // Generate optimized formats
      await this.generateOptimizedFormats(image, metadata, outputDir, baseName);

      this.stats.optimized++;
      console.log(`   ✅ Optimized successfully`);

    } catch (error) {
      this.stats.errors++;
      console.error(`   ❌ Error optimizing ${inputPath}:`, error.message);
    }
  }

  async generateBlurPlaceholder(image, outputDir, baseName) {
    try {
      const blurBuffer = await image
        .resize(CONFIG.blurPlaceholder.width, CONFIG.blurPlaceholder.height, {
          fit: 'cover',
          position: 'center'
        })
        .blur(1)
        .jpeg({ quality: CONFIG.blurPlaceholder.quality })
        .toBuffer();

      // Convert to base64 data URL
      const base64 = blurBuffer.toString('base64');
      const dataUrl = `data:image/jpeg;base64,${base64}`;
      
      // Save blur data URL to JSON file
      const blurDataPath = path.join(outputDir, `${baseName}-blur.json`);
      await fs.writeFile(blurDataPath, JSON.stringify({
        dataUrl,
        width: CONFIG.blurPlaceholder.width,
        height: CONFIG.blurPlaceholder.height
      }, null, 2));

      console.log(`   📱 Generated blur placeholder`);
    } catch (error) {
      console.error(`   ⚠️  Failed to generate blur placeholder:`, error.message);
    }
  }

  async generateResponsiveSizes(image, metadata, outputDir, baseName) {
    for (const size of CONFIG.sizes) {
      // Skip if original is smaller than target size
      if (metadata.width && metadata.width <= size.width) continue;

      for (const [format, options] of Object.entries(CONFIG.formats)) {
        try {
          const outputPath = path.join(outputDir, `${baseName}${size.suffix}.${format}`);
          
          let pipeline = image.clone().resize(size.width, null, {
            withoutEnlargement: true,
            fit: 'inside'
          });

          // Apply format-specific optimization
          pipeline = this.applyFormatOptimization(pipeline, format, options);
          
          await pipeline.toFile(outputPath);
          
          const outputStat = await fs.stat(outputPath);
          this.stats.totalSizeOptimized += outputStat.size;

        } catch (error) {
          console.error(`   ⚠️  Failed to generate ${size.suffix} ${format}:`, error.message);
        }
      }
    }
    console.log(`   📐 Generated responsive sizes`);
  }

  async generateThumbnails(image, outputDir, baseName) {
    for (const thumb of CONFIG.thumbnails) {
      for (const [format, options] of Object.entries(CONFIG.formats)) {
        try {
          const outputPath = path.join(outputDir, `${baseName}${thumb.suffix}.${format}`);
          
          let pipeline = image.clone().resize(thumb.width, thumb.height, {
            fit: 'cover',
            position: 'center'
          });

          pipeline = this.applyFormatOptimization(pipeline, format, options);
          
          await pipeline.toFile(outputPath);
          
          const outputStat = await fs.stat(outputPath);
          this.stats.totalSizeOptimized += outputStat.size;

        } catch (error) {
          console.error(`   ⚠️  Failed to generate thumbnail ${format}:`, error.message);
        }
      }
    }
    console.log(`   🖼️  Generated thumbnails`);
  }

  async generateOptimizedFormats(image, metadata, outputDir, baseName) {
    for (const [format, options] of Object.entries(CONFIG.formats)) {
      try {
        const outputPath = path.join(outputDir, `${baseName}.${format}`);
        
        let pipeline = image.clone();
        pipeline = this.applyFormatOptimization(pipeline, format, options);
        
        await pipeline.toFile(outputPath);
        
        const outputStat = await fs.stat(outputPath);
        this.stats.totalSizeOptimized += outputStat.size;

      } catch (error) {
        console.error(`   ⚠️  Failed to generate ${format}:`, error.message);
      }
    }
    console.log(`   🎨 Generated optimized formats`);
  }

  applyFormatOptimization(pipeline, format, options) {
    switch (format) {
      case 'webp':
        return pipeline.webp(options);
      case 'avif':
        return pipeline.avif(options);
      case 'jpeg':
        return pipeline.jpeg(options);
      case 'png':
        return pipeline.png(options);
      default:
        return pipeline;
    }
  }

  async generateManifest() {
    try {
      const manifest = {
        generated: new Date().toISOString(),
        config: CONFIG,
        stats: this.stats,
        images: await this.scanOptimizedImages()
      };

      const manifestPath = path.join(CONFIG.outputDir, 'image-manifest.json');
      await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
      
      console.log(`📋 Generated image manifest: ${manifestPath}`);
    } catch (error) {
      console.error('❌ Failed to generate manifest:', error.message);
    }
  }

  async scanOptimizedImages() {
    const images = {};
    
    try {
      await this.scanDirectory(CONFIG.outputDir, images, CONFIG.outputDir);
    } catch (error) {
      console.error('Error scanning optimized images:', error.message);
    }
    
    return images;
  }

  async scanDirectory(dir, images, baseDir) {
    try {
      const files = await fs.readdir(dir);
      
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = await fs.stat(filePath);
        
        if (stat.isDirectory()) {
          await this.scanDirectory(filePath, images, baseDir);
        } else if (this.isImageFile(file) || file.endsWith('.json')) {
          const relativePath = path.relative(baseDir, filePath);
          const baseName = path.parse(file).name;
          
          if (!images[baseName]) {
            images[baseName] = {
              formats: {},
              sizes: {},
              thumbnails: {},
              blur: null
            };
          }
          
          if (file.endsWith('-blur.json')) {
            images[baseName].blur = relativePath;
          } else {
            const format = path.extname(file).slice(1);
            
            if (file.includes('-thumb')) {
              images[baseName].thumbnails[format] = images[baseName].thumbnails[format] || [];
              images[baseName].thumbnails[format].push(relativePath);
            } else if (file.includes('-')) {
              // Responsive size
              const sizeMatch = file.match(/-([a-z0-9]+)\./);
              if (sizeMatch) {
                const sizeName = sizeMatch[1];
                images[baseName].sizes[sizeName] = images[baseName].sizes[sizeName] || {};
                images[baseName].sizes[sizeName][format] = relativePath;
              }
            } else {
              // Original format
              images[baseName].formats[format] = relativePath;
            }
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dir}:`, error.message);
    }
  }

  printStats() {
    console.log('\n📊 Optimization Statistics');
    console.log('============================');
    console.log(`Files processed: ${this.stats.processed}`);
    console.log(`Files optimized: ${this.stats.optimized}`);
    console.log(`Errors: ${this.stats.errors}`);
    
    if (this.stats.totalSizeOriginal > 0) {
      const originalSize = this.formatFileSize(this.stats.totalSizeOriginal);
      const optimizedSize = this.formatFileSize(this.stats.totalSizeOptimized);
      const savings = ((this.stats.totalSizeOriginal - this.stats.totalSizeOptimized) / this.stats.totalSizeOriginal * 100).toFixed(1);
      
      console.log(`Original size: ${originalSize}`);
      console.log(`Optimized size: ${optimizedSize}`);
      console.log(`Space savings: ${savings}%`);
    }
    
    console.log('\n✅ Image optimization complete!');
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Check if sharp is available
async function checkDependencies() {
  try {
    require('sharp');
    return true;
  } catch (error) {
    console.error('❌ Missing dependency: sharp');
    console.error('Please install sharp: npm install --save-dev sharp');
    console.error('Or using yarn: yarn add --dev sharp');
    return false;
  }
}

// Main execution
async function main() {
  if (!(await checkDependencies())) {
    process.exit(1);
  }

  const optimizer = new ImageOptimizer();
  
  try {
    await optimizer.init();
  } catch (error) {
    console.error('❌ Optimization failed:', error.message);
    process.exit(1);
  }
}

// Run only if this script is executed directly
if (require.main === module) {
  main();
}

module.exports = { ImageOptimizer, CONFIG };