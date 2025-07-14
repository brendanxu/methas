# South Pole 网站项目 - Claude Code 开发背景

## 📊 项目概览
- **项目名称**: South Pole 官方网站
- **技术栈**: Next.js 15.3.5 + TypeScript + Tailwind CSS + Ant Design
- **当前状态**: 前端核心功能完成，准备开发后端管理功能
- **部署**: Vercel (performance-optimizations分支)

## 🏆 已完成的核心成果

### ✅ Bundle Size 优化 (主要成就)
- **前**: 2.27MB (超出目标4.5倍)
- **后**: 最大438KB (达成500KB目标)
- **减少率**: 83% bundle size优化
- **技术方案**: 移除Framer Motion、优化Ant Design树摇、高级代码分割

### ✅ 性能优化模块实施
1. **指令5-1**: Google Analytics 4 + Web Vitals监控系统
2. **指令5-2**: Sentry错误跟踪 + 统一日志系统  
3. **指令5-3**: WCAG 2.1无障碍访问增强
4. **指令4**: SEO优化 + 结构化数据
5. **指令3**: 响应式设计 + 移动端优化

### ✅ 部署稳定性
- **解决**: Vercel 500错误 (MIDDLEWARE_INVOCATION_FAILED)
- **方案**: 移除复杂中间件，暂时禁用i18n SSR
- **结果**: 部署成功，所有页面正常运行

## 🔧 技术架构现状

### 前端架构
```
src/
├── app/                 # Next.js 15 App Router
│   ├── layout.tsx      # 根布局，主题/providers
│   ├── page.tsx        # 首页
│   ├── HomeContent.tsx # 首页内容组件
│   └── providers.tsx   # 主题/Antd/错误边界
├── components/
│   ├── sections/       # 页面区块组件
│   ├── forms/         # 表单组件
│   ├── ui/            # 基础UI组件
│   └── layouts/       # 布局组件
├── lib/
│   ├── seo-config.ts  # SEO配置
│   ├── optimized-imports.ts # 轻量化导入
│   └── dynamic-imports.tsx  # 动态加载
└── styles/            # 主题和样式
```

### 关键配置文件
- `next.config.js`: 优化的webpack配置，树摇设置
- `tailwind.config.ts`: 自定义主题配置
- `package.json`: 优化的依赖，移除了framer-motion

## 🚨 重要技术决策记录

### 已移除的功能 (临时)
1. **中间件** - 完全删除src/middleware.ts，避免Vercel Edge Function问题
2. **i18n** - 暂时禁用服务端国际化，避免SSR初始化错误
3. **Framer Motion** - 替换为轻量CSS动画

### 核心原则
- **质量优先**: "任何优化都要服务于整体项目质量"
- **稳定部署**: 优先保证生产环境可用性
- **性能目标**: Bundle size < 500KB

## 🎯 下一阶段开发计划

### 立即开始: 后端管理功能开发

#### 技术栈选择
```typescript
Backend: Next.js API Routes
Database: Vercel Postgres / Supabase  
ORM: Prisma
Auth: NextAuth.js
Email: SendGrid (已配置)
Storage: Vercel Blob
```

#### 核心功能模块
1. **内容管理系统 (CMS)**
   - 新闻管理 (CRUD)
   - 案例研究管理
   - 服务内容管理
   - 文件上传

2. **用户管理**
   - NextAuth.js认证
   - 管理员权限控制
   - 操作日志审计

3. **表单处理**
   - 联系表单数据存储
   - 邮件通知集成
   - CRM数据同步

4. **分析Dashboard**
   - GA4数据聚合
   - 自定义指标显示
   - 性能监控面板

### 数据库Schema (初步设计)
```sql
-- 用户表
users (id, email, name, role, created_at)
-- 内容表  
contents (id, type, title, content, author_id, status, created_at)
-- 表单提交
form_submissions (id, type, data, created_at)
-- 文件管理
files (id, filename, url, size, type, created_at)
```

## 🏗️ 开发环境设置

### 必要命令
```bash
# 开发服务器
pnpm dev

# 构建检查
pnpm build

# 代码质量
pnpm lint
pnpm type-check

# Git工作流
git checkout performance-optimizations
git pull origin performance-optimizations
```

### 环境变量 (参考.env.example)
```
NEXTAUTH_SECRET=xxx
DATABASE_URL=xxx  
SENDGRID_API_KEY=xxx
NEXT_PUBLIC_SITE_URL=https://southpole.com
```

## 📝 重要文件路径

### 核心配置
- `/next.config.js` - Webpack优化配置
- `/src/app/layout.tsx` - 根布局
- `/src/app/providers.tsx` - 全局Provider设置
- `/src/lib/seo-config.ts` - SEO配置

### 样式系统
- `/src/styles/ant-theme.ts` - Ant Design主题
- `/tailwind.config.ts` - Tailwind自定义配置
- `/src/app/globals.css` - 全局样式

## 🎨 设计系统

### 主题色彩
```typescript
colors: {
  primary: '#002145',    // South Pole蓝
  secondary: '#00A651',  // 环保绿  
  warning: '#F5A623',    // 警告橙
  error: '#D0021B',      // 错误红
  success: '#50E3C2'     // 成功青
}
```

### 组件规范
- 使用 `@/components/ui/` 基础组件
- Ant Design + 自定义主题
- 响应式设计优先
- 无障碍访问WCAG 2.1标准

## 🚀 部署信息
- **主分支**: `performance-optimizations`
- **部署平台**: Vercel
- **域名**: 待配置
- **CDN**: Vercel Edge Network
- **监控**: Sentry + GA4

## ⚠️ 已知技术债务
1. 需要重新实现简化版国际化系统
2. 缺少后端数据管理功能
3. 表单数据目前仅发送邮件，无存储
4. 需要建设内容管理界面

## 🔄 持续集成
- 自动化测试: 待实施
- 代码质量检查: ESLint + TypeScript
- 部署流程: Git push → Vercel自动部署

---

**使用说明**: 
在新的Claude Code窗口中，直接引用此文档即可快速了解项目现状，开始后端开发工作。所有重要的技术决策、架构信息和开发背景都已包含在内。