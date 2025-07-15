#!/usr/bin/env tsx

import { PrismaClient } from '@prisma/client'
import chalk from 'chalk'

const prisma = new PrismaClient()

async function main() {
  console.log(chalk.bold.blue('Database Query Test\n'))

  try {
    // 1. Count records in each table
    console.log(chalk.yellow('📊 Table Record Counts:'))
    const counts = await Promise.all([
      prisma.user.count().then(count => ({ table: 'Users', count })),
      prisma.content.count().then(count => ({ table: 'Contents', count })),
      prisma.formSubmission.count().then(count => ({ table: 'Form Submissions', count })),
      prisma.file.count().then(count => ({ table: 'Files', count })),
      prisma.auditLog.count().then(count => ({ table: 'Audit Logs', count })),
      prisma.account.count().then(count => ({ table: 'Accounts', count })),
      prisma.session.count().then(count => ({ table: 'Sessions', count })),
    ])

    counts.forEach(({ table, count }) => {
      console.log(`  ${table}: ${chalk.green(count.toString())}`)
    })

    // 2. Recent activity check
    console.log(chalk.yellow('\n🕐 Recent Activity:'))
    
    const recentUser = await prisma.user.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { email: true, createdAt: true }
    })
    console.log(`  Last user: ${recentUser ? `${recentUser.email} (${recentUser.createdAt.toISOString()})` : 'None'}`)

    const recentContent = await prisma.content.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { title: true, createdAt: true }
    })
    console.log(`  Last content: ${recentContent ? `${recentContent.title} (${recentContent.createdAt.toISOString()})` : 'None'}`)

    const recentForm = await prisma.formSubmission.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { type: true, createdAt: true }
    })
    console.log(`  Last form submission: ${recentForm ? `${recentForm.type} (${recentForm.createdAt.toISOString()})` : 'None'}`)

    // 3. Test a sample query with relations
    console.log(chalk.yellow('\n🔍 Sample Query Test:'))
    
    const contents = await prisma.content.findMany({
      where: { status: 'PUBLISHED' },
      include: {
        author: {
          select: { name: true, email: true }
        }
      },
      take: 5
    })

    if (contents.length > 0) {
      console.log(`  Found ${contents.length} published contents`)
      contents.forEach(content => {
        console.log(`  - "${content.title}" by ${content.author.name || content.author.email}`)
      })
    } else {
      console.log('  No published contents found')
    }

    // 4. Database size check
    console.log(chalk.yellow('\n💾 Database Info:'))
    const dbInfo = await prisma.$queryRaw<any[]>`
      SELECT 
        page_count * page_size / 1024.0 / 1024.0 as size_mb,
        page_count,
        page_size
      FROM pragma_page_count(), pragma_page_size();
    `
    console.log(`  Database size: ${dbInfo[0].size_mb.toFixed(2)} MB`)
    console.log(`  Page count: ${dbInfo[0].page_count}`)

    // 5. Performance test - simple query
    console.log(chalk.yellow('\n⚡ Performance Quick Test:'))
    
    const iterations = 100
    const start = Date.now()
    
    for (let i = 0; i < iterations; i++) {
      await prisma.user.findMany({ take: 10 })
    }
    
    const duration = Date.now() - start
    const avgTime = duration / iterations
    
    console.log(`  ${iterations} queries executed in ${duration}ms`)
    console.log(`  Average query time: ${avgTime.toFixed(2)}ms`)
    console.log(`  Queries per second: ${(1000 / avgTime).toFixed(0)}`)

    // 6. Check for potential issues
    console.log(chalk.yellow('\n⚠️  Potential Issues:'))
    
    // Check for orphaned accounts
    const orphanedAccounts = await prisma.account.findMany({
      where: {
        userId: {
          not: {
            in: await prisma.user.findMany().then(users => users.map(u => u.id))
          }
        }
      }
    })
    
    if (orphanedAccounts.length > 0) {
      console.log(chalk.red(`  - Found ${orphanedAccounts.length} orphaned account records`))
    } else {
      console.log(chalk.green('  - No orphaned records found'))
    }

    // Check for old unprocessed forms
    const oldForms = await prisma.formSubmission.count({
      where: {
        status: 'NEW',
        createdAt: {
          lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days old
        }
      }
    })
    
    if (oldForms > 0) {
      console.log(chalk.yellow(`  - ${oldForms} unprocessed form submissions older than 7 days`))
    }

    console.log(chalk.green('\n✅ Database query test completed successfully!'))

  } catch (error) {
    console.error(chalk.red('❌ Error during database test:'), error)
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(console.error)