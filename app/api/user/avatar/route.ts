import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { cloudinary } from '@/lib/cloudinary';

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get('avatar') as File;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
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

    // Upload to Cloudinary
    const uploadPromise = new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'avatars',
          public_id: `${session.user.email}-${Date.now()}`,
          transformation: [
            { width: 200, height: 200, crop: 'fill' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      // Write buffer to stream
      const bufferStream = require('stream').Readable.from(buffer);
      bufferStream.pipe(uploadStream);
    });

    const uploadResult = await uploadPromise as { secure_url: string };

     // Debug: Vérifie l'utilisateur avant la mise à jour
     const userBefore = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    // Update user profile with new avatar URL
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { image: uploadResult.secure_url },
    });

    return NextResponse.json({ url: uploadResult.secure_url });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    );
  }
}
