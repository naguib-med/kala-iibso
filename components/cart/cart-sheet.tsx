"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    ShoppingCart,
    Minus,
    Plus,
    Trash2,
    Loader2,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

export function CartSheet() {
    const router = useRouter();
    const cart = useCart();
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const handleCheckout = async () => {
        try {
            setIsCheckingOut(true);
            // Here you would typically:
            // 1. Create an order
            // 2. Redirect to payment
            await new Promise((resolve) => setTimeout(resolve, 1000));
            router.push("/checkout");
        } catch (error) {
            if (error instanceof Error) {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: `"Failed to proceed to checkout. Please try again."`,
                });
            }
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                    <ShoppingCart className="h-4 w-4" />
                    {cart.items.length > 0 && (
                        <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                            {cart.items.length}
                        </span>
                    )}
                </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col">
                <SheetHeader>
                    <SheetTitle>Shopping Cart</SheetTitle>
                </SheetHeader>

                {cart.items.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center text-center">
                        <div className="space-y-2">
                            <ShoppingCart className="h-12 w-12 mx-auto text-muted-foreground" />
                            <h3 className="font-medium">Your cart is empty</h3>
                            <p className="text-sm text-muted-foreground">
                                Start shopping to add items to your cart
                            </p>
                        </div>
                    </div>
                ) : (
                    <>
                        <ScrollArea className="flex-1 -mx-6 px-6">
                            <div className="space-y-4">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="flex gap-4">
                                        <div className="relative aspect-square h-20 w-20 rounded-lg overflow-hidden">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-1 flex-col">
                                            <h4 className="font-medium">{item.title}</h4>
                                            <p className="text-sm text-muted-foreground mb-2">
                                                ${item.price}
                                            </p>
                                            <div className="flex items-center gap-2 mt-auto">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        cart.updateQuantity(
                                                            item.id,
                                                            Math.max(0, item.quantity - 1)
                                                        )
                                                    }
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className="w-8 text-center">
                                                    {item.quantity}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() =>
                                                        cart.updateQuantity(item.id, item.quantity + 1)
                                                    }
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 ml-auto"
                                                    onClick={() => cart.removeItem(item.id)}
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
                            <div className="space-y-1.5">
                                <div className="flex justify-between">
                                    <span className="font-medium">Total</span>
                                    <span className="font-bold">${cart.total.toFixed(2)}</span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Shipping and taxes calculated at checkout
                                </p>
                            </div>
                            <Button
                                className="w-full"
                                onClick={handleCheckout}
                                disabled={isCheckingOut}
                            >
                                {isCheckingOut ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    "Checkout"
                                )}
                            </Button>
                        </div>
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}