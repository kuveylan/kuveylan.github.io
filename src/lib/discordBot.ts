import { ServerItem } from './data';

// DISCORD BOT BOT WEBHOOK & BOT SETUP INSTRUCTIONS
export interface DiscordWebhookPayload {
  username: string;
  avatar_url?: string;
  embeds: Array<{
    title: string;
    description: string;
    url?: string;
    color: number;
    fields: Array<{ name: string; value: string; inline?: boolean }>;
    image?: { url: string };
    footer?: { text: string };
    timestamp?: string;
  }>;
}

export async function sendDiscordServerNotification(server: ServerItem, webhookUrl?: string) {
  const url = webhookUrl || process.env.DISCORD_WEBHOOK_URL;
  if (!url) {
    console.log('Discord Webhook URL not configured. Skipping Discord post.');
    return false;
  }

  const payload: DiscordWebhookPayload = {
    username: 'Metin2Atlas Duyuru Botu',
    avatar_url: 'https://metin2atlas.tech/favicon.ico',
    embeds: [
      {
        title: `🔥 YENİ SERVER EKLENDİ: ${server.name}`,
        description: server.description,
        url: `https://metin2atlas.tech`,
        color: 16109579, // Amber/Gold Color
        fields: [
          { name: '⚔️ Seviye Yapısı', value: server.type, inline: true },
          { name: '🛡️ Özellikler', value: server.structure, inline: true },
          { name: '📅 Açılış Tarihi', value: server.openingDate || 'Yakında', inline: true }
        ],
        image: { url: server.bannerUrl },
        footer: { text: 'Metin2Atlas.tech - Metin2 PVP Portalı' },
        timestamp: new Date().toISOString()
      }
    ]
  };

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    return res.ok;
  } catch (err) {
    console.error('Error sending Discord notification:', err);
    return false;
  }
}
