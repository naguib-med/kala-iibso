'use client';

import { useState } from 'react';
import Image from 'next/image';

interface UserAvatarProps {
    imageSrc: string | null;
    userName: string | null;
    className?: string;
}

export function UserAvatar({ imageSrc, userName, className = "" }: UserAvatarProps) {
    const [imgSrc, setImgSrc] = useState(imageSrc || '/avatar-placeholder.png');

    // Pour déboguer
    console.log("UserAvatar reçoit imageSrc:", imageSrc);

    return (
        <div className={`relative ${className}`}>
            <Image
                src={imgSrc}
                alt={userName || 'Vendeur'}
                fill
                className="rounded-full object-cover"
                onError={() => {
                    console.log("Erreur de chargement d'image, fallback vers placeholder");
                    setImgSrc('/avatar-placeholder.png');
                }}
            />
        </div>
    );
}