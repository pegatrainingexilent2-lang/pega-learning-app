"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('loading');

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setMessage(data.message);
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Failed to send request');
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center py-12 px-4 overflow-hidden font-sans">
            {/* Background Layer (Matches Login) */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg.png')" }} />
            <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-sm" />

            <div className="relative w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white mb-6 shadow-2xl">
                        <Mail className="w-8 h-8" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-white tracking-tight text-shadow-sm">
                        Forgot Password
                    </h2>
                    <p className="mt-3 text-indigo-100/80 font-medium">
                        Enter your email to receive a recovery link
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 py-10 px-6 shadow-2xl rounded-3xl sm:px-10">
                    {status === 'success' ? (
                        <div className="text-center space-y-6">
                            <div className="flex justify-center">
                                <CheckCircle className="w-16 h-16 text-green-400" />
                            </div>
                            <p className="text-lg font-medium text-white">{message}</p>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-indigo-200 hover:text-white font-bold transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label className="block text-sm font-bold text-indigo-50 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all font-medium"
                                    placeholder="name@example.com"
                                />
                            </div>

                            {status === 'error' && (
                                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-2 rounded-lg text-sm font-medium">
                                    {message}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-bold rounded-xl text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 shadow-xl"
                            >
                                {status === 'loading' ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    'Send Recovery Link'
                                )}
                            </button>

                            <div className="text-center">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 text-sm text-indigo-100/60 hover:text-white font-medium transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
