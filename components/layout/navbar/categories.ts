import {
  Shirt,
  Watch,
  Smartphone,
  Sofa,
  Dumbbell,
  Sparkles,
  Baby,
  Car,
  PartyPopperIcon as PartyPopper,
  Archive,
  ShirtIcon as ShirtRound,
  LucideEqualSquare as Dress,
  School,
  Hand as HandbagSimple,
  Gem,
  Clock,
  Glasses,
  BriefcaseConveyorBelt as Belt,
  ChefHat as Hat,
  Phone,
  Laptop,
  Gamepad,
  Headphones,
  Armchair,
  Lamp,
  UtensilsCrossed,
  Bike,
  Dice1 as Dice,
  Book,
  Music,
  Scissors,
  SprayCan as Spray,
  Heart,
  Stethoscope,
  Blocks,
  BabyIcon as BabyCarriage,
  CarFront,
  Wrench,
  Palette,
} from 'lucide-react';

export const categories = [
  {
    title: 'Vêtements de Seconde Main',
    icon: Shirt,
    items: [
      {
        title: 'Femme',
        icon: Dress,
        href: '/marketplace/category/femme',
        description: 'Robes, jupes, chemisiers, jeans, vestes, chaussures',
        items: [
          {
            title: 'Robes',
            href: '/marketplace/category/femme/robes',
            icon: Dress,
          },
          {
            title: 'Jupes',
            href: '/marketplace/category/femme/jupes',
            icon: Dress,
          },
          {
            title: 'Chemisiers',
            href: '/marketplace/category/femme/chemisiers',
            icon: Shirt,
          },
          {
            title: 'Jeans',
            href: '/marketplace/category/femme/jeans',
            icon: Shirt,
          },
          {
            title: 'Vestes',
            href: '/marketplace/category/femme/vestes',
            icon: Shirt,
          },
          {
            title: 'Chaussures',
            href: '/marketplace/category/femme/chaussures',
            icon: Shirt,
          },
        ],
      },
      {
        title: 'Homme',
        icon: ShirtRound,
        href: '/marketplace/category/homme',
        description: 'T-shirts, pulls, jeans, costumes, manteaux, chaussures',
        items: [
          {
            title: 'T-shirts',
            href: '/marketplace/category/homme/t-shirts',
            icon: Shirt,
          },
          {
            title: 'Pulls',
            href: '/marketplace/category/homme/pulls',
            icon: Shirt,
          },
          {
            title: 'Jeans',
            href: '/marketplace/category/homme/jeans',
            icon: Shirt,
          },
          {
            title: 'Costumes',
            href: '/marketplace/category/homme/costumes',
            icon: Shirt,
          },
          {
            title: 'Manteaux',
            href: '/marketplace/category/homme/manteaux',
            icon: Shirt,
          },
          {
            title: 'Chaussures',
            href: '/marketplace/category/homme/chaussures',
            icon: Shirt,
          },
        ],
      },
      {
        title: 'Enfants',
        icon: School,
        href: '/marketplace/category/enfants',
        description: 'Tenues, pyjamas, chaussures',
        items: [
          {
            title: 'Tenues',
            href: '/marketplace/category/enfants/tenues',
            icon: Shirt,
          },
          {
            title: 'Pyjamas',
            href: '/marketplace/category/enfants/pyjamas',
            icon: Shirt,
          },
          {
            title: 'Chaussures',
            href: '/marketplace/category/enfants/chaussures',
            icon: Shirt,
          },
        ],
      },
    ],
  },
  {
    title: 'Accessoires',
    icon: Watch,
    items: [
      {
        title: 'Sacs à main',
        href: '/marketplace/category/sacs',
        icon: HandbagSimple,
      },
      { title: 'Bijoux', href: '/marketplace/category/bijoux', icon: Gem },
      { title: 'Montres', href: '/marketplace/category/montres', icon: Clock },
      {
        title: 'Lunettes',
        href: '/marketplace/category/lunettes',
        icon: Glasses,
      },
      {
        title: 'Ceintures',
        href: '/marketplace/category/ceintures',
        icon: Belt,
      },
      { title: 'Chapeaux', href: '/marketplace/category/chapeaux', icon: Hat },
    ],
  },
  {
    title: 'Électronique',
    icon: Smartphone,
    items: [
      {
        title: 'Smartphones',
        href: '/marketplace/category/smartphones',
        icon: Phone,
      },
      {
        title: 'Ordinateurs',
        href: '/marketplace/category/ordinateurs',
        icon: Laptop,
      },
      {
        title: 'Consoles',
        href: '/marketplace/category/consoles',
        icon: Gamepad,
      },
      {
        title: 'Jeux vidéo',
        href: '/marketplace/category/jeux-video',
        icon: Gamepad,
      },
      { title: 'Audio', href: '/marketplace/category/audio', icon: Headphones },
    ],
  },
  {
    title: 'Maison et Décoration',
    icon: Sofa,
    items: [
      {
        title: 'Mobilier',
        href: '/marketplace/category/mobilier',
        icon: Armchair,
      },
      {
        title: 'Décoration',
        href: '/marketplace/category/decoration',
        icon: Lamp,
      },
      {
        title: 'Cuisine',
        href: '/marketplace/category/cuisine',
        icon: UtensilsCrossed,
      },
      {
        title: 'Électroménager',
        href: '/marketplace/category/electromenager',
        icon: Sofa,
      },
    ],
  },
  {
    title: 'Sport et Loisirs',
    icon: Dumbbell,
    items: [
      {
        title: 'Équipements sportifs',
        href: '/marketplace/category/sport',
        icon: Dumbbell,
      },
      { title: 'Vélos', href: '/marketplace/category/velos', icon: Bike },
      {
        title: 'Jeux de société',
        href: '/marketplace/category/jeux-societe',
        icon: Dice,
      },
      { title: 'Livres', href: '/marketplace/category/livres', icon: Book },
      {
        title: 'Instruments de musique',
        href: '/marketplace/category/musique',
        icon: Music,
      },
    ],
  },
  {
    title: 'Beauté et Santé',
    icon: Sparkles,
    items: [
      {
        title: 'Soins capillaires',
        href: '/marketplace/category/soins-capillaires',
        icon: Scissors,
      },
      { title: 'Parfums', href: '/marketplace/category/parfums', icon: Spray },
      {
        title: 'Soins du visage',
        href: '/marketplace/category/soins-visage',
        icon: Heart,
      },
      {
        title: 'Appareils de soin',
        href: '/marketplace/category/appareils-soin',
        icon: Stethoscope,
      },
      {
        title: 'Bien-être',
        href: '/marketplace/category/bien-etre',
        icon: Heart,
      },
    ],
  },
  {
    title: 'Enfance',
    icon: Baby,
    items: [
      { title: 'Jouets', href: '/marketplace/category/jouets', icon: Blocks },
      {
        title: 'Poussettes',
        href: '/marketplace/category/poussettes',
        icon: BabyCarriage,
      },
      {
        title: 'Sièges auto',
        href: '/marketplace/category/sieges-auto',
        icon: CarFront,
      },
      {
        title: 'Matériel de puériculture',
        href: '/marketplace/category/puericulture',
        icon: Baby,
      },
      {
        title: 'Jeux éducatifs',
        href: '/marketplace/category/jeux-educatifs',
        icon: Blocks,
      },
    ],
  },
  {
    title: 'Véhicules et Accessoires',
    icon: Car,
    items: [
      {
        title: 'Pièces auto',
        href: '/marketplace/category/pieces-auto',
        icon: Wrench,
      },
      {
        title: 'Accessoires auto',
        href: '/marketplace/category/accessoires-auto',
        icon: Car,
      },
      {
        title: 'Pièces moto',
        href: '/marketplace/category/pieces-moto',
        icon: Wrench,
      },
      {
        title: 'Accessoires vélo',
        href: '/marketplace/category/accessoires-velo',
        icon: Bike,
      },
      {
        title: 'Équipements',
        href: '/marketplace/category/equipements-vehicules',
        icon: Wrench,
      },
    ],
  },
  {
    title: 'Événements et Festivités',
    icon: PartyPopper,
    items: [
      {
        title: 'Décorations de fête',
        href: '/marketplace/category/decorations-fete',
        icon: PartyPopper,
      },
      {
        title: 'Costumes',
        href: '/marketplace/category/costumes',
        icon: Shirt,
      },
      {
        title: 'Accessoires de fête',
        href: '/marketplace/category/accessoires-fete',
        icon: PartyPopper,
      },
      {
        title: 'Matériel événementiel',
        href: '/marketplace/category/materiel-evenement',
        icon: PartyPopper,
      },
      {
        title: 'Articles religieux',
        href: '/marketplace/category/articles-religieux',
        icon: PartyPopper,
      },
    ],
  },
  {
    title: 'Produits Divers',
    icon: Archive,
    items: [
      {
        title: 'Collections',
        href: '/marketplace/category/collections',
        icon: Archive,
      },
      {
        title: 'Matériel professionnel',
        href: '/marketplace/category/materiel-pro',
        icon: Wrench,
      },
      {
        title: 'Fournitures de bureau',
        href: '/marketplace/category/bureau',
        icon: Archive,
      },
      {
        title: "Articles d'art",
        href: '/marketplace/category/art',
        icon: Palette,
      },
      { title: 'Divers', href: '/marketplace/category/divers', icon: Archive },
    ],
  },
];
