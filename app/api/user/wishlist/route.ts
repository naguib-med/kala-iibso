import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const wishlistItems = await prisma.wishlist.findMany({
      where: { userEmail: session.user.email },
      include: { product: true },
    });

    const wishlist = wishlistItems.map((item) => ({
      id: item.id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.image,
    }));

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error('Wishlist fetch error:', error);
    return NextResponse.json([], { status: 200 });
  }
}
