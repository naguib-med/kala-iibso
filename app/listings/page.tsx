// app/listings/page.tsx
import { Metadata } from 'next';
import { ListingsGrid } from '@/components/listings/listings-grid';
import { ListingsFilters } from '@/components/listings/listings-filters';
import { ListingsSort } from '@/components/listings/listings-sort';
import { ListingsHeader } from '@/components/listings/listings-header';

export const metadata: Metadata = {
    title: 'Toutes les annonces | Djibouti Home',
    description: 'Découvrez toutes les annonces disponibles sur Djibouti Home',
};

export default function ListingsPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 mt-20">
            <ListingsHeader />
            <div className="container py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar avec filtres */}
                    <aside className="w-full lg:w-64 space-y-6">
                        <ListingsFilters />
                    </aside>

                    {/* Contenu principal */}
                    <main className="flex-1">
                        <div className="mb-6">
                            <ListingsSort />
                        </div>
                        <ListingsGrid />
                    </main>
                </div>
            </div>
        </div>
    );
}