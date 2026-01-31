"use client";

import Link from "next/link";
import { ArrowRight, Star, Search, X } from "lucide-react";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SubTopic {
    id: string;
    title: string;
    order: number;
    introduction?: string;
    explanation?: string;
    implementation?: string;
    example?: string;
}

interface TopicSection {
    id: string;
    title: string;
    order: number;
    subTopics: SubTopic[];
}

interface TopicBrowserProps {
    topics: TopicSection[];
}

export function TopicBrowser({ topics }: TopicBrowserProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredTopics = useMemo(() => {
        if (!searchQuery.trim()) return topics;

        const lowerQuery = searchQuery.toLowerCase();

        return topics.filter((topic) => {
            // Check topic title
            if (topic.title.toLowerCase().includes(lowerQuery)) return true;

            // Check subtopics
            return topic.subTopics.some((sub) =>
                sub.title.toLowerCase().includes(lowerQuery) ||
                sub.introduction?.toLowerCase().includes(lowerQuery) ||
                sub.explanation?.toLowerCase().includes(lowerQuery)
            );
        });
    }, [topics, searchQuery]);

    const handleClearSearch = () => setSearchQuery("");

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Learning Path</h2>
                    <p className="text-gray-500">Structured curriculum from beginner to advanced</p>
                </div>

                {/* Search Bar */}
                <div className="relative w-full md:w-96 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search topics, contents..."
                        className="block w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm shadow-sm transition-all duration-300 hover:shadow-md"
                    />
                    {searchQuery && (
                        <button
                            onClick={handleClearSearch}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                            <X className="h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors" />
                        </button>
                    )}
                </div>
            </div>

            {/* Topics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredTopics.length > 0 ? (
                        filteredTopics.map((topic, index) => (
                            <motion.div
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2 }}
                                key={topic.id}
                                className="group relative bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-white/50 overflow-hidden hover:-translate-y-2 premium-card"
                            >
                                {/* Shimmer effect on hover */}
                                <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="p-6 relative z-10">
                                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center mb-5 text-indigo-600 group-hover:from-indigo-600 group-hover:to-purple-600 group-hover:text-white transition-all duration-500 shadow-md group-hover:shadow-lg group-hover:scale-110">
                                        <Star className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:gradient-text transition-all duration-300">
                                        {topic.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-5 font-medium">
                                        {topic.subTopics.length} Comprehensive Lessons
                                    </p>

                                    <ul className="space-y-3 mb-6">
                                        {topic.subTopics.slice(0, 3).map((sub) => (
                                            <li key={sub.id} className="text-sm text-gray-600 flex items-center gap-3 group/item">
                                                <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover/item:scale-[2] group-hover/item:bg-indigo-600 transition-all duration-300"></div>
                                                <span className="group-hover/item:text-indigo-600 transition-colors duration-300 line-clamp-1">
                                                    {sub.title}
                                                </span>
                                            </li>
                                        ))}
                                        {topic.subTopics.length > 3 && (
                                            <li className="text-sm text-gray-400 pl-5 italic">
                                                +{topic.subTopics.length - 3} more topics...
                                            </li>
                                        )}
                                    </ul>
                                </div>

                                {topic.subTopics.length > 0 && (
                                    <Link
                                        href={`/learn/${topic.id}/${topic.subTopics[0].id}`}
                                        className="absolute inset-0 z-10"
                                    >
                                        <span className="sr-only">View {topic.title}</span>
                                    </Link>
                                )}

                                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-t border-indigo-100/50 flex items-center justify-between text-sm font-bold text-indigo-600 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                                    <span>Start Module</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="col-span-full py-12 text-center"
                        >
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No matching topics found</h3>
                            <p className="text-gray-500 max-w-sm mx-auto mt-2">
                                Try adjusting your search query to find what you're looking for.
                            </p>
                            <button
                                onClick={handleClearSearch}
                                className="mt-4 text-indigo-600 font-medium hover:text-indigo-700 hover:underline"
                            >
                                Clear search
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
