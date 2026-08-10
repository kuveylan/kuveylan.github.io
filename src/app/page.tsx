'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import ServerCard from '@/components/ServerCard';
import ServerWizard from '@/components/ServerWizard';
import ServerCompare from '@/components/ServerCompare';
import { MOCK_SERVERS } from '@/lib/data';
import { Flame, Calendar, ChevronDown, Swords } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('opening_this_week');
  const wizardRef = useRef<HTMLElement>(null);

  /* ---- Geri sayım: en yakın Cuma 21:00 ---- */
  const getNextFriday21 = () => {
    const now = new Date();
    const day = now.getDay(); // 0=Pazar … 6=Cumartesi
    const daysUntilFriday = (5 - day + 7) % 7 || 7;
    const next = new Date(now);
    next.setDate(now.getDate() + daysUntilFriday);
    next.setHours(21, 0, 0, 0);
    return next;
  };

  const calcTime = () => {
    const diff = Math.max(0, getNextFriday21().getTime() - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calcTime);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(calcTime()), 1000);
    return () => clearInterval(id);
  }, []);

  /* ---- Filtreleme ---- */
  const filteredServers = MOCK_SERVERS.filter(server => {
    if (activeTab === 'opening_this_week')
      return server.status === 'opening_soon' || server.categoryTab === 'opening_this_week';
    if (activeTab === 'active_online') return server.status === 'online';
    if (activeTab === '1-99') return server.type === '1-99' || server.type === '1-105';
    if (activeTab === '55-120') return server.type === '55-120' || server.type === '1-120';
    if (activeTab === 'simyasiz') return server.structure === 'Simyasız' || !server.features.alchemy;
    return true;
  });

  const scrollToWizard = () =>
    wizardRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  return (
    <div className="min-h-screen bg-[#08090c] text-gray-100 flex flex-col font-sans">

      {/* ─── HEADER ─── */}
      <Header />

      {/* ─── HERO ─── */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden text-center">
        {/* Arka plan ışıltısı */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-amber-500/8 blur-[180px] rounded-full" />
          <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-red-800/5 blur-[120px] rounded-full" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-6">
          {/* Rozet */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-xs tracking-widest">
            <Flame className="w-3.5 h-3.5 fill-amber-400" />
            TÜRKİYE&apos;NİN EN GÜNCEL METIN2 PVP PORTAL&apos;I — 2026
          </div>

          {/* Başlık */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none">
            Sana En Uygun
            <br />
            <span className="gold-gradient-text">Metin2 PVP Serverı</span> Bul
          </h1>

          {/* Alt yazı */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-400 leading-relaxed">
            Hangi sunucuya başlayacağını bilmeden mi geldin? Sorun değil!
            <br />
            <strong className="text-gray-200">Birkaç saniyede</strong> sana tam uyan serverı buluyoruz.
          </p>

          {/* CTA butonları */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              id="cta-wizard"
              onClick={scrollToWizard}
              className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-400/40 hover:scale-105"
            >
              <Swords className="w-4 h-4" />
              Bana Uygun Serverı Bul
              <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
            </button>
            <a
              href="#opening-this-week"
              className="px-6 py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-semibold text-sm transition-all"
            >
              Tüm Sunucuları Gör
            </a>
          </div>
        </div>
      </section>

      {/* ─── CUMA AÇILIŞ GERİ SAYIMI ─── */}
      <section className="px-4 sm:px-6 lg:px-8 pb-10">
        <div className="max-w-3xl mx-auto p-5 rounded-3xl bg-gradient-to-r from-[#1c150b] via-[#141824] to-[#0d0f17] border-2 border-amber-500/50 card-glow flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="text-left space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs tracking-wider">
              <Calendar className="w-4 h-4" />
              BÜYÜK AÇILIŞA KALAN SÜRE
            </div>
            <div className="text-xl font-black text-white">
              En Yakın Cuma Açılışı — 21:00
            </div>
            <div className="text-xs text-gray-400">
              Binlerce oyuncu aynı anda başlıyor • Sıfır avantaj, saf rekabet
            </div>
          </div>

          {/* Timer kutucukları */}
          <div className="flex items-center gap-2">
            {[
              { val: timeLeft.days, label: 'Gün' },
              { val: timeLeft.hours, label: 'Saat' },
              { val: timeLeft.minutes, label: 'Dakika' },
              { val: timeLeft.seconds, label: 'Saniye' },
            ].map((item, i) => (
              <div key={item.label} className="flex items-center gap-2">
                {i > 0 && <span className="text-amber-500 font-black text-xl">:</span>}
                <div className="flex flex-col items-center p-2.5 rounded-xl bg-black/60 border border-amber-500/30 min-w-[54px]">
                  <span className="text-2xl font-black text-amber-400 tabular-nums leading-none">
                    {String(item.val).padStart(2, '0')}
                  </span>
                  <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
                    {item.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SERVER WIZARD (ANA CTA AKIŞı) ─── */}
      <section
        id="wizard-section"
        ref={wizardRef}
        className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full pb-16"
      >
        <div className="mb-4 text-center">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
            <Swords className="w-3.5 h-3.5" />
            Adım adım server bul — ücretsiz, hızlı
          </span>
        </div>
        <ServerWizard servers={MOCK_SERVERS} onSelectServer={() => {}} />
      </section>

      {/* ─── SEKMELİ SERVER LİSTESİ ─── */}
      <section
        id="opening-this-week"
        className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-3xl font-black text-white">Metin2 PVP Serverlar Listesi</h2>
            <p className="text-xs text-gray-400 mt-1">Kategoriye göre filtrele, sunucunu seç</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'opening_this_week', label: '📅 Bu Cuma Açılacaklar' },
              { id: 'active_online',     label: '🟢 Aktif Online' },
              { id: '1-99',             label: '⚔️ 1-99 & 1-105 Emek' },
              { id: '55-120',           label: '🐉 55-120 Farm' },
              { id: 'simyasiz',         label: '🚫 Simyasız & Editsiz' },
            ].map(tab => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServers.map((server, idx) => (
            <ServerCard key={server.id} server={server} rank={idx + 1} />
          ))}
        </div>
      </section>

      {/* ─── SERVER KARŞILAŞTIRMA ─── */}
      <section id="compare-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ServerCompare servers={MOCK_SERVERS} />
      </section>

      {/* ─── SEO METİN BLOĞU ─── */}
      <section className="py-16 bg-[#0c0e14] border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-gray-300 leading-relaxed text-sm">
          <h2 className="text-2xl font-black text-white gold-gradient-text">
            Bu Hafta ve Bu Cuma Açılacak Metin2 PVP Serverlar — 2026 Rehberi
          </h2>
          <p>
            Türkiye&apos;nin en güvenilir Metin2 tanıtım portalı <strong>metin2atlas.tech</strong>&apos;te
            oyuncuların her hafta beklediği <strong>Cuma açılacak PVP serverlar</strong> canlı geri
            sayımlı takvimle listelenmektedir. Simyasız 1-99 Oldschool yapılardan zindan takip
            sistemli 55-120 NewSchool farm sunucularına kadar aradığın tüm detaylar burada.
          </p>
          <h3 className="text-lg font-bold text-white">En İyi Metin2 PVP Serverı Nasıl Seçilir?</h3>
          <p>
            Bir sunucuya başlamadan önce dikkat edilmesi gereken başlıca unsurlar; simya ve kuşak
            durumu, hile koruması (Svside / Uriel), TL ödüllü lonca turnuvaları ve yönetici
            kadrosunun güvenilirliğidir. Metin2Atlas&apos;taki oyuncu oylamaları ve tarafsız
            incelemeler sayesinde zamanını boşa harcamadan doğru serverı bulabilirsin.
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="mt-auto bg-[#050608] border-t border-white/10 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start">
            <span className="text-xl font-black tracking-wider gold-gradient-text">
              METIN2<span className="text-white">ATLAS.TECH</span>
            </span>
            <p className="text-xs text-gray-500 mt-1">
              © 2026 Metin2Atlas. Metin2 ve ilgili içerikler Webzen / Gameforge tescilli markalarıdır.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs text-gray-400 font-medium">
            <Link href="/add-server"  className="hover:text-amber-400 transition-colors">Server Ekle</Link>
            <Link href="/add-server"  className="hover:text-amber-400 transition-colors">Reklam Verme &amp; VIP</Link>
            <a href="#" className="hover:text-amber-400 transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-amber-400 transition-colors">İletişim</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
