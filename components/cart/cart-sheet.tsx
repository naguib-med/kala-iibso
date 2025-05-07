'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/lib/format';
import Link from 'next/link';

interface CartItem {
  id: string;
  quantity: number;
  listing: {
    id: string;
    title: string;
    price: number;
    images: string[];
  };
}

export function CartSheet() {
  const router = useRouter();
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
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (listingId: string) => {
    try {
      const response = await fetch(`/api/cart?listingId=${listingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');
      setCartItems(cartItems.filter(item => item.listing.id !== listingId));
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.listing.price * item.quantity,
    0
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-xs text-white flex items-center justify-center">
              {cartItems.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Mon panier</SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : cartItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center text-center">
            <div className="space-y-2">
              <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground" />
              <h3 className="font-medium">Votre panier est vide</h3>
              <p className="text-sm text-muted-foreground">
                Commencez à explorer les annonces
              </p>
              <Button asChild>
                <Link href="/listings">Explorer</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <Link href={`/listings/${item.listing.id}`} className="relative aspect-square h-20 w-20 rounded-lg overflow-hidden">
                      <Image
                        src={item.listing.images[0] || '/placeholder.png'}
                        alt={item.listing.title}
                        fill
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex flex-1 flex-col">
                      <Link href={`/listings/${item.listing.id}`}>
                        <h4 className="font-medium hover:text-primary">{item.listing.title}</h4>
                      </Link>
                      <p className="text-sm text-muted-foreground mb-2">
                        {formatPrice(item.listing.price)}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-sm">Quantité: {item.quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeItem(item.listing.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            <div className="space-y-4 pt-6">
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Total</span>
                <span className="font-bold">{formatPrice(total)}</span>
              </div>
              <Button
                className="w-full"
                asChild
              >
                <Link href="/cart">Voir le panier</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}