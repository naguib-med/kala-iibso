import { Metadata } from 'next';
import { WishlistList } from '@/components/wishlist/wishlist-list';

export const metadata: Metadata = {
    title: 'Ma Wishlist | Kala-Iibso',
    description: 'Consultez votre wishlist sur Kala-Iibso',
};

export default function WishlistPage() {
    return (
        <div className="container mt-[100px]">
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Ma Wishlist</h1>
                    <p className="text-muted-foreground">
                        Retrouvez ici tous les articles de votre wishlist
                    </p>
                </div>
                <WishlistList />
            </div>
        </div>
    );
}