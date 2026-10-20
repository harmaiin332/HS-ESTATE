import React, { useState } from 'react';
import { Mail, Phone, MapPin, ShieldCheck, ArrowRight, Check } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  onFilterNeighborhood?: (name: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onFilterNeighborhood }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail('');
    }, 4000);
  };

  return (
    <footer className="bg-[#0B1220] border-t border-[#C8A96B]/30 text-white pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-slate-800">
          
          {/* Brand & Manifesto */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border border-[#C8A96B] flex items-center justify-center bg-[#111C30]">
                <span className="font-serif text-[#C8A96B] text-xl font-bold tracking-widest">HS</span>
              </div>
              <span className="text-xl font-serif tracking-[0.2em] font-semibold text-white uppercase">
                HS ESTATE
              </span>
            </div>
            
            <p className="text-xs text-[#DFC58E] font-serif italic tracking-wide">
              Discover Better. Live Smarter.
            </p>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              HS ESTATE is Dubai’s premier boutique real estate advisory, representing sovereign funds, family offices, and discerning global buyers in acquiring prime GCC residential and commercial assets.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5 font-mono">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#C8A96B] shrink-0" />
                <span>Boulevard Plaza Tower 1, Level 32, Downtown Dubai</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#C8A96B] shrink-0" />
                <span>+971 4 821 9900 · Direct Private Desk</span>
              </div>
            </div>
          </div>

          {/* Prime Portfolios */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#DFC58E] font-semibold">
              Curated Portfolios
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('listings')}
                  className="hover:text-white transition-colors"
                >
                  Palm Jumeirah Fronds
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('listings')}
                  className="hover:text-white transition-colors"
                >
                  Downtown Sky Penthouses
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('listings')}
                  className="hover:text-white transition-colors"
                >
                  Emirates Hills Mansions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('listings')}
                  className="hover:text-white transition-colors"
                >
                  DIFC Executive Suites
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('listings')}
                  className="hover:text-white transition-colors"
                >
                  Off-Plan Trophy Launches
                </button>
              </li>
            </ul>
          </div>

          {/* Advisory & Services */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#DFC58E] font-semibold">
              Bespoke Advisory
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  UAE 10-Yr Golden Visa Desk
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  Off-Market Acquisitions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Cross-Border Capital Structuring
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  Turnkey Interior Architecture
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('contact')}
                  className="hover:text-white transition-colors"
                >
                  Portfolio Asset Management
                </button>
              </li>
            </ul>
          </div>

          {/* Private Newsletter */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-widest text-[#DFC58E] font-semibold">
              The Private Dispatch
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Receive confidential off-market allocations, quarterly Dubai land transaction metrics, and pre-release architectural dossiers.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2 pt-1">
              <div className="flex">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your confidential email..."
                  className="flex-1 bg-[#111C30] border border-slate-700 text-white text-xs px-3 py-2.5 focus:border-[#C8A96B] focus:outline-none placeholder-slate-500"
                />
                <button
                  type="submit"
                  className="px-4 bg-[#C8A96B] hover:bg-[#DFC58E] text-[#0B1220] text-xs font-semibold uppercase tracking-wider transition-colors shrink-0 flex items-center justify-center"
                >
                  {subscribed ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
              {subscribed && (
                <p className="text-[11px] text-[#DFC58E] font-mono">
                  ✓ Registered with HS ESTATE Private Dispatch.
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Regulatory & Legal Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 gap-4">
          <div className="flex flex-wrap items-center gap-4">
            <span>© {new Date().getFullYear()} HS ESTATE LLC. All rights reserved.</span>
            <span aria-hidden="true">·</span>
            <span>Dubai RERA ORN: 29481</span>
            <span aria-hidden="true">·</span>
            <span>DED Commercial License: 984021</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => onNavigate('about')} className="hover:text-slate-300 transition-colors">Privacy Charter</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-300 transition-colors">Regulatory Compliance</button>
            <button onClick={() => onNavigate('contact')} className="hover:text-slate-300 transition-colors">Terms of Brokerage</button>
          </div>
        </div>

      </div>
    </footer>
  );
};
