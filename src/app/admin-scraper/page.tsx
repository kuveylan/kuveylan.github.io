'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { runScraperBot } from '@/lib/scraperEngine';
import { MOCK_SERVERS, ServerItem } from '@/lib/data';
import { Bot, RefreshCw, ShieldCheck, CheckCircle2, Image as ImageIcon, MessageSquare, ExternalLink } from 'lucide-react';

export default function AdminScraperPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [scrapedServers, setScrapedServers] = useState<ServerItem[]>(MOCK_SERVERS);
  const [stats, setStats] = useState({ total: MOCK_SERVERS.length, newlyAdded: 0, duplicatesSkipped: 0 });

  const handleRunScraper = async () => {
    setIsScanning(true);
    setLogs(prev => [...prev, '🔍 Turkmmo, Metin2Box ve Forumlar taranıyor...']);

    setTimeout(async () => {
      const result = await runScraperBot(scrapedServers);
      
      setScrapedServers(prev => [...result.added, ...prev]);
      setStats(prev => ({
        total: prev.total + result.added.length,
        newlyAdded: result.added.length,
        duplicatesSkipped: prev.duplicatesSkipped + result.skippedCount
      }));

      setLogs(prev => [
        ...prev,
        `✅ Tarama Tamamlandı! ${result.added.length} Yeni Server Eklendi.`,
        `🛡️ Mükerrer Koruma: ${result.skippedCount} Çift Kayıt Engellendi & Çöpe Atıldı.`,
        `🎨 Banner Otomasyonu: Görseli olmayan sunucular için HD Tema Bannerları Oluşturuldu.`
      ]);

      setIsScanning(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-gray-100 flex flex-col font-sans">
      <Header />

      <main className="max-w-5xl mx-auto px-4 py-10 w-full flex-1 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 font-extrabold text-xs mb-2">
              <Bot className="w-4 h-4" /> YÖNETİCİ OTOMASYON MERKEZİ
            </div>
            <h1 className="text-3xl font-black text-white">
              Metin2 PVP Otomatik İçerik Botu & Discord Entegrasyonu
            </h1>
          </div>

          <button
            onClick={handleRunScraper}
            disabled={isScanning}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-black text-sm shadow-xl shadow-amber-500/20 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
            {isScanning ? 'İnternet Taranıyor...' : 'Tüm İnterneti Şimdi Tara'}
          </button>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-xs font-bold text-gray-400 uppercase">Toplam Aktif Sunucu</div>
            <div className="text-3xl font-black text-amber-400 mt-1">{stats.total}</div>
          </div>
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30">
            <div className="text-xs font-bold text-emerald-400 uppercase">Otomatik Eklenenler</div>
            <div className="text-3xl font-black text-emerald-400 mt-1">+{stats.newlyAdded}</div>
          </div>
          <div className="p-5 rounded-2xl bg-purple-500/10 border border-purple-500/30">
            <div className="text-xs font-bold text-purple-400 uppercase">Engellenen Çift Kayıt (Deduplication)</div>
            <div className="text-3xl font-black text-purple-300 mt-1">{stats.duplicatesSkipped}</div>
          </div>
        </div>

        {/* LOG CONSOLE */}
        <div className="p-6 rounded-2xl bg-[#0d0f17] border border-white/10 font-mono text-xs space-y-2">
          <div className="text-gray-400 font-bold mb-2 flex items-center gap-2">
            <Bot className="w-4 h-4 text-amber-400" /> Bot Canlı Çalışma Günlüğü (Console Output):
          </div>
          {logs.length === 0 ? (
            <p className="text-gray-600 italic">Henüz tarama başlatılmadı. &quot;Tüm İnterneti Şimdi Tara&quot; butonuna basarak otomasyonu çalıştırabilirsiniz.</p>
          ) : (
            logs.map((log, idx) => (
              <div key={idx} className="text-amber-300/90">{log}</div>
            ))
          )}
        </div>

        {/* DISCORD SETUP GUIDELINES */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-[#171424] to-[#10131a] border border-purple-500/30 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">Discord Sunucunuza Otomatik Duyuru Botu Bağlama</h3>
              <p className="text-xs text-gray-400">Sitemize yeni eklenen tüm pvp serverlar otomatik olarak Discord kanalınızda duyurulur.</p>
            </div>
          </div>

          <div className="space-y-2 text-xs text-gray-300 pl-4 border-l-2 border-purple-500/50">
            <p><strong>1. Adım:</strong> Discord sunucunuzda <span className="text-purple-300 font-bold">#yeni-açılan-serverlar</span> adında bir kanal oluşturun.</p>
            <p><strong>2. Adım:</strong> Kanal Ayarları -&gt; Entegrasyonlar -&gt; Webhook Oluştur deyin ve Webhook URL adresini kopyalayın.</p>
            <p><strong>3. Adım:</strong> Kopyaladığınız Webhook URL adresini sitemizin <code className="bg-black/50 px-1 py-0.5 rounded text-amber-300">DISCORD_WEBHOOK_URL</code> ortam değişkenine yapıştırın.</p>
          </div>
        </div>

      </main>
    </div>
  );
}
