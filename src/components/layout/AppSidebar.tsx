"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { topics } from "@/data/topics";
import { cn } from "@/lib/utils";
import { ChevronRight, BookOpen, LogOut, User, Lock, Crown, Zap } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

export function AppSidebar() {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const [openSections, setOpenSections] = useState<string[]>(topics.map(t => t.id)); // Default all open

    // Hide sidebar on login/register pages or if not authenticated
    const isAuthPage = pathname === '/login' || pathname === '/register';
    if (isAuthPage || status === "unauthenticated") {
        return null;
    }

    // While loading session, show nothing to avoid flash
    if (status === "loading") {
        return <aside className="w-80 h-screen border-r border-gray-200 bg-gray-50/50" />;
    }

    const toggleSection = (id: string) => {
        setOpenSections(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    return (
        <aside className="w-80 h-screen flex flex-col border-r border-gray-200 bg-gray-50/50">
            <div className="p-6 flex-1 overflow-y-auto font-sans">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600 mb-8">
                    <BookOpen className="w-8 h-8" />
                    <span>PegaLearn 25.1</span>
                </Link>

                <nav className="space-y-6">
                    {topics.map((topic) => (
                        <div key={topic.id} className="space-y-2">
                            <button
                                onClick={() => toggleSection(topic.id)}
                                className="flex items-center justify-between w-full text-left font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                            >
                                <span>{topic.title}</span>
                                <ChevronRight
                                    className={cn(
                                        "w-4 h-4 transition-transform",
                                        openSections.includes(topic.id) ? "rotate-90" : ""
                                    )}
                                />
                            </button>

                            <AnimatePresence>
                                {openSections.includes(topic.id) && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pl-4 space-y-1 border-l-2 border-gray-200 ml-1">
                                            {topic.subTopics.map((sub) => {
                                                const href = `/learn/${topic.id}/${sub.id}`;
                                                const isActive = pathname === href;

                                                return (
                                                    <Link
                                                        key={sub.id}
                                                        href={href}
                                                        className={cn(
                                                            "flex items-center justify-between py-1.5 px-3 text-sm rounded-md transition-colors",
                                                            isActive
                                                                ? "bg-indigo-100 text-indigo-700 font-medium"
                                                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                                        )}
                                                    >
                                                        <span className="truncate">{sub.title}</span>
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </nav>
            </div>

            {/* User Profile Section */}
            {session?.user && (
                <div className="p-4 border-t border-gray-200 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                            <User className="w-6 h-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-gray-900 truncate">
                                {(session.user as any).name || "User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {session.user.email}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-red-600 rounded-md transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            )}
        </aside>
    );
}
