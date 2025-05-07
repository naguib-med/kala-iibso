import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatPrice, formatDate } from '@/lib/format';

const CONDITIONS_FR: Record<string, string> = {
    NEW: 'Neuf',
    LIKE_NEW: 'Comme neuf',
    GOOD: 'Bon état',
    FAIR: 'État correct',
    POOR: 'État moyen',
};

interface ListingCardProps {
    listing: {
        id: string;
        title: string;
        price: number;
        images: string[];
        condition: string;
        createdAt: Date;
        location: string;
        views: number;
        status: string;
        user: {
            name: string | null;
            image: string | null;
        };
        category: {
            name: string;
        };
    };
}

export function ListingCard({ listing }: ListingCardProps) {
    const {
        id,
        title,
        price,
        images,
        condition,
        createdAt,
        location,
        status,
        user,
        category,
    } = listing;

    const thumbnailImage = images && images.length > 0
        ? images[0]
        : '/images/placeholder.png';

    const formattedDate = formatDate(new Date(createdAt));

    return (
        <Link href={`/listings/${id}`}>
            <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
                <div className="relative aspect-square overflow-hidden">
                    <Image
                        src={thumbnailImage}
                        alt={title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    {status === 'SOLD' && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">VENDU</span>
                        </div>
                    )}
                </div>
                <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
                        <span className="font-bold text-lg whitespace-nowrap ml-2">
                            {formatPrice(price)}
                        </span>
                    </div>
                    <div className="space-y-2">
                        <div className="flex gap-2">
                            <Badge variant="outline">{CONDITIONS_FR[condition] || condition}</Badge>
                            <Badge variant="secondary">{category.name}</Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                                <span>{location}</span>
                                <span>•</span>
                                <span>Publié le {formattedDate}</span>
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                    <div className="flex items-center">
                        <Avatar className="h-6 w-6 mr-2">
                            <AvatarImage src={user.image || ''} />
                            <AvatarFallback>{user.name?.charAt(0) || '?'}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                            {user.name || 'Utilisateur'}
                        </span>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    );
} 