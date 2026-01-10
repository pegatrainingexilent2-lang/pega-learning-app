"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Crown, Check, Zap, ArrowLeft, Loader2, AlertCircle, PartyPopper } from 'lucide-react';
import Link from 'next/link';

function UpgradeContent() {
    const { data: session, update } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();

    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');

    // If success, update session
    useEffect(() => {
        if (success) {
            update();
        }
    }, [success, update]);

    const handleUpgrade = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/subscription/checkout', {
                method: 'POST',
            });

            const data = await res.json();

            if (data.url) {
                // Redirect to Stripe Checkout
                window.location.href = data.url;
            } else {
                alert(data.error || 'Checkout failed. Please try again.');
                setIsLoading(false);
            }
        } catch (e) {
            alert('Something went wrong.');
            setIsLoading(false);
        }
    };

    const features = [
        "Full access to Pega Integration lessons",
        "Advanced Pega Features & Performance guide",
        "Downloadable Pega PPT resources",
        "Expert-level Implementation steps",
        "Interactive Example scenarios"
    ];

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Learning
            </Link>

            <div className="text-center mb-16">
                {success && (
                    <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center justify-center gap-3 text-green-700 animate-in fade-in slide-in-from-top-4 duration-500">
                        <PartyPopper className="w-6 h-6 text-green-600" />
                        <div>
                            <p className="font-bold">Payment Successful!</p>
                            <p className="text-sm">Welcome to Pega Pro. Your advanced curriculum is now unlocked.</p>
                        </div>
                    </div>
                )}

                {canceled && (
                    <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-center gap-3 text-amber-700 animate-in fade-in slide-in-from-top-4 duration-500">
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                        <div>
                            <p className="font-bold">Payment Canceled</p>
                            <p className="text-sm">No worries, you can upgrade whenever you're ready.</p>
                        </div>
                    </div>
                )}

                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600 mb-6 shadow-sm">
                    <Crown className="w-10 h-10" />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
                    Unlock <span className="text-indigo-600">Pega Pro</span> Experience
                </h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Take your Pega skills to the next level with our advanced curriculum and exclusive resources.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Why go Premium?</h3>
                    <ul className="space-y-4">
                        {features.map((feature, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                    <Check className="w-3 h-3" />
                                </div>
                                <span className="text-gray-600 font-medium">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform hover:scale-[1.02] transition-transform duration-300">
                    <div className="bg-indigo-600 px-8 py-10 text-white text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-2xl"></div>
                        <p className="text-indigo-100 font-bold uppercase tracking-widest text-xs mb-2">Unlimited Access</p>
                        <div className="flex items-baseline justify-center gap-1 mb-2">
                            <span className="text-4xl font-bold">$</span>
                            <span className="text-6xl font-extrabold tracking-tighter text-white">49</span>
                            <span className="text-indigo-100 text-xl">/ lifetime</span>
                        </div>
                        <p className="text-indigo-100 text-sm">One-time payment, lifetime updates</p>
                    </div>
                    <div className="px-8 py-10 bg-white">
                        <button
                            onClick={handleUpgrade}
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 py-4 px-6 rounded-xl text-lg font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 transition-all shadow-lg hover:shadow-indigo-200/50 disabled:opacity-70"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                    <span>Processing...</span>
                                </>
                            ) : (
                                <>
                                    <Zap className="w-6 h-6 fill-current" />
                                    <span>Upgrade Now</span>
                                </>
                            )}
                        </button>
                        <p className="mt-6 text-center text-xs text-gray-400">
                            Secure payment processed via Stripe. 30-day money-back guarantee.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function UpgradePage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[50vh]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        }>
            <UpgradeContent />
        </Suspense>
    );
}
