import { Metadata } from 'next';
import { CartList } from '@/components/cart/cart-list';

export const metadata: Metadata = {
    title: 'Mon Panier | Kala-Iibso',
    description: 'Consultez votre panier sur Kala-Iibso',
};

export default function CartPage() {
    return (
        <div className="container mt-[100px]">
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Mon Panier</h1>
                    <p className="text-muted-foreground">
                        Retrouvez ici tous les produits de votre panier
                    </p>
                </div>
                <CartList />
            </div>
        </div>
    );
} 