import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return new Response(JSON.stringify({ error: 'Token is required' }), {
        status: 400,
      });
    }

    const verificationToken = await prisma.verificationToken.findFirst({
      where: {
        token,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!verificationToken) {
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        {
          status: 400,
        }
      );
    }

    await prisma.user.update({
      where: {
        email: verificationToken.identifier,
      },
      data: {
        emailVerified: new Date(),
      },
    });

    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: verificationToken.identifier,
          token: token,
        },
      },
    });

    return new Response(
      JSON.stringify({ message: 'Email verified successfully' }),
      {
        status: 200,
      }
    );
  } catch (error) {
    if (error instanceof Error) {
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
      });
    }
  }
}
