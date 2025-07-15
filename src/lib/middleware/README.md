# 权限控制中间件系统

这是一个完整的权限控制和路由保护系统，为 South Pole 网站提供统一的认证、授权和审计功能。

## 📁 文件结构

```
src/lib/middleware/
├── auth.ts                 # 基础认证中间件
├── route-protection.ts     # 路由保护工具
├── examples/
│   └── user-routes.ts     # 使用示例
└── README.md              # 本文档
```

## 🛡️ 权限系统概览

### 1. 权限级别 (Permission Levels)
- `USER` (1) - 普通用户
- `ADMIN` (2) - 管理员  
- `SUPER_ADMIN` (3) - 超级管理员

### 2. 资源权限 (Resource Permissions)
权限按资源类型分组，支持细粒度控制：

```typescript
// 内容管理权限
CONTENT_READ, CONTENT_CREATE, CONTENT_UPDATE, CONTENT_DELETE, CONTENT_PUBLISH

// 用户管理权限  
USER_READ, USER_CREATE, USER_UPDATE_SELF, USER_UPDATE_OTHER, USER_DELETE, USER_CHANGE_ROLE

// 文件管理权限
FILE_UPLOAD, FILE_READ, FILE_DELETE_OWN, FILE_DELETE_ANY, FILE_MANAGE

// 系统管理权限
ADMIN_DASHBOARD, AUDIT_LOGS, SYSTEM_SETTINGS
```

## 🚀 快速开始

### 基础用法

```typescript
import { createProtectedRoute, RouteConfigs } from '@/lib/middleware/route-protection'

// 简单的认证保护
export const GET = createProtectedRoute(
  RouteConfigs.authenticated,
  async (request, { session }) => {
    // 只有登录用户才能访问
    return NextResponse.json({ user: session.user })
  }
)

// 管理员权限保护
export const POST = createProtectedRoute(
  RouteConfigs.adminOnly,
  async (request, { session, permissionChecker }) => {
    // 只有管理员才能访问
    return NextResponse.json({ message: 'Admin access granted' })
  }
)
```

### 权限检查

```typescript
import { createProtectedRoute } from '@/lib/middleware/route-protection'

export const PUT = createProtectedRoute(
  {
    auth: 'CONTENT_UPDATE', // 检查特定权限
    validation: updateContentSchema, // 数据验证
    audit: {
      action: 'UPDATE_CONTENT',
      resource: 'content'
    }
  },
  async (request, { session, validatedData }) => {
    // 自动验证权限和数据
    const content = await updateContent(validatedData)
    return NextResponse.json(content)
  }
)
```

### 数据验证集成

```typescript
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN'])
})

export const POST = createProtectedRoute(
  {
    auth: UserRole.SUPER_ADMIN,
    validation: createUserSchema, // 自动验证请求数据
    audit: {
      action: 'CREATE_USER',
      resource: 'user'
    }
  },
  async (request, { validatedData }) => {
    // validatedData 已经通过验证
    const user = await createUser(validatedData)
    return NextResponse.json(user)
  }
)
```

## 🔧 高级用法

### 自定义权限检查

```typescript
export const DELETE = createProtectedRoute(
  {
    auth: true,
    customPermissionCheck: async (session, request) => {
      // 自定义权限逻辑
      const resourceId = request.url.split('/').pop()
      return await checkResourceOwnership(session.user.id, resourceId)
    }
  },
  async (request, { session }) => {
    // 通过自定义检查的用户才能访问
  }
)
```

### 所有者或管理员权限

```typescript
import { checkUserOwnership } from '@/lib/middleware/route-protection'

export const PUT = createProtectedRoute(
  {
    auth: true,
    customPermissionCheck: async (session, request) => {
      const userId = request.url.split('/').pop()
      return await checkUserOwnership(session.user.id, userId, session.user.role)
    }
  },
  async (request, { session, params }) => {
    // 用户只能修改自己的资源，或管理员可以修改任何资源
  }
)
```

### 完整的 CRUD 路由

```typescript
import { createCRUDRoutes } from '@/lib/middleware/route-protection'

const { GET, POST, PUT, DELETE } = createCRUDRoutes(
  'content',
  {
    list: { auth: 'CONTENT_READ' },
    create: { auth: 'CONTENT_CREATE', validation: createContentSchema },
    update: { auth: 'CONTENT_UPDATE', validation: updateContentSchema },
    delete: { auth: 'CONTENT_DELETE' }
  },
  {
    list: async (request, { session }) => { /* 列表逻辑 */ },
    create: async (request, { validatedData }) => { /* 创建逻辑 */ },
    update: async (request, { validatedData, params }) => { /* 更新逻辑 */ },
    delete: async (request, { params }) => { /* 删除逻辑 */ }
  }
)

export { GET, POST, PUT, DELETE }
```

## 🔍 权限检查器 (Permission Checker)

在路由处理器中可以使用权限检查器进行运行时权限验证：

```typescript
export const GET = createProtectedRoute(
  RouteConfigs.authenticated,
  async (request, { permissionChecker, session }) => {
    // 检查权限
    if (!permissionChecker.hasPermission('CONTENT_READ')) {
      return ApiResponses.forbidden('Cannot read content')
    }
    
    // 检查角色
    if (!permissionChecker.hasMinimumRole(UserRole.ADMIN)) {
      return ApiResponses.forbidden('Admin access required')
    }
    
    // 检查用户管理权限
    if (!permissionChecker.canManageUser(targetUserRole, isOwnProfile)) {
      return ApiResponses.forbidden('Cannot manage this user')
    }
    
    // 检查资源删除权限
    if (!permissionChecker.canDeleteResource(resourceOwnerId, 'FILE_DELETE_ANY')) {
      return ApiResponses.forbidden('Cannot delete this resource')
    }
  }
)
```

## 📊 审计日志

自动记录用户操作，支持自定义详情：

```typescript
export const POST = createProtectedRoute(
  {
    auth: UserRole.ADMIN,
    audit: {
      action: 'CREATE_CONTENT',
      resource: 'content',
      getDetails: (request, params, result) => ({
        contentId: result?.data?.id,
        title: result?.data?.title,
        type: result?.data?.type
      })
    }
  },
  async (request, { session }) => {
    const content = await createContent(data)
    return ApiResponses.success(content)
    // 审计日志会自动记录操作详情
  }
)
```

## 🔄 迁移现有路由

### 迁移前（旧版本）

```typescript
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // 业务逻辑...
    
    // 手动记录审计日志
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'LIST_USERS',
        resource: 'user'
      }
    })
    
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
```

### 迁移后（新版本）

```typescript
export const GET = createProtectedRoute(
  {
    auth: 'USER_READ',
    audit: {
      action: 'LIST_USERS',
      resource: 'user'
    }
  },
  async (request, { session }) => {
    // 业务逻辑...
    return ApiResponses.success(users)
  }
)
```

## 📋 预定义配置

使用 `RouteConfigs` 中的预定义配置可以快速应用常见的权限模式：

```typescript
import { RouteConfigs } from '@/lib/middleware/route-protection'

// 公开访问
export const GET = createProtectedRoute(RouteConfigs.public, handler)

// 需要登录
export const GET = createProtectedRoute(RouteConfigs.authenticated, handler)

// 管理员权限
export const GET = createProtectedRoute(RouteConfigs.adminOnly, handler)

// 超级管理员权限
export const GET = createProtectedRoute(RouteConfigs.superAdminOnly, handler)

// 内容权限
export const GET = createProtectedRoute(RouteConfigs.contentRead, handler)
export const POST = createProtectedRoute(RouteConfigs.contentWrite, handler)

// 用户管理权限
export const GET = createProtectedRoute(RouteConfigs.userManagement, handler)

// 文件上传权限
export const POST = createProtectedRoute(RouteConfigs.fileUpload, handler)
```

## 🛠️ 工具函数

### API 响应助手

```typescript
import { ApiResponses } from '@/lib/middleware/route-protection'

// 成功响应
return ApiResponses.success(data, 200)

// 错误响应
return ApiResponses.error('Something went wrong', 400)
return ApiResponses.unauthorized()
return ApiResponses.forbidden('Insufficient privileges')
return ApiResponses.notFound('Resource not found')
return ApiResponses.validationError(zodErrors)
```

### 资源所有权检查

```typescript
import { 
  checkUserOwnership, 
  checkContentOwnership, 
  checkFileOwnership 
} from '@/lib/middleware/route-protection'

// 检查用户资源所有权
const canAccess = await checkUserOwnership(currentUserId, targetUserId, userRole)

// 检查内容所有权
const canEdit = await checkContentOwnership(userId, contentId, userRole)

// 检查文件所有权
const canDelete = await checkFileOwnership(userId, fileId, userRole)
```

## ⚠️ 注意事项

1. **权限检查顺序**：认证 → 角色/权限检查 → 自定义权限检查 → 数据验证 → 业务逻辑
2. **错误处理**：所有错误都会被自动捕获并返回标准格式的错误响应
3. **审计日志**：只有成功的操作（status < 400）才会记录审计日志
4. **性能考虑**：权限检查在内存中进行，但资源所有权检查会查询数据库
5. **类型安全**：使用 TypeScript 确保权限键和角色的类型安全

## 🔧 自定义和扩展

### 添加新权限

1. 在 `src/lib/permissions.ts` 中的 `RESOURCE_PERMISSIONS` 添加新权限
2. 更新 TypeScript 类型
3. 在相关路由中使用新权限

### 添加新的预定义配置

在 `RouteConfigs` 中添加新的配置模式：

```typescript
export const RouteConfigs = {
  // 现有配置...
  customAccess: {
    auth: 'CUSTOM_PERMISSION',
    audit: {
      action: 'CUSTOM_ACTION',
      resource: 'custom'
    }
  }
}
```

这个中间件系统提供了灵活、安全、易于使用的权限控制解决方案，同时保持了代码的简洁性和可维护性。