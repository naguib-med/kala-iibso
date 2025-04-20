import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Types de ressources
export enum ResourceType {
  AVATAR = 'avatars',
  PRODUCT_MAIN = 'products/main',
  PRODUCT_VARIANT = 'products/variants',
  PRODUCT_THUMBNAIL = 'products/thumbnails',
  CATEGORY = 'categories',
  BANNER = 'banners',
}

// Options de transformation par défaut
export const defaultTransformations = {
  [ResourceType.AVATAR]: [
    { width: 200, height: 200, crop: 'fill' },
    { quality: 'auto' },
    { fetch_format: 'auto' },
  ],
  [ResourceType.PRODUCT_MAIN]: [
    { width: 800, height: 800, crop: 'fill' },
    { quality: 'auto' },
    { fetch_format: 'auto' },
  ],
  [ResourceType.PRODUCT_VARIANT]: [
    { width: 400, height: 400, crop: 'fill' },
    { quality: 'auto' },
    { fetch_format: 'auto' },
  ],
  [ResourceType.PRODUCT_THUMBNAIL]: [
    { width: 200, height: 200, crop: 'fill' },
    { quality: 'auto' },
    { fetch_format: 'auto' },
  ],
  [ResourceType.CATEGORY]: [
    { width: 400, height: 200, crop: 'fill' },
    { quality: 'auto' },
    { fetch_format: 'auto' },
  ],
  [ResourceType.BANNER]: [
    { width: 1200, height: 400, crop: 'fill' },
    { quality: 'auto' },
    { fetch_format: 'auto' },
  ],
};

// Fonction pour générer un public_id unique
export const generatePublicId = (
  type: ResourceType,
  identifier: string,
  suffix?: string
) => {
  const timestamp = Date.now();
  // Ne pas inclure le préfixe 'kala-iibso/' car il sera ajouté par l'option folder
  // dans la configuration d'upload
  return suffix
    ? `${identifier}-${suffix}-${timestamp}`
    : `${identifier}-${timestamp}`;
};

// Fonction pour vérifier si une image existe dans Cloudinary
export async function checkImageExists(imageUrl: string): Promise<boolean> {
  try {
    // Extraire le public_id de l'URL
    const publicId = imageUrl.split('/').slice(-2).join('/').split('.')[0];

    // Vérifier l'existence de l'image
    const result = await cloudinary.api.resource(publicId);
    return !!result;
  } catch (error) {
    console.error("Erreur lors de la vérification de l'image:", error);
    return false;
  }
}

// Fonction pour obtenir l'URL par défaut en fonction du type
export function getDefaultImage(type: ResourceType): string {
  const defaultImages = {
    [ResourceType.AVATAR]: '/images/default-avatar.png',
    [ResourceType.PRODUCT_MAIN]: '/images/default-product.png',
    [ResourceType.PRODUCT_VARIANT]: '/images/default-variant.png',
    [ResourceType.PRODUCT_THUMBNAIL]: '/images/default-thumbnail.png',
    [ResourceType.CATEGORY]: '/images/default-category.png',
    [ResourceType.BANNER]: '/images/default-banner.png',
  };
  return defaultImages[type];
}

export { cloudinary };
