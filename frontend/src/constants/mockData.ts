// Club Information
export const CLUB_INFO = {
  name: 'Club Vicentinos',
  founded: 1920,
  location: 'San Miguel, Buenos Aires',
  email: 'info@vicentinos.com.ar',
  phone: '+54 11 4444-5555',
  description: 'Club Vicentinos is a traditional sports club dedicated to rugby and hockey, with a rich history spanning over a century. We are committed to fostering excellence in sports and building a strong community.'
};

// Mock News Articles
export const MOCK_NEWS = [
  {
    id: 1,
    title: 'Rugby Tournament 2024 - Club Vicentinos Advances to Finals',
    description: 'Our rugby team has successfully advanced to the finals of the 2024 Regional Championship after an impressive victory in the semi-finals. The team showed outstanding performance and teamwork throughout the competition.',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    category: 'rugby'
  },
  {
    id: 2,
    title: 'Hockey Registration Now Open for New Season',
    description: 'We are excited to announce that registration for the 2024 hockey season is now open. Players of all skill levels are welcome to join our vibrant hockey community. Registration deadline is August 15th.',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    category: 'hockey'
  },
  {
    id: 3,
    title: 'Annual Club Festival Coming This Weekend',
    description: 'Join us this weekend for our annual Club Vicentinos Festival! Enjoy family activities, live music, delicious food, and special discounts on boutique products. All are welcome to celebrate with us.',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
    category: 'events'
  },
  {
    id: 4,
    title: 'Boutique Collections Updated - New Arrivals Available',
    description: 'Our boutique has recently received new collections of official club merchandise and apparel. Check out the latest designs featuring our classic logo and new seasonal items available at our online store.',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
    category: 'boutique'
  }
];

// Disciplines Data
export const DISCIPLINES = {
  rugby: {
    name: 'Rugby',
    description: 'A traditional sport with a long history at Club Vicentinos, featuring competitive teams and youth development programs.',
    stats: {
      teams: 5,
      players: 120,
      titles: 8
    }
  },
  hockey: {
    name: 'Hockey',
    description: 'Field hockey is one of our most dynamic sports, with professional and amateur teams competing at the highest levels.',
    stats: {
      teams: 4,
      players: 85,
      titles: 6
    }
  }
};

// Mock Boutique Products
export const MOCK_BOUTIQUE_PRODUCTS = [
  {
    id: 1,
    name: 'Official Club Vicentinos Jersey',
    category: 'apparel',
    price: 2500,
    currency: 'ARS',
    image: 'https://via.placeholder.com/300x300?text=Rugby+Jersey'
  },
  {
    id: 2,
    name: 'Club Vicentinos Cap',
    category: 'accessories',
    price: 800,
    currency: 'ARS',
    image: 'https://via.placeholder.com/300x300?text=Club+Cap'
  },
  {
    id: 3,
    name: 'Vicentinos Training Shorts',
    category: 'apparel',
    price: 1800,
    currency: 'ARS',
    image: 'https://via.placeholder.com/300x300?text=Training+Shorts'
  },
  {
    id: 4,
    name: 'Official Club Water Bottle',
    category: 'accessories',
    price: 650,
    currency: 'ARS',
    image: 'https://via.placeholder.com/300x300?text=Water+Bottle'
  }
];

// Utility function to format relative dates
export function formatRelativeDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffMinutes < 1) {
    return 'Hace unos segundos';
  } else if (diffMinutes < 60) {
    return `Hace ${diffMinutes} ${diffMinutes === 1 ? 'minuto' : 'minutos'}`;
  } else if (diffHours < 24) {
    return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
  } else if (diffDays === 1) {
    return 'Ayer';
  } else if (diffDays < 7) {
    return `Hace ${diffDays} ${diffDays === 1 ? 'día' : 'días'}`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `Hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`;
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30);
    return `Hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
  } else {
    const years = Math.floor(diffDays / 365);
    return `Hace ${years} ${years === 1 ? 'año' : 'años'}`;
  }
}
