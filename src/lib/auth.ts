import { prisma, checkDatabaseConnection } from './prisma';
import bcrypt from 'bcryptjs';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export async function authenticateUser(
  email: string,
  password: string
): Promise<AuthUser | null> {
  try {
    if (!email || !password) {
      console.warn('Auth attempt with missing credentials');
      return null;
    }

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

    if (!user) return null;
    if (!user.isActive || user.isBanned) return null;

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) return null;

    // Non-blocking last login update
    prisma.users
      .update({ where: { id: user.id }, data: { lastLoginAt: new Date() } })
      .catch((err: unknown) => console.error('Failed to update last login:', err));

    return { id: user.id, email: user.email, name: user.name, role: user.role };
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Authentication service unavailable');
  }
}

export function isAdmin(user: AuthUser | null): boolean {
  if (!user) return false;
  return user.role === 'ADMIN' || user.role === 'SUPER_ADMIN';
}

export function createSessionToken(user: AuthUser): string {
  const payload = {
    ...user,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

export function verifySessionToken(token: string): AuthUser | null {
  try {
    if (!token) return null;
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const payload = JSON.parse(decoded);
    if (payload.exp && payload.exp < Date.now()) return null;
    return { id: payload.id, email: payload.email, name: payload.name, role: payload.role };
  } catch {
    return null;
  }
}
