import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Admin yoxlanır...\n');

  // Check for admin@bronev.com
  let admin = await prisma.users.findUnique({
    where: { email: 'admin@bronev.com' },
  });

  if (admin) {
    console.log('✅ Admin tapıldı:', admin.email);
    console.log('🔄 Parol yenilənir...\n');
    
    // Reset password to aframe345Bron
    const hashedPassword = await bcrypt.hash('aframe345Bron', 12);
    
    admin = await prisma.users.update({
      where: { email: 'admin@bronev.com' },
      data: {
        password: hashedPassword,
        isActive: true,
        isBanned: false,
        role: 'ADMIN',
        updatedAt: new Date(),
      },
    });
    
    console.log('✅ Admin parol yeniləndi!');
  } else {
    console.log('❌ Admin tapılmadı. Yaradılır...\n');
    
    const hashedPassword = await bcrypt.hash('aframe345Bron', 12);

    admin = await prisma.users.create({
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
    
    console.log('✅ Yeni admin yaradıldı!');
  }

  console.log('\n📧 Email: admin@bronev.com');
  console.log('🔑 Password: aframe345Bron');
  console.log('\n✅ Artıq login edə bilərsiniz!');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
