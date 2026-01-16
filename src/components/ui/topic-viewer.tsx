"use client";

import { SubTopic } from "@/types";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Book, Code, Lightbulb, Terminal, Trash2 } from "lucide-react";
import Editor from "./editor";
import { FileUpload } from "./file-upload";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface TopicViewerProps {
    data: SubTopic;
}

type Tab = "introduction" | "explanation" | "implementation" | "example";

export function TopicViewer({ data }: TopicViewerProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<Tab>("introduction");
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const isAdmin = session?.user?.email === 'pegatraining.exilent2@gmail.com';

    // Initialize local state from DB props
    const [localContent, setLocalContent] = useState<Record<string, string>>({
        title: data.title || "",
        introduction: data.content?.introduction || "",
        explanation: data.content?.explanation || "",
        implementation: data.content?.implementation || "",
        example: data.content?.example || "",
        pptUrl: data.content?.pptUrl || ""
    });

    // Update local state when data changes (navigation)
    useEffect(() => {
        setLocalContent({
            title: data.title || "",
            introduction: data.content?.introduction || "",
            explanation: data.content?.explanation || "",
            implementation: data.content?.implementation || "",
            example: data.content?.example || "",
            pptUrl: data.content?.pptUrl || ""
        });
        setIsEditing(false);
        setActiveTab("introduction");
    }, [data]);

    const handleSave = async (tabId: string, content: string) => {
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
            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to save content");
        } finally {
            setIsSaving(false);
        }
    };

    const handlePptUrlChange = (url: string) => {
        setLocalContent(prev => ({ ...prev, pptUrl: url }));
    };

    const handleSavePptUrl = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/content', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    subTopicId: data.id,
                    field: 'pptUrl',
                    content: localContent.pptUrl
                })
            });

            if (!response.ok) throw new Error("Failed to save PPT URL");

            router.refresh();
        } catch (error) {
            console.error(error);
            alert("Failed to save PPT URL");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSubTopic = async () => {
        if (!window.confirm("Are you sure you want to delete this sub-topic?")) return;

        try {
            const res = await fetch(`/api/subtopics?id=${data.id}`, { method: 'DELETE' });
            if (res.ok) {
                router.push('/');
                router.refresh();
            } else {
                alert("Failed to delete sub-topic");
            }
        } catch (err) {
            alert("Error deleting sub-topic");
        }
    };

    const getCurrentContent = (tabId: string) => {
        return (localContent as any)[tabId] || "";
    };

    const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
        { id: "introduction", label: "Introduction", icon: Book },
        { id: "explanation", label: "Explanation", icon: Lightbulb },
        { id: "implementation", label: "Implementation", icon: Terminal },
        { id: "example", label: "Example & Use Case", icon: Code },
    ];

    return (
        <div className="max-w-4xl mx-auto w-full pb-20">
            <header className="mb-8 font-sans">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        {isEditing ? (
                            <input
                                type="text"
                                value={localContent.title}
                                onChange={(e) => setLocalContent(prev => ({ ...prev, title: e.target.value }))}
                                className="text-4xl font-extrabold text-slate-900 border-b-2 border-indigo-500 outline-none w-full bg-transparent pb-1"
                            />
                        ) : (
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">{data.title}</h1>
                        )}
                    </div>
                    {isAdmin && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(!isEditing)}
                                className="px-4 py-2 text-sm font-bold text-indigo-600 bg-white/50 backdrop-blur-md border border-indigo-100 hover:bg-white rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95"
                            >
                                {isEditing ? "Cancel" : "Edit Concept"}
                            </button>
                            {!isEditing && (
                                <button
                                    onClick={handleDeleteSubTopic}
                                    className="p-2 text-slate-400 hover:text-red-500 rounded-xl hover:bg-white/50 backdrop-blur-md transition-all border border-transparent hover:border-red-100"
                                    title="Delete Sub-topic"
                                >
                                    <Trash2 size={20} />
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <div className="flex space-x-1 p-1 bg-slate-200/30 backdrop-blur-md rounded-2xl w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 py-2.5 px-6 rounded-xl text-sm font-bold transition-all relative whitespace-nowrap",
                                activeTab === tab.id
                                    ? "bg-white text-indigo-600 shadow-sm ring-1 ring-slate-100"
                                    : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
                            )}
                        >
                            <tab.icon className={cn("w-4 h-4", activeTab === tab.id ? "text-indigo-600" : "text-slate-400")} />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </header>

            <main className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(30,41,59,0.15)] border border-white/40 p-10 min-h-[500px] ring-1 ring-white/20">
                {isEditing ? (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-800 capitalize">Editing {activeTab}</h3>
                            <button
                                onClick={() => handleSave(activeTab, (localContent as any)[activeTab])}
                                disabled={isSaving}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 shadow-md transition-all active:scale-95"
                            >
                                {isSaving ? "Saving..." : "Save Tab Content"}
                            </button>
                        </div>
                        <Editor
                            value={getCurrentContent(activeTab)}
                            onChange={(val) => setLocalContent(prev => ({ ...prev, [activeTab]: val }))}
                        />
                        
                        {/* PDF/PPT Upload - Show in Explanation tab */}
                        {activeTab === "explanation" && (
                            <div className="pt-6 border-t border-gray-200">
                                <FileUpload
                                    currentUrl={localContent.pptUrl}
                                    onUploadComplete={handlePptUrlChange}
                                    acceptedTypes={[".pdf", ".ppt", ".pptx"]}
                                    label="Upload Presentation (PDF/PPT)"
                                />
                                {localContent.pptUrl && localContent.pptUrl !== data.content?.pptUrl && (
                                    <button
                                        onClick={handleSavePptUrl}
                                        disabled={isSaving}
                                        className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50 shadow-sm transition-all text-sm"
                                    >
                                        {isSaving ? "Saving..." : "Save PPT URL"}
                                    </button>
                                )}
                            </div>
                        )}
                        
                        {isEditing && localContent.title !== data.title && (
                            <button
                                onClick={() => handleSave('title', localContent.title)}
                                disabled={isSaving}
                                className="w-full py-2 border border-indigo-200 text-indigo-600 rounded-lg hover:bg-indigo-50 font-medium disabled:opacity-50 transition-all"
                            >
                                {isSaving ? "Saving Title..." : "Save Title Only"}
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="prose prose-indigo max-w-none">
                        {activeTab === "introduction" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-xl font-semibold mb-4 text-gray-800">Introduction</h3>
                                <div
                                    className="text-gray-600 text-lg leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: getCurrentContent("introduction") }}
                                />
                            </div>
                        )}

                        {activeTab === "explanation" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                                <div>
                                    <h3 className="text-xl font-semibold mb-4 text-gray-800">Detailed Explanation</h3>
                                    <div
                                        className="prose prose-indigo max-w-none text-gray-600 leading-relaxed"
                                        dangerouslySetInnerHTML={{ __html: getCurrentContent("explanation") }}
                                    />
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
                                <div className="bg-slate-900 rounded-lg p-6 text-slate-100 font-mono text-sm whitespace-pre-wrap shadow-inner overflow-x-auto">
                                    <div dangerouslySetInnerHTML={{ __html: getCurrentContent("implementation") }} />
                                </div>
                            </div>
                        )}

                        {activeTab === "example" && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-xl font-semibold mb-4 text-gray-800">Example & Use Case</h3>
                                <div className="bg-white border-l-4 border-indigo-500 p-6 shadow-sm rounded-r-lg">
                                    <div
                                        className="text-gray-700 leading-relaxed italic"
                                        dangerouslySetInnerHTML={{ __html: getCurrentContent("example") }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}
