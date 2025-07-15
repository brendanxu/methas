#!/usr/bin/env node

/**
 * South Pole Website Environment Variables Validation Script
 * 
 * 用于验证生产环境所需的环境变量是否完整配置
 * 在部署前运行此脚本以确保配置正确
 */

const fs = require('fs');
const path = require('path');

// ANSI colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

// 环境变量配置定义
const ENV_CONFIG = {
  // 必需的环境变量
  required: {
    'DATABASE_URL': {
      description: '数据库连接字符串',
      example: 'postgresql://user:pass@host:5432/db',
      validate: (value) => value.startsWith('postgresql://') || value.startsWith('postgres://')
    },
    'NEXTAUTH_SECRET': {
      description: 'NextAuth JWT签名密钥',
      example: 'your-super-secret-jwt-secret-here',
      validate: (value) => value.length >= 32
    },
    'NEXT_PUBLIC_SITE_URL': {
      description: '网站URL',
      example: 'https://southpole.com',
      validate: (value) => value.startsWith('https://') || value.startsWith('http://localhost')
    },
    'SENDGRID_API_KEY': {
      description: 'SendGrid API密钥',
      example: 'SG.xxxxx',
      validate: (value) => value.startsWith('SG.')
    },
    'SENDGRID_FROM_EMAIL': {
      description: 'SendGrid发件人邮箱',
      example: 'noreply@southpole.com',
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    }
  },

  // 推荐配置的环境变量
  recommended: {
    'NEXT_PUBLIC_GA_ID': {
      description: 'Google Analytics ID',
      example: 'G-XXXXXXXXXX',
      validate: (value) => value.startsWith('G-')
    },
    'SENTRY_DSN': {
      description: 'Sentry错误跟踪DSN',
      example: 'https://xxxxx@sentry.io/xxxxx',
      validate: (value) => value.startsWith('https://') && value.includes('sentry.io')
    },
    'RECAPTCHA_SITE_KEY': {
      description: 'reCAPTCHA站点密钥',
      example: '6LcxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxX',
      validate: (value) => value.length >= 40
    },
    'RECAPTCHA_SECRET_KEY': {
      description: 'reCAPTCHA密钥',
      example: '6LcxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxX',
      validate: (value) => value.length >= 40
    }
  },

  // 可选的环境变量
  optional: {
    'NEXT_PUBLIC_IMAGE_CDN_URL': {
      description: '图片CDN URL',
      example: 'https://cdn.southpole.com'
    },
    'CSRF_SECRET': {
      description: 'CSRF保护密钥',
      example: 'your_csrf_secret_key_here'
    },
    'RATE_LIMIT_REQUESTS': {
      description: '限流请求数',
      example: '100'
    },
    'CONTACT_EMAIL': {
      description: '联系邮箱',
      example: 'contact@southpole.com'
    }
  }
};

// 验证结果统计
const results = {
  required: { passed: 0, failed: 0, total: 0 },
  recommended: { passed: 0, failed: 0, total: 0 },
  optional: { passed: 0, failed: 0, total: 0 }
};

// 日志函数
function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logBold(message, color = 'white') {
  console.log(`${colors.bold}${colors[color]}${message}${colors.reset}`);
}

// 验证单个环境变量
function validateEnvVar(name, config, category) {
  const value = process.env[name];
  results[category].total++;

  if (!value) {
    results[category].failed++;
    log(`❌ ${name}: 未设置`, 'red');
    log(`   描述: ${config.description}`, 'yellow');
    log(`   示例: ${config.example}`, 'cyan');
    return false;
  }

  if (config.validate && !config.validate(value)) {
    results[category].failed++;
    log(`⚠️  ${name}: 格式不正确`, 'yellow');
    log(`   当前值: ${value.substring(0, 20)}...`, 'red');
    log(`   描述: ${config.description}`, 'yellow');
    log(`   示例: ${config.example}`, 'cyan');
    return false;
  }

  results[category].passed++;
  log(`✅ ${name}: 配置正确`, 'green');
  return true;
}

// 检查.env文件是否存在
function checkEnvFiles() {
  const envFiles = ['.env.local', '.env.production', '.env'];
  const existingFiles = envFiles.filter(file => fs.existsSync(path.join(process.cwd(), file)));
  
  if (existingFiles.length === 0) {
    log('⚠️  警告: 没有找到环境变量文件', 'yellow');
    log('   建议创建 .env.local 文件用于本地开发', 'cyan');
    log('   或在生产环境中直接设置环境变量', 'cyan');
  } else {
    log(`📁 找到环境变量文件: ${existingFiles.join(', ')}`, 'green');
  }
  console.log('');
}

// 生成环境变量模板
function generateTemplate() {
  log('📝 生成环境变量模板...', 'blue');
  
  let template = '# =====================================\n';
  template += '# South Pole Website - 生产环境变量\n';
  template += '# =====================================\n\n';

  // 必需变量
  template += '# 必需配置 (Required)\n';
  for (const [name, config] of Object.entries(ENV_CONFIG.required)) {
    template += `${name}=${config.example}\n`;
  }
  template += '\n';

  // 推荐变量
  template += '# 推荐配置 (Recommended)\n';
  for (const [name, config] of Object.entries(ENV_CONFIG.recommended)) {
    template += `${name}=${config.example}\n`;
  }
  template += '\n';

  // 可选变量
  template += '# 可选配置 (Optional)\n';
  for (const [name, config] of Object.entries(ENV_CONFIG.optional)) {
    template += `# ${name}=${config.example}\n`;
  }

  // 保存模板文件
  const templatePath = path.join(process.cwd(), '.env.production.template');
  fs.writeFileSync(templatePath, template);
  log(`✅ 模板已生成: ${templatePath}`, 'green');
}

// 检查Node.js环境
function checkNodeEnvironment() {
  const nodeVersion = process.version;
  const requiredVersion = '18.0.0';
  
  log(`🔍 Node.js版本: ${nodeVersion}`, 'blue');
  
  if (nodeVersion.localeCompare(requiredVersion, undefined, { numeric: true }) < 0) {
    log(`⚠️  建议使用Node.js ${requiredVersion}或更高版本`, 'yellow');
  } else {
    log('✅ Node.js版本符合要求', 'green');
  }
  console.log('');
}

// 检查依赖项
function checkDependencies() {
  const packagePath = path.join(process.cwd(), 'package.json');
  
  if (!fs.existsSync(packagePath)) {
    log('❌ 没有找到package.json', 'red');
    return;
  }

  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  const criticalDeps = ['next', 'react', 'prisma', '@prisma/client'];
  
  log('📦 检查关键依赖...', 'blue');
  
  for (const dep of criticalDeps) {
    if (packageJson.dependencies?.[dep] || packageJson.devDependencies?.[dep]) {
      log(`✅ ${dep}: 已安装`, 'green');
    } else {
      log(`❌ ${dep}: 未安装`, 'red');
    }
  }
  console.log('');
}

// 主验证函数
function validateEnvironment() {
  logBold('🚀 South Pole Website - 环境变量验证', 'blue');
  logBold('================================================', 'blue');
  console.log('');

  // 检查环境
  checkNodeEnvironment();
  checkEnvFiles();
  checkDependencies();

  // 验证必需变量
  logBold('🔴 必需配置验证', 'red');
  logBold('----------------', 'red');
  for (const [name, config] of Object.entries(ENV_CONFIG.required)) {
    validateEnvVar(name, config, 'required');
  }
  console.log('');

  // 验证推荐变量
  logBold('🟡 推荐配置验证', 'yellow');
  logBold('----------------', 'yellow');
  for (const [name, config] of Object.entries(ENV_CONFIG.recommended)) {
    validateEnvVar(name, config, 'recommended');
  }
  console.log('');

  // 验证可选变量
  logBold('🟢 可选配置验证', 'green');
  logBold('----------------', 'green');
  for (const [name, config] of Object.entries(ENV_CONFIG.optional)) {
    validateEnvVar(name, config, 'optional');
  }
  console.log('');

  // 显示总结
  logBold('📊 验证总结', 'blue');
  logBold('===========', 'blue');
  
  const { required, recommended, optional } = results;
  
  log(`必需配置: ${required.passed}/${required.total} 通过`, 
      required.failed === 0 ? 'green' : 'red');
  log(`推荐配置: ${recommended.passed}/${recommended.total} 通过`, 
      recommended.failed === 0 ? 'green' : 'yellow');
  log(`可选配置: ${optional.passed}/${optional.total} 通过`, 'green');
  
  console.log('');
  
  // 部署建议
  if (required.failed > 0) {
    logBold('🚫 部署状态: 未就绪', 'red');
    log('   必须修复所有必需配置才能部署到生产环境', 'red');
  } else if (recommended.failed > 2) {
    logBold('⚠️  部署状态: 基本就绪', 'yellow');
    log('   建议配置更多推荐选项以获得最佳体验', 'yellow');
  } else {
    logBold('✅ 部署状态: 完全就绪', 'green');
    log('   所有关键配置已完成，可以安全部署', 'green');
  }
  
  console.log('');
  
  // 返回退出码
  return required.failed === 0 ? 0 : 1;
}

// 处理命令行参数
function handleArguments() {
  const args = process.argv.slice(2);
  
  if (args.includes('--template') || args.includes('-t')) {
    generateTemplate();
    return true;
  }
  
  if (args.includes('--help') || args.includes('-h')) {
    logBold('South Pole Website - 环境变量验证脚本', 'blue');
    console.log('');
    log('用法:');
    log('  node scripts/validate-env.js           # 验证环境变量');
    log('  node scripts/validate-env.js -t       # 生成环境变量模板');
    log('  node scripts/validate-env.js --help   # 显示帮助');
    console.log('');
    return true;
  }
  
  return false;
}

// 主程序入口
if (require.main === module) {
  if (!handleArguments()) {
    const exitCode = validateEnvironment();
    process.exit(exitCode);
  }
}

module.exports = {
  validateEnvironment,
  ENV_CONFIG,
  generateTemplate
};