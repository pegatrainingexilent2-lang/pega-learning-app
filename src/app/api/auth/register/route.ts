import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = registerSchema.safeParse(body);

        if (!result.success) {
            const errorMsg = result.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`).join(', ');
            return NextResponse.json({ error: `Validation error: ${errorMsg}` }, { status: 400 });
        }

        const { name, email, password } = result.data;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Auto-approve the specific admin email
        const isApproved = email === 'pegatraining.exilent2@gmail.com';

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                isApproved: isApproved
            },
        });

        // Send notification to admin if it's a new user needing approval
        if (!isApproved) {
            const { sendAdminNotification } = await import('@/lib/email');
            await sendAdminNotification(email, name);
        }

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({ user: userWithoutPassword }, { status: 201 });

    } catch (error: any) {
        console.error("Registration error details:", error);
        return NextResponse.json({ error: `Internal Server Error: ${error?.message || 'Unknown error'}` }, { status: 500 });
    }
}
