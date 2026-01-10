import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const ADMIN_EMAIL = 'pegatraining.exilent2@gmail.com';

async function main() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: ADMIN_EMAIL },
        });

        if (user) {
            const updatedUser = await prisma.user.update({
                where: { email: ADMIN_EMAIL },
                data: { isApproved: true },
            });
            console.log('Admin user approved successfully:', updatedUser.email);
        } else {
            console.log('Admin user not found in database.');
        }
    } catch (error) {
        console.error('Error approving admin user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
