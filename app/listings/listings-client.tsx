"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ListingCard } from "@/components/listings/listing-card";
import { Plus } from "lucide-react";

const CONDITIONS_FR = {
    NEW: "Neuf",
    LIKE_NEW: "Comme neuf",
    GOOD: "Bon état",
    FAIR: "État correct",
    POOR: "État moyen",
};

export default function ListingsClient({ initialListings, categories, totalPages }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [listings, setListings] = useState(initialListings || []);

    // Récupérer les paramètres de recherche
    const querySearch = searchParams.get("query") || "";
    const categorySearch = searchParams.get("category") || "";
    const conditionSearch = searchParams.get("condition") || "";
    const minPriceSearch = searchParams.get("minPrice") || "";
    const maxPriceSearch = searchParams.get("maxPrice") || "";
    const pageSearch = searchParams.get("page") || "1";
    const pageNumber = parseInt(pageSearch, 10) || 1;

    // Fonction pour gérer la soumission des filtres
    const handleFilterSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const query = formData.get("query") || "";
        const category = formData.get("category") || "";
        const condition = formData.get("condition") || "";
        const minPrice = formData.get("minPrice") || "";
        const maxPrice = formData.get("maxPrice") || "";

        const params = new URLSearchParams();
        if (query) params.set("query", query);
        if (category && category !== "all") params.set("category", category);
        if (condition && condition !== "all") params.set("condition", condition);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);
        params.set("page", "1"); // Retour à la première page après filtrage

        router.push(`/listings?${params.toString()}`);
    };

    return (
        <div className="container py-10">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Annonces</h1>
                <Link href="/listings/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Créer une annonce
                    </Button>
                </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                {/* Filtres */}
                <div className="space-y-6">
                    <form onSubmit={handleFilterSubmit}>
                        <div className="space-y-6">
                            <div>
                                <h2 className="font-medium mb-2">Rechercher</h2>
                                <div className="flex gap-2">
                                    <Input
                                        name="query"
                                        placeholder="Rechercher..."
                                        defaultValue={querySearch}
                                        className="flex-1"
                                    />
                                    <Button type="submit" variant="secondary">
                                        Rechercher
                                    </Button>
                                </div>
                            </div>

                            <Separator />

                            <div>
                                <h2 className="font-medium mb-2">Catégorie</h2>
                                <Select name="category" defaultValue={categorySearch || "all"}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Toutes les catégories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes les catégories</SelectItem>
                                        {categories && categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator />

                            <div>
                                <h2 className="font-medium mb-2">État</h2>
                                <Select name="condition" defaultValue={conditionSearch || "all"}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Tous les états" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les états</SelectItem>
                                        {Object.entries(CONDITIONS_FR).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Separator />

                            <div>
                                <h2 className="font-medium mb-2">Prix</h2>
                                <div className="space-y-2">
                                    <Input
                                        name="minPrice"
                                        type="number"
                                        placeholder="Prix min"
                                        defaultValue={minPriceSearch}
                                    />
                                    <Input
                                        name="maxPrice"
                                        type="number"
                                        placeholder="Prix max"
                                        defaultValue={maxPriceSearch}
                                    />
                                    <Button type="submit" variant="secondary" className="w-full">
                                        Appliquer
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Liste des annonces */}
                <div className="md:col-span-3">
                    {listings.length > 0 ? (
                        <>
                            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                {listings.map((listing) => (
                                    <ListingCard key={listing.id} listing={listing} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center mt-10">
                                    <div className="flex gap-2">
                                        {pageNumber > 1 && (
                                            <Link
                                                href={`/listings?${new URLSearchParams({
                                                    ...(querySearch ? { query: querySearch } : {}),
                                                    ...(categorySearch ? { category: categorySearch } : {}),
                                                    ...(conditionSearch ? { condition: conditionSearch } : {}),
                                                    ...(minPriceSearch ? { minPrice: minPriceSearch } : {}),
                                                    ...(maxPriceSearch ? { maxPrice: maxPriceSearch } : {}),
                                                    page: String(pageNumber - 1),
                                                }).toString()}`}
                                            >
                                                <Button variant="outline">Précédent</Button>
                                            </Link>
                                        )}

                                        <span className="flex items-center px-4">
                                            Page {pageNumber} sur {totalPages}
                                        </span>

                                        {pageNumber < totalPages && (
                                            <Link
                                                href={`/listings?${new URLSearchParams({
                                                    ...(querySearch ? { query: querySearch } : {}),
                                                    ...(categorySearch ? { category: categorySearch } : {}),
                                                    ...(conditionSearch ? { condition: conditionSearch } : {}),
                                                    ...(minPriceSearch ? { minPrice: minPriceSearch } : {}),
                                                    ...(maxPriceSearch ? { maxPrice: maxPriceSearch } : {}),
                                                    page: String(pageNumber + 1),
                                                }).toString()}`}
                                            >
                                                <Button variant="outline">Suivant</Button>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="bg-muted rounded-lg p-10 text-center">
                            <h3 className="font-semibold text-xl mb-2">Aucune annonce trouvée</h3>
                            <p className="text-muted-foreground mb-6">Essayez de modifier vos filtres ou créez une nouvelle annonce.</p>
                            <Link href="/listings/new">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Créer une annonce
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}