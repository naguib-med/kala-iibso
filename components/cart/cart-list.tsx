'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/format';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';

interface CartItem {
    id: string;
    quantity: number;
    listing: {
        id: string;
        title: string;
        price: number;
        images: string[];
        condition: string;
        category: {
            name: string;
        } | null;
    };
}

export function CartList() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            const response = await fetch('/api/cart');
            if (!response.ok) throw new Error('Erreur lors de la récupération du panier');
            const data = await response.json();
            setCartItems(data);
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Erreur lors de la récupération du panier');
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = async (listingId: string, newQuantity: number) => {
        if (newQuantity < 1) return;

        try {
            const response = await fetch('/api/cart', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ listingId, quantity: newQuantity }),
            });

            if (!response.ok) throw new Error('Erreur lors de la mise à jour de la quantité');

            setCartItems(cartItems.map(item =>
                item.listing.id === listingId
                    ? { ...item, quantity: newQuantity }
                    : item
            ));
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Erreur lors de la mise à jour de la quantité');
        }
    };

    const removeItem = async (listingId: string) => {
        try {
            const response = await fetch(`/api/cart?listingId=${listingId}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Erreur lors de la suppression de l\'article');

            setCartItems(cartItems.filter(item => item.listing.id !== listingId));
            toast.success('Article retiré du panier');
        } catch (error) {
            console.error('Erreur:', error);
            toast.error('Erreur lors de la suppression de l\'article');
        }
    };

    const total = cartItems.reduce(
        (sum, item) => sum + item.listing.price * item.quantity,
        0
    );

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <h3 className="text-xl font-semibold">Panier vide</h3>
                <p className="text-muted-foreground text-center">
                    Votre panier est vide. <br />
                    Explorez les annonces et ajoutez-les à votre panier.
                </p>
                <Button asChild>
                    <Link href="/listings">Explorer les annonces</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="space-y-4">
                {cartItems.map((item) => (
                    <Card key={item.id} className="p-4">
                        <div className="flex gap-4">
                            <Link href={`/listings/${item.listing.id}`} className="flex-shrink-0">
                                <div className="relative h-24 w-24">
                                    <Image
                                        src={item.listing.images[0] || '/placeholder.png'}
                                        alt={item.listing.title}
                                        fill
                                        className="object-cover rounded-md"
                                    />
                                </div>
                            </Link>
                            <div className="flex-grow space-y-2">
                                <div className="flex justify-between">
                                    <Link href={`/listings/${item.listing.id}`}>
                                        <h3 className="font-semibold hover:text-primary transition-colors">
                                            {item.listing.title}
                                        </h3>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => removeItem(item.listing.id)}
                                        className="text-destructive hover:text-destructive"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                                {item.listing.category && (
                                    <p className="text-sm text-muted-foreground">
                                        {item.listing.category.name}
                                    </p>
                                )}
                                <p className="text-sm text-muted-foreground capitalize">
                                    État : {item.listing.condition.toLowerCase()}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => updateQuantity(item.listing.id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => updateQuantity(item.listing.id, item.quantity + 1)}
                                        >
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="text-lg font-semibold">
                                        {formatPrice(item.listing.price * item.quantity)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <div className="flex justify-end">
                <Card className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total</span>
                        <span className="text-2xl font-bold text-primary">
                            {formatPrice(total)}
                        </span>
                    </div>
                    <Button className="w-full" size="lg">
                        Passer la commande
                    </Button>
                </Card>
            </div>
        </div>
    );
}