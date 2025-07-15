#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * 
 * Analyzes Next.js bundle size and provides optimization suggestions
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG = {
  nextDir: '.next',
  outputDir: './bundle-analysis',
  thresholds: {
    totalSize: 500000, // 500KB warning threshold
    chunkSize: 200000, // 200KB warning threshold
    firstLoadJS: 300000, // 300KB warning threshold
  }
};

/**
 * Bundle Analysis Class
 */
class BundleAnalyzer {
  constructor() {
    this.results = {
      totalSize: 0,
      pages: [],
      chunks: [],
      recommendations: []
    };
  }

  /**
   * Run the bundle analysis
   */
  async analyze() {
    console.log('🔍 Starting Bundle Analysis...\n');

    try {
      // Ensure output directory exists
      await this.ensureOutputDir();

      // Run build to get fresh data
      console.log('📦 Building project for analysis...');
      execSync('npm run build', { stdio: 'inherit' });

      // Parse build output
      await this.parseBuildOutput();

      // Analyze bundle composition
      await this.analyzeBundleComposition();

      // Generate recommendations
      this.generateRecommendations();

      // Create report
      await this.generateReport();

      console.log('\n✅ Bundle analysis complete!');
      console.log(`📊 Report saved to: ${CONFIG.outputDir}/bundle-report.json`);

    } catch (error) {
      console.error('❌ Bundle analysis failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * Ensure output directory exists
   */
  async ensureOutputDir() {
    try {
      await fs.access(CONFIG.outputDir);
    } catch {
      await fs.mkdir(CONFIG.outputDir, { recursive: true });
    }
  }

  /**
   * Parse Next.js build output
   */
  async parseBuildOutput() {
    console.log('📋 Parsing build output...');

    try {
      // Read build manifest
      const manifestPath = path.join(CONFIG.nextDir, 'build-manifest.json');
      const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));

      // Read pages manifest
      const pagesManifestPath = path.join(CONFIG.nextDir, 'server/pages-manifest.json');
      const pagesManifest = JSON.parse(await fs.readFile(pagesManifestPath, 'utf8'));

      // Analyze static directory
      await this.analyzeStaticFiles();

      this.results.manifest = manifest;
      this.results.pagesManifest = pagesManifest;

    } catch (error) {
      console.warn('⚠️  Could not parse build output:', error.message);
    }
  }

  /**
   * Analyze static files
   */
  async analyzeStaticFiles() {
    const staticDir = path.join(CONFIG.nextDir, 'static');
    
    try {
      const chunks = await this.getChunkSizes(staticDir);
      this.results.chunks = chunks;
      this.results.totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
    } catch (error) {
      console.warn('⚠️  Could not analyze static files:', error.message);
    }
  }

  /**
   * Get chunk sizes recursively
   */
  async getChunkSizes(dir, chunks = []) {
    try {
      const entries = await fs.readdir(dir);
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry);
        const stat = await fs.stat(fullPath);
        
        if (stat.isDirectory()) {
          await this.getChunkSizes(fullPath, chunks);
        } else if (entry.endsWith('.js')) {
          chunks.push({
            name: path.relative(CONFIG.nextDir, fullPath),
            size: stat.size,
            path: fullPath
          });
        }
      }
    } catch (error) {
      // Ignore errors for missing directories
    }
    
    return chunks;
  }

  /**
   * Analyze bundle composition
   */
  async analyzeBundleComposition() {
    console.log('🔬 Analyzing bundle composition...');

    // Sort chunks by size
    this.results.chunks.sort((a, b) => b.size - a.size);

    // Identify large chunks
    this.results.largeChunks = this.results.chunks.filter(
      chunk => chunk.size > CONFIG.thresholds.chunkSize
    );

    // Calculate bundle metrics
    this.results.metrics = {
      totalChunks: this.results.chunks.length,
      totalSize: this.results.totalSize,
      averageChunkSize: this.results.totalSize / this.results.chunks.length,
      largestChunk: this.results.chunks[0] || null
    };
  }

  /**
   * Generate optimization recommendations
   */
  generateRecommendations() {
    console.log('💡 Generating recommendations...');

    const recommendations = [];

    // Check total bundle size
    if (this.results.totalSize > CONFIG.thresholds.totalSize) {
      recommendations.push({
        type: 'size',
        severity: 'high',
        message: `Total bundle size (${this.formatSize(this.results.totalSize)}) exceeds recommended threshold (${this.formatSize(CONFIG.thresholds.totalSize)})`,
        suggestions: [
          'Implement dynamic imports for large components',
          'Use tree shaking to eliminate unused code',
          'Consider code splitting at route level'
        ]
      });
    }

    // Check for large chunks
    if (this.results.largeChunks.length > 0) {
      recommendations.push({
        type: 'chunks',
        severity: 'medium',
        message: `Found ${this.results.largeChunks.length} large chunks`,
        chunks: this.results.largeChunks.map(chunk => ({
          name: chunk.name,
          size: this.formatSize(chunk.size)
        })),
        suggestions: [
          'Split large components using dynamic imports',
          'Move heavy third-party libraries to separate chunks',
          'Implement lazy loading for non-critical components'
        ]
      });
    }

    // Check for Ant Design optimization
    const antdChunks = this.results.chunks.filter(chunk => 
      chunk.name.includes('antd') || chunk.name.includes('ant-design')
    );
    
    if (antdChunks.length > 0) {
      const antdSize = antdChunks.reduce((sum, chunk) => sum + chunk.size, 0);
      recommendations.push({
        type: 'antd',
        severity: 'medium',
        message: `Ant Design chunks total ${this.formatSize(antdSize)}`,
        suggestions: [
          'Use modularizeImports for Ant Design',
          'Import only used components',
          'Consider alternative lightweight UI libraries for simple components'
        ]
      });
    }

    this.results.recommendations = recommendations;
  }

  /**
   * Generate comprehensive report
   */
  async generateReport() {
    console.log('📊 Generating report...');

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalSize: this.formatSize(this.results.totalSize),
        totalChunks: this.results.chunks.length,
        largeChunks: this.results.largeChunks.length
      },
      metrics: this.results.metrics,
      topChunks: this.results.chunks.slice(0, 10).map(chunk => ({
        name: chunk.name,
        size: this.formatSize(chunk.size),
        percentage: ((chunk.size / this.results.totalSize) * 100).toFixed(2) + '%'
      })),
      recommendations: this.results.recommendations,
      config: CONFIG
    };

    // Save JSON report
    await fs.writeFile(
      path.join(CONFIG.outputDir, 'bundle-report.json'),
      JSON.stringify(report, null, 2)
    );

    // Generate markdown report
    await this.generateMarkdownReport(report);

    // Display summary
    this.displaySummary(report);
  }

  /**
   * Generate markdown report
   */
  async generateMarkdownReport(report) {
    const markdown = `# Bundle Analysis Report

Generated: ${report.timestamp}

## 📊 Summary

- **Total Bundle Size**: ${report.summary.totalSize}
- **Total Chunks**: ${report.summary.totalChunks}
- **Large Chunks**: ${report.summary.largeChunks}

## 🏆 Top 10 Largest Chunks

| Chunk | Size | Percentage |
|-------|------|------------|
${report.topChunks.map(chunk => 
  `| ${chunk.name} | ${chunk.size} | ${chunk.percentage} |`
).join('\n')}

## 💡 Recommendations

${report.recommendations.map(rec => `
### ${rec.type.toUpperCase()} - ${rec.severity.toUpperCase()}

**Issue**: ${rec.message}

**Suggestions**:
${rec.suggestions.map(s => `- ${s}`).join('\n')}
`).join('\n')}

## 🎯 Next Steps

1. Review large chunks and implement dynamic imports
2. Optimize third-party library imports
3. Set up bundle size monitoring in CI/CD
4. Consider implementing route-based code splitting

---
*Generated by Bundle Analyzer Script*
`;

    await fs.writeFile(
      path.join(CONFIG.outputDir, 'bundle-report.md'),
      markdown
    );
  }

  /**
   * Display summary in console
   */
  displaySummary(report) {
    console.log('\n📊 Bundle Analysis Summary');
    console.log('='.repeat(40));
    console.log(`Total Size: ${report.summary.totalSize}`);
    console.log(`Total Chunks: ${report.summary.totalChunks}`);
    console.log(`Large Chunks: ${report.summary.largeChunks}`);

    if (report.recommendations.length > 0) {
      console.log('\n💡 Top Recommendations:');
      report.recommendations.slice(0, 3).forEach((rec, index) => {
        console.log(`${index + 1}. ${rec.message}`);
      });
    }

    console.log(`\n📋 Full report: ${CONFIG.outputDir}/bundle-report.md`);
  }

  /**
   * Format bytes to human readable size
   */
  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Main execution
async function main() {
  const analyzer = new BundleAnalyzer();
  await analyzer.analyze();
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = BundleAnalyzer;