import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

/**
 * Setup Admin User API
 * ONE-TIME USE ONLY - Delete after setup
 * 
 * Usage: GET https://bron-ev.com/api/setup-admin?secret=SETUP_SECRET_2024
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Simple security check
    if (secret !== 'SETUP_SECRET_2024') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check database connection
    console.log('[SETUP] Checking database connection...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('[SETUP] Database connected!');

    // Check if admin already exists
    const existingAdmin = await prisma.users.findUnique({
      where: { email: 'admin@bronev.com' },
    });

    if (existingAdmin) {
      return NextResponse.json({
        success: true,
        message: 'Admin user already exists',
        admin: {
          email: existingAdmin.email,
          name: existingAdmin.name,
          role: existingAdmin.role,
        },
      });
    }

    // Create admin user
    console.log('[SETUP] Creating admin user...');
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.users.create({
      data: {
        id: `user_${Date.now()}_admin`,
        email: 'admin@bronev.com',
        name: 'Admin',
        password: hashedPassword,
        role: 'ADMIN',
        phone: '0777670031',
        isActive: true,
        updatedAt: new Date(),
      },
    });

    console.log('[SETUP] Admin user created successfully!');

    return NextResponse.json({
      success: true,
      message: 'Admin user created successfully',
      admin: {
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
      instructions: 'You can now login with admin@bronev.com / admin123',
    });
  } catch (error: any) {
    console.error('[SETUP] Error:', error);
    return NextResponse.json(
      {
        error: 'Setup failed',
        message: error.message,
        details: error.toString(),
      },
      { status: 500 }
    );
  }
}
