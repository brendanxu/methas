import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 开始种子数据初始化...')

  // 创建初始管理员用户
  const adminPassword = await bcrypt.hash('admin123456', 12)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@southpole.com' },
    update: {},
    create: {
      email: 'admin@southpole.com',
      name: 'South Pole Admin',
      password: adminPassword,
      role: 'SUPER_ADMIN',
    },
  })

  console.log('✅ 创建管理员用户:', { email: admin.email, role: admin.role })

  // 创建其他测试用户
  const editorPassword = await bcrypt.hash('editor123456', 12)
  const userPassword = await bcrypt.hash('user123456', 12)

  const editor = await prisma.user.upsert({
    where: { email: 'editor@southpole.com' },
    update: {},
    create: {
      email: 'editor@southpole.com',
      name: '内容编辑',
      password: editorPassword,
      role: 'ADMIN',
    },
  })

  const normalUser = await prisma.user.upsert({
    where: { email: 'user@southpole.com' },
    update: {},
    create: {
      email: 'user@southpole.com',
      name: '普通用户',
      password: userPassword,
      role: 'USER',
    },
  })

  console.log('✅ 创建测试用户:', { 
    editor: { email: editor.email, role: editor.role },
    user: { email: normalUser.email, role: normalUser.role }
  })

  // 创建示例内容
  const contents = [
      {
        type: 'NEWS' as const,
        title: '南极碳中和项目最新进展',
        slug: 'carbon-neutral-project-update',
        content: `# 南极碳中和项目最新进展

我们很高兴地宣布，南极碳中和项目取得了重大突破。通过创新的碳捕获技术，我们已经成功减少了30%的碳排放。

## 主要成果

- **碳减排**: 累计减少碳排放50万吨
- **技术创新**: 开发了3项专利技术
- **合作伙伴**: 与20家企业建立合作关系

这一成果标志着我们在应对气候变化方面迈出了重要一步。`,
        excerpt: '南极碳中和项目取得重大突破，累计减少碳排放50万吨',
        status: 'PUBLISHED' as const,
        authorId: admin.id,
        tags: JSON.stringify(['碳中和', '环保', '技术创新']),
      },
      {
        type: 'CASE_STUDY' as const,
        title: '制造业碳足迹管理案例研究',
        slug: 'manufacturing-carbon-footprint-case-study',
        content: `# 制造业碳足迹管理案例研究

本案例研究展示了我们如何帮助一家大型制造企业实现碳足迹管理的数字化转型。

## 项目背景

客户是一家年产值10亿的制造企业，面临的主要挑战包括：
- 碳排放数据分散
- 缺乏统一管理平台
- 难以制定有效的减排策略

## 解决方案

我们为客户提供了全面的碳足迹管理解决方案...`,
        excerpt: '帮助制造企业实现碳足迹管理数字化转型的成功案例',
        status: 'PUBLISHED' as const,
        authorId: editor.id,
        tags: JSON.stringify(['案例研究', '制造业', '碳足迹']),
      },
      {
        type: 'SERVICE' as const,
        title: '企业碳中和咨询服务',
        slug: 'corporate-carbon-neutral-consulting',
        content: `# 企业碳中和咨询服务

我们为企业提供全方位的碳中和咨询服务，帮助企业制定和实施可持续发展战略。

## 服务内容

### 1. 碳足迹评估
- 全面的碳排放盘查
- 识别减排机会
- 制定减排路线图

### 2. 碳中和策略制定
- 基于科学的减排目标设定
- 碳中和路径规划
- 政策合规指导

### 3. 实施支持
- 项目管理支持
- 技术解决方案
- 持续监测和优化`,
        excerpt: '专业的企业碳中和咨询服务，助力企业实现可持续发展目标',
        status: 'PUBLISHED' as const,
        authorId: editor.id,
        tags: JSON.stringify(['咨询服务', '碳中和', '企业服务']),
      },
      {
        type: 'NEWS' as const,
        title: '2024年碳排放数据报告发布',
        slug: '2024-carbon-emission-report',
        content: `# 2024年碳排放数据报告发布

根据最新统计数据，2024年全球碳排放量继续呈现下降趋势...`,
        excerpt: '2024年碳排放数据显示环保政策效果显著',
        status: 'DRAFT' as const,
        authorId: normalUser.id,
        tags: JSON.stringify(['数据报告', '碳排放', '2024']),
      }
    ]

  // 逐个创建内容，避免重复
  let createdCount = 0
  for (const content of contents) {
    try {
      await prisma.content.create({ data: content })
      createdCount++
    } catch (error) {
      // 忽略重复创建错误
      console.log(`⚠️ 内容已存在: ${content.title}`)
    }
  }

  console.log('✅ 创建示例内容:', createdCount, '篇')

  // 创建示例表单提交
  const submissions = [
      {
        type: 'CONTACT' as const,
        data: {
          name: '张三',
          email: 'zhangsan@example.com',
          company: '绿色科技有限公司',
          message: '希望了解贵公司的碳中和解决方案',
          subject: '碳中和咨询'
        },
        status: 'NEW' as const,
      },
      {
        type: 'CONSULTATION' as const,
        data: {
          name: '李四',
          email: 'lisi@example.com',
          company: '环保制造集团',
          industry: '制造业',
          projectType: '碳足迹管理',
          budget: '100万-500万',
          description: '需要建立企业级碳足迹管理系统'
        },
        status: 'NEW' as const,
      },
      {
        type: 'NEWSLETTER' as const,
        data: {
          email: 'newsletter@example.com',
          preferences: ['技术创新', '政策解读', '案例分享']
        },
        status: 'NEW' as const,
      }
    ]

  // 逐个创建表单提交
  let submissionCount = 0
  for (const submission of submissions) {
    try {
      await prisma.formSubmission.create({ data: submission })
      submissionCount++
    } catch (error) {
      console.log(`⚠️ 表单提交已存在`)
    }
  }

  console.log('✅ 创建示例表单提交:', submissionCount, '个')

  console.log('🎉 种子数据初始化完成!')
  console.log('')
  console.log('👥 用户账号信息:')
  console.log('📧 超级管理员: admin@southpole.com / admin123456')
  console.log('📧 管理员: editor@southpole.com / editor123456')
  console.log('📧 普通用户: user@southpole.com / user123456')
  console.log('')
  console.log('🔗 访问地址:')
  console.log('- 前端首页: http://localhost:3000')
  console.log('- 管理后台: http://localhost:3000/admin')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })