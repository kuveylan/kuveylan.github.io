'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import { PlusCircle, ShieldCheck, Flame, CreditCard, Sparkles, CheckCircle2, Zap } from 'lucide-react';

export default function AddServerPage() {
  const [formData, setFormData] = useState({
    serverName: '',
    websiteUrl: '',
    discordUrl: '',
    bannerUrl: '',
    serverType: '1-99',
    structure: 'Editsiz',
    openingDate: '',
    description: '',
    rewardPool: '',
    hasAlchemy: false,
    hasLycan: false,
    hasAutoHunt: false,
    vipPackage: 'none'
  });

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // If VIP package selected, trigger PayTR payment
    if (formData.vipPackage !== 'none') {
      try {
        const res = await fetch('/api/payment/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serverId: 'new_server',
            packageType: formData.vipPackage,
            userEmail: 'owner@example.com'
          })
        });
        const data = await res.json();
        if (data.paymentUrl) {
          alert(`PayTR Otomatik Ödeme Sayfasına Yönlendiriliyorsunuz! Tutar: ${data.orderDetails.amount} ₺`);
        }
      } catch (err) {
        console.error(err);
      }
    }

    setTimeout(() => {
      setLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#08090c] text-gray-100 flex flex-col font-sans">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-12 w-full flex-1">
        
        {/* PAGE TITLE */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 text-amber-400 font-extrabold text-xs">
            <PlusCircle className="w-4 h-4" /> YAYINCI & SERVER SAHİBİ PORTALI
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-white">
            PVP Sunucunu <span className="gold-gradient-text">Metin2Atlas&apos;a Ekle</span>
          </h1>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Sunucunu anında 50.000+ aktif oyuncuya duyur! Otomatik açılış takvimine eklen ve VIP paketlerle üst sıralarda yerini al.
          </p>
        </div>

        {isSubmitted ? (
          <div className="p-8 rounded-3xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-white">Sunucunuz Başarıyla Eklendi!</h3>
            <p className="text-sm text-gray-300">
              Sunucu kaydınız alındı. Otomatik Cron-Job sistemi açılış tarihinize göre sunucunuzu canlı takvimde öne çıkaracaktır.
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-6 py-2.5 rounded-xl bg-amber-500 text-black font-bold text-xs"
            >
              Yeni Server Ekle
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 bg-[#10131a] border border-white/10 p-6 sm:p-10 rounded-3xl">
            
            {/* BASIC INFO */}
            <div className="space-y-4">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-500" /> 1. Sunucu Genel Bilgileri
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Server Adı *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Metin2Atlas 1-99"
                    value={formData.serverName}
                    onChange={(e) => setFormData({ ...formData, serverName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Açılış Tarihi & Saati *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 15 Ağustos 2026 - 21:00"
                    value={formData.openingDate}
                    onChange={(e) => setFormData({ ...formData, openingDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Web Sitesi Adresi *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Discord Sunucu Linki</label>
                  <input
                    type="url"
                    placeholder="https://discord.gg/..."
                    value={formData.discordUrl}
                    onChange={(e) => setFormData({ ...formData, discordUrl: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* SERVER SPECS */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <h3 className="text-lg font-black text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-cyan-400" /> 2. Oyun Yapısı & Özellikleri
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Seviye Aralığı</label>
                  <select
                    value={formData.serverType}
                    onChange={(e) => setFormData({ ...formData, serverType: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#161a24] border border-white/10 text-white text-sm focus:outline-none"
                  >
                    <option value="1-99">1-99 Oldschool</option>
                    <option value="1-105">1-105 Emek</option>
                    <option value="55-120">55-120 Farm</option>
                    <option value="1-120">1-120 Global</option>
                    <option value="Vslik">99-105 VS'lik</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Simya Durumu</label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasAlchemy: !formData.hasAlchemy })}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs border transition-all ${
                      formData.hasAlchemy
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-white/5 text-gray-400 border-white/10'
                    }`}
                  >
                    {formData.hasAlchemy ? '💎 Simyalı' : '🚫 Simyasız'}
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-300 mb-1">Lycan Karakteri</label>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, hasLycan: !formData.hasLycan })}
                    className={`w-full py-3 px-4 rounded-xl font-bold text-xs border transition-all ${
                      formData.hasLycan
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                        : 'bg-white/5 text-gray-400 border-white/10'
                    }`}
                  >
                    {formData.hasLycan ? '🐺 Lycanlı' : '🚫 Lycansız'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-300 mb-1">Sunucu Tanıtım Açıklaması *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Sunucunuzun öne çıkan zindanları, hile koruması ve efsun oranları..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>
            </div>

            {/* AUTOMATED MONETIZATION & VIP SPONSORSHIP PACKAGES */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 fill-amber-400" /> 3. VIP Reklam & Öne Çıkarım (Anında Otomatik Aktivasyon)
                </h3>
                <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" /> PayTR ile 7/24 Anında Yayında
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'none', title: 'Ücretsiz Standart', price: '0 ₺', desc: 'Normal sıralamada listelenir.' },
                  { id: 'vip_14', title: '14 Günlük VIP', price: '900 ₺', desc: 'En üst sıra, VIP rozet & parıltı efekti.' },
                  { id: 'vip_30', title: '30 Günlük Gold VIP', price: '1.500 ₺', desc: 'Sitelere & Hero açılış sayacına manşet.' }
                ].map(pkg => (
                  <div
                    key={pkg.id}
                    onClick={() => setFormData({ ...formData, vipPackage: pkg.id })}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      formData.vipPackage === pkg.id
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 card-glow'
                        : 'bg-white/5 border-white/10 text-gray-300 hover:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-sm text-white flex items-center justify-between">
                      <span>{pkg.title}</span>
                      <span className="text-amber-400 font-black">{pkg.price}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{pkg.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-black font-black text-base transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                {loading ? 'İşleniyor...' : formData.vipPackage !== 'none' ? 'Ödemeyi Yap ve VIP Yayınla' : 'Sunucuyu Ücretsiz Yayınla'}
              </button>
            </div>

          </form>
        )}

      </main>
    </div>
  );
}
