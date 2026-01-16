"use client";

import { useState, useEffect } from "react";
import { Upload, File, X, CheckCircle, Loader2 } from "lucide-react";

interface FileUploadProps {
    currentUrl?: string;
    onUploadComplete: (url: string) => void;
    acceptedTypes?: string[];
    label?: string;
}

export function FileUpload({ 
    currentUrl, 
    onUploadComplete, 
    acceptedTypes = [".pdf", ".ppt", ".pptx"],
    label = "Upload PDF/PPT"
}: FileUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(currentUrl || null);

    // Sync with currentUrl prop changes
    useEffect(() => {
        setUploadedUrl(currentUrl || null);
    }, [currentUrl]);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
        if (!acceptedTypes.includes(fileExtension)) {
            setUploadError(`Invalid file type. Please upload: ${acceptedTypes.join(', ')}`);
            return;
        }

        // Validate file size (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            setUploadError("File size must be less than 50MB");
            return;
        }

        setIsUploading(true);
        setUploadError(null);

        try {
            const filename = encodeURIComponent(file.name);
            const response = await fetch(`/api/upload?filename=${filename}`, {
                method: 'POST',
                body: file,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || errorData.details || `Upload failed: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.url) {
                setUploadedUrl(data.url);
                onUploadComplete(data.url);
            } else {
                throw new Error("No URL returned from upload");
            }
        } catch (error: any) {
            console.error('Upload error:', error);
            setUploadError(error.message || "Failed to upload file. Please try again.");
        } finally {
            setIsUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleRemove = () => {
        setUploadedUrl(null);
        onUploadComplete('');
    };

    return (
        <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
            </label>
            
            {uploadedUrl ? (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        <CheckCircle className="w-5 h-5 text-green-600 shrink-0" />
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-green-900 truncate">
                                File uploaded successfully
                            </p>
                            <a
                                href={uploadedUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-green-600 hover:text-green-700 truncate block"
                            >
                                {uploadedUrl.split('/').pop()}
                            </a>
                        </div>
                    </div>
                    <button
                        onClick={handleRemove}
                        className="ml-2 p-1 text-green-600 hover:text-red-600 transition-colors"
                        title="Remove file"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <div className="relative">
                    <input
                        type="file"
                        id="file-upload"
                        accept={acceptedTypes.join(',')}
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isUploading}
                    />
                    <label
                        htmlFor="file-upload"
                        className={`
                            flex items-center justify-center gap-2 p-4 border-2 border-dashed rounded-lg
                            cursor-pointer transition-all
                            ${isUploading 
                                ? 'border-indigo-300 bg-indigo-50 cursor-not-allowed' 
                                : 'border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50'
                            }
                        `}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                                <span className="text-sm font-medium text-indigo-600">Uploading...</span>
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5 text-indigo-600" />
                                <span className="text-sm font-medium text-indigo-600">
                                    Click to upload or drag and drop
                                </span>
                                <span className="text-xs text-gray-500 ml-2">
                                    ({acceptedTypes.join(', ')})
                                </span>
                            </>
                        )}
                    </label>
                </div>
            )}

            {uploadError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600">{uploadError}</p>
                </div>
            )}

            {uploadedUrl && (
                <div className="text-xs text-gray-500">
                    <File className="w-3 h-3 inline mr-1" />
                    File will be saved when you click "Save Tab Content"
                </div>
            )}
        </div>
    );
}
