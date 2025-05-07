// components/listings/listings-sort.tsx
'use client';

import { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Grid2X2, List } from 'lucide-react';

export function ListingsSort() {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">1-12 sur 156 résultats</span>
            </div>

            <div className="flex items-center gap-4">
                <Select defaultValue="recent">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Trier par" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="recent">Plus récent</SelectItem>
                        <SelectItem value="price-asc">Prix croissant</SelectItem>
                        <SelectItem value="price-desc">Prix décroissant</SelectItem>
                        <SelectItem value="popular">Plus populaire</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex rounded-lg border">
                    <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="icon"
                        className="rounded-r-none"
                        onClick={() => setViewMode('grid')}
                    >
                        <Grid2X2 className="h-4 w-4" />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="icon"
                        className="rounded-l-none"
                        onClick={() => setViewMode('list')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}