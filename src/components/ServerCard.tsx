'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ServerItem } from '@/lib/data';
import { ThumbsUp, Users, ExternalLink, ShieldCheck, Flame, Star, Clock, Info } from 'lucide-react';

interface ServerCardProps {
  server: ServerItem;
  rank?: number;
}

export default function ServerCard({ server, rank }: ServerCardProps) {
  const [votes, setVotes] = useState(server.votes);
  const [hasVoted, setHasVoted] = useState(false);

  const handleVote = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hasVoted) {
      setVotes(prev => prev + 1);
      setHasVoted(true);
    }
  };

  return (
    <div 
      className={`relative rounded-2xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1.5 ${
        server.isVip 
          ? 'bg-gradient-to-b from-[#1c170b] via-[#121520] to-[#0d0f17] border-2 border-amber-500/50 card-glow' 
          : 'bg-[#10131a] border border-white/10 hover:border-white/20'
      }`}
    >
      {/* BADGES & RANK */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        {rank && (
          <div className="w-8 h-8 rounded-lg bg-amber-500 text-black font-black flex items-center justify-center shadow-lg text-sm">
            #{rank}
          </div>
        )}
        {server.isVip && (
          <span className="px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/50 text-amber-400 font-extrabold text-xs flex items-center gap-1 backdrop-blur-md">
            <Flame className="w-3.5 h-3.5 fill-amber-400" /> VIP SPONSOR
          </span>
        )}
        {server.status === 'opening_soon' && (
          <span className="px-2.5 py-1 rounded-md bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 font-extrabold text-xs flex items-center gap-1 backdrop-blur-md">
            <Clock className="w-3.5 h-3.5" /> YAKINDA AÇILIYOR
          </span>
        )}
      </div>

      {/* RATING */}
      <div className="absolute top-3 right-3 z-10">
        <div className="px-2.5 py-1 rounded-md bg-black/60 border border-white/10 text-yellow-400 font-bold text-xs flex items-center gap-1 backdrop-blur-md">
          <Star className="w-3.5 h-3.5 fill-yellow-400" /> {server.rating}
        </div>
      </div>

      {/* BANNER IMAGE WITH CLICKABLE LINK TO SERVER DETAIL */}
      <Link href={`/server/${server.slug}`} className="block relative h-44 w-full overflow-hidden bg-gray-900 group">
        <img
          src={server.bannerUrl}
          alt={`${server.name} Metin2 PVP Server`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10131a] via-transparent to-black/30" />
      </Link>

      {/* CONTENT */}
      <div className="p-5 space-y-4">
        <div>
          <Link href={`/server/${server.slug}`} className="text-xl font-bold text-white hover:text-amber-400 transition-colors flex items-center gap-2">
            {server.name}
            <ShieldCheck className="w-5 h-5 text-emerald-400 inline" />
          </Link>
          <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
            {server.description}
          </p>
        </div>

        {/* SERVER SPECS & TAGS */}
        <div className="flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 rounded-md bg-white/5 text-amber-300 font-semibold text-xs border border-white/5">
            {server.type}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-white/5 text-gray-300 font-semibold text-xs border border-white/5">
            {server.structure}
          </span>
          {server.tags.map((tag, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded text-[11px] bg-amber-500/10 text-amber-400 font-medium">
              #{tag}
            </span>
          ))}
        </div>

        {/* STATUS & ONLINE COUNT */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
          {server.status === 'online' ? (
            <div className="flex items-center gap-2 font-medium text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <Users className="w-4 h-4" />
              <span>{server.onlinePlayers?.toLocaleString('tr-TR')} Aktif Oyuncu</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 font-medium text-cyan-400">
              <Clock className="w-4 h-4" />
              <span>{server.openingDate}</span>
            </div>
          )}
        </div>

        {/* ACTION BUTTONS (DETAIL PAGE & OFFICIAL WEBSITE) */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <Link
            href={`/server/${server.slug}`}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 hover:text-white border border-white/10 font-bold text-xs transition-all"
          >
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Detayları İncele</span>
          </Link>

          <a
            href={server.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-extrabold text-xs transition-all shadow-md shadow-amber-500/10"
          >
            <span>Siteye Git</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
