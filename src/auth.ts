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

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    console.log('>>> Authorize attempt for:', email);

                    const user = await getUser(email);
                    console.log('>>> User found in DB:', !!user);

                    if (!user) return null;

                    // Block if not approved (except for the master admin)
                    console.log('>>> User approval status:', user.isApproved);
                    if (!user.isApproved && email !== 'pegatraining.exilent2@gmail.com') {
                        console.log('>>> Approval BLOCKED for:', email);
                        throw new Error('ApprovalPending');
                    }

                    console.log('>>> Comparing passwords...');
                    const passwordsMatch = await bcrypt.compare(password, user.password);
                    console.log('>>> Passwords match:', passwordsMatch);

                    if (passwordsMatch) {
                        console.log('>>> Login SUCCESS for:', email);
                        return user;
                    }
                }

                console.log('>>> Invalid credentials for:', credentials?.email);
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
