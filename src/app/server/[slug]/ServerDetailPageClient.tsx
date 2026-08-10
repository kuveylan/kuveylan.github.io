'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { MOCK_SERVERS } from '@/lib/data';
import { 
  ShieldCheck, Flame, ExternalLink, ThumbsUp, 
  MessageSquare, ArrowLeft, Trophy, Check, X
} from 'lucide-react';
import Link from 'next/link';

interface ClientProps {
  slug: string;
}

export default function ServerDetailPageClient({ slug }: ClientProps) {
  const server = MOCK_SERVERS.find(s => s.slug === slug) || MOCK_SERVERS[0];
  const [votes, setVotes] = useState(server.votes);
  const [hasVoted, setHasVoted] = useState(false);

  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Array<{ id: string; user: string; text: string; date: string }>>([
    { id: '1', user: 'Metin2Kralı', text: 'Server efsane gözüküyor, açılış günü lonca olarak oradayız!', date: 'Bugün 14:20' },
    { id: '2', user: 'SuraMaster', text: 'Simyasız oldschool yapısı harika düşünülmüş. Başarılar dilerim.', date: 'Dün 18:45' }
  ]);

  const handleVote = () => {
    if (!hasVoted) {
      setVotes(prev => prev + 1);
      setHasVoted(true);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setComments(prev => [
      { id: Date.now().toString(), user: 'Oyuncu_' + Math.floor(Math.random() * 900 + 100), text: commentText, date: 'Şimdi' },
      ...prev
    ]);
    setCommentText('');
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-gray-100 flex flex-col font-sans">
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-8 w-full flex-1 space-y-8">
        
        {/* BACK LINK */}
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-amber-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Tüm PVP Serverlara Dön
        </Link>

        {/* HERO BANNER & MAIN SERVER INFO */}
        <div className="relative rounded-3xl overflow-hidden bg-[#10131a] border border-white/10 card-glow">
          <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-gray-900">
            <img
              src={server.bannerUrl}
              alt={server.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#10131a] via-[#10131a]/60 to-transparent" />
          </div>

          <div className="relative p-6 sm:p-8 -mt-20 z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {server.isVip && (
                  <span className="px-3 py-1 rounded-md bg-amber-500/20 border border-amber-500/50 text-amber-400 font-extrabold text-xs flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" /> VIP SPONSOR SUNUCU
                  </span>
                )}
                <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-amber-300 font-bold text-xs">
                  {server.type}
                </span>
                <span className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-gray-300 font-bold text-xs">
                  {server.structure}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white flex items-center gap-3">
                {server.name}
                <ShieldCheck className="w-8 h-8 text-emerald-400 inline" />
              </h1>

              <p className="text-sm text-gray-300 max-w-2xl leading-relaxed">
                {server.description}
              </p>
            </div>

            {/* ACTION BUTTONS (WEBSITE & VOTE) */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-[240px]">
              <button
                onClick={handleVote}
                disabled={hasVoted}
                className={`py-3.5 px-6 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
                  hasVoted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-white/5 hover:bg-amber-500/20 text-gray-200 hover:text-amber-400 border border-white/10'
                }`}
              >
                <ThumbsUp className="w-4 h-4" />
                {hasVoted ? 'Oy Verildi!' : `Oy Ver (${votes.toLocaleString('tr-TR')})`}
              </button>

              <a
                href={server.websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20"
              >
                <span>Resmi Siteye Git</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* DETAILED SPECS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* FEATURES TABLE */}
          <div className="md:col-span-2 space-y-6">
            <div className="p-6 rounded-3xl bg-[#10131a] border border-white/10 space-y-4">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" /> Sunucu Sistem Özellikleri & Efsun Yapısı
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-gray-400">Maksimum Seviye Sınırı:</span>
                  <div className="font-black text-white text-base">{server.features.maxLevel} Lvl</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-gray-400">Ödül Havuzu:</span>
                  <div className="font-black text-amber-400 text-base">{server.rewardPool || 'Turnuva Ödülü Var'}</div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-gray-400">Simya Sistemi:</span>
                  {server.features.alchemy ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Aktif</span>
                  ) : (
                    <span className="text-rose-400 font-bold flex items-center gap-1"><X className="w-4 h-4" /> Simyasız</span>
                  )}
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between">
                  <span className="text-gray-400">Lycan Karakteri:</span>
                  {server.features.lycan ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Aktif</span>
                  ) : (
                    <span className="text-rose-400 font-bold flex items-center gap-1"><X className="w-4 h-4" /> Lycansız</span>
                  )}
                </div>
              </div>
            </div>

            {/* PLAYER REVIEWS & COMMENTS SECTION */}
            <div className="p-6 rounded-3xl bg-[#10131a] border border-white/10 space-y-6">
              <h3 className="text-xl font-black text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-cyan-400" /> Oyuncu Yorumları & Değerlendirmeler ({comments.length})
              </h3>

              {/* COMMENT FORM */}
              <form onSubmit={handleAddComment} className="space-y-3">
                <textarea
                  rows={3}
                  placeholder="Sunucu hakkındaki düşüncelerini veya lonca mesajını yaz..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 text-xs"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs transition-all"
                >
                  Yorum Gönder
                </button>
              </form>

              {/* COMMENTS LIST */}
              <div className="space-y-3 pt-2">
                {comments.map(c => (
                  <div key={c.id} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-400 text-xs">{c.user}</span>
                      <span className="text-[10px] text-gray-500">{c.date}</span>
                    </div>
                    <p className="text-xs text-gray-300">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* SIDEBAR STATS */}
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-[#10131a] border border-white/10 space-y-4">
              <h4 className="text-sm font-bold text-gray-400 uppercase">Sunucu İstatistikleri</h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                  <span className="text-gray-400">Durum:</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> YAYINDA
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                  <span className="text-gray-400">Açılış Zamanı:</span>
                  <span className="text-white font-bold">{server.openingDate || 'Aktif Sunucu'}</span>
                </div>

                <div className="flex items-center justify-between text-xs py-2 border-b border-white/5">
                  <span className="text-gray-400">Toplam Oy Sayısı:</span>
                  <span className="text-amber-400 font-bold">⭐ {votes.toLocaleString('tr-TR')} Oy</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
