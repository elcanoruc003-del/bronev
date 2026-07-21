import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Production Database Yoxlanır...\n');

  // Count all tables
  const propertiesCount = await prisma.properties.count();
  const usersCount = await prisma.users.count();
  const bookingsCount = await prisma.bookings.count();
  const imagesCount = await prisma.property_images.count();
  const campaignsCount = await prisma.campaigns.count();

  console.log('📊 Database Statistika:');
  console.log(`   Evlər: ${propertiesCount}`);
  console.log(`   İstifadəçilər: ${usersCount}`);
  console.log(`   Bronlar: ${bookingsCount}`);
  console.log(`   Şəkillər: ${imagesCount}`);
  console.log(`   Kampaniyalar: ${campaignsCount}\n`);

  if (propertiesCount === 0) {
    console.log('⚠️ Database boşdur!');
    console.log('Bu LOCAL database-dir, production database deyil!\n');
    console.log('Production database URL-ni yoxlayın:');
    console.log('1. Vercel Dashboard → Settings → Environment Variables');
    console.log('2. DATABASE_URL-i kopyalayın');
    console.log('3. Bu scripti production URL ilə işlədin\n');
  } else {
    console.log('✅ Database-də məlumat var!');
    
    // Show some properties
    const properties = await prisma.properties.findMany({
      take: 5,
      select: {
        id: true,
        title: true,
        city: true,
        status: true,
        _count: {
          select: {
            property_images: true,
          },
        },
      },
    });

    console.log('\n🏠 İlk 5 ev:');
    properties.forEach((prop, i) => {
      console.log(`${i + 1}. ${prop.title} - ${prop.city} (${prop.status}) - ${prop._count.property_images} şəkil`);
    });
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
