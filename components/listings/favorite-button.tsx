'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'

interface FavoriteButtonProps {
    productId: string
    isFavorite?: boolean
    onToggle?: () => void
}

export function FavoriteButton({ productId, isFavorite = false, onToggle }: FavoriteButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const { toast } = useToast()
    const { data: session } = useSession()

    const handleToggleFavorite = async () => {
        if (!session) {
            toast({
                title: 'Connexion requise',
                description: 'Veuillez vous connecter pour ajouter aux favoris',
                variant: 'destructive',
            })
            return
        }

        setIsLoading(true)
        try {
            const response = await fetch(`/api/wishlist${isFavorite ? `?productId=${productId}` : ''}`, {
                method: isFavorite ? 'DELETE' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                ...(!isFavorite && { body: JSON.stringify({ productId }) }),
            })

            if (!response.ok) {
                const error = await response.text()
                throw new Error(error || 'Erreur lors de la modification des favoris')
            }

            toast({
                title: isFavorite ? 'Retiré des favoris' : 'Ajouté aux favoris',
                description: isFavorite
                    ? 'L\'article a été retiré de vos favoris'
                    : 'L\'article a été ajouté à vos favoris',
            })

            if (onToggle) {
                onToggle()
            }
        } catch (error) {
            toast({
                title: 'Erreur',
                description: error instanceof Error ? error.message : 'Une erreur est survenue',
                variant: 'destructive',
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={handleToggleFavorite}
            disabled={isLoading}
            className={isFavorite ? 'text-red-500 hover:text-red-600' : ''}
        >
            <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
    )
} 