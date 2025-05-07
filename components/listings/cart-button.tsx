'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingCart } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'

interface CartButtonProps {
    listingId: string
    price: number
}

export function CartButton({ listingId, price }: CartButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const { data: session } = useSession()

    const handleAddToCart = async () => {
        if (!session) {
            toast({
                title: 'Connexion requise',
                description: 'Veuillez vous connecter pour ajouter des articles au panier',
                variant: 'destructive',
            })
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ listingId }),
            })

            if (!response.ok) {
                const error = await response.text()
                if (response.status === 404) {
                    throw new Error('Produit non trouvé')
                }
                throw new Error(error || 'Erreur lors de l\'ajout au panier')
            }

            toast({
                title: 'Article ajouté',
                description: 'L\'article a été ajouté à votre panier',
            })
        } catch (error) {
            toast({
                title: 'Erreur',
                description: error instanceof Error ? error.message : 'Une erreur est survenue lors de l\'ajout au panier',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            onClick={handleAddToCart}
            disabled={isLoading}
            className="w-full"
        >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isLoading ? 'Ajout en cours...' : `Ajouter au panier - ${price.toFixed(2)}€`}
        </Button>
    )
} 