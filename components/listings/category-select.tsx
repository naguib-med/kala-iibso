'use client';

import { useEffect, useState } from 'react';
import { Category } from '@prisma/client';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface CategorySelectProps {
    value?: string;
    onChange: (value: string) => void;
    categories: (Pick<Category, 'id' | 'name' | 'parentId'>)[];
}

export function CategorySelect({ value, onChange, categories }: CategorySelectProps) {
    const [mainCategories, setMainCategories] = useState<typeof categories>([]);
    const [subCategories, setSubCategories] = useState<typeof categories>([]);
    const [selectedMainCategory, setSelectedMainCategory] = useState<string>('');

    useEffect(() => {
        // Filtrer les catégories principales (sans parent)
        const mainCats = categories.filter(cat => !cat.parentId);
        setMainCategories(mainCats);

        // Si une catégorie est déjà sélectionnée, trouver sa catégorie principale
        if (value) {
            const selectedCategory = categories.find(cat => cat.id === value);
            if (selectedCategory?.parentId) {
                setSelectedMainCategory(selectedCategory.parentId);
                const subs = categories.filter(cat => cat.parentId === selectedCategory.parentId);
                setSubCategories(subs);
            }
        }
    }, [categories, value]);

    const handleMainCategoryChange = (mainCategoryId: string) => {
        setSelectedMainCategory(mainCategoryId);
        const subs = categories.filter(cat => cat.parentId === mainCategoryId);
        setSubCategories(subs);
        // Réinitialiser la sélection de sous-catégorie
        onChange('');
    };

    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium">Catégorie principale</label>
                <Select
                    value={selectedMainCategory}
                    onValueChange={handleMainCategoryChange}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie principale" />
                    </SelectTrigger>
                    <SelectContent>
                        {mainCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {selectedMainCategory && (
                <div>
                    <label className="text-sm font-medium">Sous-catégorie</label>
                    <Select
                        value={value}
                        onValueChange={onChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une sous-catégorie" />
                        </SelectTrigger>
                        <SelectContent>
                            {subCategories.map((category) => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
        </div>
    );
} 