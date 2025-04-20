import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

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

    // Vérifier le type de contenu
    const contentType = req.headers.get('content-type') || '';
    console.log('Content-Type:', contentType);

    let userId = '';
    let image = '';

    // Traiter la requête en fonction du type de contenu
    if (contentType.includes('application/json')) {
      // Traitement JSON
      try {
        const body = await req.json();
        console.log('Données JSON reçues:', body);
        userId = body.userId;
        image = body.image;
      } catch (error) {
        console.error('Erreur de parsing JSON:', error);
        return new NextResponse(
          JSON.stringify({ error: 'Format JSON invalide' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else if (contentType.includes('multipart/form-data')) {
      // Traitement multipart form-data
      try {
        const formData = await req.formData();
        console.log('FormData reçue, champs:', [...formData.keys()]);
        userId = formData.get('userId') as string;
        image = formData.get('image') as string;
      } catch (error) {
        console.error('Erreur de parsing FormData:', error);
        return new NextResponse(
          JSON.stringify({ error: 'Format FormData invalide' }),
          { status: 400, headers: { 'Content-Type': 'application/json' } }
        );
      }
    } else {
      console.log('Type de contenu non pris en charge:', contentType);
      return new NextResponse(
        JSON.stringify({ error: 'Type de contenu non pris en charge' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('Données extraites:', { userId, image });

    if (!userId || !image) {
      console.log('Données manquantes:', { userId, image });
      return new NextResponse(
        JSON.stringify({ error: 'userId et image requis' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Vérifier que l'utilisateur a le droit de modifier cet avatar
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
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

    // Mise à jour de l'utilisateur dans la base de données
    await prisma.user.update({
      where: { id: userId },
      data: { image },
    });

    console.log('Avatar mis à jour avec succès');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'avatar:", error);
    return new NextResponse(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
