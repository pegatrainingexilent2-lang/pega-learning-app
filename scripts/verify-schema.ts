import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    try {
        console.log('Verifying User table schema...');
        // Attempt to fetch one user and check for the property
        const userCount = await prisma.user.count();
        console.log(`Total users in DB: ${userCount}`);

        const user = await prisma.user.findFirst();
        if (user) {
            console.log('User object structure keys:', Object.keys(user));
            if ('isApproved' in user) {
                console.log('✅ isApproved column exists.');
            } else {
                console.log('❌ isApproved column MISSING in database!');
            }
        } else {
            console.log('No users found to verify schema.');
        }
    } catch (error) {
        console.error('Error verifying schema:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
