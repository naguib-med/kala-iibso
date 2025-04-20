import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { uploadImage } from '@/lib/upload';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new NextResponse('Non autorisé', { status: 401 });
    }

    const formData = await req.formData();
    const image = formData.get('image') as File;
    const categoryId = formData.get('categoryId') as string;

    if (!image || !categoryId) {
      return new NextResponse('Image et categoryId requis', { status: 400 });
    }

    // Vérifier que l'utilisateur est admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return new NextResponse('Non autorisé', { status: 403 });
    }

    // Upload de l'image
    const imageUrl = await uploadImage(image, 'categories');

    // Mise à jour de la catégorie
    await prisma.category.update({
      where: { id: categoryId },
      data: { image: imageUrl },
    });

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image de la catégorie:", error);
    return new NextResponse('Erreur interne du serveur', { status: 500 });
  }
}
