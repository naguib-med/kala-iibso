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

export function ListingsFilters() {
    const [priceRange, setPriceRange] = useState([0, 1000]);

    return (
        <Card className="p-6 sticky top-24">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filtres
                </h2>
                <Button variant="ghost" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Réinitialiser
                </Button>
            </div>

            <Accordion type="multiple" defaultValue={['category', 'price', 'condition']} className="space-y-4">
                <AccordionItem value="category">
                    <AccordionTrigger>Catégorie</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-3">
                            {['Électronique', 'Mode', 'Maison', 'Sports', 'Véhicules'].map((category) => (
                                <div key={category} className="flex items-center space-x-2">
                                    <Checkbox id={category} />
                                    <Label htmlFor={category}>{category}</Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="price">
                    <AccordionTrigger>Prix</AccordionTrigger>
                    <AccordionContent>
                        <div className="space-y-4">
                            <Slider
                                min={0}
                                max={1000}
                                step={10}
                                value={priceRange}
                                onValueChange={setPriceRange}
                                className="mt-2"
                            />
                            <div className="flex justify-between text-sm text-muted-foreground">
                                <span>{priceRange[0]} DJF</span>
                                <span>{priceRange[1]} DJF</span>
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
                                    <Checkbox id={value} />
                                    <Label htmlFor={value}>{label}</Label>
                                </div>
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>

            <Button className="w-full mt-6">Appliquer les filtres</Button>
        </Card>
    );
}