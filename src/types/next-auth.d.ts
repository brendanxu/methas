import { UserRole } from '@prisma/client'
import 'next-auth'

declare module 'next-auth' {
  interface User {
    role: UserRole
    emailVerified: Date | null
  }

  interface Session {
    user: User & {
      id: string
      role: UserRole
      emailVerified: Date | null
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: UserRole
    emailVerified: Date | null
  }
}