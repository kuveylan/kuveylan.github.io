'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import ServerCard from '@/components/ServerCard';
import ServerWizard from '@/components/ServerWizard';
import ServerCompare from '@/components/ServerCompare';
import { MOCK_SERVERS, ServerItem } from '@/lib/data';
import { Flame, Calendar, Sparkles, ShieldCheck, Trophy, Layers, Filter, CheckCircle2, Clock } from 'lucide-react';

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('opening_this_week');
  
  // COUNTDOWN TIMER LOGIC FOR THIS FRIDAY
  const [timeLeft, setTimeLeft] = useState({ days: 3, hours: 14, minutes: 25, seconds: 40 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        return { ...prev, seconds: 59, minutes: prev.minutes > 0 ? prev.minutes - 1 : 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const filteredServers = MOCK_SERVERS.filter(server => {
    if (activeTab === 'opening_this_week') return server.status === 'opening_soon' || server.categoryTab === 'opening_this_week';
    if (activeTab === 'active_online') return server.status === 'online';
    if (activeTab === '1-99') return server.type === '1-99' || server.type === '1-105';
    if (activeTab === '55-120') return server.type === '55-120' || server.type === '1-120';
    if (activeTab === 'simyasiz') return server.structure === 'Simyasız' || !server.features.alchemy;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#08090c] text-gray-100 flex flex-col font-sans">
      
      {/* HEADER */}
      <Header />

      {/* HERO SECTION WITH HIGH-CTR COUNTDOWN & TITLE */}
      <section className="relative pt-10 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Glow Backgrounds */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-amber-500/10 blur-[150px] pointer-events-none rounded-full" />

        <div className="max-w-7xl mx-auto text-center relative z-10 space-y-6">
          
          {/* TOP TAG */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-xs">
            <Flame className="w-4 h-4 fill-amber-400" />
            TÜRKIYE&apos;NIN EN GÜNCEL METIN2 PVP SERVERLAR PORTALI 2026
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-none">
            Bu Hafta Açılacak <br />
            <span className="gold-gradient-text">En İyi Metin2 PVP Serverlar</span>
          </h1>

          <p className="max-w-3xl mx-auto text-base sm:text-lg text-gray-400 leading-relaxed">
            Aradığın Metin2 sunucusunu saatlerce arama! <strong>1-99 Oldschool</strong>, <strong>55-120 Farm</strong> ve <strong>Bu Cuma açılacak</strong> en kaliteli pvp serverları canlı takvimle keşfet.
          </p>

          {/* THIS FRIDAY OPENING COUNTDOWN BANNER (HIGH CTR ACCELERATOR) */}
          <div className="max-w-3xl mx-auto mt-6 p-6 rounded-3xl bg-gradient-to-r from-[#1c150b] via-[#141824] to-[#0d0f17] border-2 border-amber-500/50 card-glow flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs">
                <Calendar className="w-4 h-4" /> BÜYÜK AÇILIŞA KALAN SÜRE
              </div>
              <div className="text-xl font-black text-white">
                Atlas2 1-99 Oldschool (Bu Cuma 21:00)
              </div>
              <div className="text-xs text-gray-400">
                100.000 TL Ödüllü • Simyasız & Lycansız
              </div>
            </div>

            {/* TIMER BOXES */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center p-2.5 rounded-xl bg-black/60 border border-amber-500/30 min-w-[55px]">
                <span className="text-xl font-black text-amber-400">{timeLeft.days}</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Gün</span>
              </div>
              <span className="text-amber-500 font-black text-xl">:</span>
              <div className="flex flex-col items-center p-2.5 rounded-xl bg-black/60 border border-amber-500/30 min-w-[55px]">
                <span className="text-xl font-black text-amber-400">{timeLeft.hours}</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Saat</span>
              </div>
              <span className="text-amber-500 font-black text-xl">:</span>
              <div className="flex flex-col items-center p-2.5 rounded-xl bg-black/60 border border-amber-500/30 min-w-[55px]">
                <span className="text-xl font-black text-amber-400">{timeLeft.minutes}</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Dakika</span>
              </div>
              <span className="text-amber-500 font-black text-xl">:</span>
              <div className="flex flex-col items-center p-2.5 rounded-xl bg-black/60 border border-amber-500/30 min-w-[55px]">
                <span className="text-xl font-black text-amber-400">{timeLeft.seconds}</span>
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Saniye</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* INTERACTIVE SERVER FINDER WIZARD */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-16">
        <ServerWizard servers={MOCK_SERVERS} onSelectServer={() => {}} />
      </section>

      {/* HIGH-SEO KEYWORD TABBED SERVER LISTINGS */}
      <section id="opening-this-week" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* TABBED NAVIGATION BASED ON KEYWORD SEARCH INTENT */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h2 className="text-3xl font-black text-white">
              Metin2 PVP Serverlar Listesi
            </h2>
            <p className="text-xs text-gray-400 mt-1">Arama niyetine göre kategorize edilmiş güncel sunucular</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'opening_this_week', label: '📅 Bu Cuma Açılacaklar', badge: 'POPÜLER' },
              { id: 'active_online', label: '🟢 Aktif Online Sunucular' },
              { id: '1-99', label: '⚔️ 1-99 & 1-105 Emek' },
              { id: '55-120', label: '🐉 55-120 Farm' },
              { id: 'simyasiz', label: '🚫 Simyasız & Editsiz' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
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

        {/* SERVERS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServers.map((server, idx) => (
            <ServerCard key={server.id} server={server} rank={idx + 1} />
          ))}
        </div>
      </section>

      {/* SERVER COMPARE MODULE SECTION */}
      <section id="compare-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <ServerCompare servers={MOCK_SERVERS} />
      </section>

      {/* SEO ARTICLE SECTION FOR GOOGLE OTORITE (TURKMMO & RAKIP GEÇME) */}
      <section className="py-16 bg-[#0c0e14] border-t border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 text-gray-300 leading-relaxed text-sm">
          <h2 className="text-2xl font-black text-white gold-gradient-text">
            Bu Hafta ve Bu Cuma Açılacak Metin2 PVP Serverlar (2026 Rehberi)
          </h2>
          <p>
            Türkiye&apos;nin en güvenilir Metin2 tanıtım portalı <strong>metin2atlas.tech</strong> adresinde, 
            oyuncuların her hafta heyecanla beklediği <strong>Cuma günü açılacak PVP serverlar</strong> anlık sayaçlarla listelenmektedir. 
            Eski Türkiye sunucuları tadında simyasız 1-99 Oldschool yapılardan, zindan takip sistemli 55-120 NewSchool farm sunucularına kadar aradığınız tüm detaylar burada.
          </p>

          <h3 className="text-lg font-bold text-white mt-4">
            En İyi Metin2 PVP Serverı Nasıl Seçilir?
          </h3>
          <p>
            Bir sunucuya başlamadan önce dikkat edilmesi gereken en önemli unsurlar; simya ve kuşak durumu, hile koruması (Svside/Uriel), 
            TL ödüllü lonca turnuvaları ve yönetici kadrosunun dürüstlüğüdür. Metin2Atlas üzerinde yer alan oyuncu oylamaları ve tarafsız incelemeler sayesinde zamanınızı boşa harcamadan doğru serverı bulabilirsiniz.
          </p>
        </div>
      </section>

      {/* FOOTER */}
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
            <Link href="/add-server" className="hover:text-amber-400 transition-colors">Server Ekle</Link>
            <Link href="/add-server" className="hover:text-amber-400 transition-colors">Reklam Verme & VIP</Link>
            <a href="#" className="hover:text-amber-400 transition-colors">Gizlilik Politikası</a>
            <a href="#" className="hover:text-amber-400 transition-colors">İletişim</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
