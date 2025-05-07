import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import * as z from 'zod';

// Schéma de validation pour la mise à jour
const updateListingSchema = z.object({
  title: z.string().min(5).max(100).optional(),
  description: z.string().min(20).max(2000).optional(),
  price: z.number().positive().optional(),
  condition: z.enum(['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR']).optional(),
  categoryId: z.string().min(1).optional(),
  location: z.string().optional(),
  images: z.array(z.string()).min(1).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'SOLD', 'ARCHIVED']).optional(),
});

// Récupérer une annonce spécifique
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Incrémenter le compteur de vues
    await prisma.listing.update({
      where: { id },
      data: { views: { increment: 1 } },
    });

    // Récupérer les détails de l'annonce
    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            createdAt: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Annonce non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(listing);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'annonce:", error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Mettre à jour une annonce spécifique
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const id = params.id;

    // Vérifier si l'annonce existe et appartient à l'utilisateur
    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Annonce non trouvée' },
        { status: 404 }
      );
    }

    const isAdmin = session.user.role === 'ADMIN';
    const isOwner = listing.userId === session.user.id;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Non autorisé à modifier cette annonce' },
        { status: 403 }
      );
    }

    // Validation des données
    const body = await req.json();

    try {
      updateListingSchema.parse(body);
    } catch (validationError) {
      return NextResponse.json(
        { error: 'Données invalides', details: validationError },
        { status: 400 }
      );
    }

    // Mise à jour de l'annonce
    const updatedListing = await prisma.listing.update({
      where: { id },
      data: {
        ...(body.title && { title: body.title }),
        ...(body.description && { description: body.description }),
        ...(body.price !== undefined && { price: body.price }),
        ...(body.condition && { condition: body.condition }),
        ...(body.categoryId && { categoryId: body.categoryId }),
        ...(body.location !== undefined && { location: body.location }),
        ...(body.images && { images: body.images }),
        ...(body.status && { status: body.status }),
      },
    });

    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'annonce:", error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}

// Supprimer une annonce spécifique
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const id = params.id;

    // Vérifier si l'annonce existe et appartient à l'utilisateur
    const listing = await prisma.listing.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!listing) {
      return NextResponse.json(
        { error: 'Annonce non trouvée' },
        { status: 404 }
      );
    }

    // Vérifier si l'utilisateur est autorisé (propriétaire ou admin)
    const isAdmin = session.user.role === 'ADMIN';
    const isOwner = listing.userId === session.user.id;

    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { error: 'Non autorisé à supprimer cette annonce' },
        { status: 403 }
      );
    }

    // Suppression de l'annonce
    await prisma.listing.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Annonce supprimée avec succès',
    });
  } catch (error) {
    console.error("Erreur lors de la suppression de l'annonce:", error);
    return NextResponse.json(
      { error: 'Erreur interne du serveur' },
      { status: 500 }
    );
  }
}
