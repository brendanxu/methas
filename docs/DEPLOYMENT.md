# South Pole 网站 - 生产环境部署指南

## 📋 部署前检查清单

### ✅ 必需配置
- [ ] 数据库配置 (PostgreSQL)
- [ ] 邮件服务配置 (SendGrid)
- [ ] 身份验证密钥
- [ ] 基础站点配置

### ✅ 推荐配置
- [ ] 分析服务 (Google Analytics)
- [ ] 错误跟踪 (Sentry)
- [ ] 验证码服务 (reCAPTCHA)
- [ ] CDN配置

### ✅ 安全配置
- [ ] CSRF保护
- [ ] 限流设置
- [ ] 环境变量验证

## 🔧 详细配置指南

### 1. 数据库配置 (PostgreSQL)

#### Vercel Postgres (推荐)
```bash
# 在Vercel Dashboard中创建Postgres数据库
# 获取连接字符串并配置：
DATABASE_URL=postgres://default:xxxxx@xxx-pooler.us-east-1.postgres.vercel-storage.com/verceldb?sslmode=require
```

#### 其他PostgreSQL服务
```bash
# Supabase
DATABASE_URL=postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres

# AWS RDS
DATABASE_URL=postgresql://username:password@xxxxx.amazonaws.com:5432/southpole

# Railway
DATABASE_URL=postgresql://postgres:password@containers-us-west-xxx.railway.app:5432/railway
```

### 2. 邮件服务配置 (SendGrid)

#### 获取SendGrid API密钥
1. 访问 [SendGrid](https://sendgrid.com/)
2. 创建账户并验证域名
3. 生成API密钥

```bash
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@southpole.com
SENDGRID_FROM_NAME="South Pole"

# 收件人配置
CONTACT_EMAIL=contact@southpole.com
NEWSLETTER_EMAIL=newsletter@southpole.com
DOWNLOAD_EMAIL=downloads@southpole.com
```

### 3. 站点基础配置

```bash
# 生产环境URL
NEXT_PUBLIC_SITE_URL=https://southpole.com
NEXT_PUBLIC_SITE_NAME="South Pole"
NEXT_PUBLIC_SITE_DESCRIPTION="Leading climate solutions provider helping organizations achieve carbon neutrality"

# NextAuth配置
NEXTAUTH_URL=https://southpole.com
NEXTAUTH_SECRET=你的超级安全密钥-至少32位字符
```

### 4. 分析和监控

#### Google Analytics 4
```bash
# 在Google Analytics中创建GA4属性
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### Sentry错误跟踪
```bash
# 在Sentry中创建项目
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
NEXT_PUBLIC_SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

### 5. 安全配置

#### 验证码 (reCAPTCHA)
```bash
# 在Google reCAPTCHA中创建站点
RECAPTCHA_SITE_KEY=6LcxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxX
RECAPTCHA_SECRET_KEY=6LcxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxX
```

#### 安全密钥
```bash
# CSRF保护
CSRF_SECRET=生成一个随机的32位字符串

# 限流配置
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60000
```

### 6. 性能优化

```bash
# CDN配置 (可选)
NEXT_PUBLIC_IMAGE_CDN_URL=https://cdn.southpole.com

# 缓存TTL设置
CACHE_TTL_SHORT=300      # 5分钟
CACHE_TTL_MEDIUM=3600    # 1小时  
CACHE_TTL_LONG=86400     # 24小时

# 构建优化
NEXT_TELEMETRY_DISABLED=1
ANALYZE_BUNDLE=false
```

## 🚀 Vercel部署步骤

### 1. 准备工作
```bash
# 确保代码已推送到GitHub
git add .
git commit -m "Ready for production deployment"
git push origin performance-optimizations
```

### 2. Vercel配置
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 导入GitHub仓库
4. 配置项目设置：
   - Framework Preset: `Next.js`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

### 3. 环境变量配置
在Vercel项目设置中添加所有环境变量：

```bash
# 复制并修改.env.example中的所有变量
# 确保使用生产环境的实际值
```

### 4. 域名配置
1. 在Vercel项目设置中添加自定义域名
2. 配置DNS记录指向Vercel
3. 等待SSL证书自动生成

### 5. 数据库迁移
```bash
# 在部署后运行数据库迁移
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
```

## 🔍 部署后验证

### 1. 功能测试
- [ ] 首页正常加载
- [ ] 联系表单提交成功
- [ ] 邮件订阅功能正常
- [ ] 管理员登录正常
- [ ] API端点响应正常

### 2. 性能检查
- [ ] Core Web Vitals达标
- [ ] Bundle大小在500KB以内
- [ ] 首次加载时间<3秒
- [ ] SEO优化生效

### 3. 安全验证
- [ ] HTTPS证书正常
- [ ] 安全标头配置正确
- [ ] 限流功能工作
- [ ] 错误跟踪正常

## 🛠️ 常见问题解决

### 数据库连接问题
```bash
# 检查连接字符串格式
# 确保包含SSL模式：?sslmode=require
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

### 邮件发送失败
```bash
# 验证SendGrid API密钥
# 检查发件人邮箱是否已验证
# 确保在SendGrid中验证了域名
```

### 构建失败
```bash
# 检查所有依赖是否正确安装
npm install

# 清理缓存后重新构建  
rm -rf .next
npm run build
```

### 环境变量未生效
```bash
# 确保在Vercel Dashboard中正确设置
# 检查变量名是否正确
# 重新部署项目
```

## 📊 监控和维护

### 1. 错误监控
- Sentry Dashboard: 监控错误日志
- Vercel Analytics: 监控性能指标
- Google Analytics: 监控用户行为

### 2. 性能监控
- Web Vitals监控
- Bundle分析报告
- 数据库性能监控

### 3. 安全监控
- API调用频率监控
- 异常访问模式检测
- 安全漏洞扫描

## 🔄 持续集成

### GitHub Actions工作流
```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel
on:
  push:
    branches: [main, performance-optimizations]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Build project
        run: npm run build
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📞 支持联系

如果在部署过程中遇到问题：
1. 检查本文档的常见问题部分
2. 查看Vercel部署日志
3. 检查Sentry错误报告
4. 联系开发团队

---

**最后更新**: 2025-07-14  
**版本**: v1.0  
**适用环境**: Production