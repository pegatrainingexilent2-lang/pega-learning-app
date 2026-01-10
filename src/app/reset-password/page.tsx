"use client";

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, ArrowLeft, Loader2, CheckCircle, ShieldAlert } from 'lucide-react';

function ResetPasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setStatus('error');
            setMessage('Password must be at least 6 characters');
            return;
        }

        setStatus('loading');

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            });

            const data = await res.json();

            if (res.ok) {
                setStatus('success');
                setTimeout(() => router.push('/login'), 3000);
            } else {
                setStatus('error');
                setMessage(data.error || 'Something went wrong');
            }
        } catch (err) {
            setStatus('error');
            setMessage('Failed to reset password');
        }
    };

    if (!token) {
        return (
            <div className="text-center space-y-6">
                <div className="flex justify-center">
                    <ShieldAlert className="w-16 h-16 text-red-400" />
                </div>
                <p className="text-xl font-bold text-white">Invalid Reset Link</p>
                <p className="text-indigo-100/60">This link is missing a security token.</p>
                <Link href="/forgot-password" title="Return to forgot password" className="inline-block text-white font-bold underline">Request a new link</Link>
            </div>
        );
    }

    if (status === 'success') {
        return (
            <div className="text-center space-y-6">
                <div className="flex justify-center">
                    <CheckCircle className="w-16 h-16 text-green-400" />
                </div>
                <p className="text-2xl font-bold text-white">Password Reset!</p>
                <p className="text-indigo-100/80">Your password has been updated securely. Redirecting you to login...</p>
                <Link href="/login" className="inline-block px-8 py-3 bg-white text-indigo-700 font-bold rounded-xl shadow-lg">Login Now</Link>
            </div>
        );
    }

    return (
        <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
                <label className="block text-sm font-bold text-indigo-50 mb-2 leading-relaxed">
                    New Password
                </label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all font-medium"
                    placeholder="••••••••"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-indigo-50 mb-2 leading-relaxed">
                    Confirm New Password
                </label>
                <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-indigo-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all font-medium"
                    placeholder="••••••••"
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
                    'Update Password'
                )}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="relative min-h-screen flex items-center justify-center py-12 px-4 overflow-hidden font-sans">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/hero-bg.png')" }} />
            <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-sm" />

            <div className="relative w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white mb-6 shadow-2xl">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h2 className="text-4xl font-extrabold text-white tracking-tight text-shadow-sm">
                        Set New Password
                    </h2>
                    <p className="mt-3 text-indigo-100/80 font-medium">
                        Strong passwords keep your progress safe
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 py-10 px-6 shadow-2xl rounded-3xl sm:px-10">
                    <Suspense fallback={<div className="flex justify-center py-12"><Loader2 className="w-10 h-10 text-white animate-spin" /></div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
