'use client';

import { useState } from 'react';
import { ImageUpload } from '@/components/ui/image-upload';
import { toast } from 'sonner';

interface CategoryImageUploadProps {
    categoryId: string;
    currentImage?: string;
    onSuccess?: (url: string) => void;
}

export function CategoryImageUpload({
    categoryId,
    currentImage,
    onSuccess
}: CategoryImageUploadProps) {
    const [image, setImage] = useState<string | null>(currentImage || null);

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('categoryId', categoryId);

        const response = await fetch('/api/upload/category', {
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
        setImage(url);
        onSuccess?.(url);
        toast.success('Image de catégorie mise à jour avec succès');
    };

    const handleError = (error: string) => {
        toast.error(error);
    };

    const handleRemove = () => {
        setImage(null);
        onSuccess?.('');
        toast.success('Image supprimée avec succès');
    };

    return (
        <div className="space-y-4">
            <div className="relative">
                {image ? (
                    <div className="relative group">
                        <img
                            src={image}
                            alt="Image de catégorie"
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        <button
                            onClick={handleRemove}
                            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <ImageUpload
                        onUpload={handleUpload}
                        onError={handleError}
                        onSuccess={handleSuccess}
                        maxSize={2 * 1024 * 1024} // 2MB
                        accept={{
                            'image/*': ['.png', '.jpg', '.jpeg', '.webp']
                        }}
                        className="h-48"
                    />
                )}
            </div>
            <p className="text-sm text-gray-500">
                Format recommandé : 800x600px
            </p>
        </div>
    );
} 