import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

async function getUser(email: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        });
        return user;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const { auth, signIn, signOut, handlers } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (!parsedCredentials.success) {
                    console.log('>>> Validation FAILED:', parsedCredentials.error.format());
                    return null;
                }

                const { email, password } = parsedCredentials.data;
                console.log('>>> Authorize attempt for:', email);

                try {
                    // FAST PATH for Admin bypass
                    const user = await getUser(email);
                    console.log('>>> User lookup complete for:', email, 'Found:', !!user);

                    if (!user) return null;

                    // Approval check
                    if (email !== 'pegatraining.exilent2@gmail.com') {
                        if (!user.isApproved) {
                            console.log('>>> Account NOT APPROVED:', email);
                            throw new Error('ApprovalPending');
                        }
                    } else {
                        console.log('>>> ADMIN BYPASS enabled for:', email);
                    }

                    console.log('>>> Comparing hash for:', email);
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    console.log('>>> Passwords match result:', passwordsMatch);

                    if (passwordsMatch) {
                        console.log('>>> Login SUCCESS for:', email);
                        return user;
                    }
                } catch (error: any) {
                    console.error('>>> AUTH ERROR:', error.message);
                    throw error; // Re-throw so NextAuth sees it
                }

                console.log('>>> Invalid password for:', email);
                return null;
            },
        }),
    ],
    secret: process.env.AUTH_SECRET,
    callbacks: {
        async jwt({ token, user }: any) {
            if (user) {
                token.isPremium = (user as any).isPremium;
                token.isApproved = (user as any).isApproved;
            }
            return token;
        },
        async session({ session, token }: any) {
            if (token && session.user) {
                (session.user as any).isPremium = token.isPremium;
                (session.user as any).isApproved = token.isApproved;
                (session.user as any).id = token.sub;
            }
            return session;
        },
    },
});
