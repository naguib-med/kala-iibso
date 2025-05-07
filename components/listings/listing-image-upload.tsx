'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ImageIcon, Loader2, TrashIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface ListingImageUploadProps {
    currentImages: string[];
    onImagesChange: (images: string[]) => void;
    maxImages?: number;
    disabled?: boolean;
}

export function ListingImageUpload({
    currentImages = [],
    onImagesChange,
    maxImages = 5,
    disabled = false
}: ListingImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [images, setImages] = useState<string[]>(currentImages);

    // Gérer le dropzone
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (disabled) return;
        if (images.length + acceptedFiles.length > maxImages) {
            toast.error(`Vous ne pouvez pas ajouter plus de ${maxImages} images`);
            return;
        }

        setIsUploading(true);
        const newImages = [...images];

        try {
            for (const file of acceptedFiles) {
                const formData = new FormData();
                formData.append('image', file);

                const response = await fetch('/api/upload/listing', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.message || 'Erreur lors de l\'upload de l\'image');
                }

                const data = await response.json();
                newImages.push(data.url);
            }

            setImages(newImages);
            onImagesChange(newImages);
            toast.success('Images ajoutées avec succès');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error(error instanceof Error ? error.message : 'Erreur lors de l\'upload des images');
        } finally {
            setIsUploading(false);
        }
    }, [images, onImagesChange, maxImages, disabled]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
        },
        disabled: isUploading || disabled || images.length >= maxImages,
        maxSize: 5 * 1024 * 1024 // 5MB
    });

    // Supprimer une image
    const handleRemove = useCallback((index: number) => {
        const newImages = [...images];
        newImages.splice(index, 1);
        setImages(newImages);
        onImagesChange(newImages);
    }, [images, onImagesChange]);

    // Déplacer une image vers le haut
    const moveImageUp = useCallback((index: number) => {
        if (index === 0) return;
        const newImages = [...images];
        const temp = newImages[index - 1];
        newImages[index - 1] = newImages[index];
        newImages[index] = temp;
        setImages(newImages);
        onImagesChange(newImages);
    }, [images, onImagesChange]);

    // Déplacer une image vers le bas
    const moveImageDown = useCallback((index: number) => {
        if (index === images.length - 1) return;
        const newImages = [...images];
        const temp = newImages[index + 1];
        newImages[index + 1] = newImages[index];
        newImages[index] = temp;
        setImages(newImages);
        onImagesChange(newImages);
    }, [images, onImagesChange]);

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Images existantes */}
                {images.map((image, index) => (
                    <div key={index} className="relative group border rounded-md h-40 overflow-hidden">
                        <div className="relative h-full w-full">
                            <Image
                                src={image}
                                alt={`Image ${index + 1}`}
                                fill
                                className="object-cover"
                                sizes="(max-width: 768px) 100vw, 300px"
                            />
                            {index === 0 && (
                                <div className="absolute top-0 left-0 bg-primary text-white text-xs px-2 py-1 rounded-br-md">
                                    Principale
                                </div>
                            )}
                        </div>

                        {!disabled && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => handleRemove(index)}
                                >
                                    <TrashIcon className="h-4 w-4" />
                                </Button>
                                {index > 0 && (
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => moveImageUp(index)}
                                    >
                                        <ArrowUpIcon className="h-4 w-4" />
                                    </Button>
                                )}
                                {index < images.length - 1 && (
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => moveImageDown(index)}
                                    >
                                        <ArrowDownIcon className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {/* Zone de dropzone */}
                {images.length < maxImages && (
                    <div
                        {...getRootProps()}
                        className={cn(
                            'border-2 border-dashed rounded-md h-40 flex flex-col items-center justify-center p-4',
                            isDragActive ? 'border-primary bg-primary/5' : 'border-muted',
                            disabled && 'opacity-50 cursor-not-allowed',
                            isUploading && 'opacity-70'
                        )}
                    >
                        <input {...getInputProps()} />

                        {isUploading ? (
                            <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="text-sm text-center">Upload en cours...</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground text-center">
                                    {isDragActive ? 'Déposez les images ici' : 'Glissez-déposez ou cliquez pour ajouter'}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    PNG, JPG, WEBP jusqu'à 5MB
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <p className="text-sm text-muted-foreground">
                {images.length}/{maxImages} images {images.length > 0 && "(La première image sera l'image principale)"}
            </p>
        </div>
    );
} 