'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ui/image-upload';
import { toast } from 'sonner';

interface ProductImageUploadProps {
    productId: string;
    currentImages?: string[];
    onSuccess?: (urls: string[]) => void;
    maxImages?: number;
}

export function ProductImageUpload({
    productId,
    currentImages = [],
    onSuccess,
    maxImages = 5
}: ProductImageUploadProps) {
    const [images, setImages] = useState<string[]>(currentImages);

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('productId', productId);

        const response = await fetch('/api/upload/product', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Erreur lors de l\'upload de l\'image');
        }

        const data = await response.json();
        return data.url;
    };

    const handleSuccess = (url: string) => {
        if (images.length >= maxImages) {
            toast.error(`Maximum ${maxImages} images autorisées`);
            return;
        }

        const newImages = [...images, url];
        setImages(newImages);
        onSuccess?.(newImages);
        toast.success('Image ajoutée avec succès');
    };

    const handleError = (error: string) => {
        toast.error(error);
    };

    const handleRemove = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
        onSuccess?.(newImages);
        toast.success('Image supprimée avec succès');
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {images.map((image, index) => (
                    <div key={index} className="relative group">
                        <img
                            src={image}
                            alt={`Produit ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                            onClick={() => handleRemove(index)}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ))}
                {images.length < maxImages && (
                    <ImageUpload
                        onUpload={handleUpload}
                        onError={handleError} 
                        onSuccess={handleSuccess}
                        maxSize={5 * 1024 * 1024} // 5MB
                        accept={{
                            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
                        }}
                        className="h-32"
                    />
                )}
            </div>
            <p className="text-sm text-gray-500">
                {images.length}/{maxImages} images
            </p>
        </div>
    );
} 