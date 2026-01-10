"use client";

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { signIn } from 'next-auth/react'; // Client side signin
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            console.log('Login attempt started for:', email);
            // Using NextAuth client-side signIn
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });
            console.log('SignIn result received:', result);

            if (result?.error) {
                console.error('SignIn error state:', result.error);
                // Show the specific error message
                if (result.error === 'ApprovalPending') {
                    setError('Your account is pending administrator approval. You will receive an email once approved.');
                } else if (result.error === 'CredentialsSignin') {
                    setError('Invalid email or password');
                } else {
                    setError(result.error);
                }
                setIsLoading(false);
            } else {
                console.log('SignIn success! Redirecting...');
                // Success
                router.push('/');
                router.refresh();
            }
        } catch (err: any) {
            console.error('Fatal Login Error:', err);
            setError('Something went wrong: ' + (err.message || 'Unknown error'));
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 overflow-hidden font-sans">
            {/* Background Layer */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/images/hero-bg.png')" }}
            />
            <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-sm" />

            <div className="relative w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white mb-6 shadow-2xl">
                        <span className="text-2xl font-bold italic">P.</span>
                    </div>
                    <h2 className="text-4xl font-extrabold text-white tracking-tight">
                        Welcome Back
                    </h2>
                    <p className="mt-3 text-indigo-100/80 font-medium">
                        Sign in to continue your Pega 25.1 journey
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 py-10 px-6 shadow-2xl rounded-3xl sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-bold text-indigo-50 leading-relaxed mb-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all font-medium"
                                placeholder="name@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-bold text-indigo-50 leading-relaxed mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all font-medium"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-sm font-medium animate-pulse">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-xl"
                            >
                                {isLoading ? 'Connecting...' : 'Sign In'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center border-t border-white/10 pt-6">
                        <p className="text-sm text-indigo-100/60 font-medium">
                            Don&apos;t have an account?{' '}
                            <Link href="/register" className="text-white hover:text-indigo-200 font-bold transition-colors underline-offset-4 hover:underline">
                                Create Workspace
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
