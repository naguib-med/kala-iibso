'use client';

import { useState, useEffect } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/format';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

interface WishlistItem {
    id: string;
    listing: {
        id: string;
        title: string;
        price: number;
        images: string[];
        condition: string;
        category: {
            name: string;
        } | null;
        user: {
            name: string | null;
            image: string | null;
        };
    };
}

const getConditionLabel = (condition: string): string => {
    const conditionMap: { [key: string]: string } = {
        'NEW': 'Neuf',
        'LIKE_NEW': 'Comme neuf',
        'GOOD': 'Bon état',
        'FAIR': 'État correct',
        'POOR': 'Mauvais état'
    };

    return conditionMap[condition] || condition;
};

export function WishlistList() {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const response = await fetch('/api/wishlist');
            if (!response.ok) throw new Error('Erreur lors de la récupération de la wishlist');
            const data = await response.json();
            setWishlist(data);
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Erreur lors de la récupération de la wishlist');
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromWishlist = async (listingId: string) => {
        try {
            const response = await fetch('/api/wishlist', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ listingId }),
            });

            if (!response.ok) throw new Error('Erreur lors de la suppression de l\'article de la wishlist');

            setWishlist(wishlist.filter(item => item.listing.id !== listingId));
            toast.success('Article retiré de la wishlist');
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Erreur lors de la suppression de l\'article de la wishlist');
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <Heart className="h-12 w-12 text-muted-foreground" />
                <h3 className="text-xl font-semibold">Wishlist vide</h3>
                <p className="text-muted-foreground text-center">
                    Votre wishlist est vide. <br />
                    Explorez les annonces et ajoutez vos articles préférés ici.
                </p>
                <Button asChild>
                    <Link href="/listings">Explorer les annonces</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                    <Link href={`/listings/${item.listing.id}`}>
                        <div className="relative aspect-square">
                            <Image
                                src={item.listing.images[0] || '/placeholder.png'}
                                alt={item.listing.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </Link>
                    <div className="p-4 space-y-4">
                        <div className="space-y-2">
                            <Link href={`/listings/${item.listing.id}`}>
                                <h3 className="font-semibold hover:text-primary transition-colors">
                                    {item.listing.title}
                                </h3>
                            </Link>
                            <p className="text-2xl font-bold text-primary">
                                {formatPrice(item.listing.price)}
                            </p>
                            {item.listing.category && (
                                <p className="text-sm text-muted-foreground">
                                    {item.listing.category.name}
                                </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                                État : {getConditionLabel(item.listing.condition)}
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                {item.listing.user.image && (
                                    <Image
                                        src={item.listing.user.image}
                                        alt={item.listing.user.name || 'Vendeur'}
                                        width={24}
                                        height={24}
                                        className="rounded-full"
                                    />
                                )}
                                <span className="text-sm text-muted-foreground">
                                    {item.listing.user.name || 'Vendeur'}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeFromWishlist(item.listing.id)}
                                className="text-destructive hover:text-destructive"
                            >
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}