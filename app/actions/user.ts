'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

interface DeliveryPreferences {
  address: string;
  city: string;
  postalCode: string;
}

export async function updateUser(
  userId: string,
  data: {
    phone?: string;
    preferredSize?: string;
    bio?: string;
    deliveryPreferences?: DeliveryPreferences;
  }
) {
  const session = await auth();

  if (!session?.user || session.user.id !== userId) {
    throw new Error('Non autorisé');
  }

  try {
    // Mettre à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        phone: data.phone,
        preferredSize: data.preferredSize,
        bio: data.bio,
      },
    });

    // Créer ou mettre à jour l'adresse de livraison par défaut
    if (data.deliveryPreferences) {
      // Désactiver toutes les adresses par défaut existantes
      await prisma.address.updateMany({
        where: {
          userEmail: updatedUser.email,
          isDefault: true,
        },
        data: {
          isDefault: false,
        },
      });

      // Créer une nouvelle adresse par défaut
      await prisma.address.create({
        data: {
          userEmail: updatedUser.email,
          street: data.deliveryPreferences.address,
          city: data.deliveryPreferences.city,
          zipCode: data.deliveryPreferences.postalCode,
          state: 'Djibouti', // Valeur par défaut
          isDefault: true,
        },
      });
    }

    return updatedUser;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
    throw new Error('Erreur lors de la mise à jour du profil');
  }
}
