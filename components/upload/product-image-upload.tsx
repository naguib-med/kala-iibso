'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ImageIcon, Loader2, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface ProductImageUploadProps {
    productId: string;
    currentImage?: string | null;
    onSuccess?: (url: string) => void;
    disabled?: boolean;
    type?: 'main' | 'variant' | 'thumbnail';
}

export function ProductImageUpload({
    productId,
    currentImage,
    onSuccess,
    disabled = false,
    type = 'main'
}: ProductImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(currentImage || null);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (disabled) return;

        const file = acceptedFiles[0];
        if (!file) return;

        try {
            setIsUploading(true);

            // Prévisualiser le fichier
            const objectUrl = URL.createObjectURL(file);
            setPreview(objectUrl);

            // Créer le FormData
            const formData = new FormData();
            formData.append('image', file);
            formData.append('productId', productId);
            formData.append('type', type);

            // Envoyer l'image
            const response = await fetch('/api/upload/product', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error uploading image');
            }

            // Récupérer l'URL
            const data = await response.json();

            // Mettre à jour le preview avec l'URL finale
            setPreview(data.url);

            // Appeler le callback
            onSuccess?.(data.url);

            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error instanceof Error ? error.message : 'Error uploading image');
            setPreview(currentImage || null);
        } finally {
            setIsUploading(false);
        }
    }, [productId, currentImage, disabled, onSuccess, type]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        disabled: isUploading || disabled,
        maxSize: 5 * 1024 * 1024 // 5MB
    });

    const handleRemove = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            setPreview(null);

            const response = await fetch(`/api/product/${productId}/image`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error removing image');
            }

            onSuccess?.('');
            toast.success('Image removed successfully');
        } catch (error) {
            console.error('Remove error:', error);
            toast.error(error instanceof Error ? error.message : 'Error removing image');
        }
    }, [productId, type, onSuccess]);

    return (
        <div
            {...getRootProps()}
            className={cn(
                'relative border-2 border-dashed rounded-md p-2 h-40 flex flex-col items-center justify-center',
                isDragActive ? 'border-primary bg-primary/5' : 'border-muted',
                disabled && 'opacity-50 cursor-not-allowed',
                isUploading && 'opacity-70'
            )}
        >
            <input {...getInputProps()} />

            {isUploading ? (
                <div className="flex flex-col items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
                    <p className="text-sm text-center">Uploading...</p>
                </div>
            ) : preview ? (
                <div className="relative w-full h-full">
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Image
                            src={preview}
                            alt="Product image"
                            fill
                            className="object-contain rounded-md"
                            sizes="(max-width: 768px) 100vw, 300px"
                        />
                    </div>
                    {!disabled && (
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-0 right-0 z-10"
                            onClick={handleRemove}
                        >
                            <TrashIcon className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center">
                    <ImageIcon className="h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground text-center">
                        {isDragActive ? 'Drop the image here' : 'Drag & drop or click to select'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 5MB</p>
                </div>
            )}
        </div>
    );
} 