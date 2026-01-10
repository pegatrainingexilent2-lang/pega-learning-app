"use client";

import { SubTopic } from "@/types";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Book, Code, Lightbulb, Terminal, Lock, Zap } from "lucide-react";
import Editor from "./editor";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface TopicViewerProps {
    data: SubTopic;
}

type Tab = "introduction" | "explanation" | "implementation" | "example";

export function TopicViewer({ data }: TopicViewerProps) {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<Tab>("introduction");
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Initialize local state from DB props
    const [localContent, setLocalContent] = useState<Record<string, string>>({
        explanation: data.content?.explanation || "",
        implementation: data.content?.implementation || ""
    });

    // Update local state when data changes (navigation)
    useEffect(() => {
        setLocalContent({
            explanation: data.content?.explanation || "",
            implementation: data.content?.implementation || ""
        });
        setIsEditing(false);
        setActiveTab("introduction"); // Reset to intro on new topic
    }, [data]);

    const handleSave = async (tabId: 'explanation' | 'implementation', content: string) => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subTopicId: data.id,
                    field: tabId,
                    content: content
                })
            });

            if (!response.ok) throw new Error("Failed to save");

            setIsEditing(false);
        } catch (error) {
            console.error(error);
            alert("Failed to save content");
        } finally {
            setIsSaving(false);
        }
    };

    const getCurrentContent = (tabId: 'explanation' | 'implementation') => {
        return localContent[tabId] || "";
    };

    const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
        { id: "introduction", label: "Introduction", icon: Book },
        { id: "explanation", label: "Explanation", icon: Lightbulb },
        { id: "implementation", label: "Implementation", icon: Terminal },
        { id: "example", label: "Example & Use Case", icon: Code },
    ];

    return (
        <div className="max-w-4xl mx-auto w-full">
            <header className="mb-8 font-sans">
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{data.title}</h1>
                    {(activeTab === "explanation" || activeTab === "implementation") && session?.user?.email === 'pegatraining.exilent2@gmail.com' && (
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                        >
                            {isEditing ? "Cancel Editing" : "Edit Content"}
                        </button>
                    )}
                </div>
                <div className="flex space-x-2 border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 py-4 px-6 border-b-2 text-sm font-medium transition-colors relative",
                                activeTab === tab.id
                                    ? "border-indigo-600 text-indigo-600"
                                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            <main className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 min-h-[400px]">
                <div className="prose prose-indigo max-w-none">
                    {activeTab === "introduction" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Introduction</h3>
                            <div className="whitespace-pre-line text-gray-600 text-lg leading-relaxed">
                                {data.content?.introduction}
                            </div>
                        </div>
                    )}

                    {activeTab === "explanation" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                            <div>
                                <h3 className="text-xl font-semibold mb-4 text-gray-800">Detailed Explanation</h3>
                                {isEditing ? (
                                    <div className="space-y-4">
                                        <Editor
                                            value={getCurrentContent("explanation")}
                                            onChange={(val) => setLocalContent(prev => ({ ...prev, explanation: val }))}
                                        />
                                        <button
                                            onClick={() => handleSave("explanation", localContent.explanation)}
                                            disabled={isSaving}
                                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50"
                                        >
                                            {isSaving ? "Saving..." : "Save Changes"}
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className="prose prose-indigo max-w-none text-gray-600 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: getCurrentContent("explanation") }}
                                    />
                                )}
                            </div>

                            {data.content?.pptUrl && (
                                <div className="mt-8 pt-8 border-t border-gray-100">
                                    <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center gap-2">
                                        <Book className="w-5 h-5 text-indigo-600" />
                                        Presentation Material
                                    </h4>
                                    <div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
                                        <div>
                                            <p className="font-medium text-indigo-900">Topic Presentation</p>
                                            <p className="text-sm text-indigo-600/80">Download the slide deck for this topic.</p>
                                        </div>
                                        <a
                                            href={data.content.pptUrl}
                                            download
                                            className="whitespace-nowrap inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-sm hover:shadow active:scale-95"
                                        >
                                            Download PPT
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "implementation" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Step-by-Step Implementation</h3>
                            {isEditing ? (
                                <div className="space-y-4">
                                    <Editor
                                        value={getCurrentContent("implementation")}
                                        onChange={(val) => setLocalContent(prev => ({ ...prev, implementation: val }))}
                                    />
                                    <button
                                        onClick={() => handleSave("implementation", localContent.implementation)}
                                        disabled={isSaving}
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50"
                                    >
                                        {isSaving ? "Saving..." : "Save Changes"}
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-slate-900 rounded-lg p-6 text-slate-100 font-mono text-sm whitespace-pre-wrap shadow-inner">
                                    {getCurrentContent("implementation").includes("<") ? (
                                        <div dangerouslySetInnerHTML={{ __html: getCurrentContent("implementation") }} />
                                    ) : (
                                        getCurrentContent("implementation")
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "example" && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <h3 className="text-xl font-semibold mb-4 text-gray-800">Example & Use Case</h3>
                            <div className="bg-white border-l-4 border-indigo-500 p-6 shadow-sm rounded-r-lg">
                                <p className="text-gray-700 leading-relaxed italic">{data.content?.example}</p>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
