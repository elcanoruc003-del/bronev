import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

// Initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Creating admin user...');
  
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.users.upsert({
    where: { email: 'admin@bronev.com' },
    update: {},
    create: {
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

  console.log('✅ Admin user created successfully!');
  console.log('📧 Email: admin@bronev.com');
  console.log('🔑 Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
