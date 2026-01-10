const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Updating premium topics...");

    // Mark Integration and Advanced subtopics as premium
    const result = await prisma.subTopic.updateMany({
        where: {
            OR: [
                { topicSectionId: 'integration' },
                { topicSectionId: 'advanced' },
                { topicSectionId: 'performance' }
            ]
        },
        data: {
            isPremium: true
        }
    });

    console.log(`Updated ${result.count} topics to Premium status.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
