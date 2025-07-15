# South Pole API 端点测试清单

## 📋 API 端点完整清单

### 🌐 公共端点 (无需认证)
- [ ] `GET /api/health` - 健康检查
- [ ] `GET /api/public/team` - 团队信息
- [ ] `POST /api/forms/contact` - 联系表单提交
- [ ] `POST /api/forms/newsletter` - 邮件订阅
- [ ] `GET /api/search` - 内容搜索
- [ ] `GET /api/search/suggestions` - 搜索建议
- [ ] `POST /api/newsletter` - 邮件订阅（备用端点）

### 🔐 认证端点
- [ ] `POST /api/auth/register` - 用户注册
- [ ] `GET/POST /api/auth/[...nextauth]` - NextAuth.js 认证

### 👥 用户管理 (管理员权限)
- [ ] `GET /api/users` - 获取用户列表
- [ ] `POST /api/users` - 创建用户
- [ ] `GET /api/users/[id]` - 获取用户详情
- [ ] `PUT /api/users/[id]` - 更新用户
- [ ] `DELETE /api/users/[id]` - 删除用户

### 📝 内容管理 (管理员权限)
- [ ] `GET /api/content` - 获取内容列表
- [ ] `POST /api/content` - 创建内容
- [ ] `GET /api/content/[id]` - 获取内容详情
- [ ] `PUT /api/content/[id]` - 更新内容
- [ ] `DELETE /api/content/[id]` - 删除内容

### 📋 表单管理 (管理员权限)
- [ ] `GET /api/forms` - 获取表单提交列表
- [ ] `POST /api/forms` - 创建表单配置
- [ ] `GET /api/forms/[id]` - 获取表单详情
- [ ] `PUT /api/forms/[id]` - 更新表单状态
- [ ] `DELETE /api/forms/[id]` - 删除表单提交
- [ ] `POST /api/forms/submit` - 通用表单提交
- [ ] `GET /api/forms/download` - 下载表单数据

### 📁 文件管理 (管理员权限)
- [ ] `GET /api/upload` - 获取文件列表
- [ ] `POST /api/upload` - 上传文件
- [ ] `GET /api/upload/[id]` - 获取文件详情
- [ ] `DELETE /api/upload/[id]` - 删除文件

### 🚦 限流管理 (超级管理员权限)
- [ ] `GET /api/admin/rate-limits` - 获取限流配置
- [ ] `POST /api/admin/rate-limits` - 创建/更新限流配置
- [ ] `DELETE /api/admin/rate-limits` - 删除限流配置
- [ ] `GET /api/admin/rate-limits/status` - 获取限流状态
- [ ] `DELETE /api/admin/rate-limits/status` - 重置限流状态

### 📊 数据导出 (管理员权限)
- [ ] `GET /api/admin/exports` - 获取导出历史
- [ ] `POST /api/admin/exports` - 创建数据导出
- [ ] `GET /api/admin/exports/download/[filename]` - 下载导出文件

### 📈 分析和监控 (管理员权限)
- [ ] `GET /api/search/analytics` - 搜索分析数据
- [ ] `POST /api/analytics/vitals` - Web Vitals 数据收集
- [ ] `POST /api/errors` - 错误报告收集
- [ ] `GET /api/logs` - 系统日志查询

## 🧪 测试分类

### 1. 功能性测试
- [ ] 正常请求响应验证
- [ ] 必填字段验证
- [ ] 数据格式验证
- [ ] 业务逻辑验证

### 2. 安全性测试
- [ ] 权限控制验证
- [ ] 输入验证和清理
- [ ] SQL 注入防护
- [ ] XSS 防护
- [ ] CSRF 防护

### 3. 性能测试
- [ ] 响应时间测试
- [ ] 并发请求测试
- [ ] 限流功能测试
- [ ] 大数据量处理

### 4. 错误处理测试
- [ ] 无效请求处理
- [ ] 网络错误处理
- [ ] 服务器错误处理
- [ ] 边界条件测试

## 🔍 检查要点

### 响应格式一致性
所有 API 应返回统一格式：
```json
{
  "success": boolean,
  "data": any,
  "error": string | null,
  "code": string | null,
  "timestamp": string
}
```

### 状态码规范
- `200` - 成功
- `201` - 创建成功
- `400` - 请求错误
- `401` - 未认证
- `403` - 权限不足
- `404` - 资源不存在
- `429` - 请求过于频繁
- `500` - 服务器错误

### 安全头检查
- [ ] `Content-Type` 正确设置
- [ ] `X-Rate-Limit-*` 头存在
- [ ] 敏感信息不在响应中

### 数据库操作验证
- [ ] 事务完整性
- [ ] 外键约束
- [ ] 数据一致性
- [ ] 审计日志记录

## 🐛 常见问题检查

### 数据验证
- [ ] 邮箱格式验证
- [ ] 手机号格式验证
- [ ] 文件类型限制
- [ ] 文件大小限制

### 权限控制
- [ ] 用户角色验证
- [ ] 资源访问权限
- [ ] 操作权限检查
- [ ] 会话有效性

### 错误处理
- [ ] 友好的错误消息
- [ ] 详细的错误日志
- [ ] 错误代码规范
- [ ] 堆栈信息隐藏

### 性能优化
- [ ] 数据库查询优化
- [ ] 响应数据精简
- [ ] 缓存策略
- [ ] 分页实现

## 📊 测试结果记录

| 端点 | 方法 | 状态 | 问题描述 | 修复状态 |
|------|------|------|----------|----------|
| | | | | |

## 🚀 下一步改进

基于测试结果，需要重点关注：
1. [ ] 错误处理统一化
2. [ ] 响应时间优化
3. [ ] 安全漏洞修复
4. [ ] 文档完善
5. [ ] 监控告警配置