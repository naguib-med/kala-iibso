import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import * as z from 'zod';

// Schéma de validation
const listingSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(20).max(2000),
  price: z.number().positive(),
  condition: z.enum(['NEW', 'LIKE_NEW', 'GOOD', 'FAIR', 'POOR']),
  categoryId: z.string().min(1),
  location: z.string().optional(),
  images: z.array(z.string()).min(1),
});

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      console.error('Pas de session ou userId manquant');
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const body = await req.json();

    try {
      listingSchema.parse(body);
    } catch (validationError) {
      console.error('Erreur de validation:', validationError);
      return NextResponse.json(
        { error: 'Données invalides', details: validationError },
        { status: 400 }
      );
    }

    // Vérification de l'existence de l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      console.error('Utilisateur non trouvé:', session.user.id);
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Création de l'annonce
    const listing = await prisma.listing.create({
      data: {
        title: body.title,
        description: body.description,
        price: body.price,
        condition: body.condition,
        images: body.images || [],
        categoryId: body.categoryId,
        userId: session.user.id,
        status: 'DRAFT',
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error("Erreur de création d'annonce:", error);
    return NextResponse.json(
      { error: "Échec de la création de l'annonce" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    // Paramètres de filtrage
    const categoryId = searchParams.get('categoryId');
    const condition = searchParams.get('condition');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const search = searchParams.get('search');

    // Paramètres de pagination
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const skip = (page - 1) * limit;

    // Construction du filtre
    const where: any = {
      status: 'PUBLISHED',
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (condition) {
      where.condition = condition;
    }

    if (minPrice) {
      where.price = {
        ...where.price,
        gte: parseFloat(minPrice),
      };
    }

    if (maxPrice) {
      where.price = {
        ...where.price,
        lte: parseFloat(maxPrice),
      };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Requête pour obtenir le nombre total
    const total = await prisma.listing.count({ where });

    // Requête pour obtenir les annonces
    const listings = await prisma.listing.findMany({
      where,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    });

    // Retourner les annonces avec les métadonnées de pagination
    return NextResponse.json({
      listings,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Erreur de récupération des annonces:', error);
    return NextResponse.json(
      { error: 'Échec de la récupération des annonces' },
      { status: 500 }
    );
  }
}
