
import { PrismaClient } from '@prisma/client'
import { topics } from '../src/data/topics'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    for (const section of topics) {
        const topicSection = await prisma.topicSection.upsert({
            where: { id: section.id },
            update: {
                title: section.title,
            },
            create: {
                id: section.id,
                title: section.title,
            },
        })
        console.log(`Upserted TopicSection: ${topicSection.id}`)

        let order = 0;
        for (const sub of section.subTopics) {
            order++;
            // Check if there is existing saved data in local storage format? 
            // No, we are seeding from the static .ts files as the base truth.

            await prisma.subTopic.upsert({
                where: { id: sub.id },
                update: {
                    title: sub.title,
                    topicSectionId: section.id,
                    introduction: sub.content?.introduction || "",
                    explanation: sub.content?.explanation || "",
                    implementation: sub.content?.implementation || "",
                    example: sub.content?.example || "",
                    pptUrl: sub.content?.pptUrl || null,
                    order: order
                },
                create: {
                    id: sub.id,
                    title: sub.title,
                    topicSectionId: section.id,
                    introduction: sub.content?.introduction || "",
                    explanation: sub.content?.explanation || "",
                    implementation: sub.content?.implementation || "",
                    example: sub.content?.example || "",
                    pptUrl: sub.content?.pptUrl || null,
                    order: order
                }
            })
        }
    }
    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
