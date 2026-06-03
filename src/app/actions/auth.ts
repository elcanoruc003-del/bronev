'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { createSessionToken, verifySessionToken } from '@/lib/auth';

const USER_SESSION_COOKIE = 'bronev_user_session';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
};

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return /^(\+994|994|0)?[1-9][0-9]{8}$/.test(cleaned);
}

function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (cleaned.startsWith('+994')) return cleaned.substring(1);
  if (cleaned.startsWith('0')) return '994' + cleaned.substring(1);
  if (!cleaned.startsWith('994')) return '994' + cleaned;
  return cleaned;
}

function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 6) return { valid: false, error: 'Parol ən azı 6 simvol olmalıdır' };
  if (password.length > 100) return { valid: false, error: 'Parol çox uzundur' };
  return { valid: true };
}

export async function registerUser(data: {
  name: string;
  identifier: string;
  password: string;
}) {
  try {
    const { name, identifier, password } = data;

    if (!name || !identifier || !password)
      return { success: false, error: 'Bütün sahələr tələb olunur' };
    if (name.length < 2)
      return { success: false, error: 'Ad ən azı 2 simvol olmalıdır' };

    const pwCheck = validatePassword(password);
    if (!pwCheck.valid) return { success: false, error: pwCheck.error };

    let email: string | null = null;
    let phone: string | null = null;

    if (isValidEmail(identifier)) {
      email = identifier.toLowerCase().trim();
    } else if (isValidPhone(identifier)) {
      phone = normalizePhone(identifier);
    } else {
      return { success: false, error: 'Düzgün email və ya telefon nömrəsi daxil edin' };
    }

    const existing = await prisma.users.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (existing)
      return { success: false, error: 'Bu email və ya telefon nömrəsi artıq qeydiyyatdan keçib' };

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        email: email || `phone_${phone}_${Date.now()}@noemail.bronev.internal`,
        phone: phone || null,
        password: hashedPassword,
        role: 'USER',
        updatedAt: new Date(),
      },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });

    const token = createSessionToken(user);
    const jar = await cookies();
    jar.set(USER_SESSION_COOKIE, token, { ...COOKIE_OPTIONS, maxAge: 60 * 60 * 24 * 30 });

    return { success: true, user, message: 'Qeydiyyat uğurla tamamlandı' };
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Qeydiyyat zamanı xəta baş verdi' };
  }
}

export async function loginUser(data: { identifier: string; password: string }) {
  try {
    const { identifier, password } = data;

    if (!identifier || !password)
      return { success: false, error: 'Email/telefon və parol tələb olunur' };

    let email: string | null = null;
    let phone: string | null = null;

    if (isValidEmail(identifier)) {
      email = identifier.toLowerCase().trim();
    } else if (isValidPhone(identifier)) {
      phone = normalizePhone(identifier);
    } else {
      return { success: false, error: 'Düzgün email və ya telefon nömrəsi daxil edin' };
    }

    const user = await prisma.users.findFirst({
      where: {
        OR: [
          ...(email ? [{ email }] : []),
          ...(phone ? [{ phone }] : []),
        ],
      },
    });

    if (!user) return { success: false, error: 'İstifadəçi tapılmadı' };

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return { success: false, error: 'Parol səhvdir' };

    const token = createSessionToken({ id: user.id, email: user.email, name: user.name, role: user.role });
    const jar = await cookies();
    jar.set(USER_SESSION_COOKIE, token, { ...COOKIE_OPTIONS, maxAge: 60 * 60 * 24 * 30 });

    return {
      success: true,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role },
      message: 'Giriş uğurlu oldu',
    };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Giriş zamanı xəta baş verdi' };
  }
}

export async function getCurrentUser() {
  try {
    const jar = await cookies();
    const token = jar.get(USER_SESSION_COOKIE)?.value;
    if (!token) return null;

    const payload = verifySessionToken(token);
    if (!payload) return null;

    return await prisma.users.findUnique({
      where: { id: payload.id },
      select: { id: true, name: true, email: true, phone: true, role: true },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

export async function logoutUser() {
  try {
    const jar = await cookies();
    jar.delete(USER_SESSION_COOKIE);
    return { success: true, message: 'Çıxış uğurlu oldu' };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Çıxış zamanı xəta baş verdi' };
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}
