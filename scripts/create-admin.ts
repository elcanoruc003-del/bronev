import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@bronev.com';
  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    console.error('❌ ADMIN_PASSWORD environment variable is required.');
    console.error('   Run: ADMIN_PASSWORD=yourpassword npx tsx scripts/create-admin.ts');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('❌ ADMIN_PASSWORD must be at least 8 characters.');
    process.exit(1);
  }

  console.log('🔄 Creating admin user...');

  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.users.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      isActive: true,
      isBanned: false,
      role: 'ADMIN',
      updatedAt: new Date(),
    },
    create: {
      id: `user_${Date.now()}_admin`,
      email,
      name: 'Admin',
      password: hashedPassword,
      role: 'ADMIN',
      phone: process.env.ADMIN_PHONE || null,
      isActive: true,
      updatedAt: new Date(),
    },
  });

  console.log('✅ Admin user created/updated successfully!');
  console.log(`📧 Email: ${admin.email}`);
  console.log('🔑 Password: [hidden]');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
