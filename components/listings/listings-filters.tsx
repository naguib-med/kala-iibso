// components/listings/listings-filters.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Filter, RefreshCw } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

type Condition = 'NEW' | 'LIKE_NEW' | 'GOOD' | 'FAIR' | 'POOR';

interface FiltersState {
    priceRange: [number, number];
    conditions: Condition[];
}

const DEFAULT_FILTERS: FiltersState = {
    priceRange: [0, 1000],
    conditions: [],
};

export function ListingsFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [filters, setFilters] = useState<FiltersState>(() => {
        const priceMin = Number(searchParams.get('priceMin')) || DEFAULT_FILTERS.priceRange[0];
        const priceMax = Number(searchParams.get('priceMax')) || DEFAULT_FILTERS.priceRange[1];
        const conditions = searchParams.get('conditions')?.split(',') as Condition[] || DEFAULT_FILTERS.conditions;

        return {
            priceRange: [priceMin, priceMax],
            conditions,
        };
    });

    const handleConditionChange = (condition: Condition, checked: boolean) => {
        setFilters(prev => ({
            ...prev,
            conditions: checked
                ? [...prev.conditions, condition]
                : prev.conditions.filter(c => c !== condition)
        }));
    };

    const resetFilters = () => {
        setFilters(DEFAULT_FILTERS);
        const params = new URLSearchParams(searchParams);
        params.delete('priceMin');
        params.delete('priceMax');
        params.delete('conditions');
        router.push(`?${params.toString()}`);
    };

    const applyFilters = () => {
        const params = new URLSearchParams(searchParams);
        params.set('priceMin', filters.priceRange[0].toString());
        params.set('priceMax', filters.priceRange[1].toString());
        if (filters.conditions.length > 0) {
            params.set('conditions', filters.conditions.join(','));
        } else {
            params.delete('conditions');
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <Card className="p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtres
                </h2>
                <Button variant="ghost" size="sm" onClick={resetFilters}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réinitialiser
                </Button>
            </div>

            <Accordion type="multiple" defaultValue={['price', 'condition']} className="space-y-4">
                <AccordionItem value="price">
                    <AccordionTrigger>Prix</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4">
                            <Slider
                                min={0}
                                max={1000}
                                step={10}
                                value={filters.priceRange}
                                onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                                className="mt-2"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>{filters.priceRange[0]} DJF</span>
                                <span>{filters.priceRange[1]} DJF</span>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="condition">
                    <AccordionTrigger>État</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3">
                            {[
                                { value: 'NEW', label: 'Neuf' },
                                { value: 'LIKE_NEW', label: 'Comme neuf' },
                                { value: 'GOOD', label: 'Bon état' },
                                { value: 'FAIR', label: 'État correct' },
                                { value: 'POOR', label: 'Mauvais état' },
                            ].map(({ value, label }) => (
                                <div key={value} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={value}
                                        checked={filters.conditions.includes(value as Condition)}
                                        onCheckedChange={(checked) => handleConditionChange(value as Condition, checked as boolean)}
                                    />
                                    <Label htmlFor={value}>{label}</Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Button className="w-full mt-6" onClick={applyFilters}>Appliquer les filtres</Button>
        </Card>
    );
}