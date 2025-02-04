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

    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userEmail: session.user.email },
    });

    return NextResponse.json(paymentMethods);
  } catch (error) {
    console.error('Payment methods fetch error:', error);
    return NextResponse.json([], { status: 200 }); // Return empty array for now
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    
    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        ...data,
        userEmail: session.user.email,
      },
    });

    return NextResponse.json(paymentMethod);
  } catch (error) {
    console.error('Payment method creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment method' },
      { status: 500 }
    );
  }
}
