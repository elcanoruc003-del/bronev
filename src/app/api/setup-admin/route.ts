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
      // Reset existing admin password
      const newPassword = 'Bronev2026!';
      const hashedPassword = await bcrypt.hash(newPassword, 12);

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
        password: newPassword,
      });
    }

    // Create new admin
    const hashedPassword = await bcrypt.hash('Bronev2026!', 12);

    const admin = await prisma.users.create({
      data: {
        id: `admin_${Date.now()}`,
        email: 'admin@bronev.az',
        name: 'Admin',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Yeni admin yaradıldı',
      email: admin.email,
      password: 'Bronev2026!',
    });
  } catch (error: any) {
    console.error('Setup admin error:', error);
    return NextResponse.json(
      { error: error.message || 'Xəta baş verdi' },
      { status: 500 }
    );
  }
}
