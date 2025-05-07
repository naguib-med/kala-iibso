'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Trash2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'

interface CartItem {
    id: string
    quantity: number
    product: {
        id: string
        name: string
        price: number
        image: string
    }
}

export function Cart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { data: session } = useSession()
    const { toast } = useToast()

    useEffect(() => {
        if (session) {
            fetchCartItems()
        }
    }, [session])

    const fetchCartItems = async () => {
        try {
            const response = await fetch('/api/cart')
            if (!response.ok) throw new Error('Erreur lors de la récupération du panier')
            const data = await response.json()
            setCartItems(data)
        } catch (error) {
            toast({
                title: 'Erreur',
                description: 'Impossible de charger le panier',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleRemoveItem = async (productId: string) => {
        try {
            const response = await fetch(`/api/cart?listingId=${productId}`, {
                method: 'DELETE',
            })

            if (!response.ok) throw new Error('Erreur lors de la suppression')

            setCartItems(cartItems.filter(item => item.product.id !== productId))
            toast({
                title: 'Article supprimé',
                description: 'L\'article a été retiré de votre panier',
            })
        } catch (error) {
            toast({
                title: 'Erreur',
                description: 'Impossible de supprimer l\'article',
                variant: 'destructive',
            })
        }
    }

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0)
    }

    if (!session) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <h2 className="text-2xl font-bold mb-4">Panier</h2>
                <p className="text-muted-foreground mb-4">Veuillez vous connecter pour voir votre panier</p>
                <Link href="/login">
                    <Button>Se connecter</Button>
                </Link>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex justify-center p-8">
                <p>Chargement du panier...</p>
            </div>
        )
    }

    if (cartItems.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8">
                <h2 className="text-2xl font-bold mb-4">Panier vide</h2>
                <p className="text-muted-foreground mb-4">Votre panier est actuellement vide</p>
                <Link href="/listings">
                    <Button>Voir les articles</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Votre panier</h2>
            <div className="grid gap-6">
                {cartItems.map((item) => (
                    <Card key={item.id} className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-20 h-20 object-cover rounded"
                                />
                                <div>
                                    <h3 className="font-medium">{item.product.name}</h3>
                                    <p className="text-muted-foreground">
                                        {item.quantity} x {item.product.price.toFixed(2)}€
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <p className="font-medium">
                                    {(item.product.price * item.quantity).toFixed(2)}€
                                </p>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => handleRemoveItem(item.product.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            <div className="mt-6 flex justify-between items-center">
                <h3 className="text-xl font-bold">
                    Total: {calculateTotal().toFixed(2)}€
                </h3>
                <Button>Passer la commande</Button>
            </div>
        </div>
    )
} 