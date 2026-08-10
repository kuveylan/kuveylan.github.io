'use client';

import { useState } from 'react';
import { ServerItem } from '@/lib/data';
import { Columns3, X, Check, Minus, Trophy, Flame } from 'lucide-react';

interface ServerCompareProps {
  servers: ServerItem[];
}

export default function ServerCompare({ servers }: ServerCompareProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([servers[0]?.id, servers[1]?.id]);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter(i => i !== id));
      }
    } else {
      if (selectedIds.length < 3) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const comparedServers = servers.filter(s => selectedIds.includes(s.id));

  return (
    <div className="rounded-3xl bg-[#10131a] border border-white/10 p-6 sm:p-8 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Columns3 className="w-4 h-4" /> SUNUCU KIYASLAMA MODÜLÜ
          </div>
          <h3 className="text-2xl font-black text-white mt-1">
            Server Karşılaştırma Tablosu
          </h3>
        </div>

        {/* SERVER SELECT CHIPS */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">Karşılaştırılacak Sunucuları Seç (Maks 3):</span>
          {servers.map(s => {
            const isSelected = selectedIds.includes(s.id);
            return (
              <button
                key={s.id}
                onClick={() => toggleSelect(s.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                    : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10'
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* COMPARISON TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-gray-300 border-collapse">
          <thead>
            <tr className="border-b border-white/10">
              <th className="py-4 px-4 font-bold text-gray-400 w-1/4">Özellikler</th>
              {comparedServers.map(s => (
                <th key={s.id} className="py-4 px-4 font-black text-white text-base">
                  <div className="flex items-center gap-1.5">
                    {s.isVip && <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />}
                    {s.name}
                  </div>
                  <div className="text-xs font-normal text-amber-400 mt-1">{s.type} • {s.structure}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            <tr>
              <td className="py-3 px-4 font-semibold text-gray-400">Maksimum Seviye</td>
              {comparedServers.map(s => (
                <td key={s.id} className="py-3 px-4 font-bold text-white">
                  {s.features.maxLevel} Lvl
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-gray-400">Simya Sistemi</td>
              {comparedServers.map(s => (
                <td key={s.id} className="py-3 px-4">
                  {s.features.alchemy ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-bold"><Check className="w-4 h-4" /> Var</span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 font-bold"><X className="w-4 h-4" /> Yok (Simyasız)</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-gray-400">Lycan Karakteri</td>
              {comparedServers.map(s => (
                <td key={s.id} className="py-3 px-4">
                  {s.features.lycan ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-bold"><Check className="w-4 h-4" /> Var</span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 font-bold"><X className="w-4 h-4" /> Yok (Lycansız)</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-gray-400">Otomatik Av / Bot</td>
              {comparedServers.map(s => (
                <td key={s.id} className="py-3 px-4">
                  {s.features.autoHunt ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-bold"><Check className="w-4 h-4" /> Serbest</span>
                  ) : (
                    <span className="text-rose-400 flex items-center gap-1 font-bold"><X className="w-4 h-4" /> Yasak / Yok</span>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-gray-400">Ödül Havuzu</td>
              {comparedServers.map(s => (
                <td key={s.id} className="py-3 px-4 font-bold text-amber-400 flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-amber-400" />
                  {s.rewardPool || 'Turnuva Ödülü Var'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="py-3 px-4 font-semibold text-gray-400">Oy Sayısı & Puan</td>
              {comparedServers.map(s => (
                <td key={s.id} className="py-3 px-4 font-bold text-white">
                  ⭐ {s.rating} ({s.votes.toLocaleString('tr-TR')} Oy)
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
