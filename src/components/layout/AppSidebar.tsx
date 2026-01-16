"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { TopicSection } from "@/types";
import { cn } from "@/lib/utils";
import { ChevronRight, BookOpen, LogOut, User, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

interface AppSidebarProps {
    initialTopics: TopicSection[];
}

export function AppSidebar({ initialTopics }: AppSidebarProps) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    const router = useRouter();
    const [openSections, setOpenSections] = useState<string[]>(initialTopics.map(t => t.id));

    const isAdmin = session?.user?.email === 'pegatraining.exilent2@gmail.com';

    if (pathname === '/login' || pathname === '/register' || status === "unauthenticated") {
        return null;
    }

    if (status === "loading") {
        return <aside className="w-80 h-screen border-r border-gray-200 bg-gray-50/50" />;
    }

    const toggleSection = (id: string) => {
        setOpenSections(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const handleAddTopic = async () => {
        const title = window.prompt("Enter Topic Title (e.g., Advanced Pega Concepts)");
        if (!title) return;

        // Generate a more unique ID to avoid collisions
        const id = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '') + '-' + Math.random().toString(36).substr(2, 4);

        try {
            const res = await fetch('/api/topics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, id })
            });

            if (res.ok) {
                router.refresh();
            } else {
                const error = await res.json();
                alert(`Error: ${error.error}`);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to create topic");
        }
    };

    const handleAddSubTopic = async (topicId: string) => {
        const title = window.prompt("Enter Sub-topic Title (e.g., Decision Rules)");
        if (!title) return;

        // Generate a more unique ID to avoid collisions
        const id = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]/g, '') + '-' + Math.random().toString(36).substr(2, 4);

        try {
            const res = await fetch('/api/subtopics', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, id, topicSectionId: topicId })
            });

            if (res.ok) {
                router.refresh();
            } else {
                const error = await res.json();
                alert(`Error: ${error.error}`);
            }
        } catch (err) {
            console.error(err);
            alert("Failed to create sub-topic");
        }
    };

    const handleDeleteTopic = async (topicId: string) => {
        if (!window.confirm("Are you sure you want to delete this topic and all its content?")) return;

        try {
            const res = await fetch(`/api/topics?id=${topicId}`, { method: 'DELETE' });
            if (res.ok) {
                router.refresh();
            } else {
                alert("Failed to delete topic");
            }
        } catch (err) {
            alert("Error deleting topic");
        }
    };

    return (
        <aside className="w-80 h-screen flex flex-col border-r border-white/30 backdrop-blur-xl shrink-0 relative overflow-hidden sidebar-bg">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/20 via-purple-600/15 to-pink-500/10" />
            
            {/* Secondary gradient layer */}
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/15 via-transparent to-indigo-500/10" />
            
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-30 sidebar-pattern" />
            
            {/* Animated mesh gradient blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-400/30 to-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0s' }} />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-indigo-400/25 to-blue-400/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
            
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            {/* Ambient glow effect */}
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-indigo-200/20 to-transparent blur-2xl pointer-events-none" />
            
            {/* Glass morphism overlay */}
            <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />

            <div className="p-6 flex-1 overflow-y-auto font-sans relative z-10">
                <Link href="/" className="flex items-center gap-3 font-bold text-xl mb-8 group">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/50 transition-all duration-300 group-hover:scale-110">
                        <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        PegaLearn 25.1
                    </span>
                </Link>

                <nav className="space-y-6">
                    {initialTopics.map((topic) => (
                        <div key={topic.id} className="space-y-2 group">
                            <div className="flex items-center justify-between group">
                                <button
                                    onClick={() => toggleSection(topic.id)}
                                    className="flex items-center justify-between flex-1 text-left font-semibold text-gray-900 hover:text-indigo-600 transition-all duration-300 py-2 px-3 rounded-lg hover:bg-white/60 hover:shadow-sm"
                                >
                                    <span>{topic.title}</span>
                                    <ChevronRight
                                        className={cn(
                                            "w-4 h-4 transition-transform duration-300",
                                            openSections.includes(topic.id) ? "rotate-90" : ""
                                        )}
                                    />
                                </button>
                                {isAdmin && (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                        <button
                                            onClick={() => handleAddSubTopic(topic.id)}
                                            className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"
                                            title="Add Sub-topic"
                                        >
                                            <PlusCircle size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTopic(topic.id)}
                                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                            title="Delete Topic"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <AnimatePresence>
                                {openSections.includes(topic.id) && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pl-4 space-y-1 border-l-2 border-gradient-to-b from-indigo-200 to-purple-200 ml-1">
                                            {topic.subTopics.map((sub) => {
                                                const href = `/learn/${topic.id}/${sub.id}`;
                                                const isActive = pathname === href;

                                                return (
                                                    <Link
                                                        key={sub.id}
                                                        href={href}
                                                        className={cn(
                                                            "flex items-center justify-between py-2 px-3 text-sm rounded-lg transition-all duration-300 relative group/link",
                                                            isActive
                                                                ? "bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 font-medium shadow-sm"
                                                                : "text-gray-600 hover:bg-white/60 hover:text-gray-900 hover:shadow-sm"
                                                        )}
                                                    >
                                                        {isActive && (
                                                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-lg" />
                                                        )}
                                                        <span className="truncate relative z-10">{sub.title}</span>
                                                        {!isActive && (
                                                            <div className="w-1 h-1 rounded-full bg-indigo-400 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                                                        )}
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}

                    {isAdmin && (
                        <button
                            onClick={handleAddTopic}
                            className="flex items-center gap-2 w-full py-2.5 px-3 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-white/60 hover:bg-white/80 border border-dashed border-indigo-300 hover:border-indigo-400 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                        >
                            <PlusCircle size={16} />
                            <span>Add New Topic Section</span>
                        </button>
                    )}
                </nav>
            </div>

            {session?.user && (
                <div className="p-4 border-t border-white/30 bg-white/40 backdrop-blur-md shadow-[0_-4px_12px_-2px_rgba(99,102,241,0.1)] relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg">
                            <User className="w-5 h-5" />
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
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-gray-600 hover:text-red-600 bg-white/60 hover:bg-red-50/80 rounded-lg transition-all duration-300 shadow-sm hover:shadow-md"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            )}
        </aside>
    );
}
