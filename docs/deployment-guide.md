# South Pole 官网部署指南

## 快速部署

### 1. Vercel 部署（推荐）

1. **连接 GitHub 仓库**
   ```bash
   # 推送代码到 GitHub
   git remote add origin https://github.com/your-org/southpole-official.git
   git push -u origin main
   ```

2. **在 Vercel 中导入项目**
   - 访问 [vercel.com](https://vercel.com)
   - 点击 "New Project"
   - 选择 GitHub 仓库
   - 配置环境变量（见下方）

3. **设置环境变量**
   ```
   NODE_ENV=production
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   SENDGRID_API_KEY=your_sendgrid_key
   SENDGRID_FROM_EMAIL=noreply@your-domain.com
   CONTACT_EMAIL=contact@your-domain.com
   JWT_SECRET=your_secure_jwt_secret_32chars
   ```

4. **配置域名**
   - 在 Vercel 项目设置中添加自定义域名
   - 更新 DNS 记录指向 Vercel

### 2. Netlify 部署

1. **部署到 Netlify**
   ```bash
   npm run build
   npm install -g netlify-cli
   netlify login
   netlify init
   netlify deploy --prod
   ```

2. **环境变量配置**
   - 在 Netlify 控制台中设置环境变量
   - 配置构建命令: `npm run build`
   - 发布目录: `.next`

### 3. Docker 部署

1. **构建 Docker 镜像**
   ```bash
   docker build -t southpole-official .
   ```

2. **运行容器**
   ```bash
   docker run -p 3000:3000 \
     -e NODE_ENV=production \
     -e NEXT_PUBLIC_SITE_URL=https://your-domain.com \
     southpole-official
   ```

3. **使用 Docker Compose**
   ```yaml
   # docker-compose.yml
   version: '3.8'
   services:
     app:
       build: .
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
         - NEXT_PUBLIC_SITE_URL=https://your-domain.com
       env_file:
         - .env.production
   ```

## 环境配置

### 必需环境变量

| 变量名 | 描述 | 示例 |
|--------|------|------|
| `NODE_ENV` | 运行环境 | `production` |
| `NEXT_PUBLIC_SITE_URL` | 网站URL | `https://southpole.com` |
| `CONTACT_EMAIL` | 联系邮箱 | `contact@southpole.com` |

### 邮件服务配置

**使用 SendGrid:**
```env
SENDGRID_API_KEY=SG.xxxxx
SENDGRID_FROM_EMAIL=noreply@southpole.com
```

**使用 SMTP:**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 数据库配置

**PostgreSQL:**
```env
DATABASE_URL=postgresql://user:password@localhost:5432/southpole
```

**MongoDB:**
```env
DATABASE_URL=mongodb://user:password@localhost:27017/southpole
```

### 监控和分析

```env
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Sentry 错误追踪
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx

# DataDog 监控
DATADOG_API_KEY=your_datadog_key
```

## 生产环境检查清单

### 安全配置
- [ ] 设置强JWT密钥
- [ ] 配置HTTPS
- [ ] 启用安全头部
- [ ] 设置CORS策略
- [ ] 配置内容安全策略(CSP)

### 性能优化
- [ ] 启用图片优化
- [ ] 配置CDN
- [ ] 设置缓存策略
- [ ] 启用压缩
- [ ] 配置负载均衡

### 监控和日志
- [ ] 配置错误监控
- [ ] 设置性能监控
- [ ] 启用访问日志
- [ ] 配置健康检查
- [ ] 设置告警规则

### 备份和恢复
- [ ] 配置数据库备份
- [ ] 设置代码备份
- [ ] 测试恢复流程
- [ ] 文档化恢复步骤

## 常见问题

### 构建错误

**Error: 模块未找到**
```bash
# 清理并重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

**TypeScript 错误**
```bash
# 检查类型
npm run type-check
```

### 运行时错误

**API 调用失败**
- 检查环境变量配置
- 确认网络连接
- 查看服务器日志

**表单提交失败**
- 检查邮件服务配置
- 确认数据库连接
- 检查安全设置

### 性能问题

**页面加载缓慢**
- 检查图片优化
- 确认CDN配置
- 分析网络请求

**API 响应慢**
- 检查数据库查询
- 确认缓存策略
- 分析服务器资源

## 维护指南

### 定期维护任务

1. **更新依赖**
   ```bash
   npm update
   npm audit fix
   ```

2. **清理日志**
   ```bash
   # 清理应用日志
   find ./logs -name "*.log" -mtime +30 -delete
   ```

3. **数据库维护**
   ```bash
   # PostgreSQL VACUUM
   psql -d southpole -c "VACUUM ANALYZE;"
   ```

### 监控指标

- CPU 使用率 < 80%
- 内存使用率 < 85%
- 磁盘使用率 < 90%
- 响应时间 < 2秒
- 错误率 < 1%

### 告警规则

- API 错误率 > 5%
- 页面加载时间 > 5秒
- 服务不可用 > 1分钟
- 磁盘空间 < 10%

## 支持和联系

如果在部署过程中遇到问题，请联系：

- 技术支持: tech@southpole.com
- 文档: [内部文档链接]
- 应急联系: [应急联系方式]