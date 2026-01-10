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
        <aside className="w-80 h-screen flex flex-col border-r border-indigo-100/50 bg-[#fcfdfe] shrink-0">
            <div className="p-6 flex-1 overflow-y-auto font-sans">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-indigo-600 mb-8">
                    <BookOpen className="w-8 h-8" />
                    <span>PegaLearn 25.1</span>
                </Link>

                <nav className="space-y-6">
                    {initialTopics.map((topic) => (
                        <div key={topic.id} className="space-y-2 group">
                            <div className="flex items-center justify-between group">
                                <button
                                    onClick={() => toggleSection(topic.id)}
                                    className="flex items-center justify-between flex-1 text-left font-semibold text-gray-900 hover:text-indigo-600 transition-colors"
                                >
                                    <span>{topic.title}</span>
                                    <ChevronRight
                                        className={cn(
                                            "w-4 h-4 transition-transform",
                                            openSections.includes(topic.id) ? "rotate-90" : ""
                                        )}
                                    />
                                </button>
                                {isAdmin && (
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                                        <button
                                            onClick={() => handleAddSubTopic(topic.id)}
                                            className="p-1 text-gray-400 hover:text-indigo-600"
                                            title="Add Sub-topic"
                                        >
                                            <PlusCircle size={14} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTopic(topic.id)}
                                            className="p-1 text-gray-400 hover:text-red-500"
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

                    {isAdmin && (
                        <button
                            onClick={handleAddTopic}
                            className="flex items-center gap-2 w-full py-2 px-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 border border-dashed border-indigo-200 rounded-lg transition-all"
                        >
                            <PlusCircle size={16} />
                            <span>Add New Topic Section</span>
                        </button>
                    )}
                </nav>
            </div>

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
