import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const { listingId } = await req.json();
    if (!listingId) {
      return new NextResponse("ID de l'annonce requis", { status: 400 });
    }

    // Vérifier si l'annonce est déjà en favoris
    const existingWishlist = await prisma.wishlist.findFirst({
      where: {
        userEmail: session.user.email!,
        listingId,
      },
    });

    if (existingWishlist) {
      return new NextResponse('Annonce déjà en favoris', { status: 400 });
    }

    // Ajouter l'annonce aux favoris
    await prisma.wishlist.create({
      data: {
        userEmail: session.user.email!,
        listingId,
      },
    });

    return new NextResponse('Annonce ajoutée aux favoris', { status: 200 });
  } catch (error) {
    console.error("Erreur lors de l'ajout aux favoris:", error);
    return new NextResponse('Erreur interne du serveur', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const { listingId } = await req.json();
    if (!listingId) {
      return new NextResponse("ID de l'annonce requis", { status: 400 });
    }

    // Supprimer l'annonce des favoris
    await prisma.wishlist.deleteMany({
      where: {
        userEmail: session.user.email!,
        listingId,
      },
    });

    return new NextResponse('Annonce retirée des favoris', { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la suppression des favoris:', error);
    return new NextResponse('Erreur interne du serveur', { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    // Récupérer les favoris de l'utilisateur
    const wishlist = await prisma.wishlist.findMany({
      where: {
        userEmail: session.user.email!,
      },
      include: {
        listing: {
          include: {
            category: {
              select: {
                name: true,
              },
            },
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris:', error);
    return new NextResponse('Erreur interne du serveur', { status: 500 });
  }
}
