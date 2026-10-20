import React from 'react';
import { Shield, Award, Landmark, TrendingUp, Users, CheckCircle, ArrowRight } from 'lucide-react';
import { HERO_IMAGE, VILLA_PALM_IMAGE, PENTHOUSE_DOWNTOWN_IMAGE } from '../data/mockData';

interface AboutPageProps {
  onOpenConsultation: () => void;
  onNavigateToListings: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenConsultation, onNavigateToListings }) => {
  return (
    <div className="min-h-screen bg-white">
      
      {/* Hero Banner */}
      <section className="relative py-28 bg-[#0B1220] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-30">
          <img src={HERO_IMAGE} alt="HS ESTATE Dubai" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-4">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#DFC58E]">
            About HS ESTATE · Dubai, UAE
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight">
            Discover Better. Live Smarter.
          </h1>
          <p className="text-sm sm:text-base text-slate-300 font-light max-w-2xl mx-auto leading-relaxed">
            A bespoke private brokerage representing global institutional investors, sovereign entities, and discerning families in acquiring Dubai’s most coveted trophy real estate.
          </p>
        </div>
      </section>

      {/* Narrative & Philosophy */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#A38446] font-semibold block">
              The Firm
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0B1220] tracking-tight">
              Pioneering Quantitative Rigor in Ultra-Luxury Property
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              Founded in Dubai’s premier financial hub, HS ESTATE was established to replace traditional sales tactics with institutional advisory standards. We provide objective, data-backed counsel on capital allocation across Dubai’s freehold zones.
            </p>
            <p className="text-sm text-slate-600 leading-relaxed font-sans">
              Whether curating an off-market beachfront villa on Palm Jumeirah or structuring a diversified portfolio of DIFC high-yield units, our Senior Partners prioritize discretion, legal security, and long-term capital preservation above all else.
            </p>

            <div className="pt-2 grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-4 bg-[#F6F7F9] border border-slate-200">
                <span className="text-[#A38446] font-bold text-xl block mb-1">RERA ORN 29481</span>
                <span className="text-slate-500">Official Dubai Land Dept License</span>
              </div>
              <div className="p-4 bg-[#F6F7F9] border border-slate-200">
                <span className="text-[#A38446] font-bold text-xl block mb-1">35% Off-Market</span>
                <span className="text-slate-500">Transactions strictly confidential</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="aspect-[4/3] bg-slate-900 border border-slate-200 overflow-hidden shadow-2xl">
              <img
                src={VILLA_PALM_IMAGE}
                alt="Palm Jumeirah Villa"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-[#0B1220] text-white p-6 border border-[#C8A96B]/50 max-w-xs shadow-2xl hidden sm:block">
              <p className="text-xs text-[#DFC58E] font-serif italic mb-1">
                "Our single fiduciary obligation is to the buyer’s lasting prosperity in the Emirates."
              </p>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                — HS ESTATE Charter
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* Senior Leadership Team */}
      <section className="py-24 bg-[#F6F7F9] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#A38446] font-semibold block mb-2">
              Partnership & Advisory
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0B1220] tracking-tight">
              Senior Leadership
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Decades of combined experience in sovereign wealth advisory, private banking, and architectural development.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80"
                alt="Alexander Sterling"
                className="w-28 h-28 object-cover mb-4 border border-[#C8A96B]"
              />
              <h3 className="font-serif font-bold text-lg text-[#0B1220]">Alexander Sterling</h3>
              <p className="text-xs text-[#A38446] font-mono uppercase tracking-wider mb-2">
                Managing Director · Ultra-Prime
              </p>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Former Zurich private wealth director specializing in Palm Jumeirah and Emirates Hills trophy transactions exceeding 50M AED.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80"
                alt="Soraya Mansoor"
                className="w-28 h-28 object-cover mb-4 border border-[#C8A96B]"
              />
              <h3 className="font-serif font-bold text-lg text-[#0B1220]">Soraya Mansoor</h3>
              <p className="text-xs text-[#A38446] font-mono uppercase tracking-wider mb-2">
                Senior Partner · Penthouses & Off-Market
              </p>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Architectural historian and 12-year Dubai luxury veteran directing our Downtown and DIFC penthouse acquisitions.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center">
              <img
                src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format&fit=crop&q=80"
                alt="Tariq Al-Sabah"
                className="w-28 h-28 object-cover mb-4 border border-[#C8A96B]"
              />
              <h3 className="font-serif font-bold text-lg text-[#0B1220]">Tariq Al-Sabah</h3>
              <p className="text-xs text-[#A38446] font-mono uppercase tracking-wider mb-2">
                Head of Golden Visa & Government Affairs
              </p>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                Directing our in-house residency team for expedited 10-Year UAE Golden Visa facilitation for international buyers and their families.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advisory Divisions */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#A38446] font-semibold block mb-2">
            Practice Groups
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0B1220] tracking-tight">
            Specialized Advisory Desks
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 bg-[#F6F7F9] border border-slate-200">
            <h3 className="font-serif font-bold text-xl text-[#0B1220] mb-2">
              01. The Trophy Waterfront Desk
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Dedicated exclusively to beachfront villas and private frond estates on Palm Jumeirah, Jumeirah Bay Island (Bulgari), and Dubai Islands.
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
              <li>✓ Private beach riparian rights verification</li>
              <li>✓ Subterranean automotive showroom design</li>
              <li>✓ Marine engineering & private jetty permitting</li>
            </ul>
          </div>

          <div className="p-8 bg-[#F6F7F9] border border-slate-200">
            <h3 className="font-serif font-bold text-xl text-[#0B1220] mb-2">
              02. Institutional Portfolio & Yield Desk
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Structuring high-yield residential blocks across Downtown Dubai, DIFC, and Dubai Marina with projected net returns exceeding 8.5%.
            </p>
            <ul className="text-xs text-slate-700 space-y-1.5 font-medium">
              <li>✓ Commercial escrow account audits</li>
              <li>✓ Turnkey corporate tenant leasing management</li>
              <li>✓ Cross-border currency peg hedging guidance</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-20 bg-[#0B1220] text-white text-center border-t border-[#C8A96B]/30">
        <div className="max-w-2xl mx-auto px-6 space-y-6">
          <h2 className="text-3xl font-serif font-bold">Initiate Your Dubai Relationship</h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Arrange a confidential meeting at our Downtown Dubai headquarters or via encrypted digital briefing.
          </p>
          <div className="pt-2 flex justify-center gap-4">
            <button
              onClick={onOpenConsultation}
              className="px-6 py-3 bg-[#C8A96B] hover:bg-[#DFC58E] text-[#0B1220] text-xs uppercase tracking-widest font-bold"
            >
              Contact Private Desk
            </button>
            <button
              onClick={onNavigateToListings}
              className="px-6 py-3 border border-slate-600 text-white text-xs uppercase tracking-widest font-semibold hover:bg-white/5"
            >
              Explore Portfolios
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
