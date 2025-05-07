import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const body = await req.json();
    const { listingId } = body;

    if (!listingId) {
      return new NextResponse("ID de l'article requis", { status: 400 });
    }

    // Vérifier si le listing existe
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      return new NextResponse('Article non trouvé', { status: 404 });
    }

    // Vérifier si l'article existe déjà dans le panier
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userEmail: session.user.email,
        listingId: listingId,
      },
    });

    if (existingCartItem) {
      // Mettre à jour la quantité si l'article existe déjà
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + 1 },
      });
    } else {
      // Créer un nouvel élément dans le panier
      await prisma.cartItem.create({
        data: {
          userEmail: session.user.email,
          listingId: listingId,
          quantity: 1,
        },
      });
    }

    return new NextResponse('Article ajouté au panier', { status: 200 });
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier:", error);
    return new NextResponse('Erreur interne', { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const cartItems = await prisma.cartItem.findMany({
      where: {
        userEmail: session.user.email,
      },
      include: {
        listing: true,
      },
    });

    return NextResponse.json(cartItems);
  } catch (error) {
    console.error('Erreur lors de la récupération du panier:', error);
    return new NextResponse('Erreur interne', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get('listingId');

    if (!listingId) {
      return new NextResponse("ID de l'article requis", { status: 400 });
    }

    await prisma.cartItem.deleteMany({
      where: {
        userEmail: session.user.email,
        listingId: listingId,
      },
    });

    return new NextResponse('Article supprimé du panier', { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la suppression du panier:', error);
    return new NextResponse('Erreur interne', { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const { listingId, quantity } = await req.json();
    if (!listingId || !quantity) {
      return new NextResponse("ID de l'article et quantité requis", {
        status: 400,
      });
    }

    // Mettre à jour la quantité
    await prisma.cartItem.updateMany({
      where: {
        userEmail: session.user.email!,
        listingId,
      },
      data: {
        quantity,
      },
    });

    return new NextResponse('Quantité mise à jour', { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du panier:', error);
    return new NextResponse('Erreur interne du serveur', { status: 500 });
  }
}
