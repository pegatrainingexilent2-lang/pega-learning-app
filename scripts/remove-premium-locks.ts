const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Removing premium locks from all topics...");

    const result = await prisma.subTopic.updateMany({
        where: {},
        data: {
            isPremium: false
        }
    });

    console.log(`Updated ${result.count} topics. All content is now FREE.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
