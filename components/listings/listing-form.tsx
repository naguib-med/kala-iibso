'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { ListingImageUpload } from '@/components/listings/listing-image-upload';
import { Loader2 } from 'lucide-react';
import { CategorySelect } from '@/components/listings/category-select';
import { CONDITIONS } from '@/lib/translations';

// Définition du schéma de validation
const listingFormSchema = z.object({
    title: z.string().min(1, 'Le titre est requis').max(100, 'Le titre ne doit pas dépasser 100 caractères'),
    description: z.string().min(1, 'La description est requise').max(1000, 'La description ne doit pas dépasser 1000 caractères'),
    price: z.number().min(0, 'Le prix doit être positif'),
    categoryId: z.string().min(1, 'La catégorie est requise'),
    condition: z.enum(['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR']),
    images: z.array(z.string()).optional(),
});

type ListingFormValues = z.infer<typeof listingFormSchema>;

interface ListingFormProps {
    categories: {
        id: string;
        name: string;
    }[];
}

export function ListingForm({ categories }: ListingFormProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<string[]>([]);

    const form = useForm<z.infer<typeof listingFormSchema>>({
        resolver: zodResolver(listingFormSchema),
        defaultValues: {
            title: '',
            description: '',
            price: 0,
            categoryId: '',
            condition: 'NEW',
        },
    });

    const onSubmit = async (data: ListingFormValues) => {
        try {
            setIsSubmitting(true);

            // Assurer que les images sont incluses
            data.images = images;

            // Déterminer si c'est une création ou mise à jour
            const url = `/api/listings`;

            const method = 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Une erreur est survenue");
            }

            const result = await response.json();

            toast.success("Annonce créée avec succès");
            router.push(`/listings/${result.id}`);
            router.refresh();
        } catch (error) {
            console.error("Erreur lors de la soumission:", error);
            toast.error(error instanceof Error ? error.message : "Une erreur est survenue");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImagesChange = (newImages: string[]) => {
        setImages(newImages);
        form.setValue('images', newImages, { shouldValidate: true });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Titre de l'annonce</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: iPhone 13 Pro en excellent état" {...field} />
                            </FormControl>
                            <FormDescription>
                                Un titre clair et précis attire plus d'acheteurs.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Décrivez votre article en détail (état, caractéristiques, raison de la vente, etc.)"
                                    className="min-h-32"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                Une description détaillée augmente vos chances de vendre rapidement.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Prix (en €)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        {...field}
                                        onChange={e => field.onChange(parseFloat(e.target.value))}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="condition"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>État</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionnez l'état de l'article" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.entries(CONDITIONS).map(([value, label]) => (
                                            <SelectItem key={value} value={value}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Catégorie</FormLabel>
                            <FormControl>
                                <CategorySelect
                                    value={field.value}
                                    onChange={field.onChange}
                                    categories={categories}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="images"
                    render={() => (
                        <FormItem>
                            <FormLabel>Photos de l'article</FormLabel>
                            <FormControl>
                                <ListingImageUpload
                                    currentImages={images}
                                    onImagesChange={handleImagesChange}
                                    maxImages={5}
                                />
                            </FormControl>
                            <FormDescription>
                                Ajoutez jusqu'à 5 photos de bonne qualité. La première sera l'image principale.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                    >
                        Annuler
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Publier l'annonce
                    </Button>
                </div>
            </form>
        </Form>
    );
} 