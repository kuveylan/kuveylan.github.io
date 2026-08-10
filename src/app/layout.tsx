import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bu Hafta Açılacak Metin2 PVP Serverlar 2026 | Metin2Atlas',
  description: 'Bu Cuma açılacak Metin2 PVP serverlar listesi, 1-99 Oldschool, 1-105, 55-120 emek ve vslik sunucular. Canlı açılış takvimi, server karşılaştırma ve oy verme sistemi.',
  keywords: [
    'bu hafta açılacak metin2 pvp serverlar',
    'bu cuma açılacak pvp serverlar',
    'metin2 pvp serverlar 2026',
    '1-99 emek serverlar',
    '55-120 farm serverlar',
    'simyasız metin2 pvp',
    'metin2 pvp tanıtım',
    'metin2 pvp oy ver',
    'metin2 atlas'
  ],
  authors: [{ name: 'Metin2Atlas Tech Team' }],
  openGraph: {
    title: 'Bu Hafta Açılacak Metin2 PVP Serverlar 2026 | Metin2Atlas',
    description: 'En güncel Metin2 PVP sunucuları, Bu Cuma açılacak serverlar takvimi ve interaktif server sihirbazı.',
    url: 'https://metin2atlas.tech',
    siteName: 'Metin2Atlas',
    locale: 'tr_TR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Metin2Atlas | Metin2 PVP Serverlar Portalı 2026',
    description: 'Bu Cuma açılacak sunucuları canlı geri sayımla keşfet!',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Metin2Atlas',
    url: 'https://metin2atlas.tech',
    description: 'Bu Hafta Açılacak Metin2 PVP Serverlar ve Güncel Sunucu Listesi',
    publisher: {
      '@type': 'Organization',
      name: 'Metin2Atlas',
      url: 'https://metin2atlas.tech'
    }
  };

  return (
    <html lang="tr" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-[#08090c] text-gray-100">
        {children}
      </body>
    </html>
  );
}
