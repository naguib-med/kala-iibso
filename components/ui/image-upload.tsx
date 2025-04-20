'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { ImagePlus, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ImageUploadProps {
    onUpload: (file: File) => Promise<string>;
    onError?: (error: string) => void;
    onSuccess?: (url: string) => void;
    className?: string;
    maxSize?: number;
    accept?: Record<string, string[]>;
    defaultImage?: string;
}

export function ImageUpload({
    onUpload,
    onError,
    onSuccess,
    className,
    maxSize = 5 * 1024 * 1024, // 5MB par défaut
    accept = {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
    },
    defaultImage
}: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(defaultImage || null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        try {
            setIsUploading(true);
            setPreview(URL.createObjectURL(file));
            const url = await onUpload(file);
            setPreview(url);
            onSuccess?.(url);
        } catch (error) {
            console.error('Upload error:', error);
            onError?.(error instanceof Error ? error.message : 'Erreur lors de l\'upload');
            setPreview(defaultImage || null);
        } finally {
            setIsUploading(false);
        }
    }, [onUpload, onError, onSuccess, defaultImage]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        maxSize,
        accept,
        disabled: isUploading
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                'relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
                isUploading && 'opacity-50 cursor-not-allowed',
                className
            )}
        >
            <input {...getInputProps()} />

            {isUploading ? (
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Upload en cours...</p>
                </div>
            ) : preview ? (
                <div className="relative w-full h-full">
                    <Image
                        src={preview}
                        alt="Preview"
                        className="object-cover rounded-lg"
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white text-sm">Cliquez pour changer</p>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center gap-2">
                    <ImagePlus className="w-8 h-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                        {isDragActive
                            ? "Déposez l'image ici"
                            : "Glissez-déposez une image ou cliquez pour sélectionner"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                        PNG, JPG, GIF jusqu&apos;à {maxSize / 1024 / 1024}MB
                    </p>
                </div>
            )}
        </div>
    );
} 