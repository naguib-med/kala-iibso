'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { updateUser } from '@/app/actions/user';

export default function NewUserPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session, update } = useSession();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const callbackUrl = searchParams.get('callbackUrl') || '/';

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const data = {
            phone: formData.get('phone') as string,
            preferredSize: formData.get('preferredSize') as string,
            bio: formData.get('bio') as string,
            notificationPreferences: {
                email: formData.get('emailNotifications') === 'on',
                sms: formData.get('smsNotifications') === 'on',
            },
            deliveryPreferences: {
                address: formData.get('deliveryAddress') as string,
                city: formData.get('deliveryCity') as string,
                postalCode: formData.get('postalCode') as string,
            },
            interests: Array.from(formData.getAll('interests')) as string[],
        };

        try {
            if (!session?.user?.id) {
                throw new Error('Utilisateur non connecté');
            }

            await updateUser(session.user.id, data);
            await update(); // Mettre à jour la session
            router.push(callbackUrl);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Bienvenue sur Kala Iibso!
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Complétez votre profil pour une meilleure expérience
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        {/* Informations de base */}
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Informations de base</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                                        Numéro de téléphone
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        required
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Numéro de téléphone"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="preferredSize" className="block text-sm font-medium text-gray-700">
                                        Taille préférée
                                    </label>
                                    <select
                                        id="preferredSize"
                                        name="preferredSize"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                    >
                                        <option value="">Sélectionnez votre taille</option>
                                        <option value="XS">XS</option>
                                        <option value="S">S</option>
                                        <option value="M">M</option>
                                        <option value="L">L</option>
                                        <option value="XL">XL</option>
                                        <option value="XXL">XXL</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                                        À propos de vous
                                    </label>
                                    <textarea
                                        id="bio"
                                        name="bio"
                                        rows={3}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Dites-nous en plus sur vous (optionnel)"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Préférences de livraison */}
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Adresse de livraison par défaut</h3>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="deliveryAddress" className="block text-sm font-medium text-gray-700">
                                        Adresse
                                    </label>
                                    <input
                                        id="deliveryAddress"
                                        name="deliveryAddress"
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Votre adresse"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="deliveryCity" className="block text-sm font-medium text-gray-700">
                                        Ville
                                    </label>
                                    <input
                                        id="deliveryCity"
                                        name="deliveryCity"
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Votre ville"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                                        Code postal
                                    </label>
                                    <input
                                        id="postalCode"
                                        name="postalCode"
                                        type="text"
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                        placeholder="Code postal"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Préférences de notification */}
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Préférences de notification</h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <input
                                        id="emailNotifications"
                                        name="emailNotifications"
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="emailNotifications" className="ml-2 block text-sm text-gray-900">
                                        Recevoir des notifications par email
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="smsNotifications"
                                        name="smsNotifications"
                                        type="checkbox"
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="smsNotifications" className="ml-2 block text-sm text-gray-900">
                                        Recevoir des notifications par SMS
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Centres d'intérêt */}
                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Centres d&apos;intérêt</h3>
                            <div className="space-y-2">
                                {['Mode', 'Accessoires', 'Chaussures', 'Beauté', 'Maison', 'Sport'].map((interest) => (
                                    <div key={interest} className="flex items-center">
                                        <input
                                            id={`interest-${interest}`}
                                            name="interests"
                                            type="checkbox"
                                            value={interest}
                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor={`interest-${interest}`} className="ml-2 block text-sm text-gray-900">
                                            {interest}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-500 text-sm text-center">{error}</div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                            {isLoading ? 'Enregistrement...' : 'Compléter mon profil'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 