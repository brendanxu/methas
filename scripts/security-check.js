#!/usr/bin/env node

/**
 * South Pole Website Security Check Script
 * 
 * 全面的安全性检查工具，用于验证生产环境的安全配置
 * 检查包括：依赖项漏洞、配置安全、代码质量等
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

// 安全检查结果统计
const securityResults = {
  dependencies: { passed: 0, failed: 0, warnings: 0 },
  configuration: { passed: 0, failed: 0, warnings: 0 },
  codeQuality: { passed: 0, failed: 0, warnings: 0 },
  permissions: { passed: 0, failed: 0, warnings: 0 }
};

// 日志函数
function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logBold(message, color = 'white') {
  console.log(`${colors.bold}${colors[color]}${message}${colors.reset}`);
}

// 检查依赖项漏洞
async function checkDependencyVulnerabilities() {
  logBold('🔍 依赖项安全检查', 'blue');
  logBold('==================', 'blue');

  try {
    // 检查package.json是否存在
    const packagePath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packagePath)) {
      log('❌ package.json文件不存在', 'red');
      securityResults.dependencies.failed++;
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    // 检查是否有npm audit
    try {
      log('📦 运行npm audit检查...', 'cyan');
      const auditResult = execSync('npm audit --audit-level=moderate --json', { 
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      const audit = JSON.parse(auditResult);
      
      if (audit.metadata.vulnerabilities.total === 0) {
        log('✅ 没有发现依赖项漏洞', 'green');
        securityResults.dependencies.passed++;
      } else {
        const { high, critical, moderate, low } = audit.metadata.vulnerabilities;
        
        if (critical > 0 || high > 0) {
          log(`❌ 发现严重漏洞: ${critical} 严重, ${high} 高危`, 'red');
          securityResults.dependencies.failed++;
        } else if (moderate > 0) {
          log(`⚠️  发现中等漏洞: ${moderate} 个`, 'yellow');
          securityResults.dependencies.warnings++;
        } else {
          log(`ℹ️  发现低危漏洞: ${low} 个`, 'cyan');
          securityResults.dependencies.passed++;
        }
      }
    } catch (error) {
      if (error.status === 1) {
        // npm audit found vulnerabilities
        try {
          const auditOutput = error.stdout.toString();
          const audit = JSON.parse(auditOutput);
          const { high, critical, moderate, low } = audit.metadata.vulnerabilities;
          
          if (critical > 0 || high > 0) {
            log(`❌ 发现严重漏洞: ${critical} 严重, ${high} 高危`, 'red');
            log('   建议运行: npm audit fix', 'yellow');
            securityResults.dependencies.failed++;
          } else if (moderate > 0) {
            log(`⚠️  发现中等漏洞: ${moderate} 个`, 'yellow');
            securityResults.dependencies.warnings++;
          } else {
            log(`ℹ️  发现低危漏洞: ${low} 个`, 'cyan');
            securityResults.dependencies.passed++;
          }
        } catch {
          log('⚠️  无法解析audit结果', 'yellow');
          securityResults.dependencies.warnings++;
        }
      } else {
        log('⚠️  npm audit检查失败', 'yellow');
        securityResults.dependencies.warnings++;
      }
    }

    // 检查过时的依赖项
    try {
      log('📅 检查过时的依赖项...', 'cyan');
      const outdatedResult = execSync('npm outdated --json', { 
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      const outdated = JSON.parse(outdatedResult);
      const outdatedCount = Object.keys(outdated).length;
      
      if (outdatedCount === 0) {
        log('✅ 所有依赖项都是最新的', 'green');
        securityResults.dependencies.passed++;
      } else {
        log(`⚠️  发现 ${outdatedCount} 个过时的依赖项`, 'yellow');
        securityResults.dependencies.warnings++;
      }
    } catch (error) {
      if (error.status === 1) {
        // npm outdated found outdated packages
        try {
          const outdatedOutput = error.stdout.toString();
          if (outdatedOutput.trim()) {
            const outdated = JSON.parse(outdatedOutput);
            const outdatedCount = Object.keys(outdated).length;
            log(`⚠️  发现 ${outdatedCount} 个过时的依赖项`, 'yellow');
            securityResults.dependencies.warnings++;
          } else {
            log('✅ 所有依赖项都是最新的', 'green');
            securityResults.dependencies.passed++;
          }
        } catch {
          log('ℹ️  有些依赖项可能过时，建议检查', 'cyan');
          securityResults.dependencies.warnings++;
        }
      } else {
        log('ℹ️  无法检查过时的依赖项', 'cyan');
        securityResults.dependencies.warnings++;
      }
    }

  } catch (error) {
    log(`❌ 依赖项检查失败: ${error.message}`, 'red');
    securityResults.dependencies.failed++;
  }

  console.log('');
}

// 检查配置安全性
function checkConfigurationSecurity() {
  logBold('⚙️  配置安全检查', 'blue');
  logBold('================', 'blue');

  // 检查敏感文件是否被正确忽略
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  const sensitivePatterns = ['.env', '.env.local', '.env.production', 'node_modules', '.next'];
  
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    let allPatternsFound = true;
    
    for (const pattern of sensitivePatterns) {
      if (!gitignoreContent.includes(pattern)) {
        log(`⚠️  .gitignore缺少模式: ${pattern}`, 'yellow');
        allPatternsFound = false;
        securityResults.configuration.warnings++;
      }
    }
    
    if (allPatternsFound) {
      log('✅ .gitignore配置正确', 'green');
      securityResults.configuration.passed++;
    }
  } else {
    log('❌ 缺少.gitignore文件', 'red');
    securityResults.configuration.failed++;
  }

  // 检查环境变量文件是否存在敏感信息
  const envFiles = ['.env', '.env.local', '.env.production'];
  for (const envFile of envFiles) {
    const envPath = path.join(process.cwd(), envFile);
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8');
      
      // 检查是否包含明显的测试/示例值
      const testPatterns = ['your_api_key', 'your-secret', 'password123', 'localhost'];
      let hasTestValues = false;
      
      for (const pattern of testPatterns) {
        if (envContent.toLowerCase().includes(pattern)) {
          hasTestValues = true;
          break;
        }
      }
      
      if (hasTestValues) {
        log(`⚠️  ${envFile} 可能包含测试值`, 'yellow');
        securityResults.configuration.warnings++;
      } else {
        log(`✅ ${envFile} 配置看起来正常`, 'green');
        securityResults.configuration.passed++;
      }
    }
  }

  // 检查next.config.js的安全配置
  const nextConfigPath = path.join(process.cwd(), 'next.config.js');
  if (fs.existsSync(nextConfigPath)) {
    const nextConfigContent = fs.readFileSync(nextConfigPath, 'utf8');
    
    // 检查是否启用了安全标头
    if (nextConfigContent.includes('headers') || nextConfigContent.includes('security')) {
      log('✅ Next.js配置包含安全设置', 'green');
      securityResults.configuration.passed++;
    } else {
      log('⚠️  Next.js配置缺少安全标头', 'yellow');
      securityResults.configuration.warnings++;
    }
  }

  // 检查vercel.json的安全配置
  const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
  if (fs.existsSync(vercelConfigPath)) {
    const vercelConfigContent = fs.readFileSync(vercelConfigPath, 'utf8');
    
    try {
      const vercelConfig = JSON.parse(vercelConfigContent);
      
      if (vercelConfig.headers && vercelConfig.headers.length > 0) {
        const securityHeaders = ['X-Content-Type-Options', 'X-Frame-Options', 'X-XSS-Protection'];
        const foundHeaders = vercelConfig.headers.some(headerGroup => 
          headerGroup.headers && headerGroup.headers.some(header => 
            securityHeaders.includes(header.key)
          )
        );
        
        if (foundHeaders) {
          log('✅ Vercel配置包含安全标头', 'green');
          securityResults.configuration.passed++;
        } else {
          log('⚠️  Vercel配置缺少安全标头', 'yellow');
          securityResults.configuration.warnings++;
        }
      } else {
        log('⚠️  Vercel配置没有设置标头', 'yellow');
        securityResults.configuration.warnings++;
      }
    } catch {
      log('❌ Vercel配置格式错误', 'red');
      securityResults.configuration.failed++;
    }
  }

  console.log('');
}

// 检查代码质量和安全
function checkCodeQuality() {
  logBold('📝 代码质量检查', 'blue');
  logBold('================', 'blue');

  // 检查TypeScript配置
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    try {
      const tsconfigContent = fs.readFileSync(tsconfigPath, 'utf8');
      const tsconfig = JSON.parse(tsconfigContent);
      
      // 检查严格模式
      if (tsconfig.compilerOptions && tsconfig.compilerOptions.strict) {
        log('✅ TypeScript严格模式已启用', 'green');
        securityResults.codeQuality.passed++;
      } else {
        log('⚠️  建议启用TypeScript严格模式', 'yellow');
        securityResults.codeQuality.warnings++;
      }
    } catch {
      log('❌ TypeScript配置格式错误', 'red');
      securityResults.codeQuality.failed++;
    }
  } else {
    log('⚠️  没有找到TypeScript配置', 'yellow');
    securityResults.codeQuality.warnings++;
  }

  // 检查ESLint配置
  const eslintConfigs = ['.eslintrc.js', '.eslintrc.json', 'eslint.config.js'];
  let hasEslint = false;
  
  for (const config of eslintConfigs) {
    if (fs.existsSync(path.join(process.cwd(), config))) {
      hasEslint = true;
      break;
    }
  }
  
  if (hasEslint) {
    log('✅ ESLint配置已设置', 'green');
    securityResults.codeQuality.passed++;
  } else {
    log('⚠️  没有找到ESLint配置', 'yellow');
    securityResults.codeQuality.warnings++;
  }

  // 检查是否有console.log或调试代码
  try {
    log('🔍 扫描调试代码...', 'cyan');
    const srcPath = path.join(process.cwd(), 'src');
    
    if (fs.existsSync(srcPath)) {
      const result = execSync(`find ${srcPath} -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs grep -l "console\\.log\\|debugger" || echo "none"`, {
        encoding: 'utf8'
      });
      
      if (result.trim() === 'none' || result.trim() === '') {
        log('✅ 没有发现调试代码', 'green');
        securityResults.codeQuality.passed++;
      } else {
        const files = result.trim().split('\n').filter(f => f && f !== 'none');
        log(`⚠️  发现 ${files.length} 个文件包含调试代码`, 'yellow');
        securityResults.codeQuality.warnings++;
      }
    }
  } catch {
    log('ℹ️  无法扫描调试代码', 'cyan');
  }

  // 检查是否有TODO或FIXME注释
  try {
    log('📋 检查待办事项...', 'cyan');
    const srcPath = path.join(process.cwd(), 'src');
    
    if (fs.existsSync(srcPath)) {
      const result = execSync(`find ${srcPath} -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" | xargs grep -i "todo\\|fixme\\|hack" || echo "none"`, {
        encoding: 'utf8'
      });
      
      if (result.trim() === 'none' || result.trim() === '') {
        log('✅ 没有发现待办事项', 'green');
        securityResults.codeQuality.passed++;
      } else {
        const todos = result.trim().split('\n').filter(f => f && f !== 'none');
        log(`ℹ️  发现 ${todos.length} 个待办事项`, 'cyan');
        securityResults.codeQuality.warnings++;
      }
    }
  } catch {
    log('ℹ️  无法检查待办事项', 'cyan');
  }

  console.log('');
}

// 检查文件权限
function checkFilePermissions() {
  logBold('🔐 文件权限检查', 'blue');
  logBold('================', 'blue');

  const sensitiveFiles = [
    { file: '.env', maxPerm: '600' },
    { file: '.env.local', maxPerm: '600' },
    { file: '.env.production', maxPerm: '600' },
    { file: 'package.json', maxPerm: '644' },
    { file: 'next.config.js', maxPerm: '644' }
  ];

  for (const { file, maxPerm } of sensitiveFiles) {
    const filePath = path.join(process.cwd(), file);
    
    if (fs.existsSync(filePath)) {
      try {
        const stats = fs.statSync(filePath);
        const mode = (stats.mode & parseInt('777', 8)).toString(8);
        
        if (parseInt(mode, 8) <= parseInt(maxPerm, 8)) {
          log(`✅ ${file}: 权限正确 (${mode})`, 'green');
          securityResults.permissions.passed++;
        } else {
          log(`⚠️  ${file}: 权限过于宽松 (${mode}), 建议设为 ${maxPerm}`, 'yellow');
          securityResults.permissions.warnings++;
        }
      } catch (error) {
        log(`❌ 无法检查 ${file} 的权限`, 'red');
        securityResults.permissions.failed++;
      }
    }
  }

  // 检查脚本文件的执行权限
  const scriptsPath = path.join(process.cwd(), 'scripts');
  if (fs.existsSync(scriptsPath)) {
    try {
      const scriptFiles = fs.readdirSync(scriptsPath)
        .filter(file => file.endsWith('.js') || file.endsWith('.sh'));
      
      for (const script of scriptFiles) {
        const scriptPath = path.join(scriptsPath, script);
        const stats = fs.statSync(scriptPath);
        const mode = (stats.mode & parseInt('777', 8)).toString(8);
        
        if (mode.includes('7') || mode.includes('5')) {
          log(`✅ scripts/${script}: 有执行权限`, 'green');
          securityResults.permissions.passed++;
        } else {
          log(`⚠️  scripts/${script}: 缺少执行权限`, 'yellow');
          securityResults.permissions.warnings++;
        }
      }
    } catch (error) {
      log('ℹ️  无法检查脚本权限', 'cyan');
    }
  }

  console.log('');
}

// 生成安全报告
function generateSecurityReport() {
  logBold('📊 安全检查报告', 'blue');
  logBold('================', 'blue');

  const { dependencies, configuration, codeQuality, permissions } = securityResults;
  
  // 计算总分
  const totalPassed = dependencies.passed + configuration.passed + codeQuality.passed + permissions.passed;
  const totalFailed = dependencies.failed + configuration.failed + codeQuality.failed + permissions.failed;
  const totalWarnings = dependencies.warnings + configuration.warnings + codeQuality.warnings + permissions.warnings;
  const totalChecks = totalPassed + totalFailed + totalWarnings;

  log(`依赖项安全: ${dependencies.passed} 通过, ${dependencies.failed} 失败, ${dependencies.warnings} 警告`, 
      dependencies.failed > 0 ? 'red' : dependencies.warnings > 0 ? 'yellow' : 'green');
  
  log(`配置安全: ${configuration.passed} 通过, ${configuration.failed} 失败, ${configuration.warnings} 警告`, 
      configuration.failed > 0 ? 'red' : configuration.warnings > 0 ? 'yellow' : 'green');
  
  log(`代码质量: ${codeQuality.passed} 通过, ${codeQuality.failed} 失败, ${codeQuality.warnings} 警告`, 
      codeQuality.failed > 0 ? 'red' : codeQuality.warnings > 0 ? 'yellow' : 'green');
  
  log(`文件权限: ${permissions.passed} 通过, ${permissions.failed} 失败, ${permissions.warnings} 警告`, 
      permissions.failed > 0 ? 'red' : permissions.warnings > 0 ? 'yellow' : 'green');

  console.log('');
  
  // 总体评估
  const securityScore = totalChecks > 0 ? Math.round((totalPassed / totalChecks) * 100) : 0;
  
  log(`总体安全评分: ${securityScore}%`, securityScore >= 80 ? 'green' : securityScore >= 60 ? 'yellow' : 'red');
  
  if (totalFailed === 0 && totalWarnings === 0) {
    logBold('🎉 安全检查全部通过！', 'green');
  } else if (totalFailed === 0) {
    logBold('✅ 没有发现严重安全问题', 'green');
    log('   建议解决警告项以提高安全性', 'yellow');
  } else {
    logBold('⚠️  发现安全问题，建议修复后再部署', 'yellow');
  }

  console.log('');
  
  // 生成建议
  logBold('💡 安全建议', 'cyan');
  logBold('============', 'cyan');
  
  if (dependencies.failed > 0 || dependencies.warnings > 0) {
    log('• 运行 npm audit fix 修复依赖项漏洞', 'cyan');
    log('• 定期更新依赖项到最新版本', 'cyan');
  }
  
  if (configuration.failed > 0 || configuration.warnings > 0) {
    log('• 检查和完善安全标头配置', 'cyan');
    log('• 确保敏感文件被正确忽略', 'cyan');
  }
  
  if (codeQuality.failed > 0 || codeQuality.warnings > 0) {
    log('• 移除生产代码中的调试语句', 'cyan');
    log('• 启用TypeScript严格模式', 'cyan');
  }
  
  if (permissions.failed > 0 || permissions.warnings > 0) {
    log('• 设置正确的文件权限', 'cyan');
    log('• 保护敏感配置文件', 'cyan');
  }

  return totalFailed === 0;
}

// 主函数
async function runSecurityCheck() {
  logBold('🔒 South Pole Website 安全检查', 'blue');
  logBold('=================================', 'blue');
  console.log('');

  await checkDependencyVulnerabilities();
  checkConfigurationSecurity();
  checkCodeQuality();
  checkFilePermissions();
  
  const isSecure = generateSecurityReport();
  
  return isSecure ? 0 : 1;
}

// 处理命令行参数
function handleArguments() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    logBold('South Pole Website 安全检查脚本', 'blue');
    console.log('');
    log('用法:');
    log('  node scripts/security-check.js        # 运行完整安全检查');
    log('  node scripts/security-check.js --help # 显示帮助');
    console.log('');
    log('检查项目:');
    log('  • 依赖项漏洞扫描');
    log('  • 配置文件安全检查');
    log('  • 代码质量评估'); 
    log('  • 文件权限验证');
    console.log('');
    return true;
  }
  
  return false;
}

// 主程序入口
if (require.main === module) {
  if (!handleArguments()) {
    runSecurityCheck().then(exitCode => {
      process.exit(exitCode);
    }).catch(error => {
      log(`❌ 安全检查失败: ${error.message}`, 'red');
      process.exit(1);
    });
  }
}

module.exports = {
  runSecurityCheck,
  checkDependencyVulnerabilities,
  checkConfigurationSecurity,
  checkCodeQuality,
  checkFilePermissions
};