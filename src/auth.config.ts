import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    providers: [],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAuthPage =
                nextUrl.pathname === '/login' ||
                nextUrl.pathname === '/register' ||
                nextUrl.pathname === '/forgot-password' ||
                nextUrl.pathname === '/reset-password';

            if (isOnAuthPage) {
                if (isLoggedIn) {
                    // Redirect logged-in users away from auth pages to dashboard
                    return Response.redirect(new URL('/', nextUrl));
                }
                // Allow unauthenticated users to see login/register
                return true;
            }

            // For all other pages (including root /), require authentication
            return isLoggedIn;
        },
    },
    secret: process.env.AUTH_SECRET || "pega-learning-app-secret-key-change-me",
} satisfies NextAuthConfig;
