import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const paymentMethodSchema = z.object({
  cardNumber: z.string(),  // Will store masked number
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Must be in format MM/YY'),
  cardHolder: z.string().min(1, 'Card holder name is required'),
  cardType: z.string().nullable(),
  isDefault: z.boolean().default(false),
  id: z.string().optional(), // For updates
});

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
      where: {
        userEmail: session.user.email
      }
    });

    return NextResponse.json(paymentMethods);
  } catch (error) {
    console.error('Payment methods fetch error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to fetch payment methods' },
      { status: 500 }
    );
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
    const validatedData = paymentMethodSchema.parse(data);

    // If this is set as default, unset any existing default
    if (validatedData.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: {
          userEmail: session.user.email,
          isDefault: true
        },
        data: {
          isDefault: false
        }
      });
    }

    // Mask the card number before storing
    const maskedCardNumber = "•".repeat(12) + validatedData.cardNumber.slice(-4);

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        cardNumber: maskedCardNumber,
        expiryDate: validatedData.expiryDate,
        cardHolder: validatedData.cardHolder,
        cardType: validatedData.cardType,
        isDefault: validatedData.isDefault,
        userEmail: session.user.email
      }
    });

    return NextResponse.json(paymentMethod);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid payment method data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Payment method creation error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to create payment method' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const data = await request.json();
    const { id, ...updateData } = paymentMethodSchema.parse(data);

    if (!id) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    // If this is set as default, unset any existing default
    if (updateData.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: {
          userEmail: session.user.email,
          isDefault: true,
          NOT: {
            id: id
          }
        },
        data: {
          isDefault: false
        }
      });
    }

    const paymentMethod = await prisma.paymentMethod.update({
      where: {
        id,
        userEmail: session.user.email
      },
      data: {
        cardNumber: "•".repeat(12) + updateData.cardNumber.slice(-4),
        expiryDate: updateData.expiryDate,
        cardHolder: updateData.cardHolder,
        cardType: updateData.cardType,
        isDefault: updateData.isDefault
      }
    });

    return NextResponse.json(paymentMethod);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid payment method data', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Payment method update error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to update payment method' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop();

    if (!id) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    await prisma.paymentMethod.delete({
      where: {
        id,
        userEmail: session.user.email
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment method deletion error:', error instanceof Error ? error.message : 'Unknown error');
    return NextResponse.json(
      { error: 'Failed to delete payment method' },
      { status: 500 }
    );
  }
}