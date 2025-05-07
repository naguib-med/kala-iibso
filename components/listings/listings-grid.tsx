// components/listings/listings-grid.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Eye, MapPin, Clock } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Listing, ListingFilters } from '@/types/listings';
import { useSearchParams } from 'next/navigation';

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

const getConditionColor = (condition: string): string => {
    const colorMap: { [key: string]: string } = {
        'NEW': 'bg-green-500/10 text-green-600 border-green-500/20',
        'LIKE_NEW': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        'GOOD': 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
        'FAIR': 'bg-orange-500/10 text-orange-600 border-orange-500/20',
        'POOR': 'bg-red-500/10 text-red-600 border-red-500/20'
    };

    return colorMap[condition] || 'bg-gray-500/10 text-gray-600 border-gray-500/20';
};

export function ListingsGrid() {
    const searchParams = useSearchParams();
    const [listings, setListings] = useState<Listing[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setPage(1);
        setListings([]);
        fetchListings(1);
    }, [searchParams]);

    useEffect(() => {
        if (page > 1) {
            fetchListings(page);
        }
    }, [page]);

    const fetchListings = async (currentPage: number) => {
        try {
            const params = new URLSearchParams(searchParams);
            params.set('page', currentPage.toString());
            params.set('limit', '12');

            const response = await fetch(`/api/listings?${params.toString()}`);
            const data = await response.json();

            if (currentPage === 1) {
                setListings(data.listings);
            } else {
                setListings(prev => [...prev, ...data.listings]);
            }

            setHasMore(data.hasMore);
        } catch (error) {
            console.error('Erreur:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading && page === 1) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <Skeleton className="aspect-square" />
                        <div className="p-4 space-y-3">
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                            <Skeleton className="h-8 w-1/3" />
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (listings.length === 0 && !isLoading) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">Aucune annonce trouvée</h3>
                <p className="text-muted-foreground">
                    Essayez de modifier vos critères de recherche
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <AnimatePresence>
                    {listings.map((listing, index) => (
                        <motion.div
                            key={listing.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                                <Link href={`/listings/${listing.id}`}>
                                    <div className="relative aspect-square">
                                        <Image
                                            src={listing.images[0] || '/placeholder.png'}
                                            alt={listing.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                                        {/* Badges */}
                                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                                            <Badge className={getConditionColor(listing.condition)}>
                                                {getConditionLabel(listing.condition)}
                                            </Badge>
                                            <Button
                                                size="icon"
                                                variant="secondary"
                                                className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
                                            >
                                                <Heart className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        {/* Image counter */}
                                        {listing.images.length > 1 && (
                                            <div className="absolute bottom-4 right-4 px-2 py-1 rounded-full bg-black/60 text-white text-xs">
                                                1/{listing.images.length}
                                            </div>
                                        )}
                                    </div>
                                </Link>

                                <div className="p-4 space-y-3">
                                    <Link href={`/listings/${listing.id}`}>
                                        <h3 className="font-semibold line-clamp-2 hover:text-primary transition-colors">
                                            {listing.title}
                                        </h3>
                                    </Link>

                                    <div className="flex items-center justify-between">
                                        <p className="text-xl font-bold text-primary">
                                            {formatPrice(listing.price)}
                                        </p>
                                        {listing.category && (
                                            <Badge variant="secondary" className="text-xs">
                                                {listing.category.name}
                                            </Badge>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="h-4 w-4" />
                                            <span>{listing.location || 'Non spécifié'}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="h-4 w-4" />
                                            <span>{listing.views}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t">
                                        <div className="flex items-center gap-2">
                                            {listing.user.image ? (
                                                <Image
                                                    src={listing.user.image}
                                                    alt={listing.user.name || 'Vendeur'}
                                                    width={24}
                                                    height={24}
                                                    className="rounded-full"
                                                />
                                            ) : (
                                                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-xs font-medium text-primary">
                                                        {listing.user.name?.[0]?.toUpperCase() || 'V'}
                                                    </span>
                                                </div>
                                            )}
                                            <span className="text-sm">
                                                {listing.user.name || 'Vendeur'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                            <Clock className="h-4 w-4" />
                                            <span>
                                                {formatDistanceToNow(new Date(listing.createdAt), {
                                                    addSuffix: true,
                                                    locale: fr,
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {hasMore && (
                <div className="flex justify-center">
                    <Button
                        variant="outline"
                        onClick={() => setPage(p => p + 1)}
                        disabled={isLoading}
                        className="rounded-full px-8"
                    >
                        {isLoading ? 'Chargement...' : 'Charger plus'}
                    </Button>
                </div>
            )}
        </div>
    );
}