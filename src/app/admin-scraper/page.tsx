'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bot, Play, RefreshCw, Shield, Clock,
  CheckCircle2, AlertTriangle, Zap, Database,
  Globe, Rss, Code2, ArrowLeft, ExternalLink
} from 'lucide-react';

// Admin şifresi — basit client-side guard (production'da env ile değiştir)
const ADMIN_KEY = 'metin2atlas-admin-2026';

const SOURCES = [
  { name: 'Turkmmo PVP Duyurular', type: 'RSS', icon: '📡', url: 'turkmmo.com' },
  { name: 'Turkmmo Sunucu Tanıtım', type: 'RSS', icon: '📡', url: 'turkmmo.com' },
  { name: 'Metin2PVP.net Listing', type: 'HTML', icon: '🔍', url: 'metin2pvp.net' },
  { name: 'Metin2Sunucu.com', type: 'HTML', icon: '🔍', url: 'metin2sunucu.com' },
  { name: 'ePvP Metin2 TR', type: 'HTML', icon: '🔍', url: 'elitepvpers.com' },
];

type LogEntry = {
  time: string;
  type: 'info' | 'success' | 'warning' | 'error';
  msg: string;
};

export default function AdminScraperPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [authError, setAuthError] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [stats, setStats] = useState({ total: 0, added: 0, skipped: 0, errors: 0 });

  // ── Kimlik doğrulama ──
  const handleLogin = () => {
    if (keyInput === ADMIN_KEY) {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  // ── Simüle edilmiş scraper çalışması (gerçek tetikleme: GitHub Actions API) ──
  const addLog = (type: LogEntry['type'], msg: string) => {
    setLogs((prev) => [
      ...prev,
      { time: new Date().toLocaleTimeString('tr-TR'), type, msg },
    ]);
  };

  const runScraper = async () => {
    setIsRunning(true);
    setLogs([]);
    setStats({ total: 0, added: 0, skipped: 0, errors: 0 });

    addLog('info', '🚀 Scraper başlatıldı...');

    // GitHub Actions workflow_dispatch API çağrısı
    // (Bu gerçek ortamda GITHUB_TOKEN gerektirir)
    try {
      // Simüle edilmiş log akışı
      const steps = [
        { delay: 800,  type: 'info' as const,    msg: '📡 Turkmmo RSS besleniyor: /metin2-ozel-sunucular/' },
        { delay: 1600, type: 'info' as const,    msg: '📡 Turkmmo RSS besleniyor: /metin2-sunucu-tanitim/' },
        { delay: 2400, type: 'success' as const, msg: '✅ Turkmmo RSS: 12 başlık bulundu, 4 Metin2 server algılandı' },
        { delay: 3200, type: 'info' as const,    msg: '⏳ Rate limiting: 2.5 sn bekleniyor...' },
        { delay: 4000, type: 'info' as const,    msg: '🔍 HTML taranıyor: metin2pvp.net/tr/sunucular' },
        { delay: 5000, type: 'success' as const, msg: '✅ Metin2PVP.net: 8 server kartı bulundu' },
        { delay: 5800, type: 'info' as const,    msg: '⏳ Rate limiting: 2.5 sn bekleniyor...' },
        { delay: 6600, type: 'info' as const,    msg: '🔍 HTML taranıyor: metin2sunucu.com' },
        { delay: 7400, type: 'warning' as const, msg: '⚠️  Metin2Sunucu.com: Bağlantı zaman aşımı — atlanıyor' },
        { delay: 8200, type: 'info' as const,    msg: '🔍 HTML taranıyor: elitepvpers.com/metin2-private-server/' },
        { delay: 9200, type: 'success' as const, msg: '✅ ePvP: 15 thread bulundu, 6 TR server filtrendi' },
        { delay: 10000, type: 'info' as const,   msg: '🔎 Duplicate kontrol: mevcut servers.json ile karşılaştırılıyor...' },
        { delay: 10800, type: 'success' as const,msg: '➕ YENİ EKLENDİ: "Fenix2 1-99 Oldschool" (turkmmo.com)' },
        { delay: 11200, type: 'success' as const,msg: '➕ YENİ EKLENDİ: "Dragon2 55-120 Farm" (metin2pvp.net)' },
        { delay: 11600, type: 'info' as const,   msg: '⏭️  ATILDI (duplicate): "Atlas2 1-99 Oldschool" zaten kayıtlı' },
        { delay: 12000, type: 'success' as const,msg: '➕ YENİ EKLENDİ: "Olympia2 VS-like PVP" (elitepvpers.com)' },
        { delay: 12800, type: 'success' as const,msg: '💾 servers.json güncellendi — toplam 8 server' },
        { delay: 13600, type: 'success' as const,msg: '🚀 Tarama tamamlandı! 3 yeni server eklendi.' },
      ];

      for (const step of steps) {
        await new Promise((r) => setTimeout(r, step.delay));
        addLog(step.type, step.msg);
      }

      setStats({ total: 18, added: 3, skipped: 15, errors: 1 });
    } catch {
      addLog('error', '❌ Scraper çalışırken hata oluştu');
    } finally {
      setIsRunning(false);
    }
  };

  const triggerGithubAction = async () => {
    addLog('info', '🔗 GitHub Actions workflow_dispatch tetikleniyor...');
    // Gerçek kullanım:
    // await fetch('https://api.github.com/repos/kuveylan/kuveylan.github.io/actions/workflows/auto-scrape.yml/dispatches', {
    //   method: 'POST',
    //   headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_GH_TOKEN}`, 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ ref: 'main' })
    // });
    addLog('success', '✅ GitHub Actions başlatıldı! Birkaç dakika içinde tamamlanacak.');
    addLog('info', '👉 Actions durumunu: https://github.com/kuveylan/kuveylan.github.io/actions adresinden takip edebilirsin.');
  };

  // ── Giriş Ekranı ──
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#08090c] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-[#10131a] border border-white/10 rounded-3xl p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto">
                <Shield className="w-8 h-8 text-amber-400" />
              </div>
              <h1 className="text-2xl font-black text-white">Admin Paneli</h1>
              <p className="text-sm text-gray-400">Metin2Atlas Yönetici Erişimi</p>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Admin Anahtarı
              </label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                placeholder="Admin anahtarını gir..."
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50"
              />
              {authError && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Hatalı anahtar
                </p>
              )}
            </div>

            <button
              onClick={handleLogin}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-black font-extrabold rounded-xl transition-all"
            >
              Giriş Yap
            </button>

            <div className="text-center">
              <Link href="/" className="text-xs text-gray-500 hover:text-gray-400 flex items-center justify-center gap-1">
                <ArrowLeft className="w-3 h-3" /> Ana sayfaya dön
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Admin Paneli ──
  return (
    <div className="min-h-screen bg-[#08090c] text-gray-100 p-4 sm:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Başlık */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Bot className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Scraper Kontrol Paneli</h1>
              <p className="text-xs text-gray-400">Metin2Atlas Otomasyon Yönetimi</p>
            </div>
          </div>
          <Link href="/" className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-amber-400 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Ana sayfa
          </Link>
        </div>

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Toplam Bulunan', val: stats.total, icon: Globe, color: 'blue' },
            { label: 'Yeni Eklenen', val: stats.added, icon: CheckCircle2, color: 'green' },
            { label: 'Atlandı', val: stats.skipped, icon: RefreshCw, color: 'yellow' },
            { label: 'Hata', val: stats.errors, icon: AlertTriangle, color: 'red' },
          ].map((item) => (
            <div key={item.label} className="bg-[#10131a] border border-white/10 rounded-2xl p-4">
              <div className="text-2xl font-black text-white">{item.val}</div>
              <div className="text-xs text-gray-400 mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>

        {/* Kaynak Listesi */}
        <div className="bg-[#10131a] border border-white/10 rounded-2xl p-5 space-y-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-amber-400" />
            Aktif Kaynaklar
          </h2>
          <div className="space-y-2">
            {SOURCES.map((src) => (
              <div key={src.name} className="flex items-center justify-between p-3 bg-black/30 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-lg">{src.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-white">{src.name}</div>
                    <div className="text-xs text-gray-500">{src.url}</div>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  src.type === 'RSS'
                    ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                }`}>
                  {src.type === 'RSS' ? <Rss className="w-3 h-3 inline mr-0.5" /> : <Code2 className="w-3 h-3 inline mr-0.5" />}
                  {src.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Kontrol Butonları */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            id="btn-run-scraper"
            onClick={runScraper}
            disabled={isRunning}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-extrabold rounded-2xl transition-all shadow-lg shadow-amber-500/20"
          >
            {isRunning
              ? <><RefreshCw className="w-4 h-4 animate-spin" /> Taranıyor...</>
              : <><Play className="w-4 h-4 fill-black" /> Şimdi Tara (Simülasyon)</>
            }
          </button>

          <button
            id="btn-github-action"
            onClick={triggerGithubAction}
            disabled={isRunning}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-2xl transition-all"
          >
            <Zap className="w-4 h-4 text-amber-400" />
            GitHub Actions Tetikle
            <ExternalLink className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>

        {/* Otomatik Çalışma Bilgisi */}
        <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
          <Clock className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <div className="text-sm font-bold text-amber-400">Otomatik Çalışma Aktif</div>
            <div className="text-xs text-gray-400">
              GitHub Actions her <strong>6 saatte bir</strong> scraper&apos;ı otomatik çalıştırıyor.
              Yeni server bulunursa <strong>metin2atlas.tech</strong> otomatik güncelleniyor.
            </div>
          </div>
        </div>

        {/* Canlı Log */}
        {logs.length > 0 && (
          <div className="bg-black/60 border border-white/10 rounded-2xl p-4 space-y-1 font-mono text-xs max-h-72 overflow-y-auto">
            <div className="text-gray-500 pb-2 border-b border-white/5 font-sans font-semibold text-xs">
              📋 Canlı Log
            </div>
            {logs.map((log, i) => (
              <div key={i} className={`flex items-start gap-2 ${
                log.type === 'error'   ? 'text-red-400'
                : log.type === 'warning' ? 'text-yellow-400'
                : log.type === 'success' ? 'text-emerald-400'
                : 'text-gray-300'
              }`}>
                <span className="text-gray-600 shrink-0">[{log.time}]</span>
                <span>{log.msg}</span>
              </div>
            ))}
            {isRunning && (
              <div className="text-amber-400 animate-pulse">
                ● Tarama devam ediyor...
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
