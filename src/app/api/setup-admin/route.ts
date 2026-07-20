import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcryptjs';

// TEMPORARY ENDPOINT - Yalnız production-da ilk admin yaratmaq üçün
// İstifadə etdikdən sonra bu faylı silin!

export async function POST(request: Request) {
  try {
    const { secretKey } = await request.json();

    // Simple security - dəyişdirin və gizli saxlayın
    if (secretKey !== 'bronev_setup_2026') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if any admin exists
    const existingAdmin = await prisma.users.findFirst({
      where: {
        OR: [
          { role: 'ADMIN' },
          { role: 'SUPER_ADMIN' },
        ],
      },
    });

    if (existingAdmin) {
      // Reset existing admin password to aframe345Bron
      const hashedPassword = await bcrypt.hash('aframe345Bron', 12);

      await prisma.users.update({
        where: { id: existingAdmin.id },
        data: {
          password: hashedPassword,
          isActive: true,
          isBanned: false,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Admin parol yeniləndi',
        email: existingAdmin.email,
        password: 'aframe345Bron',
      });
    }

    // Create new admin with admin@bronev.com
    const hashedPassword = await bcrypt.hash('aframe345Bron', 12);

    const admin = await prisma.users.create({
      data: {
        id: `admin_${Date.now()}`,
        email: 'admin@bronev.com',
        name: 'Admin',
        password: hashedPassword,
        role: 'ADMIN',
        phone: '0777670031',
        isActive: true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Yeni admin yaradıldı',
      email: admin.email,
      password: 'aframe345Bron',
    });
  } catch (error: any) {
    console.error('Setup admin error:', error);
    return NextResponse.json(
      { error: error.message || 'Xəta baş verdi' },
      { status: 500 }
    );
  }
}
