import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/format';
import { CalendarDays, Eye, MapPin, MessageCircle, ChevronRight, Flag } from 'lucide-react';
import { CONDITIONS } from '@/lib/translations';
import { UserAvatar } from '@/components/user-avatar';
import { ImageGalleryWithMagnify } from '@/components/listings/image-gallery';
import { ListingActions } from '@/components/listings/listing-actions';

interface ListingPageProps {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ListingPageProps): Promise<Metadata> {
    const { id } = await params;
    const listing = await prisma.listing.findUnique({
        where: { id },
        select: { title: true },
    });

    if (!listing) {
        return {
            title: 'Annonce non trouvée | Kala-Iibso',
        };
    }

    return {
        title: `${listing.title} | Kala-Iibso`,
    };
}

function getConditionLabel(condition: string) {
    return CONDITIONS[condition as keyof typeof CONDITIONS] || condition;
}

export default async function ListingPage({ params }: ListingPageProps) {
    const { id } = await params;

    const listing = await prisma.listing.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    createdAt: true,
                    phone: true,
                },
            },
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });

    if (!listing || listing.status === 'ARCHIVED') {
        notFound();
    }

    await prisma.listing.update({
        where: { id },
        data: { views: { increment: 1 } },
    });

    const formattedDate = new Date(listing.createdAt).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    const userJoinDate = new Date(listing.user.createdAt).toLocaleDateString('fr-FR', {
        month: 'long',
        year: 'numeric'
    });

    const similarListings = await prisma.listing.findMany({
        where: {
            categoryId: listing.categoryId,
            id: { not: listing.id },
            status: 'PUBLISHED',
        },
        take: 2,
        select: {
            id: true,
            title: true,
            price: true,
            images: true,
        },
    });

    return (
        <div className="bg-gradient-to-b from-background to-muted/30 min-h-screen mt-[100px]">
            <div className="container pt-4 pb-2">
                <div className="flex items-center text-sm text-muted-foreground">
                    <a href="/" className="hover:text-primary transition">Accueil</a>
                    <ChevronRight className="h-4 w-4 mx-2" />
                    {listing.category && (
                        <>
                            <a href={`/categories/${listing.category.id}`} className="hover:text-primary transition">{listing.category.name}</a>
                            <ChevronRight className="h-4 w-4 mx-2" />
                        </>
                    )}
                    <span className="text-foreground font-medium truncate max-w-xs">{listing.title}</span>
                </div>
            </div>

            <div className="container py-6">
                <div className="grid md:grid-cols-5 gap-8">
                    <div className="md:col-span-3">
                        <ImageGalleryWithMagnify images={listing.images} title={listing.title} />

                        <div className="md:hidden mt-6 space-y-4">
                            <h1 className="text-2xl font-bold">{listing.title}</h1>
                            <p className="text-2xl font-bold text-primary">{formatPrice(listing.price)}</p>

                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="px-3 py-1">{getConditionLabel(listing.condition)}</Badge>
                                {listing.category && (
                                    <Badge variant="outline" className="px-3 py-1">{listing.category.name}</Badge>
                                )}
                            </div>

                            <div className="flex items-center text-muted-foreground">
                                <Eye className="w-4 h-4 mr-2" />
                                <span className="text-sm">{listing.views} vues</span>
                            </div>

                            <div className="border-t pt-4 mt-6">
                                <h2 className="font-semibold text-lg mb-3">Description</h2>
                                <p className="whitespace-pre-line text-muted-foreground">{listing.description}</p>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 space-y-6">
                        <div className="hidden md:block space-y-6">
                            <div className="space-y-2">
                                <h1 className="text-3xl font-bold leading-tight tracking-tight">{listing.title}</h1>
                                <p className="text-3xl font-bold text-primary">{formatPrice(listing.price)}</p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="px-3 py-1.5 text-sm font-medium">
                                    {getConditionLabel(listing.condition)}
                                </Badge>
                                {listing.category && (
                                    <Badge variant="outline" className="px-3 py-1.5 text-sm font-medium">
                                        {listing.category.name}
                                    </Badge>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-xl">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <CalendarDays className="h-4 w-4 flex-shrink-0" />
                                    <span className="text-sm">Publié le {formattedDate}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Eye className="h-4 w-4 flex-shrink-0" />
                                    <span className="text-sm">{listing.views} vues</span>
                                </div>
                                {listing.location && (
                                    <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                                        <MapPin className="h-4 w-4 flex-shrink-0" />
                                        <span className="text-sm">{listing.location}</span>
                                    </div>
                                )}
                            </div>

                            <ListingActions
                                listingId={listing.id}
                                title={listing.title}
                                price={listing.price}
                                sellerPhone={listing.user.phone}
                            />
                        </div>

                        <Card className="bg-background/60 backdrop-blur-sm border shadow-sm rounded-xl overflow-hidden">
                            <div className="p-6 space-y-6">
                                <div className="flex items-center gap-4">
                                    <div className="relative h-16 w-16 flex-shrink-0">
                                        <UserAvatar
                                            imageSrc={listing.user.image}
                                            userName={listing.user.name}
                                            className="h-16 w-16 rounded-full"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-semibold">{listing.user.name}</h3>
                                        <p className="text-sm text-muted-foreground">Membre depuis {userJoinDate}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="hidden md:block space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Description</h2>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <MessageCircle className="h-4 w-4" />
                                    <span>Détails du produit</span>
                                </div>
                            </div>
                            <div className="p-4 bg-muted/30 rounded-xl">
                                <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                                    {listing.description}
                                </p>
                            </div>
                        </div>

                        {listing.status === 'SOLD' && (
                            <div className="bg-yellow-50/80 backdrop-blur-sm border border-yellow-200 p-4 rounded-xl">
                                <div className="flex items-center gap-2 text-yellow-700">
                                    <Flag className="h-4 w-4" />
                                    <p className="font-medium">Cet article a été vendu</p>
                                </div>
                            </div>
                        )}

                        {similarListings.length > 0 && (
                            <div className="hidden md:block space-y-4">
                                <h2 className="text-xl font-semibold">Annonces similaires</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {similarListings.map((item) => (
                                        <a
                                            key={item.id}
                                            href={`/listings/${item.id}`}
                                            className="group block rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
                                        >
                                            <Card className="h-full border-0 shadow-none group-hover:shadow-lg transition-all duration-300">
                                                <div className="relative aspect-square">
                                                    <Image
                                                        src={item.images[0] || '/placeholder-product.png'}
                                                        alt={item.title}
                                                        fill
                                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60" />
                                                </div>
                                                <div className="p-3 space-y-1">
                                                    <h3 className="font-medium text-sm truncate">{item.title}</h3>
                                                    <p className="text-sm font-bold text-primary">{formatPrice(item.price)}</p>
                                                </div>
                                            </Card>
                                        </a>
                                    ))}

                                    {similarListings.length === 1 && (
                                        <Card className="rounded-xl overflow-hidden border-0 shadow-none">
                                            <div className="relative aspect-square bg-muted/30 flex items-center justify-center">
                                                <span className="text-sm text-muted-foreground">Pas d'autres annonces similaires</span>
                                            </div>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}