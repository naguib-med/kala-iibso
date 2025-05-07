'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, MessageCircle, Share2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface ListingActionsProps {
    listingId: string;
    title: string;
    price: number;
    sellerPhone?: string | null;
}

export function ListingActions({ listingId, title, price, sellerPhone }: ListingActionsProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLiked, setIsLiked] = useState(false);
    const [isInCart, setIsInCart] = useState(false);

    const handleAddToCart = async () => {
        if (!session) {
            router.push('/auth/signin');
            return;
        }

        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ listingId }),
            });

            if (!response.ok) throw new Error('Erreur lors de l\'ajout au panier');

            setIsInCart(true);
            toast.success('Article ajouté au panier');
        } catch (error) {
            toast.error('Erreur lors de l\'ajout au panier');
        }
    };

    const handleToggleFavorite = async () => {
        if (!session) {
            router.push('/auth/signin');
            return;
        }

        try {
            const response = await fetch('/api/wishlist', {
                method: isLiked ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ listingId }), // Envoyer listingId
            });

            if (!response.ok) throw new Error('Erreur lors de la mise à jour des favoris');

            setIsLiked(!isLiked);
            toast.success(isLiked ? 'Retiré des favoris' : 'Ajouté aux favoris');
        } catch (error) {
            toast.error('Erreur lors de la mise à jour des favoris');
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: title,
                text: `Découvrez cette annonce : ${title}`,
                url: window.location.href,
            }).catch(console.log);
        } else {
            navigator.clipboard.writeText(window.location.href)
                .then(() => toast.success('Lien copié dans le presse-papier'))
                .catch(() => toast.error('Erreur lors de la copie du lien'));
        }
    };

    const handleWhatsApp = () => {
        if (!sellerPhone) {
            toast.error('Numéro de téléphone non disponible');
            return;
        }

        const message = `Bonjour, je suis intéressé par votre annonce "${title}"`;
        const whatsappUrl = `https://wa.me/${sellerPhone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
                <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={isInCart}
                >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    {isInCart ? 'Dans le panier' : 'Ajouter au panier'}
                </Button>
                <Button
                    size="icon"
                    variant={isLiked ? "destructive" : "secondary"}
                    onClick={handleToggleFavorite}
                >
                    <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                </Button>
            </div>

            <div className="flex items-center gap-2">
                <Button
                    size="lg"
                    variant="outline"
                    className="flex-1"
                    onClick={handleWhatsApp}
                >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contacter le vendeur
                </Button>
                <Button
                    size="icon"
                    variant="outline"
                    onClick={handleShare}
                >
                    <Share2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
} 