import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Admin istifadəçilərə baxırıq...\n');

  const admins = await prisma.users.findMany({
    where: {
      OR: [
        { role: 'ADMIN' },
        { role: 'SUPER_ADMIN' },
      ],
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      phone: true,
      createdAt: true,
    },
  });

  if (admins.length === 0) {
    console.log('❌ Admin tapılmadı!\n');
    console.log('Yeni admin yaratmaq üçün:');
    console.log('$env:ADMIN_EMAIL="admin@bronev.az"');
    console.log('$env:ADMIN_PASSWORD="admin123456"');
    console.log('npx tsx scripts/create-admin.ts');
  } else {
    console.log(`✅ ${admins.length} admin tapıldı:\n`);
    admins.forEach((admin, index) => {
      console.log(`${index + 1}. Email: ${admin.email}`);
      console.log(`   Ad: ${admin.name}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Telefon: ${admin.phone || 'N/A'}`);
      console.log(`   Yaradılıb: ${admin.createdAt.toLocaleDateString('az-AZ')}\n`);
    });
    
    console.log('⚠️ Parol database-də hash-lanmış formadadır.');
    console.log('📝 Parol dəyişdirmək üçün yeni admin yarat:\n');
    console.log('$env:ADMIN_EMAIL="admin@bronev.az"');
    console.log('$env:ADMIN_PASSWORD="yeni_parol_123"');
    console.log('npx tsx scripts/create-admin.ts');
  }

  console.log('\n🔍 Kampaniyalara baxırıq...\n');

  const campaigns = await prisma.campaigns.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      participationFee: true,
      drawDate: true,
      createdAt: true,
      _count: {
        select: {
          participants: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (campaigns.length === 0) {
    console.log('❌ Kampaniya tapılmadı!');
  } else {
    console.log(`✅ ${campaigns.length} kampaniya tapıldı:\n`);
    campaigns.forEach((campaign, index) => {
      console.log(`${index + 1}. ${campaign.title}`);
      console.log(`   Slug: ${campaign.slug}`);
      console.log(`   Status: ${campaign.status}`);
      console.log(`   İştirak haqqı: ${campaign.participationFee / 100} AZN`);
      console.log(`   İştirakçı sayı: ${campaign._count.participants}`);
      console.log(`   Çəkiliş: ${campaign.drawDate ? new Date(campaign.drawDate).toLocaleDateString('az-AZ') : 'N/A'}`);
      console.log(`   Yaradılıb: ${campaign.createdAt.toLocaleDateString('az-AZ')}\n`);
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
