'use client';

import { useState, useEffect } from 'react';
import { ImageUpload } from '@/components/ui/image-upload';
import { toast } from 'sonner';
import { checkImageExists, getDefaultImage, ResourceType } from '@/lib/cloudinary';

interface AvatarUploadProps {
    userId: string;
    currentAvatar?: string;
    onSuccess?: (url: string) => void;
}

export function AvatarUpload({ userId, currentAvatar, onSuccess }: AvatarUploadProps) {
    const [avatar, setAvatar] = useState<string | null>(currentAvatar || null);
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        async function verifyAvatar() {
            if (currentAvatar) {
                try {
                    console.log('Vérification de l\'avatar existant:', currentAvatar);
                    const exists = await checkImageExists(currentAvatar);
                    console.log('L\'avatar existe:', exists);

                    if (!exists) {
                        const defaultAvatarUrl = getDefaultImage(ResourceType.AVATAR);
                        console.log('Image non trouvée, utilisation de l\'avatar par défaut:', defaultAvatarUrl);

                        // Création d'un objet JSON pour envoyer à l'API
                        const data = {
                            userId: userId,
                            image: defaultAvatarUrl
                        };

                        // Mettre à jour la base de données avec l'image par défaut
                        try {
                            const response = await fetch('/api/user/avatar', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(data),
                            });

                            const responseText = await response.text();
                            console.log('Réponse de l\'API (texte):', responseText);

                            const responseData = responseText ? JSON.parse(responseText) : {};
                            console.log('Réponse de l\'API (parsée):', responseData);

                            if (!response.ok) {
                                console.error('Erreur lors de la mise à jour de l\'avatar:', responseData);
                                throw new Error(responseData.error || 'Erreur lors de la mise à jour de l\'avatar');
                            }

                            setAvatar(defaultAvatarUrl);
                        } catch (error) {
                            console.error('Erreur lors de la requête API:', error);
                            setAvatar(defaultAvatarUrl); // On utilise quand même l'avatar par défaut
                        }
                    }
                } catch (error) {
                    console.error('Erreur lors de la vérification de l\'avatar:', error);
                    setAvatar(getDefaultImage(ResourceType.AVATAR));
                }
            } else {
                // Si pas d'avatar, utiliser l'avatar par défaut
                setAvatar(getDefaultImage(ResourceType.AVATAR));
            }
            setIsChecking(false);
        }

        verifyAvatar();
    }, [currentAvatar, userId]);

    const handleUpload = async (file: File) => {
        const formData = new FormData();
        formData.append('image', file);
        formData.append('userId', userId);

        console.log('FormData envoyée:', {
            champs: [...formData.keys()],
            userId: formData.get('userId'),
            fichier: formData.get('image') instanceof File ? 'Fichier présent' : 'Pas de fichier'
        });

        const response = await fetch('/api/upload/avatar', {
            method: 'POST',
            body: formData,
        });

        try {
            const responseText = await response.text();
            console.log('Réponse de l\'upload (texte):', responseText);

            const responseData = responseText ? JSON.parse(responseText) : {};
            console.log('Réponse de l\'upload (parsée):', responseData);

            if (!response.ok) {
                throw new Error(responseData.error || 'Erreur lors de l\'upload de l\'avatar');
            }

            return responseData.url;
        } catch (error) {
            console.error('Erreur lors du parsing de la réponse:', error);
            throw new Error('Erreur lors de l\'upload de l\'avatar');
        }
    };

    const handleSuccess = (url: string) => {
        setAvatar(url);
        onSuccess?.(url);
        toast.success('Avatar mis à jour avec succès');
    };

    const handleError = (error: string) => {
        console.error('Erreur lors de l\'upload:', error);
        toast.error(error);
    };

    if (isChecking) {
        return (
            <div className="w-48 h-48 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="w-48 h-48">
            <ImageUpload
                onUpload={handleUpload}
                onError={handleError}
                onSuccess={handleSuccess}
                maxSize={2 * 1024 * 1024} // 2MB
                accept={{
                    'image/*': ['.png', '.jpg', '.jpeg', '.webp']
                }}
                className="rounded-full"
                defaultImage={avatar || getDefaultImage(ResourceType.AVATAR)}
            />
        </div>
    );
} 