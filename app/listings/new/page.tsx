import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { ListingForm } from '@/components/listings/listing-form';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export const metadata: Metadata = {
    title: 'Publier une annonce | Kala-Iibso',
    description: 'Publiez votre annonce et vendez vos articles rapidement et facilement.',
};

export default async function NewListingPage() {
    // Vérifier l'authentification
    const session = await auth();

    if (!session?.user) {
        redirect('/api/auth/signin?callbackUrl=/listings/new');
    }

    // Récupérer toutes les catégories pour le sélecteur
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            parentId: true,
        },
        orderBy: {
            name: 'asc',
        },
    });

    return (
        <div className="container mx-auto mt-[100px]">
            <div className="max-w-3xl mx-auto">
                <div className="flex flex-col gap-6">
                    <div>
                        <h1 className="text-3xl font-bold">Publier une annonce</h1>
                        <p className="text-muted-foreground mt-2">
                            Remplissez le formulaire ci-dessous pour mettre en vente votre article.
                        </p>
                    </div>

                    <div className="border rounded-lg p-6">
                        <ListingForm categories={categories} />
                    </div>
                </div>
            </div>
        </div>
    );
} 