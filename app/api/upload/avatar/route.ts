import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { uploadImage } from '@/lib/upload';
import { cloudinary } from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      console.log('Non autorisé: Pas de session utilisateur');
      return new NextResponse(JSON.stringify({ error: 'Non autorisé' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const formData = await req.formData();
    console.log('FormData reçue pour upload, champs:', [...formData.keys()]);

    const image = formData.get('image') as File;
    const userId = formData.get('userId') as string;

    console.log('Données extraites:', {
      userId,
      imageType: image ? typeof image : 'non défini',
      imageEstFichier: image instanceof File,
    });

    if (!image || !userId) {
      console.log('Données manquantes:', { image: !!image, userId: !!userId });
      return new NextResponse(
        JSON.stringify({ error: 'Image et userId requis' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Vérifier que l'utilisateur a le droit de modifier cet avatar
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true, image: true },
    });

    if (!user || (session.user.id !== userId && user.role !== 'ADMIN')) {
      console.log('Accès non autorisé:', {
        userId,
        sessionUserId: session.user.id,
        userRole: user?.role,
      });
      return new NextResponse(JSON.stringify({ error: 'Non autorisé' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Si l'utilisateur a déjà une image, vérifier si elle existe dans Cloudinary
    if (user.image) {
      try {
        const publicId = user.image.split('/').pop()?.split('.')[0];
        if (publicId) {
          console.log("Suppression de l'image précédente:", publicId);
          await cloudinary.uploader.destroy(publicId);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la suppression de l'ancienne image:",
          error
        );
        // On continue même si la suppression échoue
      }
    }

    // Upload de l'image
    console.log("Début de l'upload vers Cloudinary");
    const imageUrl = await uploadImage(image, 'avatars');
    console.log("URL de l'image uploadée:", imageUrl);

    // Mise à jour de l'utilisateur dans la base de données
    await prisma.user.update({
      where: { id: userId },
      data: { image: imageUrl },
    });

    console.log('Avatar mis à jour avec succès');
    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error("Erreur lors de l'upload de l'avatar:", error);
    return new NextResponse(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
