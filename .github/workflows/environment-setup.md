# 🔧 CI/CD Environment Setup Guide

## GitHub Secrets Configuration

为了正确运行 CI/CD 流程，需要在 GitHub Repository Settings > Secrets and variables > Actions 中配置以下环境变量：

### 🚀 Vercel 部署相关
```bash
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_vercel_org_id
VERCEL_PROJECT_ID=your_vercel_project_id
```

### 🌍 应用环境变量
```bash
NEXT_PUBLIC_SITE_URL=https://southpole.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_API_URL=https://api.southpole.com
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENDGRID_API_KEY=SG.your_sendgrid_api_key
```

### 📊 分析和监控
```bash
LHCI_GITHUB_APP_TOKEN=your_lighthouse_ci_token
CODECOV_TOKEN=your_codecov_token
```

### 📢 通知配置
```bash
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/xxx/xxx/xxx
EMAIL_USERNAME=your_notification_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
NOTIFICATION_EMAIL=team@southpole.com
```

### 🔒 安全相关
```bash
GITHUB_TOKEN=automatically_provided_by_github
NODE_AUTH_TOKEN=your_npm_token_if_needed
```

## 🏗️ Vercel 项目配置

### 1. 创建 Vercel 项目
```bash
npx vercel
# 按照提示配置项目
```

### 2. 获取项目信息
```bash
# 获取 ORG ID 和 PROJECT ID
cat .vercel/project.json
```

### 3. 域名配置
在 Vercel Dashboard 中配置：
- Production: `southpole.com`, `www.southpole.com`
- Development: `dev.southpole.com`

## 🚨 Lighthouse CI 配置

### 1. 安装 Lighthouse CI
```bash
npm install -g @lhci/cli
```

### 2. 创建 Lighthouse CI 项目
```bash
lhci wizard
```

### 3. 配置 GitHub App
在 [GitHub Apps](https://github.com/apps/lighthouse-ci) 安装 Lighthouse CI App。

## 📊 Codecov 配置

1. 访问 [Codecov](https://codecov.io/)
2. 使用 GitHub 账号登录
3. 添加 Repository
4. 获取 CODECOV_TOKEN

## 📢 Slack 通知配置

### 1. 创建 Slack App
1. 访问 [Slack API](https://api.slack.com/apps)
2. 创建新应用
3. 启用 Incoming Webhooks
4. 创建 Webhook URL

### 2. 配置 Webhook
```json
{
  "channel": "#deployments",
  "username": "South Pole CI/CD",
  "icon_emoji": ":rocket:"
}
```

## 🔧 本地开发环境配置

### 1. 复制环境变量
```bash
cp .env.example .env.local
```

### 2. 配置本地环境变量
```bash
# .env.local
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_GA_ID=G-LOCAL-DEVELOPMENT
NODE_ENV=development
```

## 🌍 环境分类

### Development (dev branch)
- **URL**: https://dev.southpole.com
- **Purpose**: 开发环境，用于功能测试
- **Auto Deploy**: ✅ 推送到 dev 分支时自动部署

### Preview (Pull Requests)
- **URL**: Dynamic Vercel URLs
- **Purpose**: PR 预览，用于代码审查
- **Auto Deploy**: ✅ 创建 PR 时自动部署

### Production (main branch)
- **URL**: https://southpole.com
- **Purpose**: 生产环境
- **Auto Deploy**: ✅ 合并到 main 分支时自动部署
- **Quality Gates**: 需要通过所有测试和 Lighthouse 检查

## 🔄 部署流程

### 1. 开发流程
```
Feature Branch → dev → Preview → main → Production
```

### 2. 质量检查
- ✅ ESLint 代码检查
- ✅ TypeScript 类型检查
- ✅ 单元测试
- ✅ 构建测试
- ✅ Lighthouse 性能检查
- ✅ 安全扫描

### 3. 自动化部署
- **dev**: 推送时自动部署
- **PR**: 创建时自动部署预览
- **main**: 合并时自动部署生产环境

## 🚨 故障排除

### 构建失败
1. 检查 ESLint 错误
2. 检查 TypeScript 类型错误
3. 检查依赖版本冲突

### 部署失败
1. 检查 Vercel Token 有效性
2. 检查环境变量配置
3. 检查域名配置

### 测试失败
1. 检查测试环境配置
2. 检查依赖安装
3. 检查测试文件路径

## 📚 相关文档

- [Vercel 文档](https://vercel.com/docs)
- [GitHub Actions 文档](https://docs.github.com/en/actions)
- [Lighthouse CI 文档](https://github.com/GoogleChrome/lighthouse-ci)
- [Next.js 部署文档](https://nextjs.org/docs/deployment)