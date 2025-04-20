import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { cloudinary, ResourceType, generatePublicId } from '@/lib/cloudinary';
import { prisma } from '@/lib/prisma';
import { Readable } from 'stream';

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('image') as File;
    const productId = formData.get('productId') as string;
    const type = formData.get('type') as 'main' | 'variant' | 'thumbnail';

    if (!file || !productId || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Convert File to buffer for Cloudinary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique public_id based on type
    const resourceType =
      type === 'main'
        ? ResourceType.PRODUCT_MAIN
        : type === 'variant'
          ? ResourceType.PRODUCT_VARIANT
          : ResourceType.PRODUCT_THUMBNAIL;

    const publicId = generatePublicId(resourceType, productId);

    // Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          public_id: publicId,
          folder: `kala-iibso/${resourceType}`,
          transformation: [
            {
              width: type === 'main' ? 800 : type === 'variant' ? 400 : 200,
              height: type === 'main' ? 800 : type === 'variant' ? 400 : 200,
              crop: 'fill',
            },
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
        { error: 'Failed to upload image' },
        { status: 500 }
      );
    }

    // Mettre à jour l'URL de l'image dans la base de données
    const updateData =
      type === 'main'
        ? { image: uploadResult.secure_url }
        : type === 'variant'
          ? { variantImage: uploadResult.secure_url }
          : { thumbnail: uploadResult.secure_url };

    await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error('Product image upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload product image' },
      { status: 500 }
    );
  }
}
