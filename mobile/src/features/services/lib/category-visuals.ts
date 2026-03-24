export const categoryVisuals: Record<
  string,
  {
    imageUrl: string;
    subtitle: string;
  }
> = {
  demenagement: {
    imageUrl:
      'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&w=1200&q=80',
    subtitle: 'Camion, chargement et manutention',
  },
  electricite: {
    imageUrl:
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=1200&q=80',
    subtitle: 'Luminaires, prises et petits travaux',
  },
  jardinage: {
    imageUrl:
      'https://images.unsplash.com/photo-1461354464878-ad92f492a5a0?auto=format&fit=crop&w=1200&q=80',
    subtitle: 'Entretien, taille et remise au propre',
  },
  menage: {
    imageUrl:
      'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80',
    subtitle: 'Nettoyage ponctuel ou regulier',
  },
  'montage-meuble': {
    imageUrl:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
    subtitle: 'Montage et ajustements soignes',
  },
  peinture: {
    imageUrl:
      'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=1200&q=80',
    subtitle: 'Retouches, murs et finitions',
  },
  plomberie: {
    imageUrl:
      'https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&q=80',
    subtitle: 'Fuites, robinetterie et depannage',
  },
};

export function getCategoryVisual(slug: string) {
  return (
    categoryVisuals[slug] ?? {
      imageUrl:
        'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
      subtitle: 'Prestations a domicile reservees en quelques etapes',
    }
  );
}

export function getCategoryImage(slug: string) {
  return getCategoryVisual(slug).imageUrl;
}
