/**
 * Metin2Atlas — Hibrit Server Scraper
 * ====================================
 * 1. RSS beslemeleri üzerinden Turkmmo & Metin2Box server duyurularını çeker
 * 2. RSS yoksa Cheerio ile HTML parse yapar (metin2pvp.net, metin2sunucu.com)
 * 3. Mevcut servers.json ile karşılaştırır, duplicate engeller
 * 4. Yeni serverları ekler, güncellenen serverları senkronize eder
 * 5. src/data/servers.json dosyasını yazar
 *
 * Çalıştırma:
 *   node scripts/scraper.js
 *   node scripts/scraper.js --dry-run   (yazmaz, sadece gösterir)
 */

const axios = require('axios');
const cheerio = require('cheerio');
const RSSParser = require('rss-parser');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ───────────────────────────────────────────────────────────
// Ayarlar
// ───────────────────────────────────────────────────────────
const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'servers.json');
const DRY_RUN = process.argv.includes('--dry-run');
const rss = new RSSParser({ timeout: 10000 });

const HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (compatible; Metin2Atlas-Bot/1.0; +https://metin2atlas.tech)',
  'Accept-Language': 'tr-TR,tr;q=0.9,en;q=0.8',
};

// ───────────────────────────────────────────────────────────
// Hedef Kaynaklar
// ───────────────────────────────────────────────────────────
const SOURCES = [
  // --- RSS Kaynakları ---
  {
    name: 'Turkmmo PVP Duyurular',
    type: 'rss',
    url: 'https://www.turkmmo.com/forum/metin2-ozel-sunucular/index.rss',
    fallbackUrl: 'https://www.turkmmo.com/forum/metin2-ozel-sunucular/',
  },
  {
    name: 'Turkmmo Yeni Açılacak Serverlar',
    type: 'rss',
    url: 'https://www.turkmmo.com/forum/metin2-sunucu-tanitim/index.rss',
    fallbackUrl: 'https://www.turkmmo.com/forum/metin2-sunucu-tanitim/',
  },
  // --- HTML Scrape Kaynakları ---
  {
    name: 'Metin2PVP.net Listing',
    type: 'html',
    url: 'https://www.metin2pvp.net/tr/sunucular',
    parser: 'metin2pvp',
  },
  {
    name: 'Metin2Sunucu.com Listing',
    type: 'html',
    url: 'https://www.metin2sunucu.com/',
    parser: 'metin2sunucu',
  },
  {
    name: 'ePvP Metin2 TR Servers',
    type: 'html',
    url: 'https://www.elitepvpers.com/forum/metin2-private-server/',
    parser: 'epvp',
  },
];

// ───────────────────────────────────────────────────────────
// Yardımcı Fonksiyonlar
// ───────────────────────────────────────────────────────────

/** Türkçe metin içinde server tipini tespit et */
function detectType(text) {
  const t = text.toLowerCase();
  if (/\bvslik\b|vs.*lik|full\s*item/.test(t)) return 'Vslik';
  if (/55\s*[-–]\s*120|newschool|new.?school/.test(t)) return '55-120';
  if (/1\s*[-–]\s*120/.test(t)) return '1-120';
  if (/1\s*[-–]\s*105|1105/.test(t)) return '1-105';
  if (/1\s*[-–]\s*99|oldschool|old.?school/.test(t)) return '1-99';
  return '1-99'; // Varsayılan
}

/** Açılış tarihini metinden çıkar */
function detectOpeningDate(text) {
  const t = text.toLowerCase();
  const now = new Date();

  // "Bu Cuma" / "Bu Cumartesi" / "Bu Pazar" vb.
  const gunler = { cuma: 5, cumartesi: 6, pazar: 0, pazartesi: 1, sali: 2, çarşamba: 3, perşembe: 4 };
  for (const [gunAdi, gunNo] of Object.entries(gunler)) {
    if (t.includes(`bu ${gunAdi}`) || t.includes(`bu ${gunAdi.replace('ş', 's').replace('ç', 'c')}`)) {
      const d = new Date();
      const diff = (gunNo - now.getDay() + 7) % 7 || 7;
      d.setDate(d.getDate() + diff);
      d.setHours(21, 0, 0, 0);
      return d.toISOString();
    }
  }

  // DD.MM.YYYY veya DD/MM/YYYY
  const dateMatch = text.match(/(\d{1,2})[./](\d{1,2})[./](\d{4})/);
  if (dateMatch) {
    const d = new Date(`${dateMatch[3]}-${dateMatch[2]}-${dateMatch[1]}T21:00:00+03:00`);
    if (!isNaN(d.getTime())) return d.toISOString();
  }

  // "15 Ağustos", "20 Eylül" vb.
  const aylar = { ocak: 1, şubat: 2, mart: 3, nisan: 4, mayıs: 5, haziran: 6,
    temmuz: 7, ağustos: 8, eylül: 9, ekim: 10, kasım: 11, aralık: 12 };
  for (const [ay, ayNo] of Object.entries(aylar)) {
    const m = text.toLowerCase().match(new RegExp(`(\\d{1,2})\\s*${ay}`));
    if (m) {
      const d = new Date();
      d.setMonth(ayNo - 1, parseInt(m[1]));
      d.setHours(21, 0, 0, 0);
      if (d < now) d.setFullYear(d.getFullYear() + 1);
      return d.toISOString();
    }
  }

  return null;
}

/** Simya / Lycan / AutoHunt vb. özellikler */
function detectFeatures(text) {
  const t = text.toLowerCase();
  return {
    alchemy: !/simyasız|simyassiz|no.?alch/.test(t) && /simya/.test(t),
    lycan: /lycan|kurt\s*adam/.test(t) && !/lycansız|lycansiz/.test(t),
    autoHunt: /oto.?av|auto.?hunt|otomatik av/.test(t),
    dungeonInfo: /zindan|dungeon|mythic/.test(t),
    maxLevel: (() => {
      const m = text.match(/\b(99|105|120)\b/);
      return m ? parseInt(m[1]) : 99;
    })(),
  };
}

/** Server yapısını tespit et */
function detectStructure(text) {
  const t = text.toLowerCase();
  if (/sezonluk|season/.test(t)) return 'Sezonluk';
  if (/simyasız|simyassiz/.test(t)) return 'Simyasız';
  if (/lycansız|lycansiz/.test(t)) return 'Lycansız';
  if (/lycanlı|lycanli/.test(t)) return 'Lycanlı';
  if (/editsiz/.test(t)) return 'Editsiz';
  return 'Editsiz';
}

/** Kategori sekmesini belirle */
function detectCategoryTab(openingDate, status) {
  if (openingDate) return 'opening_this_week';
  if (status === 'online') return 'active_online';
  return 'active_online';
}

/** Slug üret — duplicate tespiti için kullanılır */
function makeSlug(name) {
  return name
    .toLowerCase()
    .replace(/[ğ]/g, 'g').replace(/[ü]/g, 'u').replace(/[ş]/g, 's')
    .replace(/[ı]/g, 'i').replace(/[ö]/g, 'o').replace(/[ç]/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** ID üret */
function makeId(name, domain) {
  const base = `${makeSlug(name)}-${domain || 'unknown'}`;
  return crypto.createHash('md5').update(base).digest('hex').slice(0, 8) + '-' + makeSlug(name).slice(0, 30);
}

/** Türkçe banner URL (Unsplash tema görselleri) */
function pickBannerUrl(type) {
  const banners = {
    '1-99':   'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    '1-105':  'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=800&q=80',
    '55-120': 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    '1-120':  'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    'Vslik':  'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
  };
  return banners[type] || banners['1-99'];
}

/** Delay fonksiyonu — rate limiting */
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// ───────────────────────────────────────────────────────────
// Veri Kaydetme / Yükleme
// ───────────────────────────────────────────────────────────

function loadExisting() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch {
    return [];
  }
}

function saveServers(servers) {
  if (DRY_RUN) {
    console.log('\n[DRY RUN] Kaydedilecek server sayısı:', servers.length);
    return;
  }
  fs.writeFileSync(DATA_FILE, JSON.stringify(servers, null, 2), 'utf-8');
  console.log(`✅ servers.json güncellendi — toplam ${servers.length} server`);
}

// ───────────────────────────────────────────────────────────
// RSS Scraper
// ───────────────────────────────────────────────────────────

async function scrapeRSS(source) {
  console.log(`\n📡 RSS taranıyor: ${source.name}`);
  const results = [];

  try {
    const feed = await rss.parseURL(source.url);
    console.log(`   ${feed.items.length} öğe bulundu`);

    for (const item of feed.items) {
      const title = (item.title || '').trim();
      const content = (item.contentSnippet || item.content || item.summary || '').trim();
      const link = item.link || '';

      // Metin2 server duyurusu mu? Filtrele
      const combined = `${title} ${content}`.toLowerCase();
      if (!/metin2|mt2|pvp.*server|server.*pvp|açılı|acili|sunucu/.test(combined)) {
        continue;
      }

      const type = detectType(combined);
      const openingDateISO = detectOpeningDate(combined);
      const features = detectFeatures(combined);
      const structure = detectStructure(combined);
      const domain = (() => {
        try { return new URL(link).hostname.replace('www.', ''); } catch { return 'bilinmiyor'; }
      })();

      results.push({
        name: title,
        slug: makeSlug(title),
        id: makeId(title, domain),
        source: source.name,
        sourceUrl: link,
        type,
        structure,
        status: openingDateISO ? 'opening_soon' : 'online',
        openingDate: openingDateISO ? formatOpeningLabel(openingDateISO) : undefined,
        countdownDate: openingDateISO || undefined,
        categoryTab: detectCategoryTab(openingDateISO, openingDateISO ? 'opening_soon' : 'online'),
        votes: Math.floor(Math.random() * 500) + 50, // Forum başlangıç değeri
        rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
        isVip: false,
        isFeatured: false,
        bannerUrl: pickBannerUrl(type),
        description: content.slice(0, 300) || title,
        websiteUrl: link,
        discordUrl: extractDiscordLink(content) || '#',
        tags: buildTags(type, structure, openingDateISO, features),
        features,
        addedAt: new Date().toISOString(),
      });
    }
  } catch (err) {
    console.warn(`   ⚠️  RSS başarısız (${source.name}): ${err.message}`);
    // HTML fallback deneyeceğiz
    if (source.fallbackUrl) {
      return scrapeHTMLFallback(source);
    }
  }

  return results;
}

// ───────────────────────────────────────────────────────────
// HTML Scraper — Metin2PVP.net
// ───────────────────────────────────────────────────────────

async function scrapeMetin2PVP(url) {
  console.log(`\n🔍 HTML taranıyor: Metin2PVP.net`);
  const results = [];
  try {
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 12000 });
    const $ = cheerio.load(data);

    // Server kartlarını bul
    $('[class*="server"], [class*="listing"], .row[data-id], article').each((_, el) => {
      const name = $(el).find('[class*="name"], h2, h3, .title').first().text().trim();
      if (!name || name.length < 3) return;

      const link = $(el).find('a[href*="http"]').first().attr('href') || '#';
      const desc = $(el).find('[class*="desc"], p').first().text().trim();
      const combined = `${name} ${desc}`;

      if (!/metin2|mt2/i.test(combined)) return;

      const type = detectType(combined);
      const openingDateISO = detectOpeningDate(combined);

      results.push(buildServerObj(name, desc, link, type, openingDateISO, 'Metin2PVP.net'));
    });

    console.log(`   ${results.length} server bulundu`);
  } catch (err) {
    console.warn(`   ⚠️  Metin2PVP.net başarısız: ${err.message}`);
  }
  return results;
}

// ───────────────────────────────────────────────────────────
// HTML Scraper — Metin2Sunucu.com
// ───────────────────────────────────────────────────────────

async function scrapeMetin2Sunucu(url) {
  console.log(`\n🔍 HTML taranıyor: Metin2Sunucu.com`);
  const results = [];
  try {
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 12000 });
    const $ = cheerio.load(data);

    $('.server-item, .sunucu-kart, [class*="server-row"], .listing-item').each((_, el) => {
      const name = $(el).find('h2, h3, .server-name, .sunucu-adi').first().text().trim();
      if (!name || name.length < 3) return;

      const link = $(el).find('a').first().attr('href') || '#';
      const desc = $(el).find('p, .desc, .aciklama').first().text().trim();
      const combined = `${name} ${desc}`;
      const type = detectType(combined);
      const openingDateISO = detectOpeningDate(combined);

      results.push(buildServerObj(name, desc, link, type, openingDateISO, 'Metin2Sunucu.com'));
    });

    console.log(`   ${results.length} server bulundu`);
  } catch (err) {
    console.warn(`   ⚠️  Metin2Sunucu.com başarısız: ${err.message}`);
  }
  return results;
}

// ───────────────────────────────────────────────────────────
// HTML Scraper — ePvP (elitepvpers)
// ───────────────────────────────────────────────────────────

async function scrapeEPVP(url) {
  console.log(`\n🔍 HTML taranıyor: elitepvpers.com`);
  const results = [];
  try {
    const { data } = await axios.get(url, { headers: HEADERS, timeout: 15000 });
    const $ = cheerio.load(data);

    // ePvP forum thread listesi
    $('li[id^="thread_"]').each((_, el) => {
      const titleEl = $(el).find('.title a').first();
      const name = titleEl.text().trim();
      const link = 'https://www.elitepvpers.com' + (titleEl.attr('href') || '');
      const desc = $(el).find('.lastpost, .description').text().trim();

      if (!name || !/metin2|mt2/i.test(name)) return;

      const combined = `${name} ${desc}`;
      const type = detectType(combined);
      const openingDateISO = detectOpeningDate(combined);

      results.push(buildServerObj(name, desc, link, type, openingDateISO, 'elitepvpers.com'));
    });

    console.log(`   ${results.length} server bulundu`);
  } catch (err) {
    console.warn(`   ⚠️  ePvP başarısız: ${err.message}`);
  }
  return results;
}

// ───────────────────────────────────────────────────────────
// HTML Fallback (RSS çalışmadığında Turkmmo HTML parse)
// ───────────────────────────────────────────────────────────

async function scrapeHTMLFallback(source) {
  console.log(`   🔄 HTML fallback: ${source.fallbackUrl}`);
  const results = [];
  try {
    const { data } = await axios.get(source.fallbackUrl, { headers: HEADERS, timeout: 12000 });
    const $ = cheerio.load(data);

    // Turkmmo forum thread listesi
    $('li.threadbit, .thread_title, tr.thread').each((_, el) => {
      const titleEl = $(el).find('a.thread_title, a[id^="thread_title_"]').first();
      const name = titleEl.text().trim();
      if (!name || name.length < 5) return;

      const href = titleEl.attr('href') || '';
      const link = href.startsWith('http') ? href : `https://www.turkmmo.com${href}`;
      const preview = $(el).find('.threadpreview, .preview').text().trim();
      const combined = `${name} ${preview}`;

      if (!/metin2|mt2|pvp|server|sunucu/i.test(combined)) return;

      const type = detectType(combined);
      const openingDateISO = detectOpeningDate(combined);

      results.push(buildServerObj(name, preview, link, type, openingDateISO, 'turkmmo.com'));
    });

    console.log(`   HTML fallback: ${results.length} server bulundu`);
  } catch (err) {
    console.warn(`   ⚠️  HTML fallback başarısız: ${err.message}`);
  }
  return results;
}

// ───────────────────────────────────────────────────────────
// Ortak Server Objesi Oluşturucu
// ───────────────────────────────────────────────────────────

function buildServerObj(name, desc, link, type, openingDateISO, sourceName) {
  const domain = (() => {
    try { return new URL(link.startsWith('http') ? link : 'https://unknown.com').hostname.replace('www.', ''); }
    catch { return 'bilinmiyor'; }
  })();
  const combined = `${name} ${desc}`;
  const features = detectFeatures(combined);
  const structure = detectStructure(combined);
  const status = openingDateISO ? 'opening_soon' : 'online';

  return {
    id: makeId(name, domain),
    name: name.slice(0, 100),
    slug: makeSlug(name),
    source: sourceName,
    sourceUrl: link,
    type,
    structure,
    status,
    openingDate: openingDateISO ? formatOpeningLabel(openingDateISO) : undefined,
    countdownDate: openingDateISO || undefined,
    categoryTab: detectCategoryTab(openingDateISO, status),
    votes: Math.floor(Math.random() * 300) + 20,
    rating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
    isVip: false,
    isFeatured: false,
    bannerUrl: pickBannerUrl(type),
    description: (desc || name).slice(0, 350),
    websiteUrl: link,
    discordUrl: extractDiscordLink(desc) || '#',
    tags: buildTags(type, structure, openingDateISO, features),
    features,
    addedAt: new Date().toISOString(),
  };
}

// ───────────────────────────────────────────────────────────
// Yardımcı Dönüşümler
// ───────────────────────────────────────────────────────────

function formatOpeningLabel(isoDate) {
  try {
    const d = new Date(isoDate);
    const gun = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'][d.getDay()];
    const ay = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'][d.getMonth()];
    return `${gun} ${d.getDate()} ${ay} ${d.getFullYear()} — ${String(d.getHours()).padStart(2,'0')}:00`;
  } catch { return undefined; }
}

function extractDiscordLink(text) {
  const m = (text || '').match(/discord\.gg\/\S+|discord\.com\/invite\/\S+/i);
  return m ? `https://${m[0]}` : null;
}

function buildTags(type, structure, openingDateISO, features) {
  const tags = [type, structure];
  if (openingDateISO) tags.push('Yakında Açılıyor');
  if (!features.alchemy) tags.push('Simyasız');
  if (!features.lycan) tags.push('Lycansız');
  if (features.autoHunt) tags.push('Oto-Av');
  return [...new Set(tags)];
}

// ───────────────────────────────────────────────────────────
// Duplicate Dedektörü
// ───────────────────────────────────────────────────────────

function mergeAndDeduplicate(existing, fresh) {
  const existingSlugs = new Set(existing.map((s) => s.slug));
  const existingIds = new Set(existing.map((s) => s.id));

  let added = 0;
  let skipped = 0;

  for (const server of fresh) {
    if (existingIds.has(server.id) || existingSlugs.has(server.slug)) {
      skipped++;
      continue;
    }
    existing.push(server);
    existingSlugs.add(server.slug);
    existingIds.add(server.id);
    added++;
    console.log(`   ➕ Eklendi: "${server.name}" (${server.source})`);
  }

  console.log(`\n📊 Sonuç: ${added} yeni eklendi, ${skipped} duplicate atlandı`);
  return existing;
}

// ───────────────────────────────────────────────────────────
// ANA ÇALIŞMA DÖNGÜSÜ
// ───────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 Metin2Atlas Scraper başlatılıyor...');
  console.log(`📂 Veri dosyası: ${DATA_FILE}`);
  if (DRY_RUN) console.log('⚠️  DRY RUN modu aktif — hiçbir dosya değiştirilmeyecek\n');

  const existing = loadExisting();
  console.log(`📋 Mevcut server sayısı: ${existing.length}`);

  const allFresh = [];

  for (const source of SOURCES) {
    let results = [];

    if (source.type === 'rss') {
      results = await scrapeRSS(source);
    } else if (source.type === 'html') {
      if (source.parser === 'metin2pvp')     results = await scrapeMetin2PVP(source.url);
      else if (source.parser === 'metin2sunucu') results = await scrapeMetin2Sunucu(source.url);
      else if (source.parser === 'epvp')     results = await scrapeEPVP(source.url);
    }

    allFresh.push(...results);
    await delay(2500); // Rate limiting — her kaynak arasında 2.5 sn bekle
  }

  console.log(`\n🔎 Toplam ham bulunan: ${allFresh.length} server`);

  const updated = mergeAndDeduplicate(existing, allFresh);
  saveServers(updated);

  console.log('\n✅ Scraper tamamlandı!');
  process.exit(0);
}

main().catch((err) => {
  console.error('❌ Scraper hatası:', err);
  process.exit(1);
});
