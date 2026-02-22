'use server';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { createSessionToken, verifySessionToken } from '@/lib/auth';

const USER_SESSION_COOKIE = 'bronev_user_session';

/**
 * Validate email format
 */
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone format (Azerbaijan)
 */
function isValidPhone(phone: string): boolean {
  // Remove spaces, dashes, parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  // Check if it's a valid Azerbaijan phone number
  // Formats: +994XXXXXXXXX, 994XXXXXXXXX, 0XXXXXXXXX
  const phoneRegex = /^(\+994|994|0)?[1-9][0-9]{8}$/;
  return phoneRegex.test(cleaned);
}

/**
 * Normalize phone number to standard format
 */
function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // If starts with +994, remove +
  if (cleaned.startsWith('+994')) {
    return cleaned.substring(1);
  }
  
  // If starts with 0, replace with 994
  if (cleaned.startsWith('0')) {
    return '994' + cleaned.substring(1);
  }
  
  // If doesn't start with 994, add it
  if (!cleaned.startsWith('994')) {
    return '994' + cleaned;
  }
  
  return cleaned;
}

/**
 * Validate password strength
 */
function validatePassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 6) {
    return { valid: false, error: 'Parol ən azı 6 simvol olmalıdır' };
  }
  
  if (password.length > 100) {
    return { valid: false, error: 'Parol çox uzundur' };
  }
  
  return { valid: true };
}

/**
 * User Registration
 */
export async function registerUser(data: {
  name: string;
  identifier: string; // email or phone
  password: string;
}) {
  try {
    const { name, identifier, password } = data;

    // Validate inputs
    if (!name || !identifier || !password) {
      return { success: false, error: 'Bütün sahələr tələb olunur' };
    }

    if (name.length < 2) {
      return { success: false, error: 'Ad ən azı 2 simvol olmalıdır' };
    }

    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return { success: false, error: passwordValidation.error };
    }

    // Determine if identifier is email or phone
    let email: string | null = null;
    let phone: string | null = null;

    if (isValidEmail(identifier)) {
      email = identifier.toLowerCase().trim();
    } else if (isValidPhone(identifier)) {
      phone = normalizePhone(identifier);
    } else {
      return { 
        success: false, 
        error: 'Düzgün email və ya telefon nömrəsi daxil edin' 
      };
    }

    // Check if user already exists
    const existingUser = await prisma.users.findFirst({
      where: {
        OR: [
          email ? { email } : {},
          phone ? { phone } : {},
        ].filter(obj => Object.keys(obj).length > 0),
      },
    });

    if (existingUser) {
      return { 
        success: false, 
        error: 'Bu email və ya telefon nömrəsi artıq qeydiyyatdan keçib' 
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.users.create({
      data: {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: name.trim(),
        email: email || `${phone}@phone.bronev.com`,
        phone: phone || null,
        password: hashedPassword,
        role: 'USER',
        updatedAt: new Date(),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    // Create session
    const token = createSessionToken(user);
    cookies().set(USER_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return { 
      success: true, 
      user,
      message: 'Qeydiyyat uğurla tamamlandı' 
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { 
      success: false, 
      error: 'Qeydiyyat zamanı xəta baş verdi' 
    };
  }
}

/**
 * User Login
 */
export async function loginUser(data: {
  identifier: string; // email or phone
  password: string;
}) {
  try {
    const { identifier, password } = data;

    // Validate inputs
    if (!identifier || !password) {
      return { success: false, error: 'Email/telefon və parol tələb olunur' };
    }

    // Determine if identifier is email or phone
    let email: string | null = null;
    let phone: string | null = null;

    if (isValidEmail(identifier)) {
      email = identifier.toLowerCase().trim();
    } else if (isValidPhone(identifier)) {
      phone = normalizePhone(identifier);
    } else {
      return { 
        success: false, 
        error: 'Düzgün email və ya telefon nömrəsi daxil edin' 
      };
    }

    // Find user
    const user = await prisma.users.findFirst({
      where: {
        OR: [
          email ? { email } : {},
          phone ? { phone } : {},
        ].filter(obj => Object.keys(obj).length > 0),
      },
    });

    if (!user) {
      return { 
        success: false, 
        error: 'İstifadəçi tapılmadı' 
      };
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { 
        success: false, 
        error: 'Parol səhvdir' 
      };
    }

    // Create session
    const token = createSessionToken({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    cookies().set(USER_SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });

    return { 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      message: 'Giriş uğurlu oldu' 
    };
  } catch (error: any) {
    console.error('Login error:', error);
    return { 
      success: false, 
      error: 'Giriş zamanı xəta baş verdi' 
    };
  }
}

/**
 * Get current logged in user
 */
export async function getCurrentUser() {
  try {
    const token = cookies().get(USER_SESSION_COOKIE)?.value;
    
    if (!token) {
      return null;
    }

    const payload = verifySessionToken(token);
    if (!payload) {
      return null;
    }

    // Get fresh user data from database
    const user = await prisma.users.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    return user;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}

/**
 * User Logout
 */
export async function logoutUser() {
  try {
    cookies().delete(USER_SESSION_COOKIE);
    return { success: true, message: 'Çıxış uğurlu oldu' };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: false, error: 'Çıxış zamanı xəta baş verdi' };
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return !!user;
}
