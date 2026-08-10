'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShieldAlert, Flame, Calendar, Trophy, Menu, X, PlusCircle } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 bg-[#08090c]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-600 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0d0f17] rounded-[10px] flex items-center justify-center">
                <ShieldAlert className="w-6 h-6 text-amber-500 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-wider gold-gradient-text">
                METIN2<span className="text-white">ATLAS</span>
              </span>
              <span className="text-[10px] tracking-widest text-amber-400/80 uppercase font-semibold">
                PVP SERVER PORTALI 2026
              </span>
            </div>
          </Link>

          {/* DESKTOP HIGH-SEO NAVIGATION */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link 
              href="/#opening-this-week" 
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all"
            >
              <Calendar className="w-4 h-4 text-amber-400" />
              Bu Cuma Açılacaklar
            </Link>
            <Link 
              href="/#opening-this-week" 
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-gray-200 hover:text-amber-400 hover:bg-white/5 transition-all"
            >
              <Flame className="w-4 h-4 text-emerald-400" />
              Aktif PVP Sunucular
            </Link>
            <Link 
              href="/#compare-section" 
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-gray-200 hover:text-cyan-400 hover:bg-white/5 transition-all"
            >
              <Trophy className="w-4 h-4 text-cyan-400" />
              Server Karşılaştır
            </Link>
          </nav>

          {/* ADD SERVER CTA BUTTON */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/add-server"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-extrabold text-xs shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle className="w-4 h-4" />
              PVP Server Ekle / Reklam Ver
            </Link>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#0d0f17] px-4 pt-4 pb-6 space-y-3">
          <Link
            href="/#opening-this-week"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-amber-400 bg-amber-500/10 font-bold text-sm"
          >
            <Calendar className="w-5 h-5 text-amber-400" />
            Bu Cuma Açılacaklar
          </Link>
          <Link
            href="/#opening-this-week"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-200 hover:bg-white/5 font-medium text-sm"
          >
            <Flame className="w-5 h-5 text-emerald-400" />
            Aktif PVP Sunucular
          </Link>
          <Link
            href="/#compare-section"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-200 hover:bg-white/5 font-medium text-sm"
          >
            <Trophy className="w-5 h-5 text-cyan-400" />
            Server Karşılaştır
          </Link>
          <div className="pt-2">
            <Link
              href="/add-server"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-amber-500 text-black font-extrabold text-sm"
            >
              <PlusCircle className="w-5 h-5" />
              PVP Server Ekle / Reklam Ver
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
