import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const wishlist = await prisma.wishlist.findMany({
      where: { userEmail: session.user.email },
      include: { product: true },
    });

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error('Wishlist fetch error:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array for now
  }
}
