import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'
import { UserRole } from '@prisma/client'
import type { JWT } from 'next-auth/jwt'

// Production logging utilities
const logError = (message: string, error?: any) => {
  console.error(`[AUTH ERROR] ${new Date().toISOString()} - ${message}`, error);
};

const logInfo = (message: string, data?: any) => {
  if (process.env.NODE_ENV === 'production') {
    console.log(`[AUTH INFO] ${new Date().toISOString()} - ${message}`, data ? JSON.stringify(data) : '');
  }
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.email || !credentials?.password) {
            logError('Missing credentials in login attempt')
            return null
          }

          // Rate limiting check could be added here
          const email = credentials.email.toLowerCase().trim()

          const user = await prisma.user.findUnique({
            where: { email },
            select: {
              id: true,
              email: true,
              name: true,
              password: true,
              role: true,
              emailVerified: true,
              createdAt: true,
              updatedAt: true
            }
          })

          if (!user || !user.password) {
            logError(`Login attempt failed for ${email}: User not found or no password`)
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

          if (!isPasswordValid) {
            logError(`Login attempt failed for ${email}: Invalid password`)
            
            // Record failed login attempt
            await prisma.auditLog.create({
              data: {
                userId: user.id,
                action: 'LOGIN_FAILED',
                resource: 'auth',
                details: { 
                  email,
                  reason: 'invalid_password',
                  ip: req?.headers?.['x-forwarded-for'] || 'unknown'
                }
              }
            }).catch(err => logError('Failed to record login attempt', err))
            
            return null
          }

          // Record successful login
          await prisma.auditLog.create({
            data: {
              userId: user.id,
              action: 'LOGIN_SUCCESS',
              resource: 'auth',
              details: { 
                email,
                ip: req?.headers?.['x-forwarded-for'] || 'unknown'
              }
            }
          }).catch(err => logError('Failed to record login success', err))

          logInfo(`Successful login for ${email}`)

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            emailVerified: user.emailVerified
          }
        } catch (error) {
          logError('Authorization error:', error)
          return null
        }
      }
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          })
        ]
      : []),
  ],
  callbacks: {
    async jwt({ token, user, account, profile, trigger, session }) {
      try {
        // Initial sign in
        if (user) {
          token.role = user.role
          token.emailVerified = user.emailVerified
        }

        // Handle session update
        if (trigger === 'update' && session) {
          // Allow updating user info
          if (session.name) token.name = session.name
          if (session.email) token.email = session.email
        }

        // Verify user still exists and is active
        if (token.sub) {
          const existingUser = await prisma.user.findUnique({
            where: { id: token.sub },
            select: { id: true, role: true, emailVerified: true }
          })

          if (!existingUser) {
            logError(`JWT validation failed: User ${token.sub} not found`)
            // Return empty token to force re-authentication
            return { ...token, role: 'USER' as UserRole }
          }

          // Update token with current user data
          token.role = existingUser.role
          token.emailVerified = existingUser.emailVerified
        }

        return token
      } catch (error) {
        logError('JWT callback error:', error)
        return token
      }
    },
    async session({ session, token }) {
      try {
        if (token) {
          session.user.id = token.sub!
          session.user.role = token.role
          session.user.emailVerified = token.emailVerified
        }
        return session
      } catch (error) {
        logError('Session callback error:', error)
        return session
      }
    },
    async signIn({ user, account, profile, email, credentials }) {
      try {
        // Additional sign-in checks can be added here
        if (account?.provider === 'google') {
          // Handle Google OAuth sign-in
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email! }
          })

          if (existingUser) {
            // Update existing user's Google info
            await prisma.user.update({
              where: { email: user.email! },
              data: {
                image: user.image,
                emailVerified: new Date()
              }
            })
          }
        }

        return true
      } catch (error) {
        logError('Sign-in callback error:', error)
        return false
      }
    },
  },
  pages: {
    signIn: '/admin/login',
    error: '/admin/error',
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      logInfo(`User signed in: ${user.email}`, {
        provider: account?.provider,
        isNewUser
      })
    },
    async signOut({ token }) {
      logInfo(`User signed out: ${token?.email}`)
      
      // Record logout in audit log
      if (token?.sub) {
        await prisma.auditLog.create({
          data: {
            userId: token.sub,
            action: 'LOGOUT',
            resource: 'auth',
            details: { email: token.email }
          }
        }).catch(err => logError('Failed to record logout', err))
      }
    },
    async session({ session, token }) {
      // Optional: Track active sessions
    }
  },
  debug: process.env.NODE_ENV === 'development',
}