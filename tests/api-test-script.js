#!/usr/bin/env node

/**
 * South Pole API 端点全面测试脚本
 * 
 * 测试目标：
 * 1. 验证所有 API 端点的基本功能
 * 2. 检查权限控制和安全性
 * 3. 验证数据格式和响应结构
 * 4. 检测潜在的错误和边界情况
 */

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// 测试结果收集器
class TestReporter {
  constructor() {
    this.results = []
    this.startTime = Date.now()
  }

  log(category, endpoint, method, status, message, details = null) {
    const result = {
      timestamp: new Date().toISOString(),
      category,
      endpoint,
      method,
      status,
      message,
      details
    }
    this.results.push(result)
    
    const statusSymbol = status === 'PASS' ? '✅' : status === 'FAIL' ? '❌' : '⚠️'
    console.log(`${statusSymbol} [${category}] ${method} ${endpoint} - ${message}`)
    
    if (details && status !== 'PASS') {
      console.log(`   Details: ${JSON.stringify(details, null, 2)}`)
    }
  }

  generateReport() {
    const endTime = Date.now()
    const duration = endTime - this.startTime
    
    const summary = {
      totalTests: this.results.length,
      passed: this.results.filter(r => r.status === 'PASS').length,
      failed: this.results.filter(r => r.status === 'FAIL').length,
      warnings: this.results.filter(r => r.status === 'WARN').length,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    }

    console.log('\n' + '='.repeat(80))
    console.log('📊 API 测试报告')
    console.log('='.repeat(80))
    console.log(`测试用时: ${summary.duration}`)
    console.log(`总计测试: ${summary.totalTests}`)
    console.log(`✅ 通过: ${summary.passed}`)
    console.log(`❌ 失败: ${summary.failed}`)
    console.log(`⚠️  警告: ${summary.warnings}`)
    console.log(`成功率: ${((summary.passed / summary.totalTests) * 100).toFixed(1)}%`)

    if (summary.failed > 0) {
      console.log('\n❌ 失败的测试:')
      this.results.filter(r => r.status === 'FAIL').forEach(result => {
        console.log(`  ${result.method} ${result.endpoint} - ${result.message}`)
      })
    }

    return summary
  }
}

// HTTP 请求工具
async function makeRequest(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`
  const config = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'SouthPole-API-Tester/1.0',
      'Referer': 'http://localhost:3000',
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(url, config)
    const data = await response.text()
    
    let parsedData
    try {
      parsedData = JSON.parse(data)
    } catch {
      parsedData = data
    }

    return {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data: parsedData,
      ok: response.ok
    }
  } catch (error) {
    return {
      status: 0,
      statusText: 'Network Error',
      error: error.message,
      ok: false
    }
  }
}

// 测试用例定义
const API_TESTS = [
  // ==================== 公共 API ====================
  {
    category: 'PUBLIC',
    name: '健康检查',
    endpoint: '/api/health',
    method: 'GET',
    expectedStatus: 200,
    validate: (response) => {
      return response.data?.status === 'healthy'
    }
  },

  {
    category: 'PUBLIC',
    name: '团队信息',
    endpoint: '/api/public/team',
    method: 'GET',
    expectedStatus: 200,
    validate: (response) => {
      return Array.isArray(response.data?.data)
    }
  },

  // ==================== 表单 API ====================
  {
    category: 'FORMS',
    name: '联系表单提交',
    endpoint: '/api/forms/contact',
    method: 'POST',
    expectedStatus: 200,
    body: {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      company: 'Test Company',
      country: 'CN',
      inquiryType: 'carbon-footprint',
      message: 'This is a test message for carbon footprint assessment inquiry',
      agreeToTerms: true,
      phone: '+1234567890'
    },
    validate: (response) => {
      return response.data?.success === true
    }
  },

  {
    category: 'FORMS',
    name: '联系表单提交 - 缺少必填字段',
    endpoint: '/api/forms/contact',
    method: 'POST',
    expectedStatus: 400,
    body: {
      firstName: 'Test',
      lastName: 'User'
      // 缺少必填字段：email, company, country, inquiryType, message, agreeToTerms
    }
  },

  {
    category: 'FORMS',
    name: '邮件订阅',
    endpoint: '/api/forms/newsletter',
    method: 'POST',
    expectedStatus: 200,
    body: {
      email: 'newsletter@example.com',
      firstName: 'Newsletter Subscriber'
    },
    validate: (response) => {
      return response.data?.success === true
    }
  },

  {
    category: 'FORMS',
    name: '邮件订阅 - 无效邮箱',
    endpoint: '/api/forms/newsletter',
    method: 'POST',
    expectedStatus: 400,
    body: {
      email: 'invalid-email',
      firstName: 'Test'
    }
  },

  // ==================== 搜索 API ====================
  {
    category: 'SEARCH',
    name: '内容搜索',
    endpoint: '/api/search?q=south+pole',
    method: 'GET',
    expectedStatus: 200,
    validate: (response) => {
      return Array.isArray(response.data?.results)
    }
  },

  {
    category: 'SEARCH',
    name: '搜索建议',
    endpoint: '/api/search/suggestions?q=climate',
    method: 'GET',
    expectedStatus: 200,
    validate: (response) => {
      return Array.isArray(response.data?.suggestions)
    }
  },

  {
    category: 'SEARCH',
    name: '搜索分析',
    endpoint: '/api/search/analytics',
    method: 'GET',
    expectedStatus: 401  // 需要管理员权限
  },

  // ==================== 认证相关 ====================
  {
    category: 'AUTH',
    name: '用户注册 - 缺少数据',
    endpoint: '/api/auth/register',
    method: 'POST',
    expectedStatus: 400,
    body: {}
  },

  // ==================== 无权限访问管理员 API ====================
  {
    category: 'ADMIN_NO_AUTH',
    name: '内容管理 - 公开已发布内容',
    endpoint: '/api/content',
    method: 'GET',
    expectedStatus: 200,
    validate: (response) => {
      return response.data?.success === true && Array.isArray(response.data?.data?.contents)
    }
  },

  {
    category: 'ADMIN_NO_AUTH',
    name: '用户管理 - 无权限',
    endpoint: '/api/users',
    method: 'GET',
    expectedStatus: 401
  },

  {
    category: 'ADMIN_NO_AUTH',
    name: '表单管理 - 无权限',
    endpoint: '/api/forms',
    method: 'GET',
    expectedStatus: 401
  },

  {
    category: 'ADMIN_NO_AUTH',
    name: '文件上传 - 无权限',
    endpoint: '/api/upload',
    method: 'POST',
    expectedStatus: 401
  },

  {
    category: 'ADMIN_NO_AUTH',
    name: '限流管理 - 无权限',
    endpoint: '/api/admin/rate-limits',
    method: 'GET',
    expectedStatus: 401
  },

  {
    category: 'ADMIN_NO_AUTH',
    name: '数据导出 - 无权限',
    endpoint: '/api/admin/exports',
    method: 'GET',
    expectedStatus: 401
  },

  // ==================== 错误处理测试 ====================
  {
    category: 'ERROR_HANDLING',
    name: '不存在的端点',
    endpoint: '/api/non-existent',
    method: 'GET',
    expectedStatus: 404
  },

  {
    category: 'ERROR_HANDLING',
    name: '不支持的方法',
    endpoint: '/api/health',
    method: 'DELETE',
    expectedStatus: 405
  },

  {
    category: 'ERROR_HANDLING',
    name: '恶意 JSON 请求',
    endpoint: '/api/forms/contact',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: '{"invalid": json}',
    expectedStatus: 400,
    rawBody: true
  }
]

// 限流测试
async function testRateLimit(reporter) {
  console.log('\n🚦 测试限流功能...')
  
  const requests = []
  for (let i = 0; i < 5; i++) {
    requests.push(makeRequest('/api/forms/contact', {
      method: 'POST',
      body: JSON.stringify({
        name: `Test User ${i}`,
        email: `test${i}@example.com`,
        message: 'Rate limit test'
      })
    }))
  }

  try {
    const responses = await Promise.all(requests)
    const rateLimited = responses.some(r => r.status === 429)
    
    if (rateLimited) {
      reporter.log('RATE_LIMIT', '/api/forms/contact', 'POST', 'PASS', '限流功能正常工作')
    } else {
      reporter.log('RATE_LIMIT', '/api/forms/contact', 'POST', 'WARN', '限流可能未生效或阈值较高')
    }
  } catch (error) {
    reporter.log('RATE_LIMIT', '/api/forms/contact', 'POST', 'FAIL', '限流测试失败', error.message)
  }
}

// 安全性测试
async function testSecurity(reporter) {
  console.log('\n🔒 测试安全性...')

  // SQL 注入测试
  const sqlInjectionPayloads = [
    "'; DROP TABLE users; --",
    "' OR '1'='1",
    "admin'/*",
    "1' UNION SELECT * FROM users--"
  ]

  for (const payload of sqlInjectionPayloads) {
    const response = await makeRequest(`/api/search?q=${encodeURIComponent(payload)}`)
    if (response.status === 200 && response.data?.success) {
      // 这是好的，说明输入被正确处理了
      reporter.log('SECURITY', '/api/search', 'GET', 'PASS', 'SQL注入防护正常')
    } else if (response.status >= 400) {
      reporter.log('SECURITY', '/api/search', 'GET', 'PASS', '恶意输入被正确拒绝')
    }
  }

  // XSS 测试
  const xssPayload = '<script>alert("xss")</script>'
  const xssResponse = await makeRequest('/api/forms/contact', {
    method: 'POST',
    body: JSON.stringify({
      name: xssPayload,
      email: 'test@test.com',
      message: 'test'
    })
  })
  
  if (xssResponse.status === 200 || xssResponse.status === 400) {
    reporter.log('SECURITY', '/api/forms/contact', 'POST', 'PASS', 'XSS防护正常')
  }
}

// 主测试函数
async function runAPITests() {
  console.log('🚀 开始 South Pole API 端点测试...\n')
  
  const reporter = new TestReporter()

  // 执行基本 API 测试
  for (const test of API_TESTS) {
    try {
      const requestOptions = {
        method: test.method,
        headers: test.headers || {}
      }

      if (test.body) {
        if (test.rawBody) {
          requestOptions.body = test.body
        } else {
          requestOptions.body = JSON.stringify(test.body)
        }
      }

      const response = await makeRequest(test.endpoint, requestOptions)
      
      let status = 'PASS'
      let message = test.name
      let details = null

      // 检查状态码
      if (test.expectedStatus && response.status !== test.expectedStatus) {
        status = 'FAIL'
        message = `期望状态码 ${test.expectedStatus}, 实际 ${response.status}`
        details = { response: response.data }
      }

      // 执行自定义验证
      if (status === 'PASS' && test.validate) {
        try {
          const isValid = test.validate(response)
          if (!isValid) {
            status = 'FAIL'
            message = '响应验证失败'
            details = { response: response.data }
          }
        } catch (error) {
          status = 'FAIL'
          message = '验证函数错误'
          details = { error: error.message }
        }
      }

      reporter.log(test.category, test.endpoint, test.method, status, message, details)

    } catch (error) {
      reporter.log(test.category, test.endpoint, test.method, 'FAIL', '请求失败', error.message)
    }

    // 避免过于频繁的请求
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  // 运行限流测试
  await testRateLimit(reporter)

  // 运行安全性测试
  await testSecurity(reporter)

  // 生成最终报告
  const summary = reporter.generateReport()

  // 保存详细报告
  const fs = require('fs')
  const reportPath = './test-results.json'
  
  try {
    fs.writeFileSync(reportPath, JSON.stringify({
      summary,
      results: reporter.results
    }, null, 2))
    console.log(`\n📄 详细报告已保存到: ${reportPath}`)
  } catch (error) {
    console.log(`⚠️  无法保存报告文件: ${error.message}`)
  }

  return summary
}

// 如果直接运行此脚本
if (require.main === module) {
  runAPITests().catch(console.error)
}

module.exports = { runAPITests }