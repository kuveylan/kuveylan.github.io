'use client';

import { useState } from 'react';
import { ServerItem } from '@/lib/data';
import { Sparkles, CheckCircle2, RotateCcw, ArrowRight, ShieldCheck, Flame } from 'lucide-react';

interface ServerWizardProps {
  servers: ServerItem[];
  onSelectServer: (server: ServerItem) => void;
}

export default function ServerWizard({ servers, onSelectServer }: ServerWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [stylePreference, setStylePreference] = useState<string>('');
  const [levelPreference, setLevelPreference] = useState<string>('');
  const [alchemyPreference, setAlchemyPreference] = useState<string>('');
  const [results, setResults] = useState<ServerItem[]>([]);

  const handleCalculate = (alchemyChoice: string) => {
    setAlchemyPreference(alchemyChoice);
    setStep(4);

    // Matching logic
    const matched = servers.filter(s => {
      let match = true;
      if (stylePreference === 'Oldschool' && s.structure !== 'Editsiz' && s.structure !== 'Simyasız') match = false;
      if (levelPreference && s.type !== levelPreference) match = false;
      if (alchemyChoice === 'Simyasız' && s.features.alchemy) match = false;
      return match;
    });

    setResults(matched.length > 0 ? matched : servers.slice(0, 3));
  };

  const resetWizard = () => {
    setStep(1);
    setStylePreference('');
    setLevelPreference('');
    setAlchemyPreference('');
    setResults([]);
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-b from-[#161a26] via-[#10131a] to-[#0a0c12] border-2 border-amber-500/40 p-6 sm:p-8 card-glow overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400">
            <Sparkles className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white">Sana En Uygun Metin2 PVP Serverı Bul</h3>
            <p className="text-xs text-gray-400">3 Hızlı Soru Sorarak Hayalindeki Sunucuyu Keşfet</p>
          </div>
        </div>

        {step > 1 && (
          <button
            onClick={resetWizard}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 text-xs font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Baştan Başla
          </button>
        )}
      </div>

      {/* STEP 1: PLAYSTYLE */}
      {step === 1 && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
            Adım 1/3: Oyun Tarzın Nasıl Olsun?
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'Oldschool', title: '📜 Nostaljik Oldschool', desc: 'Zor emek, 2008 yılı Dolunay ve maden heyecanı.' },
              { id: 'Newschool', title: '🐉 Yeni Nesil Farm', desc: '55-120 Hızlı seviye, özel zindanlar ve otomatik av.' },
              { id: 'Vslik', title: '⚔️ Anında VS & Turnuva', desc: 'Farm yok, direkt 99 seviye başlayıp savaşa katıl.' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setStylePreference(item.id); setStep(2); }}
                className="p-4 rounded-2xl bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/50 text-left transition-all group"
              >
                <div className="font-bold text-white group-hover:text-amber-400 text-base">{item.title}</div>
                <div className="text-xs text-gray-400 mt-1 leading-relaxed">{item.desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 2: LEVEL RANGE */}
      {step === 2 && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
            Adım 2/3: Tercih Ettiğin Seviye Aralığı?
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {['1-99', '1-105', '55-120', 'Vslik'].map(lvl => (
              <button
                key={lvl}
                onClick={() => { setLevelPreference(lvl); setStep(3); }}
                className="p-4 rounded-2xl bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/50 text-center transition-all group"
              >
                <div className="text-xl font-black text-white group-hover:text-amber-400">{lvl}</div>
                <div className="text-[11px] text-gray-400 mt-1">Seviye Sınırı</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3: ALCHEMY & SYSTEM PREFERENCE */}
      {step === 3 && (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
            Adım 3/3: Simya ve Kuşak Sistemleri Olsun mu?
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => handleCalculate('Simyasız')}
              className="p-5 rounded-2xl bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/50 text-left transition-all group"
            >
              <div className="font-bold text-white group-hover:text-amber-400 text-base flex items-center justify-between">
                <span>🚫 Simyasız & Kuşaksız</span>
                <CheckCircle2 className="w-5 h-5 text-amber-400 opacity-0 group-hover:opacity-100" />
              </div>
              <p className="text-xs text-gray-400 mt-1">Sadece bilek gücü ve klasik efsunlar konuşsun.</p>
            </button>

            <button
              onClick={() => handleCalculate('Simyalı')}
              className="p-5 rounded-2xl bg-white/5 hover:bg-amber-500/10 border border-white/10 hover:border-amber-500/50 text-left transition-all group"
            >
              <div className="font-bold text-white group-hover:text-amber-400 text-base flex items-center justify-between">
                <span>💎 Simyalı & Zengin Sistemli</span>
                <CheckCircle2 className="w-5 h-5 text-amber-400 opacity-0 group-hover:opacity-100" />
              </div>
              <p className="text-xs text-gray-400 mt-1">Mükemmel Simyalar dizip maksimum hasara ulaş.</p>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: RESULTS */}
      {step === 4 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Tam Sana Göre {results.length} Efsane Sunucu Bulduk!
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {results.map(srv => (
              <div
                key={srv.id}
                className="p-4 rounded-2xl bg-white/5 border border-amber-500/30 hover:border-amber-500 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-400 font-bold">
                      {srv.type}
                    </span>
                    <span className="text-xs text-gray-300 font-bold truncate">{srv.name}</span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-2">{srv.description}</p>
                </div>

                <a
                  href={srv.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md shadow-amber-500/20"
                >
                  <span>Incele & Oyna</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
