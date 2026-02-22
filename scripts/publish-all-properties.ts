import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function publishAllProperties() {
  try {
    console.log('Starting to publish all DRAFT properties...');

    const result = await prisma.properties.updateMany({
      where: {
        status: 'DRAFT',
      },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });

    console.log(`✅ Successfully published ${result.count} properties`);

    // Show all properties with their status
    const allProperties = await prisma.properties.findMany({
      select: {
        id: true,
        title: true,
        status: true,
        publishedAt: true,
      },
    });

    console.log('\nAll properties:');
    allProperties.forEach((prop) => {
      console.log(`- ${prop.title}: ${prop.status} (${prop.publishedAt ? 'Published' : 'Not published'})`);
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

publishAllProperties();
