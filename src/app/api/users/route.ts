import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/lib/auth'
import { 
  ApiWrappers, 
  createSuccessResponse, 
  APIError, 
  ErrorCode,
  validateRequestBody
} from '@/lib/api-error-handler'
import { CachedQueries } from '@/lib/cache/cached-queries'

const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['USER', 'ADMIN', 'SUPER_ADMIN']).default('USER'),
})

// GET /api/users - 获取用户列表
const handleGetUsers = async (request: NextRequest, context: any) => {
  const { session } = context
  
  // 权限检查
  if (!session?.user || !['ADMIN', 'SUPER_ADMIN'].includes(session.user.role)) {
    throw new APIError(ErrorCode.FORBIDDEN, 'Admin access required')
  }

  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100) // 限制最大100
  const role = searchParams.get('role')
  const search = searchParams.get('search')
  const skip = (page - 1) * limit

  // 构建查询条件
  const where: any = {}
  if (role && ['USER', 'ADMIN', 'SUPER_ADMIN'].includes(role)) {
    where.role = role
  }
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } }
    ]
  }

  try {
    // 使用缓存查询
    const result = await CachedQueries.getUsersWithFilters({
      page,
      limit,
      role: role || undefined,
      search: search || undefined,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    })

    return createSuccessResponse({
      ...result.data,
      cached: result.fromCache,
      timestamp: result.timestamp
    })
  } catch (error) {
    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to fetch users',
      error
    )
  }
}

// POST /api/users - 创建新用户
const handleCreateUser = async (request: NextRequest, context: any) => {
  const { session } = context
  
  // 权限检查 - 只有 SUPER_ADMIN 可以创建用户
  if (!session?.user || session.user.role !== 'SUPER_ADMIN') {
    throw new APIError(ErrorCode.FORBIDDEN, 'Super admin access required')
  }

  // 验证请求体
  const data = await validateRequestBody<z.infer<typeof createUserSchema>>(
    request,
    {
      required: ['name', 'email', 'password'],
      validate: (body) => {
        try {
          createUserSchema.parse(body)
          return { isValid: true }
        } catch (error) {
          return { 
            isValid: false, 
            errors: error instanceof z.ZodError ? error.errors.map(e => e.message) : ['Invalid input'] 
          }
        }
      }
    }
  )

  const parsedData = createUserSchema.parse(data)

  try {
    // 检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: parsedData.email }
    })

    if (existingUser) {
      throw new APIError(
        ErrorCode.CONFLICT,
        'User with this email already exists'
      )
    }

    // 哈希密码
    const hashedPassword = await bcrypt.hash(parsedData.password, 12)

    // 创建用户
    const user = await prisma.user.create({
      data: {
        ...parsedData,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      }
    })

    // 记录审计日志
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'CREATE_USER',
        resource: 'user',
        details: { 
          createdUserId: user.id, 
          email: user.email, 
          role: user.role 
        }
      }
    })

    // 清除用户相关缓存
    await CachedQueries.invalidateUserCache(user.id)

    return createSuccessResponse(user, { created: true })
    
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    
    throw new APIError(
      ErrorCode.INTERNAL_SERVER_ERROR,
      'Failed to create user',
      error
    )
  }
}

// 导出包装的处理器
export const GET = ApiWrappers.admin(handleGetUsers)
export const POST = ApiWrappers.admin(handleCreateUser)