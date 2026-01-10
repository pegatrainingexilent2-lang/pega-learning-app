"use client";

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import 'react-quill-new/dist/quill.snow.css';

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function Editor({ value, onChange }: EditorProps) {
    // Dynamically import ReactQuill to avoid server-side rendering issues
    const ReactQuill = useMemo(() => dynamic(() => import('react-quill-new'), { ssr: false }), []) as any;

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ],
    };

    return (
        <div className="bg-white text-gray-900 rounded-lg overflow-hidden">
            <ReactQuill
                theme="snow"
                value={value}
                onChange={onChange}
                modules={modules}
                className="h-[300px] mb-12" // Add margin bottom for toolbar
            />
        </div>
    );
}
