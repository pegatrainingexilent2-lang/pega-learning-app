"use client";

import dynamic from 'next/dynamic';
import 'suneditor/dist/css/suneditor.min.css';

const SunEditor = dynamic(() => import("suneditor-react"), {
    ssr: false,
});

interface EditorProps {
    value: string;
    onChange: (value: string) => void;
}

export default function Editor({ value, onChange }: EditorProps) {
    const handleImageUploadBefore = (files: any[], info: any, uploadHandler: any) => {
        if (!files || files.length === 0) return true;

        const file = files[0];
        // Ensure we have a valid filename, especially for pasted blobs
        const filename = encodeURIComponent(file.name || `image-${Date.now()}.png`);

        fetch(`/api/upload?filename=${filename}`, {
            method: 'POST',
            body: file,
        })
            .then(async res => {
                if (!res.ok) {
                    const errBody = await res.json().catch(() => ({}));
                    throw new Error(errBody.details || errBody.error || `Server error: ${res.status}`);
                }
                return res.json();
            })
            .then(data => {
                if (data.url) {
                    const response = {
                        result: [
                            {
                                url: data.url,
                                name: filename,
                                size: file.size
                            }
                        ]
                    };
                    uploadHandler(response);
                } else {
                    throw new Error("No URL returned from upload");
                }
            })
            .catch(err => {
                console.error('Upload failed:', err);
                uploadHandler(`Upload failed: ${err.message}`);
                // If it's a 500, remind about the secret
                if (err.message.includes("Vercel Blob")) {
                    alert("Possible connection issue. Please ensure you have Redeployed on Vercel after creating the Blob Store.");
                }
            });

        return undefined;
    };

    return (
        <div className="bg-white text-gray-900 rounded-xl border border-gray-200 overflow-hidden shadow-sm transition-all suneditor-custom">
            <SunEditor
                setContents={value}
                onChange={onChange}
                onImageUploadBefore={handleImageUploadBefore}
                onVideoUploadBefore={handleImageUploadBefore}
                setOptions={{
                    height: "400px",
                    buttonList: [
                        ["undo", "redo"],
                        ["font", "fontSize", "formatBlock"],
                        ["paragraphStyle", "blockquote"],
                        ["bold", "underline", "italic", "strike", "subscript", "superscript"],
                        ["fontColor", "hiliteColor", "textStyle"],
                        ["removeFormat"],
                        ["outdent", "indent"],
                        ["align", "horizontalRule", "list", "lineHeight"],
                        ["table", "link", "image", "video", "audio"],
                        ["fullScreen", "showBlocks", "codeView"],
                        ["preview", "print"],
                    ],
                    placeholder: "Start writing your content...",
                    defaultStyle: "font-family: Inter, sans-serif; font-size: 16px;",
                    imageUploadHeader: {
                        "Accept": "application/json"
                    }
                }}
            />
            <style jsx global>{`
                .sun-editor {
                    border: none !important;
                    font-family: inherit !important;
                }
                .sun-editor .se-toolbar {
                    background-color: #f9fafb !important;
                    outline: none !important;
                    border-bottom: 1px solid #e5e7eb !important;
                }
                .sun-editor-editable {
                    padding: 2rem !important;
                    background-color: white !important;
                }
                /* Ensure headings and lists look consistent with the theme */
                .sun-editor-editable h1 { font-size: 1.5rem !important; font-weight: bold !important; margin-bottom: 0.5rem !important; }
                .sun-editor-editable h2 { font-size: 1.25rem !important; font-weight: bold !important; margin-top: 1rem !important; margin-bottom: 0.5rem !important; }
                .sun-editor-editable ul { list-style-type: disc !important; padding-left: 1.5rem !important; }
                .sun-editor-editable ol { list-style-type: decimal !important; padding-left: 1.5rem !important; }
            `}</style>
        </div>
    );
}
