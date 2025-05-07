// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Vérifier si des catégories existent déjà
  const categoryCount = await prisma.category.count();

  if (categoryCount === 0) {
    console.log(
      'Aucune catégorie trouvée, création des catégories par défaut...'
    );

    // Créer les catégories principales
    const clothing = await prisma.category.create({
      data: {
        name: 'Vêtements',
        slug: 'vetements',
        description: 'Tous types de vêtements pour hommes, femmes et enfants',
      },
    });

    const electronics = await prisma.category.create({
      data: {
        name: 'Électronique',
        slug: 'electronique',
        description: 'Appareils électroniques et accessoires',
      },
    });

    const home = await prisma.category.create({
      data: {
        name: 'Maison',
        slug: 'maison',
        description: 'Décoration, meubles et accessoires pour la maison',
      },
    });

    // Créer les sous-catégories
    await prisma.category.createMany({
      data: [
        // Sous-catégories de Vêtements
        {
          name: 'Homme',
          slug: 'vetements-homme',
          description: 'Vêtements pour homme',
          parentId: clothing.id,
        },
        {
          name: 'Femme',
          slug: 'vetements-femme',
          description: 'Vêtements pour femme',
          parentId: clothing.id,
        },
        {
          name: 'Enfant',
          slug: 'vetements-enfant',
          description: 'Vêtements pour enfant',
          parentId: clothing.id,
        },

        // Sous-catégories d'Électronique
        {
          name: 'Smartphones',
          slug: 'smartphones',
          description: 'Téléphones mobiles et accessoires',
          parentId: electronics.id,
        },
        {
          name: 'Ordinateurs',
          slug: 'ordinateurs',
          description: 'Ordinateurs portables et de bureau',
          parentId: electronics.id,
        },
        {
          name: 'Audio',
          slug: 'audio',
          description: 'Écouteurs, enceintes et équipement audio',
          parentId: electronics.id,
        },

        // Sous-catégories de Maison
        {
          name: 'Salon',
          slug: 'salon',
          description: 'Meubles et décoration pour le salon',
          parentId: home.id,
        },
        {
          name: 'Cuisine',
          slug: 'cuisine',
          description: 'Ustensiles et accessoires de cuisine',
          parentId: home.id,
        },
        {
          name: 'Salle de bain',
          slug: 'salle-de-bain',
          description: 'Accessoires et décoration pour la salle de bain',
          parentId: home.id,
        },
      ],
    });

    console.log('Catégories par défaut créées avec succès !');
  } else {
    console.log(
      `${categoryCount} catégories existent déjà dans la base de données.`
    );
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
