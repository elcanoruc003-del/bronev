import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Bütün istifadəçilərə baxırıq...\n');

  const allUsers = await prisma.users.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
    },
  });

  if (allUsers.length === 0) {
    console.log('❌ Heç bir istifadəçi tapılmadı!\n');
    console.log('İlk admin yaratmaq üçün:\n');
    const newAdmin = await prisma.users.create({
      data: {
        id: `admin_${Date.now()}`,
        email: 'admin@bronev.az',
        name: 'Admin',
        password: await bcrypt.hash('Bronev2026!', 12),
        role: 'ADMIN',
        isActive: true,
        updatedAt: new Date(),
      },
    });
    console.log('✅ Yeni admin yaradıldı!');
    console.log(`📧 Email: ${newAdmin.email}`);
    console.log(`🔑 Parol: Bronev2026!`);
    return;
  }

  console.log(`✅ ${allUsers.length} istifadəçi tapıldı:\n`);
  allUsers.forEach((user, index) => {
    console.log(`${index + 1}. ${user.email} (${user.role})`);
  });

  // Admin olanları tap
  const admins = allUsers.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN');

  if (admins.length === 0) {
    console.log('\n⚠️ Admin role-u olan istifadəçi yoxdur!');
    console.log('Birinci istifadəçini admin edək:\n');
    
    const firstUser = allUsers[0];
    const newPassword = 'Bronev2026!';
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.users.update({
      where: { id: firstUser.id },
      data: {
        role: 'ADMIN',
        password: hashedPassword,
        isActive: true,
        updatedAt: new Date(),
      },
    });

    console.log('✅ İstifadəçi admin edildi və parolu yeniləndi!');
    console.log(`📧 Email: ${firstUser.email}`);
    console.log(`🔑 Yeni Parol: ${newPassword}`);
  } else {
    console.log(`\n✅ ${admins.length} admin tapıldı:`);
    
    for (const admin of admins) {
      console.log(`\n📧 Email: ${admin.email}`);
      console.log(`👤 Ad: ${admin.name}`);
      console.log(`🔧 Role: ${admin.role}`);
    }

    // İlk adminin parolunu reset et
    const firstAdmin = admins[0];
    const newPassword = 'Bronev2026!';
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.users.update({
      where: { id: firstAdmin.id },
      data: {
        password: hashedPassword,
        isActive: true,
        isBanned: false,
        updatedAt: new Date(),
      },
    });

    console.log(`\n✅ ${firstAdmin.email} parol yeniləndi!`);
    console.log(`🔑 Yeni Parol: ${newPassword}`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
