#!/usr/bin/env node

/**
 * South Pole Website Debug Cleanup Script
 * 
 * 清理生产代码中的调试语句，为部署做准备
 * 将console.log替换为适当的日志记录或删除
 */

const fs = require('fs');
const path = require('path');

// ANSI colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'white') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logBold(message, color = 'white') {
  console.log(`${colors.bold}${colors[color]}${message}${colors.reset}`);
}

// 配置：哪些console.log应该保留（转为正式日志）
const KEEP_LOGS = [
  'Sending contact form notifications:',
  'Sending confirmation email:',
  'Sending newsletter welcome:',
  'Security event:',
  'Rate limit exceeded:',
  'Suspicious email detected:',
  'Form Error:',
  'Export completed:',
  'File uploaded:',
  'User authenticated:',
  'Database operation:'
];

// 检查是否应该保留某个console.log
function shouldKeepLog(logContent) {
  return KEEP_LOGS.some(pattern => logContent.includes(pattern));
}

// 处理单个文件
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    let changes = [];

    // 匹配console.log语句的正则表达式
    const consoleLogRegex = /console\.log\s*\([^)]*\);?/g;
    
    let newContent = content.replace(consoleLogRegex, (match, offset) => {
      // 获取当前行号
      const beforeMatch = content.substring(0, offset);
      const lineNumber = beforeMatch.split('\n').length;
      
      // 检查是否应该保留这个log
      if (shouldKeepLog(match)) {
        // 转换为适当的日志调用
        const logContent = match.replace('console.log', 'logInfo');
        changes.push({
          line: lineNumber,
          type: 'converted',
          original: match.trim(),
          replacement: logContent
        });
        modified = true;
        return logContent;
      } else {
        // 删除这个console.log
        changes.push({
          line: lineNumber,
          type: 'removed',
          original: match.trim()
        });
        modified = true;
        return '// Debug log removed for production';
      }
    });

    // 处理console.error, console.warn等
    const consoleErrorRegex = /console\.error\s*\([^)]*\);?/g;
    newContent = newContent.replace(consoleErrorRegex, (match, offset) => {
      const beforeMatch = content.substring(0, offset);
      const lineNumber = beforeMatch.split('\n').length;
      
      const logContent = match.replace('console.error', 'logError');
      changes.push({
        line: lineNumber,
        type: 'converted',
        original: match.trim(),
        replacement: logContent
      });
      modified = true;
      return logContent;
    });

    // 处理debugger语句
    const debuggerRegex = /^\s*debugger\s*;?\s*$/gm;
    newContent = newContent.replace(debuggerRegex, (match, offset) => {
      const beforeMatch = content.substring(0, offset);
      const lineNumber = beforeMatch.split('\n').length;
      
      changes.push({
        line: lineNumber,
        type: 'removed',
        original: match.trim()
      });
      modified = true;
      return '// Debugger statement removed for production';
    });

    if (modified) {
      return { success: true, changes, newContent };
    }

    return { success: true, changes: [], newContent: content };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// 添加日志工具函数到文件
function addLoggerImport(content, filePath) {
  // 检查是否已经有日志导入
  if (content.includes('logInfo') || content.includes('logError')) {
    // 检查是否有导入语句
    if (!content.includes('import') && !content.includes('require')) {
      // 这是API路由文件，添加简单的日志函数
      const loggerCode = `
// Production logging utilities
const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(\`[INFO] \${new Date().toISOString()} - \${message}\`, data ? JSON.stringify(data) : '');
  }
};

const logError = (message: string, error?: any) => {
  console.error(\`[ERROR] \${new Date().toISOString()} - \${message}\`, error);
};
`;
      
      // 在import语句后添加
      const importIndex = content.lastIndexOf('import');
      if (importIndex !== -1) {
        const nextLineIndex = content.indexOf('\n', importIndex);
        if (nextLineIndex !== -1) {
          return content.slice(0, nextLineIndex + 1) + loggerCode + content.slice(nextLineIndex + 1);
        }
      }
      
      // 如果没有import语句，在文件开头添加
      return loggerCode + '\n' + content;
    }
  }
  
  return content;
}

// 扫描源代码目录
function scanDirectory(dirPath, extensions = ['.ts', '.tsx', '.js', '.jsx']) {
  const files = [];
  
  function scan(currentPath) {
    const items = fs.readdirSync(currentPath);
    
    for (const item of items) {
      const fullPath = path.join(currentPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // 跳过某些目录
        if (!['node_modules', '.next', 'build', 'dist', '.git'].includes(item)) {
          scan(fullPath);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(item);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  }
  
  scan(dirPath);
  return files;
}

// 主清理函数
function cleanupDebugCode(dryRun = false) {
  logBold('🧹 代码清理工具 - 移除调试语句', 'blue');
  logBold('================================', 'blue');
  
  if (dryRun) {
    log('🔍 预览模式 - 不会修改文件', 'yellow');
  }
  
  console.log('');

  const srcPath = path.join(process.cwd(), 'src');
  
  if (!fs.existsSync(srcPath)) {
    log('❌ 源代码目录不存在', 'red');
    return;
  }

  const files = scanDirectory(srcPath);
  log(`📂 找到 ${files.length} 个源文件`, 'blue');
  console.log('');

  let totalFiles = 0;
  let modifiedFiles = 0;
  let totalChanges = 0;

  for (const filePath of files) {
    totalFiles++;
    const relativePath = path.relative(process.cwd(), filePath);
    
    const result = processFile(filePath);
    
    if (!result.success) {
      log(`❌ ${relativePath}: ${result.error}`, 'red');
      continue;
    }

    if (result.changes.length > 0) {
      modifiedFiles++;
      totalChanges += result.changes.length;
      
      log(`📝 ${relativePath}:`, 'cyan');
      
      for (const change of result.changes) {
        const lineInfo = `行 ${change.line}`;
        
        if (change.type === 'removed') {
          log(`   ❌ ${lineInfo}: 移除 "${change.original}"`, 'red');
        } else if (change.type === 'converted') {
          log(`   🔄 ${lineInfo}: "${change.original}" → "${change.replacement}"`, 'yellow');
        }
      }
      
      if (!dryRun) {
        // 添加日志工具函数
        const finalContent = addLoggerImport(result.newContent, filePath);
        fs.writeFileSync(filePath, finalContent);
        log(`   ✅ 文件已更新`, 'green');
      }
      
      console.log('');
    }
  }

  // 显示总结
  logBold('📊 清理总结', 'blue');
  logBold('============', 'blue');
  log(`总文件数: ${totalFiles}`, 'cyan');
  log(`修改文件数: ${modifiedFiles}`, modifiedFiles > 0 ? 'yellow' : 'green');
  log(`总修改数: ${totalChanges}`, totalChanges > 0 ? 'yellow' : 'green');

  if (dryRun && totalChanges > 0) {
    console.log('');
    log('🔧 运行清理:', 'cyan');
    log('   node scripts/cleanup-debug.js --apply', 'cyan');
  } else if (!dryRun && totalChanges > 0) {
    console.log('');
    log('✅ 代码清理完成！', 'green');
    log('   建议重新运行测试确保功能正常', 'yellow');
  } else {
    console.log('');
    log('✨ 代码已经很干净，无需清理', 'green');
  }
}

// 处理命令行参数
function handleArguments() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    logBold('South Pole Website 代码清理脚本', 'blue');
    console.log('');
    log('用法:');
    log('  node scripts/cleanup-debug.js          # 预览模式（不修改文件）');
    log('  node scripts/cleanup-debug.js --apply  # 应用清理（修改文件）');
    log('  node scripts/cleanup-debug.js --help   # 显示帮助');
    console.log('');
    log('功能:');
    log('  • 移除console.log调试语句');
    log('  • 移除debugger语句');
    log('  • 转换重要日志为生产日志');
    log('  • 保持代码功能完整性');
    console.log('');
    return true;
  }
  
  const apply = args.includes('--apply') || args.includes('-a');
  cleanupDebugCode(!apply);
  
  return true;
}

// 主程序入口
if (require.main === module) {
  handleArguments();
}

module.exports = {
  cleanupDebugCode,
  processFile,
  scanDirectory
};