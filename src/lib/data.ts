export interface ServerItem {
  id: string;
  name: string;
  slug: string;
  categoryTab: 'opening_this_week' | 'active_online' | '1-99' | '55-120' | 'simyasiz';
  type: '1-99' | '1-105' | '55-120' | '1-120' | 'Vslik';
  structure: 'Editsiz' | 'Simyasız' | 'Lycanlı' | 'Lycansız' | 'Sezonluk';
  status: 'online' | 'opening_soon';
  openingDate?: string;
  countdownDate?: string; // ISO format for timer
  onlinePlayers?: number;
  votes: number;
  rating: number;
  isVip: boolean;
  isFeatured: boolean;
  bannerUrl: string;
  description: string;
  websiteUrl: string;
  discordUrl: string;
  tags: string[];
  rewardPool?: string;
  features: {
    alchemy: boolean;
    lycan: boolean;
    autoHunt: boolean;
    dungeonInfo: boolean;
    maxLevel: number;
  };
}

export const MOCK_SERVERS: ServerItem[] = [
  {
    id: '1',
    name: 'Atlas2 1-99 Oldschool',
    slug: 'atlas2-1-99-oldschool',
    categoryTab: 'opening_this_week',
    type: '1-99',
    structure: 'Editsiz',
    status: 'opening_soon',
    openingDate: 'Bu Cuma - 15 Ağustos 21:00',
    countdownDate: '2026-08-14T21:00:00+03:00',
    votes: 18450,
    rating: 4.9,
    isVip: true,
    isFeatured: true,
    rewardPool: '100.000 TL Ödül Havuzu',
    bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    description: 'Nostaljik 2008 ruhu! Simyasız, lycansız, otomatik avsız, %100 hilesiz 1-99 Oldschool efsanesi Bu Cuma kapılarını açıyor!',
    websiteUrl: 'https://metin2atlas.tech',
    discordUrl: 'https://discord.gg/metin2atlas',
    tags: ['Bu Cuma Açılıyor', '100K Ödüllü', 'Simyasız', 'Lycansız', 'Oldschool'],
    features: {
      alchemy: false,
      lycan: false,
      autoHunt: false,
      dungeonInfo: true,
      maxLevel: 99
    }
  },
  {
    id: '2',
    name: 'Aura2 55-120 NewSchool Farm',
    slug: 'aura2-55-120-newschool',
    categoryTab: '55-120',
    type: '55-120',
    structure: 'Lycanlı',
    status: 'online',
    onlinePlayers: 6200,
    votes: 14200,
    rating: 4.8,
    isVip: true,
    isFeatured: true,
    rewardPool: '50.000 TL Lonca Turnuvası',
    bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    description: 'Hızlı farm yapısı, özel dereceli zindanlar, derece sistemi ve TL ödüllü lonca savaşları ile rekor online!',
    websiteUrl: '#',
    discordUrl: '#',
    tags: ['55-120', 'Dereceli Zindan', 'Hızlı Farm', 'Rekor Online'],
    features: {
      alchemy: true,
      lycan: true,
      autoHunt: true,
      dungeonInfo: true,
      maxLevel: 120
    }
  },
  {
    id: '3',
    name: 'Kronos2 1-105 Emek Server',
    slug: 'kronos2-1-105-emek',
    categoryTab: '1-99',
    type: '1-105',
    structure: 'Simyasız',
    status: 'opening_soon',
    openingDate: 'Bu Cuma - 15 Ağustos 20:00',
    countdownDate: '2026-08-14T20:00:00+03:00',
    votes: 9300,
    rating: 4.7,
    isVip: false,
    isFeatured: true,
    rewardPool: '25.000 TL Bireysel & Lonca',
    bannerUrl: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    description: 'TR Tipi zorluk derecesi. Simyasız ve Lycansız yapısıyla gerçek oyuncuların buluşma noktası.',
    websiteUrl: '#',
    discordUrl: '#',
    tags: ['Bu Cuma', '1-105', 'TR Tipi Emek', 'Simyasız'],
    features: {
      alchemy: false,
      lycan: false,
      autoHunt: false,
      dungeonInfo: true,
      maxLevel: 105
    }
  },
  {
    id: '4',
    name: 'Rohan2 VS-Like (Anında 99 Lvl)',
    slug: 'rohan2-vs-like',
    categoryTab: 'active_online',
    type: 'Vslik',
    structure: 'Editsiz',
    status: 'online',
    onlinePlayers: 3400,
    votes: 8100,
    rating: 4.6,
    isVip: false,
    isFeatured: false,
    rewardPool: 'Haftalık 10.000 TL VS Turnuvası',
    bannerUrl: 'https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?auto=format&fit=crop&w=800&q=80',
    description: 'Farm yapma derdi yok! Başlangıçta tüm eşyalar hazır, direkt savaşa ve turnuvalara katıl.',
    websiteUrl: '#',
    discordUrl: '#',
    tags: ['VSlik', 'Anında 99', 'TL Ödüllü VS', 'Karakter Dengeli'],
    features: {
      alchemy: false,
      lycan: false,
      autoHunt: false,
      dungeonInfo: false,
      maxLevel: 99
    }
  },
  {
    id: '5',
    name: 'Olympos2 1-99 Nostalji',
    slug: 'olympos2-1-99-nostalji',
    categoryTab: 'simyasiz',
    type: '1-99',
    structure: 'Simyasız',
    status: 'online',
    onlinePlayers: 4100,
    votes: 11200,
    rating: 4.8,
    isVip: true,
    isFeatured: false,
    bannerUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
    description: '2008 yılı Dolunay kılıcı düşürme heyecanı! Eski Türkiye sunucusu atmosferi.',
    websiteUrl: '#',
    discordUrl: '#',
    tags: ['Simyasız', 'Dolunay Düşürmeli', 'Oldschool Emek'],
    features: {
      alchemy: false,
      lycan: false,
      autoHunt: false,
      dungeonInfo: false,
      maxLevel: 99
    }
  }
];
