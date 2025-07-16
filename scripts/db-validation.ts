#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'
import { performance } from 'perf_hooks'
import chalk from 'chalk'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

interface TestResult {
  name: string
  status: 'pass' | 'fail' | 'warning'
  duration: number
  details?: any
  error?: string
}

const results: TestResult[] = []

async function runTest(name: string, testFn: () => Promise<any>) {
  const start = performance.now()
  try {
    const details = await testFn()
    const duration = performance.now() - start
    results.push({ name, status: 'pass', duration, details })
    console.log(chalk.green(`✓ ${name} (${duration.toFixed(2)}ms)`))
  } catch (error) {
    const duration = performance.now() - start
    results.push({ 
      name, 
      status: 'fail', 
      duration, 
      error: error instanceof Error ? error.message : String(error) 
    })
    console.log(chalk.red(`✗ ${name} (${duration.toFixed(2)}ms) - ${error}`))
  }
}

// 1. DATABASE CONNECTION AND CONFIGURATION
async function testDatabaseConnection() {
  console.log(chalk.blue('\n=== DATABASE CONNECTION AND CONFIGURATION ===\n'))
  
  await runTest('Database Connection', async () => {
    await prisma.$connect()
    return { connected: true }
  })
  
  await runTest('Database Version', async () => {
    const result = await prisma.$queryRaw`SELECT sqlite_version() as version`
    return result
  })
  
  await runTest('Connection Pool Status', async () => {
    // Note: $metrics is not available in standard Prisma client
    // This would require Prisma Accelerate or custom implementation
    return { status: 'Metrics not available in SQLite' }
  })
  
  await runTest('Schema Validation', async () => {
    // Test if all tables exist
    const tables = await prisma.$queryRaw`
      SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';
    `
    return { tables }
  })
}

// 2. CRUD OPERATIONS VALIDATION
async function testCRUDOperations() {
  console.log(chalk.blue('\n=== CRUD OPERATIONS VALIDATION ===\n'))
  
  // User CRUD
  let testUserId: string
  await runTest('User - Create', async () => {
    const user = await prisma.user.create({
      data: {
        email: `test-${Date.now()}@example.com`,
        name: 'Test User',
        role: 'USER',
      },
    })
    testUserId = user.id
    return user
  })
  
  await runTest('User - Read', async () => {
    const user = await prisma.user.findUnique({
      where: { id: testUserId },
    })
    return user
  })
  
  await runTest('User - Update', async () => {
    const user = await prisma.user.update({
      where: { id: testUserId },
      data: { name: 'Updated Test User' },
    })
    return user
  })
  
  await runTest('User - List with Pagination', async () => {
    const users = await prisma.user.findMany({
      take: 10,
      skip: 0,
      orderBy: { createdAt: 'desc' },
    })
    return { count: users.length }
  })
  
  // Content CRUD
  let testContentId: string
  await runTest('Content - Create', async () => {
    const content = await prisma.content.create({
      data: {
        type: 'NEWS',
        title: 'Test News Article',
        slug: `test-news-${Date.now()}`,
        content: 'This is a test content',
        excerpt: 'Test excerpt',
        status: 'DRAFT',
        authorId: testUserId,
      },
    })
    testContentId = content.id
    return content
  })
  
  await runTest('Content - Read with Relations', async () => {
    const content = await prisma.content.findUnique({
      where: { id: testContentId },
      include: { author: true },
    })
    return content
  })
  
  await runTest('Content - Update', async () => {
    const content = await prisma.content.update({
      where: { id: testContentId },
      data: { status: 'PUBLISHED' },
    })
    return content
  })
  
  // FormSubmission CRUD
  let testFormId: string
  await runTest('FormSubmission - Create', async () => {
    const form = await prisma.formSubmission.create({
      data: {
        type: 'CONTACT',
        data: {
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message',
        },
        status: 'NEW',
      },
    })
    testFormId = form.id
    return form
  })
  
  await runTest('FormSubmission - Update Status', async () => {
    const form = await prisma.formSubmission.update({
      where: { id: testFormId },
      data: { status: 'PROCESSED' },
    })
    return form
  })
  
  // File CRUD
  let testFileId: string
  await runTest('File - Create', async () => {
    const file = await prisma.file.create({
      data: {
        filename: 'Test Document.pdf',
        storedFilename: 'test-file.pdf',
        url: 'https://example.com/test-file.pdf',
        size: 1024000,
        mimeType: 'application/pdf',
        type: 'DOCUMENT',
        uploadedById: testUserId,
      },
    })
    testFileId = file.id
    return file
  })
  
  // Cleanup
  await runTest('Cleanup Test Data', async () => {
    await prisma.file.delete({ where: { id: testFileId } })
    await prisma.formSubmission.delete({ where: { id: testFormId } })
    await prisma.content.delete({ where: { id: testContentId } })
    await prisma.user.delete({ where: { id: testUserId } })
    return { cleaned: true }
  })
}

// 3. DATA RELATIONSHIPS AND CONSTRAINTS
async function testRelationshipsAndConstraints() {
  console.log(chalk.blue('\n=== DATA RELATIONSHIPS AND CONSTRAINTS ===\n'))
  
  await runTest('Foreign Key Constraint - Content Author', async () => {
    try {
      await prisma.content.create({
        data: {
          type: 'NEWS',
          title: 'Invalid Author Test',
          slug: 'invalid-author-test',
          content: 'Test',
          authorId: 'non-existent-id',
        },
      })
      throw new Error('Should have failed with foreign key constraint')
    } catch (error) {
      if (error instanceof Error && error.message.includes('Foreign key constraint')) {
        return { constraintWorking: true }
      }
      throw error
    }
  })
  
  await runTest('Unique Constraint - User Email', async () => {
    const email = `unique-test-${Date.now()}@example.com`
    await prisma.user.create({
      data: { email, name: 'User 1' },
    })
    
    try {
      await prisma.user.create({
        data: { email, name: 'User 2' },
      })
      throw new Error('Should have failed with unique constraint')
    } catch (error) {
      if (error instanceof Error && error.message.includes('Unique constraint')) {
        return { constraintWorking: true }
      }
      throw error
    } finally {
      await prisma.user.deleteMany({ where: { email } })
    }
  })
  
  await runTest('Cascade Delete - User Accounts', async () => {
    const user = await prisma.user.create({
      data: {
        email: `cascade-test-${Date.now()}@example.com`,
        name: 'Cascade Test',
        accounts: {
          create: {
            type: 'oauth',
            provider: 'google',
            providerAccountId: 'test-123',
          },
        },
      },
      include: { accounts: true },
    })
    
    const accountCount = user.accounts.length
    await prisma.user.delete({ where: { id: user.id } })
    
    const orphanedAccounts = await prisma.account.findMany({
      where: { userId: user.id },
    })
    
    return { 
      accountsCreated: accountCount,
      orphanedAccounts: orphanedAccounts.length,
      cascadeWorking: orphanedAccounts.length === 0,
    }
  })
}

// 4. TRANSACTION AND CONCURRENCY TESTING
async function testTransactionsAndConcurrency() {
  console.log(chalk.blue('\n=== TRANSACTION AND CONCURRENCY TESTING ===\n'))
  
  await runTest('Transaction - Rollback on Error', async () => {
    const email = `transaction-test-${Date.now()}@example.com`
    
    try {
      await prisma.$transaction(async (tx) => {
        await tx.user.create({
          data: { email, name: 'Transaction Test' },
        })
        
        // Force an error
        throw new Error('Intentional rollback')
      })
    } catch (error) {
      // Transaction should have rolled back
    }
    
    const user = await prisma.user.findUnique({ where: { email } })
    return { userCreated: user !== null, rollbackWorking: user === null }
  })
  
  await runTest('Transaction - Multiple Operations', async () => {
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: `multi-tx-${Date.now()}@example.com`,
          name: 'Multi Transaction',
        },
      })
      
      const content = await tx.content.create({
        data: {
          type: 'NEWS',
          title: 'Transaction Content',
          slug: `tx-content-${Date.now()}`,
          content: 'Created in transaction',
          authorId: user.id,
        },
      })
      
      const log = await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'CREATE_CONTENT',
          resource: `content:${content.id}`,
        },
      })
      
      return { user, content, log }
    })
    
    // Cleanup
    await prisma.auditLog.delete({ where: { id: result.log.id } })
    await prisma.content.delete({ where: { id: result.content.id } })
    await prisma.user.delete({ where: { id: result.user.id } })
    
    return { operationsCompleted: 3 }
  })
  
  await runTest('Concurrent Writes - Race Condition Test', async () => {
    const user = await prisma.user.create({
      data: {
        email: `concurrent-${Date.now()}@example.com`,
        name: 'Initial Name',
      },
    })
    
    // Simulate concurrent updates
    const updates = await Promise.allSettled([
      prisma.user.update({
        where: { id: user.id },
        data: { name: 'Update 1' },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { name: 'Update 2' },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { name: 'Update 3' },
      }),
    ])
    
    const finalUser = await prisma.user.findUnique({ where: { id: user.id } })
    await prisma.user.delete({ where: { id: user.id } })
    
    return {
      concurrentUpdates: updates.length,
      successfulUpdates: updates.filter(u => u.status === 'fulfilled').length,
      finalName: finalUser?.name,
    }
  })
}

// 5. QUERY PERFORMANCE ANALYSIS
async function testQueryPerformance() {
  console.log(chalk.blue('\n=== QUERY PERFORMANCE ANALYSIS ===\n'))
  
  // Create test data
  const testUsers = await Promise.all(
    Array.from({ length: 50 }, (_, i) => 
      prisma.user.create({
        data: {
          email: `perf-test-${i}-${Date.now()}@example.com`,
          name: `Performance Test User ${i}`,
        },
      })
    )
  )
  
  const testContents = await Promise.all(
    testUsers.slice(0, 20).map((user, i) =>
      prisma.content.create({
        data: {
          type: 'NEWS',
          title: `Performance Test Article ${i}`,
          slug: `perf-test-${i}-${Date.now()}`,
          content: 'Lorem ipsum '.repeat(100),
          authorId: user.id,
        },
      })
    )
  )
  
  await runTest('Complex Query - Join Performance', async () => {
    const start = performance.now()
    const results = await prisma.content.findMany({
      where: {
        status: 'DRAFT',
        author: {
          role: 'USER',
        },
      },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    })
    const duration = performance.now() - start
    
    return {
      recordsReturned: results.length,
      queryTime: duration,
      performanceStatus: duration < 100 ? 'good' : duration < 500 ? 'acceptable' : 'slow',
    }
  })
  
  await runTest('N+1 Query Detection', async () => {
    // Bad pattern - N+1 query
    const badStart = performance.now()
    const users = await prisma.user.findMany({ take: 10 })
    const contentsWithN1 = await Promise.all(
      users.map(user => 
        prisma.content.findMany({ where: { authorId: user.id } })
      )
    )
    const badDuration = performance.now() - badStart
    
    // Good pattern - single query with include
    const goodStart = performance.now()
    const usersWithContents = await prisma.user.findMany({
      take: 10,
      include: {
        contents: true,
      },
    })
    const goodDuration = performance.now() - goodStart
    
    return {
      n1QueryTime: badDuration,
      optimizedQueryTime: goodDuration,
      improvement: `${((badDuration - goodDuration) / badDuration * 100).toFixed(2)}%`,
    }
  })
  
  await runTest('Pagination Performance', async () => {
    const pageSizes = [10, 50, 100]
    const results = []
    
    for (const pageSize of pageSizes) {
      const start = performance.now()
      await prisma.user.findMany({
        take: pageSize,
        skip: 0,
        orderBy: { createdAt: 'desc' },
      })
      const duration = performance.now() - start
      results.push({ pageSize, duration })
    }
    
    return results
  })
  
  await runTest('Aggregation Query Performance', async () => {
    const start = performance.now()
    const aggregation = await prisma.content.groupBy({
      by: ['type', 'status'],
      _count: {
        id: true,
      },
    })
    const duration = performance.now() - start
    
    return {
      groups: aggregation.length,
      queryTime: duration,
    }
  })
  
  await runTest('Full-text Search Performance', async () => {
    const searchTerm = 'Performance'
    const start = performance.now()
    const results = await prisma.content.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm } },
          { content: { contains: searchTerm } },
        ],
      },
    })
    const duration = performance.now() - start
    
    return {
      resultsFound: results.length,
      queryTime: duration,
      recommendation: duration > 100 ? 'Consider implementing full-text search index' : 'Performance acceptable',
    }
  })
  
  // Cleanup test data
  await prisma.content.deleteMany({ 
    where: { id: { in: testContents.map(c => c.id) } } 
  })
  await prisma.user.deleteMany({ 
    where: { id: { in: testUsers.map(u => u.id) } } 
  })
}

// 6. DATABASE HEALTH AND OPTIMIZATION
async function testDatabaseHealth() {
  console.log(chalk.blue('\n=== DATABASE HEALTH AND OPTIMIZATION ===\n'))
  
  await runTest('Database Size Analysis', async () => {
    const result = await prisma.$queryRaw`
      SELECT 
        page_count * page_size as size,
        page_count,
        page_size
      FROM pragma_page_count(), pragma_page_size();
    `
    return result
  })
  
  await runTest('Table Statistics', async () => {
    const tables = ['User', 'Content', 'FormSubmission', 'File', 'AuditLog']
    const stats = []
    
    for (const table of tables) {
      const count = await (prisma as any)[table.toLowerCase()].count()
      stats.push({ table, count })
    }
    
    return stats
  })
  
  await runTest('Index Usage Analysis', async () => {
    const indexes = await prisma.$queryRaw`
      SELECT 
        name,
        tbl_name as table_name,
        sql
      FROM sqlite_master 
      WHERE type = 'index' AND name NOT LIKE 'sqlite_%';
    `
    return indexes
  })
  
  await runTest('Vacuum Database', async () => {
    await prisma.$executeRaw`VACUUM;`
    return { vacuumed: true }
  })
}

// Generate comprehensive report
function generateReport() {
  console.log(chalk.blue('\n=== DATABASE VALIDATION REPORT ===\n'))
  
  const passed = results.filter(r => r.status === 'pass').length
  const failed = results.filter(r => r.status === 'fail').length
  const warnings = results.filter(r => r.status === 'warning').length
  
  console.log(chalk.bold('Summary:'))
  console.log(chalk.green(`  ✓ Passed: ${passed}`))
  console.log(chalk.red(`  ✗ Failed: ${failed}`))
  console.log(chalk.yellow(`  ⚠ Warnings: ${warnings}`))
  console.log(`  Total Tests: ${results.length}`)
  
  console.log(chalk.bold('\nPerformance Metrics:'))
  const avgDuration = results.reduce((sum, r) => sum + r.duration, 0) / results.length
  console.log(`  Average Test Duration: ${avgDuration.toFixed(2)}ms`)
  
  const slowTests = results.filter(r => r.duration > 500).sort((a, b) => b.duration - a.duration)
  if (slowTests.length > 0) {
    console.log(chalk.yellow('\nSlow Tests (>500ms):'))
    slowTests.slice(0, 5).forEach(test => {
      console.log(`  - ${test.name}: ${test.duration.toFixed(2)}ms`)
    })
  }
  
  const failedTests = results.filter(r => r.status === 'fail')
  if (failedTests.length > 0) {
    console.log(chalk.red('\nFailed Tests:'))
    failedTests.forEach(test => {
      console.log(`  - ${test.name}: ${test.error}`)
    })
  }
  
  console.log(chalk.bold('\nRecommendations:'))
  
  // Performance recommendations
  if (avgDuration > 100) {
    console.log(chalk.yellow('  - Consider implementing query result caching'))
  }
  
  // SQLite specific recommendations
  console.log(chalk.yellow('  - Current database is SQLite. For production, consider migrating to PostgreSQL for:'))
  console.log('    • Better concurrent write performance')
  console.log('    • Full-text search capabilities')
  console.log('    • Better JSON field support')
  console.log('    • Connection pooling')
  
  // Backup recommendations
  console.log(chalk.yellow('  - Implement regular backup strategy:'))
  console.log('    • Daily automated backups')
  console.log('    • Point-in-time recovery capability')
  console.log('    • Test restore procedures regularly')
}

// Main execution
async function main() {
  console.log(chalk.bold.blue('Starting Database Validation...\n'))
  
  try {
    await testDatabaseConnection()
    await testCRUDOperations()
    await testRelationshipsAndConstraints()
    await testTransactionsAndConcurrency()
    await testQueryPerformance()
    await testDatabaseHealth()
    
    generateReport()
  } catch (error) {
    console.error(chalk.red('Fatal error during validation:'), error)
  } finally {
    await prisma.$disconnect()
  }
}

// Run if executed directly
if (require.main === module) {
  main().catch(console.error)
}

export { main as validateDatabase }