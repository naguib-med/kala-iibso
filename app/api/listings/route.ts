import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import * as z from 'zod';
import { NextRequest } from 'next/server';
import { ListingFilters } from '@/types/listings';

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

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filters: ListingFilters = {
      page: Number(searchParams.get('page')) || 1,
      limit: Number(searchParams.get('limit')) || 12,
      priceMin: Number(searchParams.get('priceMin')) || undefined,
      priceMax: Number(searchParams.get('priceMax')) || undefined,
      conditions:
        (searchParams.get('conditions')?.split(',') as any[]) || undefined,
    };

    const where = {
      AND: [
        filters.priceMin ? { price: { gte: filters.priceMin } } : {},
        filters.priceMax ? { price: { lte: filters.priceMax } } : {},
        filters.conditions?.length
          ? { condition: { in: filters.conditions } }
          : {},
      ],
    };

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
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
        orderBy: {
          createdAt: 'desc',
        },
        skip: (filters.page! - 1) * filters.limit!,
        take: filters.limit!,
      }),
      prisma.listing.count({ where }),
    ]);

    return NextResponse.json({
      listings,
      hasMore: total > filters.page! * filters.limit!,
      total,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des listings:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des listings' },
      { status: 500 }
    );
  }
}
