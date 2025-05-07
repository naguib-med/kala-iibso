'use client';

import { useRouter } from 'next/navigation';
import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface Category {
    id: string;
    name: string;
}

interface FilterClientProps {
    initialValues: {
        query: string;
        category: string;
        condition: string;
        minPrice: string;
        maxPrice: string;
        page: string;
    };
    categories: Category[];
    conditions: Record<string, string>;
}

export default function FilterClient({ initialValues, categories, conditions }: FilterClientProps) {
    const router = useRouter();

    const [query, setQuery] = useState(initialValues.query || '');
    const [category, setCategory] = useState(initialValues.category || '');
    const [condition, setCondition] = useState(initialValues.condition || '');
    const [minPrice, setMinPrice] = useState(initialValues.minPrice || '');
    const [maxPrice, setMaxPrice] = useState(initialValues.maxPrice || '');

    const createQueryString = useCallback((params: Record<string, string>) => {
        const urlParams = new URLSearchParams();

        // Only add non-empty parameters
        Object.entries(params).forEach(([key, value]) => {
            if (value) urlParams.set(key, value);
        });

        return urlParams.toString();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const queryString = createQueryString({
            query,
            category,
            condition,
            minPrice,
            maxPrice,
            page: '1' // Reset to page 1 when search changes
        });

        router.push(`/listings${queryString ? `?${queryString}` : ''}`);
    };

    const handleCategoryChange = (value: string) => {
        setCategory(value);
        const queryString = createQueryString({
            query,
            category: value,
            condition,
            minPrice,
            maxPrice,
            page: '1'
        });

        router.push(`/listings${queryString ? `?${queryString}` : ''}`);
    };

    const handleConditionChange = (value: string) => {
        setCondition(value);
        const queryString = createQueryString({
            query,
            category,
            condition: value,
            minPrice,
            maxPrice,
            page: '1'
        });

        router.push(`/listings${queryString ? `?${queryString}` : ''}`);
    };

    const handlePriceFilter = () => {
        const queryString = createQueryString({
            query,
            category,
            condition,
            minPrice,
            maxPrice,
            page: '1'
        });

        router.push(`/listings${queryString ? `?${queryString}` : ''}`);
    };

    return (
        <>
            <div>
                <h2 className="font-medium mb-2">Rechercher</h2>
                <form onSubmit={handleSearch}>
                    <div className="flex gap-2">
                        <Input
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Rechercher..."
                            className="flex-1"
                        />
                        <Button type="submit" variant="secondary">
                            Rechercher
                        </Button>
                    </div>
                </form>
            </div>

            <Separator />

            <div>
                <h2 className="font-medium mb-2">Catégorie</h2>
                <Select value={category} onValueChange={handleCategoryChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Toutes les catégories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Toutes les catégories</SelectItem>
                        {categories.map((cat) => (
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
                <Select value={condition} onValueChange={handleConditionChange}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Tous les états" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="">Tous les états</SelectItem>
                        {Object.entries(conditions).map(([key, label]) => (
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
                        type="number"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="Prix min"
                    />
                    <Input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Prix max"
                    />
                    <Button
                        onClick={handlePriceFilter}
                        variant="secondary"
                        className="w-full"
                    >
                        Appliquer
                    </Button>
                </div>
            </div>
        </>
    );
}