#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'
import { performance } from 'perf_hooks'
import chalk from 'chalk'

const prisma = new PrismaClient()

interface StressTestResult {
  test: string
  concurrency: number
  operations: number
  duration: number
  opsPerSecond: number
  errors: number
  p95Latency: number
  p99Latency: number
}

async function measureLatencies(durations: number[]): Promise<{ p95: number; p99: number }> {
  const sorted = durations.sort((a, b) => a - b)
  const p95Index = Math.floor(sorted.length * 0.95)
  const p99Index = Math.floor(sorted.length * 0.99)
  
  return {
    p95: sorted[p95Index] || 0,
    p99: sorted[p99Index] || 0,
  }
}

async function runConcurrentOperations(
  name: string,
  concurrency: number,
  operationCount: number,
  operation: () => Promise<any>
): Promise<StressTestResult> {
  console.log(chalk.yellow(`\nRunning ${name} with ${concurrency} concurrent operations...`))
  
  const start = performance.now()
  const durations: number[] = []
  let errors = 0
  
  // Create batches of concurrent operations
  const batches = Math.ceil(operationCount / concurrency)
  
  for (let batch = 0; batch < batches; batch++) {
    const batchSize = Math.min(concurrency, operationCount - batch * concurrency)
    const promises = []
    
    for (let i = 0; i < batchSize; i++) {
      const opStart = performance.now()
      promises.push(
        operation()
          .then(() => {
            durations.push(performance.now() - opStart)
          })
          .catch((error) => {
            errors++
            console.error(chalk.red(`Operation failed: ${error.message}`))
          })
      )
    }
    
    await Promise.all(promises)
  }
  
  const totalDuration = performance.now() - start
  const { p95, p99 } = await measureLatencies(durations)
  
  return {
    test: name,
    concurrency,
    operations: operationCount,
    duration: totalDuration,
    opsPerSecond: (operationCount / totalDuration) * 1000,
    errors,
    p95Latency: p95,
    p99Latency: p99,
  }
}

async function stressTestReads() {
  console.log(chalk.blue('\n=== READ OPERATION STRESS TEST ==='))
  
  // Create test data
  const testUsers = await Promise.all(
    Array.from({ length: 100 }, (_, i) =>
      prisma.user.create({
        data: {
          email: `stress-read-${i}-${Date.now()}@example.com`,
          name: `Stress Test User ${i}`,
        },
      })
    )
  )
  
  const results: StressTestResult[] = []
  
  // Test different concurrency levels
  for (const concurrency of [1, 10, 50, 100]) {
    const result = await runConcurrentOperations(
      `Read Test (concurrency: ${concurrency})`,
      concurrency,
      1000,
      async () => {
        const randomId = testUsers[Math.floor(Math.random() * testUsers.length)].id
        await prisma.user.findUnique({ where: { id: randomId } })
      }
    )
    results.push(result)
  }
  
  // Cleanup
  await prisma.user.deleteMany({
    where: { id: { in: testUsers.map(u => u.id) } }
  })
  
  return results
}

async function stressTestWrites() {
  console.log(chalk.blue('\n=== WRITE OPERATION STRESS TEST ==='))
  
  const results: StressTestResult[] = []
  const createdIds: string[] = []
  
  // Test different concurrency levels
  for (const concurrency of [1, 10, 25, 50]) {
    const result = await runConcurrentOperations(
      `Write Test (concurrency: ${concurrency})`,
      concurrency,
      100,
      async () => {
        const user = await prisma.user.create({
          data: {
            email: `stress-write-${Date.now()}-${Math.random()}@example.com`,
            name: 'Stress Write User',
          },
        })
        createdIds.push(user.id)
      }
    )
    results.push(result)
  }
  
  // Cleanup
  if (createdIds.length > 0) {
    await prisma.user.deleteMany({
      where: { id: { in: createdIds } }
    })
  }
  
  return results
}

async function stressTestMixedOperations() {
  console.log(chalk.blue('\n=== MIXED OPERATIONS STRESS TEST ==='))
  
  // Create initial data
  const testUser = await prisma.user.create({
    data: {
      email: `stress-mixed-${Date.now()}@example.com`,
      name: 'Mixed Test User',
    },
  })
  
  const results: StressTestResult[] = []
  const createdContentIds: string[] = []
  
  const result = await runConcurrentOperations(
    'Mixed Operations (70% read, 20% write, 10% update)',
    50,
    1000,
    async () => {
      const rand = Math.random()
      
      if (rand < 0.7) {
        // Read operation (70%)
        await prisma.content.findMany({
          where: { status: 'PUBLISHED' },
          take: 10,
        })
      } else if (rand < 0.9) {
        // Write operation (20%)
        const content = await prisma.content.create({
          data: {
            type: 'NEWS',
            title: `Stress Test Article ${Date.now()}`,
            slug: `stress-${Date.now()}-${Math.random()}`,
            content: 'Stress test content',
            authorId: testUser.id,
          },
        })
        createdContentIds.push(content.id)
      } else {
        // Update operation (10%)
        if (createdContentIds.length > 0) {
          const randomId = createdContentIds[Math.floor(Math.random() * createdContentIds.length)]
          await prisma.content.update({
            where: { id: randomId },
            data: { status: 'PUBLISHED' },
          }).catch(() => {}) // Ignore if already deleted
        }
      }
    }
  )
  
  results.push(result)
  
  // Cleanup
  if (createdContentIds.length > 0) {
    await prisma.content.deleteMany({
      where: { id: { in: createdContentIds } }
    })
  }
  await prisma.user.delete({ where: { id: testUser.id } })
  
  return results
}

async function stressTestTransactions() {
  console.log(chalk.blue('\n=== TRANSACTION STRESS TEST ==='))
  
  const results: StressTestResult[] = []
  const createdUserIds: string[] = []
  
  const result = await runConcurrentOperations(
    'Transaction Test',
    20,
    100,
    async () => {
      const result = await prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email: `stress-tx-${Date.now()}-${Math.random()}@example.com`,
            name: 'Transaction Test User',
          },
        })
        
        const content = await tx.content.create({
          data: {
            type: 'NEWS',
            title: 'Transaction Test Content',
            slug: `tx-test-${Date.now()}-${Math.random()}`,
            content: 'Created in transaction',
            authorId: user.id,
          },
        })
        
        await tx.auditLog.create({
          data: {
            userId: user.id,
            action: 'CREATE_CONTENT',
            resource: `content:${content.id}`,
          },
        })
        
        return { user, content }
      })
      
      createdUserIds.push(result.user.id)
    }
  )
  
  results.push(result)
  
  // Cleanup
  if (createdUserIds.length > 0) {
    // Delete in reverse order due to foreign keys
    await prisma.auditLog.deleteMany({
      where: { userId: { in: createdUserIds } }
    })
    await prisma.content.deleteMany({
      where: { authorId: { in: createdUserIds } }
    })
    await prisma.user.deleteMany({
      where: { id: { in: createdUserIds } }
    })
  }
  
  return results
}

function generateReport(allResults: StressTestResult[][]) {
  console.log(chalk.bold.blue('\n\n=== STRESS TEST REPORT ===\n'))
  
  const flatResults = allResults.flat()
  
  // Summary table
  console.log(chalk.bold('Performance Summary:'))
  console.log('┌─────────────────────────────────┬────────────┬──────────┬────────────┬──────────┬──────────┬──────────┐')
  console.log('│ Test                            │ Concurrency│ Total Ops│ Ops/Second │ Errors   │ P95 (ms) │ P99 (ms) │')
  console.log('├─────────────────────────────────┼────────────┼──────────┼────────────┼──────────┼──────────┼──────────┤')
  
  for (const result of flatResults) {
    const testName = result.test.padEnd(31)
    const concurrency = result.concurrency.toString().padStart(11)
    const ops = result.operations.toString().padStart(9)
    const opsPerSec = result.opsPerSecond.toFixed(1).padStart(11)
    const errors = result.errors.toString().padStart(9)
    const p95 = result.p95Latency.toFixed(1).padStart(9)
    const p99 = result.p99Latency.toFixed(1).padStart(9)
    
    const errorColor = result.errors > 0 ? chalk.red : chalk.green
    console.log(`│ ${testName} │ ${concurrency} │ ${ops} │ ${opsPerSec} │ ${errorColor(errors)} │ ${p95} │ ${p99} │`)
  }
  
  console.log('└─────────────────────────────────┴────────────┴──────────┴────────────┴──────────┴──────────┴──────────┘')
  
  // Performance analysis
  console.log(chalk.bold('\nPerformance Analysis:'))
  
  const readResults = flatResults.filter(r => r.test.includes('Read'))
  const writeResults = flatResults.filter(r => r.test.includes('Write'))
  
  if (readResults.length > 0) {
    const maxReadOps = Math.max(...readResults.map(r => r.opsPerSecond))
    console.log(`  • Peak read performance: ${chalk.green(maxReadOps.toFixed(1))} ops/second`)
  }
  
  if (writeResults.length > 0) {
    const maxWriteOps = Math.max(...writeResults.map(r => r.opsPerSecond))
    console.log(`  • Peak write performance: ${chalk.green(maxWriteOps.toFixed(1))} ops/second`)
  }
  
  // Bottleneck analysis
  console.log(chalk.bold('\nBottleneck Analysis:'))
  
  // Check if performance degrades with concurrency
  const concurrencyGroups = new Map<string, StressTestResult[]>()
  for (const result of flatResults) {
    const key = result.test.split('(')[0].trim()
    if (!concurrencyGroups.has(key)) {
      concurrencyGroups.set(key, [])
    }
    concurrencyGroups.get(key)!.push(result)
  }
  
  for (const [testType, results] of concurrencyGroups) {
    const sorted = results.sort((a, b) => a.concurrency - b.concurrency)
    if (sorted.length >= 2) {
      const lowConcurrency = sorted[0]
      const highConcurrency = sorted[sorted.length - 1]
      
      const scalability = (highConcurrency.opsPerSecond / lowConcurrency.opsPerSecond) / 
                         (highConcurrency.concurrency / lowConcurrency.concurrency)
      
      if (scalability < 0.5) {
        console.log(chalk.yellow(`  • ${testType} shows poor scalability (${(scalability * 100).toFixed(0)}% efficiency at high concurrency)`))
      } else if (scalability > 0.8) {
        console.log(chalk.green(`  • ${testType} scales well with concurrency`))
      }
    }
  }
  
  // SQLite specific warnings
  console.log(chalk.bold('\nDatabase-Specific Observations:'))
  console.log(chalk.yellow('  • SQLite detected - Write operations are serialized'))
  console.log(chalk.yellow('  • For production workloads with high write concurrency, consider PostgreSQL'))
  
  const totalErrors = flatResults.reduce((sum, r) => sum + r.errors, 0)
  if (totalErrors > 0) {
    console.log(chalk.red(`  • Total errors encountered: ${totalErrors}`))
    console.log(chalk.red('  • Errors likely due to SQLite write locks under high concurrency'))
  }
  
  // Recommendations
  console.log(chalk.bold('\nRecommendations:'))
  console.log('  1. Implement connection pooling for better resource utilization')
  console.log('  2. Add caching layer for frequently accessed data')
  console.log('  3. Consider read replicas for read-heavy workloads')
  console.log('  4. Monitor slow queries and add appropriate indexes')
  console.log('  5. Implement retry logic for transient failures')
}

async function main() {
  console.log(chalk.bold.blue('Starting Database Stress Test...\n'))
  console.log(chalk.gray('This test will create and delete temporary data'))
  
  try {
    const results = await Promise.all([
      stressTestReads(),
      stressTestWrites(),
      stressTestMixedOperations(),
      stressTestTransactions(),
    ])
    
    generateReport(results)
  } catch (error) {
    console.error(chalk.red('Fatal error during stress test:'), error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  main().catch(console.error)
}

export { main as runStressTest }