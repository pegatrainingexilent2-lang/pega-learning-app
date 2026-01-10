import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ADMIN_EMAIL = 'pegatraining.exilent2@gmail.com';

async function main() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: ADMIN_EMAIL },
        });

        if (user) {
            console.log('Admin User Record Found:');
            console.log(JSON.stringify(user, null, 2));
            console.log('Email Length:', user.email.length);
            console.log('Comparing to hardcoded email:', user.email === ADMIN_EMAIL);
        } else {
            console.log('Admin user NOT FOUND with:', ADMIN_EMAIL);
            // Try finding by part of the email
            const allUsers = await prisma.user.findMany();
            console.log('All Users in DB:');
            allUsers.forEach(u => console.log(`- "${u.email}" (Len: ${u.email.length})`));
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
