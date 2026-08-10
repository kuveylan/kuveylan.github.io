// src/lib/data.ts
// Veri kaynağı: src/data/servers.json (scraper tarafından güncellenir)

import rawServers from '@/data/servers.json';

export interface ServerItem {
  id: string;
  name: string;
  slug: string;
  source?: string;
  sourceUrl?: string;
  categoryTab: 'opening_this_week' | 'active_online' | '1-99' | '55-120' | 'simyasiz';
  type: '1-99' | '1-105' | '55-120' | '1-120' | 'Vslik';
  structure: 'Editsiz' | 'Simyasız' | 'Lycanlı' | 'Lycansız' | 'Sezonluk';
  status: 'online' | 'opening_soon';
  openingDate?: string;
  countdownDate?: string;
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
  addedAt?: string;
  features: {
    alchemy: boolean;
    lycan: boolean;
    autoHunt: boolean;
    dungeonInfo: boolean;
    maxLevel: number;
  };
}

// JSON'dan oku — tip doğrulama ile
export const MOCK_SERVERS: ServerItem[] = rawServers as ServerItem[];

// Alias (eski kodlarla uyumluluk)
export const SERVERS = MOCK_SERVERS;

// Yardımcı filtreler
export function getServerBySlug(slug: string): ServerItem | undefined {
  return MOCK_SERVERS.find((s) => s.slug === slug);
}

export function getServersByTab(tab: string): ServerItem[] {
  if (tab === 'opening_this_week')
    return MOCK_SERVERS.filter(
      (s) => s.status === 'opening_soon' || s.categoryTab === 'opening_this_week'
    );
  if (tab === 'active_online') return MOCK_SERVERS.filter((s) => s.status === 'online');
  if (tab === '1-99') return MOCK_SERVERS.filter((s) => s.type === '1-99' || s.type === '1-105');
  if (tab === '55-120') return MOCK_SERVERS.filter((s) => s.type === '55-120' || s.type === '1-120');
  if (tab === 'simyasiz')
    return MOCK_SERVERS.filter((s) => s.structure === 'Simyasız' || !s.features.alchemy);
  return MOCK_SERVERS;
}
