import { cloudinary, ResourceType, generatePublicId } from '@/lib/cloudinary';

/**
 * Upload une image vers Cloudinary
 * @param file Fichier à uploader
 * @param folder Dossier de destination (correspond à ResourceType)
 * @param identifier Identifiant optionnel pour le nom du fichier
 * @returns URL de l'image uploadée
 */
export async function uploadImage(
  file: File,
  folder: string,
  identifier?: string
): Promise<string> {
  try {
    // Convertir le fichier en buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Générer un identifiant unique si non fourni
    const id = identifier || Date.now().toString();

    // Construire le public_id sans le préfixe kala-iibso (il sera ajouté par l'option folder)
    const publicId = `${id}-${Date.now()}`;

    console.log('Upload avec les paramètres suivants:', {
      folder: `kala-iibso/${folder}`,
      publicId,
    });

    // Uploader vers Cloudinary
    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `kala-iibso/${folder}`,
            public_id: publicId,
            overwrite: true,
            resource_type: 'image',
          },
          (error, result) => {
            if (error) {
              console.error('Erreur Cloudinary:', error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer);
    });

    console.log('Upload réussi:', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error("Erreur lors de l'upload de l'image:", error);
    throw new Error("Erreur lors de l'upload de l'image");
  }
}

/**
 * Supprime une image de Cloudinary
 * @param publicId Identifiant public de l'image
 * @returns Résultat de la suppression
 */
export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    await cloudinary.uploader.destroy(publicId);
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error);
    return false;
  }
}
