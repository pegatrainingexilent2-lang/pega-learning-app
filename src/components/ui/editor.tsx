"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    List,
    ListOrdered,
    Heading1,
    Heading2,
    Link as LinkIcon,
    Undo,
    Redo
} from 'lucide-react';

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
}

const MenuBar = ({ editor }: { editor: any }) => {
    if (!editor) {
        return null;
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) {
            return;
        }

        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    };

    return (
        <div className="flex flex-wrap gap-1 p-2 border-b border-gray-200 bg-gray-50/50 sticky top-0 z-10">
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={`p-2 rounded hover:bg-white hover:shadow-sm transition-all ${editor.isActive('bold') ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                title="Bold"
            >
                <Bold size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={`p-2 rounded hover:bg-white hover:shadow-sm transition-all ${editor.isActive('italic') ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                title="Italic"
            >
                <Italic size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded hover:bg-white hover:shadow-sm transition-all ${editor.isActive('underline') ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                title="Underline"
            >
                <UnderlineIcon size={18} />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`p-2 rounded hover:bg-white hover:shadow-sm transition-all ${editor.isActive('heading', { level: 1 }) ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                title="Heading 1"
            >
                <Heading1 size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`p-2 rounded hover:bg-white hover:shadow-sm transition-all ${editor.isActive('heading', { level: 2 }) ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                title="Heading 2"
            >
                <Heading2 size={18} />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-white hover:shadow-sm transition-all ${editor.isActive('bulletList') ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                title="Bullet List"
            >
                <List size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-white hover:shadow-sm transition-all ${editor.isActive('orderedList') ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                title="Ordered List"
            >
                <ListOrdered size={18} />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1 self-center" />
            <button
                onClick={setLink}
                className={`p-2 rounded hover:bg-white hover:shadow-sm transition-all ${editor.isActive('link') ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'}`}
                title="Add Link"
            >
                <LinkIcon size={18} />
            </button>
            <div className="flex-grow" />
            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
                className="p-2 rounded hover:bg-white hover:shadow-sm transition-all text-gray-400 disabled:opacity-30"
                title="Undo"
            >
                <Undo size={18} />
            </button>
            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().chain().focus().redo().run()}
                className="p-2 rounded hover:bg-white hover:shadow-sm transition-all text-gray-400 disabled:opacity-30"
                title="Redo"
            >
                <Redo size={18} />
            </button>
        </div>
    );
};

export default function Editor({ value, onChange }: EditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline cursor-pointer',
                },
            }),
            Placeholder.configure({
                placeholder: 'Start writing your content...',
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    return (
        <div className="bg-white text-gray-900 rounded-xl border border-gray-200 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500/50 transition-all">
            <MenuBar editor={editor} />
            <div className="prose prose-sm md:prose-base max-w-none p-4 min-h-[300px] outline-none">
                <EditorContent editor={editor} />
            </div>
            <style jsx global>{`
                .ProseMirror p.is-editor-empty:first-child::before {
                    content: attr(data-placeholder);
                    float: left;
                    color: #adb5bd;
                    pointer-events: none;
                    height: 0;
                }
                .ProseMirror {
                    outline: none !important;
                }
                .ProseMirror h1 { font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem; }
                .ProseMirror h2 { font-size: 1.25rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem; }
                .ProseMirror ul { list-style-type: disc; padding-left: 1.5rem; }
                .ProseMirror ol { list-style-type: decimal; padding-left: 1.5rem; }
                .ProseMirror p { margin-bottom: 0.5rem; }
            `}</style>
        </div>
    );
}
