'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const regions = [
  'Djibouti Ville',
  'Ali Sabieh',
  'Dikhil',
  'Tadjourah',
  'Obock',
  'Arta',
];

const categories = [
  {
    id: 'vehicles',
    label: 'Véhicules',
    subcategories: ['Voitures', 'Motos', 'Pièces détachées'],
  },
  {
    id: 'electronics',
    label: 'Électronique',
    subcategories: ['Téléphones', 'Ordinateurs', 'TV & Audio'],
  },
  {
    id: 'home',
    label: 'Maison',
    subcategories: ['Meubles', 'Électroménager', 'Décoration'],
  },
  {
    id: 'fashion',
    label: 'Mode',
    subcategories: ['Vêtements', 'Chaussures', 'Accessoires'],
  },
];

const conditions = {
  vehicles: ['Excellent', 'Très bon', 'Bon', 'À rénover'],
  general: ['Neuf', 'Comme neuf', 'Bon état', 'État correct'],
};

export function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [priceRange, setPriceRange] = useState([0, 1000000]);

  const updateFilters = (newParams: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <h2 className="font-semibold mb-4">Localisation</h2>
        <Select onValueChange={(value) => updateFilters({ region: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une région" />
          </SelectTrigger>
          <SelectContent>
            {regions.map((region) => (
              <SelectItem key={region} value={region.toLowerCase()}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      <Card className="p-4">
        <h2 className="font-semibold mb-4">Catégories</h2>
        <div className="space-y-4">
          <Select onValueChange={(value) => updateFilters({ category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Toutes les catégories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => updateFilters({ subcategory: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sous-catégorie" />
            </SelectTrigger>
            <SelectContent>
              {categories
                .find((c) => c.id === searchParams.get('category'))
                ?.subcategories.map((sub) => (
                  <SelectItem key={sub} value={sub.toLowerCase()}>
                    {sub}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="font-semibold mb-4">Prix (DJF)</h2>
        <div className="space-y-4">
          <Slider
            defaultValue={[0, 1000000]}
            max={1000000}
            step={1000}
            value={priceRange}
            onValueChange={setPriceRange}
            onValueCommit={() => {
              updateFilters({
                minPrice: priceRange[0].toString(),
                maxPrice: priceRange[1].toString(),
              });
            }}
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>Min</Label>
              <Input
                type="number"
                value={priceRange[0]}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setPriceRange([value, priceRange[1]]);
                }}
              />
            </div>
            <div className="flex-1">
              <Label>Max</Label>
              <Input
                type="number"
                value={priceRange[1]}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setPriceRange([priceRange[0], value]);
                }}
              />
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <h2 className="font-semibold mb-4">État</h2>
        <Select onValueChange={(value) => updateFilters({ condition: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner l'état" />
          </SelectTrigger>
          <SelectContent>
            {(searchParams.get('category') === 'vehicles'
              ? conditions.vehicles
              : conditions.general
            ).map((condition) => (
              <SelectItem key={condition} value={condition.toLowerCase()}>
                {condition}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      <Button
        className="w-full"
        variant="outline"
        onClick={() => {
          router.push('/search');
          setPriceRange([0, 1000000]);
        }}
      >
        Réinitialiser les filtres
      </Button>
    </div>
  );
}
