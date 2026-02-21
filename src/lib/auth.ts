import { prisma, checkDatabaseConnection } from './prisma';
import * as bcrypt from 'bcryptjs';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Production-Safe Authentication
 * With comprehensive error handling and logging
 */
export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthUser | null> {
  try {
    // Validate inputs
    if (!email || !password) {
      console.warn('Auth attempt with missing credentials');
      return null;
    }

    // Check database connection first
    const isConnected = await checkDatabaseConnection();
    if (!isConnected) {
      console.error('Database connection unavailable during auth');
      throw new Error('Database connection failed');
    }

    const user = await prisma.users.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        isActive: true,
        isBanned: true,
      },
    });

    if (!user) {
      console.warn(`Auth failed: User not found - ${email}`);
      return null;
    }

    if (!user.isActive) {
      console.warn(`Auth failed: User inactive - ${email}`);
      return null;
    }

    if (user.isBanned) {
      console.warn(`Auth failed: User banned - ${email}`);
      return null;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.warn(`Auth failed: Invalid password - ${email}`);
      return null;
    }

    // Update last login (non-blocking)
    prisma.users
      .update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date(),
        },
      })
      .catch((err) => console.error('Failed to update last login:', err));

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch (error) {
    console.error('Authentication error:', error);
    // Re-throw for proper error handling upstream
    throw new Error('Authentication service unavailable');
  }
}

/**
 * Check if user is admin
 */
export function isAdmin(user: AuthUser | null): boolean {
  if (!user) return false;
  return user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
}

/**
 * Create session token (simple implementation)
 * In production, use JWT with expiration
 */
export function createSessionToken(user: AuthUser): string {
  try {
    const payload = {
      ...user,
      iat: Date.now(),
      exp: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    return Buffer.from(JSON.stringify(payload)).toString('base64');
  } catch (error) {
    console.error('Token creation error:', error);
    throw new Error('Failed to create session token');
  }
}

/**
 * Verify session token with expiration check
 */
export function verifySessionToken(token: string): AuthUser | null {
  try {
    if (!token) return null;

    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const payload = JSON.parse(decoded);

    // Check expiration
    if (payload.exp && payload.exp < Date.now()) {
      console.warn('Session token expired');
      return null;
    }

    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    };
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}
