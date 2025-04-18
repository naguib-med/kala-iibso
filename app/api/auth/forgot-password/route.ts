import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import * as z from 'zod';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email } = schema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: "If an account exists, we've sent a reset link" },
        { status: 200 }
      );
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour

    await prisma.resetToken.create({
      data: {
        token,
        expires,
        userId: user.id,
      },
    });

    try {
      // Envoyer l'email directement avec Resend
      const resetLink = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;

      await resend.emails.send({
        from: 'onboarding@resend.dev',
        to: email,
        subject: 'Reset your password',
        html: `
          <h1>Reset your password</h1>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
        `,
      });
    } catch (emailError) {
      console.error('Error sending reset email:', emailError);
    }

    return NextResponse.json(
      { message: "If an account exists, we've sent a reset link" },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
