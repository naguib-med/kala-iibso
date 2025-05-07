import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { Readable } from 'stream';
import { cloudinary, ResourceType } from '@/lib/cloudinary';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'Image requise' }, { status: 400 });
    }

    // Validation du type de fichier
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'Le fichier doit être une image' },
        { status: 400 }
      );
    }

    // Conversion du fichier en buffer pour Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Générer un identifiant unique pour l'image
    const uniqueId = uuidv4();

    // Upload vers Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: `kala-iibso/${ResourceType.PRODUCT_MAIN}`, // Utilisation du même dossier que les produits
          public_id: `listing-${uniqueId}`,
          transformation: [
            { width: 1200, height: 1200, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      Readable.from(buffer).pipe(uploadStream);
    });

    const uploadResult = (await uploadPromise) as { secure_url: string };

    if (!uploadResult?.secure_url) {
      return NextResponse.json(
        { error: "Échec de l'upload de l'image" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error("Erreur d'upload d'image d'annonce:", error);
    return NextResponse.json(
      { error: "Échec de l'upload de l'image d'annonce" },
      { status: 500 }
    );
  }
}
