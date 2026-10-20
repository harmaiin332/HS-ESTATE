import React, { useState } from 'react';
import { Search, ArrowRight, Shield, Award, Landmark, TrendingUp, Sparkles, Check, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Property, Neighborhood, Development, PropertyPurpose } from '../types';
import { Currency, formatCurrency, formatAedShort } from '../utils/formatters';
import { PropertyCard } from '../components/PropertyCard';
import { HERO_IMAGE, SAMPLE_TESTIMONIALS } from '../data/mockData';

interface HomePageProps {
  properties: Property[];
  neighborhoods: Neighborhood[];
  developments: Development[];
  currency: Currency;
  savedPropertyIds: string[];
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onSelectProperty: (property: Property) => void;
  onSearch: (params: { purpose: PropertyPurpose; neighborhood: string; type: string; minPrice: number; maxPrice: number; bedrooms: string }) => void;
  onNavigateToListings: (filter?: any) => void;
  onOpenAdvisor: () => void;
  onOpenConsultation: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  properties,
  neighborhoods,
  developments,
  currency,
  savedPropertyIds,
  onToggleSave,
  onSelectProperty,
  onSearch,
  onNavigateToListings,
  onOpenAdvisor,
  onOpenConsultation,
}) => {
  // Hero Search Panel State
  const [searchMode, setSearchMode] = useState<'standard' | 'ai'>('standard');
  const [activePurpose, setActivePurpose] = useState<PropertyPurpose>('buy');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBedrooms, setSelectedBedrooms] = useState('all');
  const [selectedPriceBracket, setSelectedPriceBracket] = useState('all');
  const [aiHeroQuery, setAiHeroQuery] = useState('');

  // Featured Properties Filter
  const [featuredTab, setFeaturedTab] = useState<'all' | 'Villa' | 'Penthouse' | 'Apartment'>('all');

  const filteredFeatured = properties.filter((p) => {
    if (featuredTab === 'all') return true;
    return p.type === featuredTab;
  });

  const handleHeroSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchMode === 'ai') {
      if (aiHeroQuery.trim()) {
        onNavigateToListings({ aiQuery: aiHeroQuery.trim() });
      }
      return;
    }

    let minPrice = 0;
    let maxPrice = 200000000;

    if (selectedPriceBracket === 'under15m') {
      maxPrice = 15000000;
    } else if (selectedPriceBracket === '15m-40m') {
      minPrice = 15000000;
      maxPrice = 40000000;
    } else if (selectedPriceBracket === '40m-80m') {
      minPrice = 40000000;
      maxPrice = 80000000;
    } else if (selectedPriceBracket === 'above80m') {
      minPrice = 80000000;
    }

    onSearch({
      purpose: activePurpose,
      neighborhood: selectedNeighborhood === 'all' ? '' : selectedNeighborhood,
      type: selectedType === 'all' ? '' : selectedType,
      minPrice,
      maxPrice,
      bedrooms: selectedBedrooms === 'all' ? '' : selectedBedrooms,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center bg-[#0B1220] overflow-hidden">
        {/* Background Image with Depth & Scrim */}
        <div className="absolute inset-0 z-0">
          <img
            src={HERO_IMAGE}
            alt="Dubai Luxury Skyline Sunset"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center scale-100 transition-transform duration-1000 ease-out"
          />
          {/* Measured gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220] via-[#0B1220]/75 to-[#0B1220]/45" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,18,32,0.6)_100%)]" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center flex flex-col items-center">
          
          {/* Subtle editorial kicker */}
          <div className="mb-4 inline-flex items-center gap-2.5 text-xs font-mono tracking-[0.25em] text-[#DFC58E] uppercase">
            <span>Dubai, UAE</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>Ultra-Prime Real Estate</span>
            <span aria-hidden="true" className="text-slate-500">·</span>
            <span>Private Advisory</span>
          </div>

          {/* Primary Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white tracking-tight leading-[1.1] max-w-4xl text-balance">
            Find Your Place in Dubai.
          </h1>

          {/* Tagline */}
          <p className="mt-4 text-base sm:text-lg text-slate-300 font-light max-w-2xl text-balance">
            Discover Better. Live Smarter. Exclusive waterfront villas, sky penthouses, and private off-market portfolios for international buyers and investors.
          </p>

          {/* Search Panel Container */}
          <div className="w-full max-w-4xl mt-10 bg-[#0B1220]/90 backdrop-blur-xl border border-[#C8A96B]/40 shadow-2xl p-4 sm:p-6 text-left">
            
            {/* Search Modes (Standard / AI Natural Language) */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-6 border-b border-slate-700/70 pb-3">
              <div className="flex items-center gap-2">
                {(['buy', 'rent', 'invest'] as PropertyPurpose[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => {
                      setSearchMode('standard');
                      setActivePurpose(p);
                    }}
                    className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold transition-all ${
                      searchMode === 'standard' && activePurpose === p
                        ? 'bg-[#C8A96B] text-[#0B1220] shadow-md'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {p === 'buy' ? 'Buy Property' : p === 'rent' ? 'Rent Residence' : 'Invest / Off-Plan'}
                  </button>
                ))}
              </div>

              {/* AI Natural Search Toggle */}
              <button
                type="button"
                onClick={() => setSearchMode('ai')}
                className={`px-4 py-2 text-xs uppercase tracking-widest font-semibold transition-all flex items-center gap-1.5 ${
                  searchMode === 'ai'
                    ? 'bg-[#C8A96B] text-[#0B1220] shadow-md font-bold'
                    : 'bg-[#111C30] border border-[#C8A96B]/40 text-[#DFC58E] hover:bg-slate-800'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Natural Search</span>
              </button>
            </div>

            {/* If AI Mode is active */}
            {searchMode === 'ai' ? (
              <form onSubmit={handleHeroSearchSubmit} className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#C8A96B] absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={aiHeroQuery}
                      onChange={(e) => setAiHeroQuery(e.target.value)}
                      placeholder="e.g. Find a 2-bedroom apartment in Dubai Marina under AED 1.5 million..."
                      className="w-full bg-[#111C30] border border-slate-700 text-white text-xs pl-10 pr-4 py-3 focus:outline-none focus:border-[#C8A96B] placeholder-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!aiHeroQuery.trim()}
                    className="px-6 py-3 bg-[#C8A96B] hover:bg-[#DFC58E] disabled:opacity-40 text-[#0B1220] text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors shrink-0 shadow-lg"
                  >
                    <Sparkles className="w-4 h-4 text-[#0B1220]" />
                    <span>Search with AI</span>
                  </button>
                </div>

                {/* Sample Prompt Chips */}
                <div className="pt-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#DFC58E] block mb-2">
                    Or select an example prompt:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Find a 2-bedroom apartment in Dubai Marina under AED 1.5 million.",
                      "Show villas with swimming pools in Dubai Hills Estate.",
                      "Find rental properties under AED 100,000 per year.",
                      "Show penthouses with three bedrooms and a sea view.",
                    ].map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setAiHeroQuery(sample);
                          onNavigateToListings({ aiQuery: sample });
                        }}
                        className="text-[11px] px-3 py-1.5 bg-[#111C30] hover:bg-slate-800 border border-slate-700 hover:border-[#C8A96B] text-slate-300 hover:text-white transition-all text-left"
                      >
                        "{sample}"
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            ) : (
              /* Standard Dropdown Grid */
              <form onSubmit={handleHeroSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Location */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Location
                  </label>
                  <select
                    value={selectedNeighborhood}
                    onChange={(e) => setSelectedNeighborhood(e.target.value)}
                    className="w-full bg-[#111C30] border border-slate-700 text-white text-xs px-3 py-2.5 focus:border-[#C8A96B] focus:outline-none"
                  >
                    <option value="all">All Prime Districts</option>
                    <option value="Palm Jumeirah">Palm Jumeirah</option>
                    <option value="Downtown Dubai">Downtown Dubai</option>
                    <option value="Dubai Hills Estate">Dubai Hills Estate</option>
                    <option value="Dubai Marina">Dubai Marina</option>
                    <option value="Emirates Hills">Emirates Hills</option>
                    <option value="DIFC">DIFC</option>
                    <option value="Dubai Creek Harbour">Dubai Creek Harbour</option>
                  </select>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Property Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full bg-[#111C30] border border-slate-700 text-white text-xs px-3 py-2.5 focus:border-[#C8A96B] focus:outline-none"
                  >
                    <option value="all">All Typologies</option>
                    <option value="Villa">Beachfront Villa</option>
                    <option value="Penthouse">Sky Penthouse</option>
                    <option value="Apartment">Luxury Apartment</option>
                    <option value="Mansion">Golf Mansion</option>
                    <option value="Townhouse">Townhouse</option>
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Bedrooms
                  </label>
                  <select
                    value={selectedBedrooms}
                    onChange={(e) => setSelectedBedrooms(e.target.value)}
                    className="w-full bg-[#111C30] border border-slate-700 text-white text-xs px-3 py-2.5 focus:border-[#C8A96B] focus:outline-none"
                  >
                    <option value="all">Any Bedrooms</option>
                    <option value="1">1 Bedroom</option>
                    <option value="2">2 Bedrooms</option>
                    <option value="3">3 Bedrooms</option>
                    <option value="4">4 Bedrooms</option>
                    <option value="5">5+ Bedrooms</option>
                  </select>
                </div>

                {/* Price Bracket (AED) */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Price Bracket (AED)
                  </label>
                  <select
                    value={selectedPriceBracket}
                    onChange={(e) => setSelectedPriceBracket(e.target.value)}
                    className="w-full bg-[#111C30] border border-slate-700 text-white text-xs px-3 py-2.5 focus:border-[#C8A96B] focus:outline-none"
                  >
                    <option value="all">Any Price</option>
                    <option value="under15m">Under 15M AED</option>
                    <option value="15m-40m">15M - 40M AED</option>
                    <option value="40m-80m">40M - 80M AED</option>
                    <option value="above80m">80M+ AED (Ultra-Prime)</option>
                  </select>
                </div>

                {/* Submit CTA */}
                <div className="sm:col-span-2 lg:col-span-4 pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#C8A96B] hover:bg-[#DFC58E] text-[#0B1220] text-xs uppercase tracking-widest font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search Prime Dubai Estates</span>
                  </button>
                </div>

              </form>
            )}
          </div>

        </div>
      </section>

      {/* 2. KPI & TRUST STRIP (Full-Width Row Below Hero) */}
      <section className="bg-[#111C30] border-y border-[#C8A96B]/20 py-8 text-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#DFC58E] tabular-nums">4.8B+ AED</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-mono mt-1">Managed Portfolio Value</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-white tabular-nums">9.2% Net</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-mono mt-1">Peak Prime Rental Yields</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-[#DFC58E] tabular-nums">10-Year</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-mono mt-1">UAE Golden Visa Desk</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-serif font-bold text-white tabular-nums">0% Tax</div>
            <div className="text-xs text-slate-400 uppercase tracking-wider font-mono mt-1">Capital Gains & Property Tax</div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#A38446] font-semibold block mb-2">
              Curated Private Portfolio
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0B1220] tracking-tight">
              Featured Dubai Residences
            </h2>
          </div>

          {/* Category Tabs (Interactive buttons) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 self-start md:self-auto overflow-x-auto">
            {(['all', 'Villa', 'Penthouse', 'Apartment'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFeaturedTab(tab)}
                className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                  featuredTab === tab
                    ? 'bg-[#0B1220] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab === 'all' ? 'All Curated' : `${tab}s`}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Column Property Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFeatured.slice(0, 6).map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              currency={currency}
              isSaved={savedPropertyIds.includes(property.id)}
              onToggleSave={onToggleSave}
              onSelect={onSelectProperty}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => onNavigateToListings()}
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0B1220] hover:bg-[#111C30] text-white text-xs uppercase tracking-widest font-semibold border border-[#C8A96B]/50 transition-colors shadow-md"
          >
            <span>Explore All Dubai Properties</span>
            <ArrowRight className="w-4 h-4 text-[#C8A96B]" />
          </button>
        </div>
      </section>

      {/* 4. EXPLORE DUBAI NEIGHBORHOODS */}
      <section className="py-24 bg-[#F6F7F9] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#A38446] font-semibold block mb-2">
              Prime Geographies
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0B1220] tracking-tight">
              Explore Dubai’s Iconic Enclaves
            </h2>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              From palatial private beachfront fronds to cosmopolitan financial high-rises, discover the lifestyle and investment yields of each marquee district.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {neighborhoods.map((n) => (
              <div
                key={n.id}
                onClick={() => onNavigateToListings({ neighborhood: n.name })}
                className="group cursor-pointer bg-white border border-slate-200 hover:border-[#C8A96B] transition-all duration-300 overflow-hidden shadow-sm hover:shadow-lg flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                  <img
                    src={n.image}
                    alt={n.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/90 via-[#0B1220]/30 to-transparent" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-serif text-2xl font-bold">{n.name}</h3>
                    <p className="text-xs text-slate-300 font-sans line-clamp-1">{n.tagline}</p>
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {n.description}
                  </p>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono text-slate-500 tabular-nums">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Avg Price/sqft</span>
                      <span className="font-bold text-[#0B1220]">{n.avgPricePerSqft.toLocaleString()} AED</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400 block text-[10px]">Active Portfolios</span>
                      <span className="font-bold text-[#0B1220]">{n.propertyCount} Listed</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. NEW DEVELOPMENTS / OFF-PLAN TROPHY LAUNCHES */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#A38446] font-semibold block mb-2">
              Off-Plan & Architectural Drops
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0B1220] tracking-tight">
              Premier Developments
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Direct pre-allocation access to flagship branded residences with structured developer payment plans and escrow security.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {developments.map((dev) => (
            <div
              key={dev.id}
              className="bg-white border border-slate-200 hover:border-[#C8A96B] transition-all p-6 flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="relative aspect-[16/9] mb-5 overflow-hidden bg-slate-900">
                  <img
                    src={dev.image}
                    alt={dev.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-[#0B1220]/80 text-[#DFC58E] px-2 py-1 text-[10px] font-mono border border-[#C8A96B]/30 uppercase">
                    Handover {dev.handover}
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider mb-1">
                  {dev.developer} · {dev.location}
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0B1220] mb-2">
                  {dev.name}
                </h3>
                <p className="text-xs text-slate-600 mb-4 font-sans">
                  {dev.projectType}
                </p>

                <div className="space-y-2 py-3 border-t border-slate-100 text-xs text-slate-600">
                  {dev.projectHighlights.map((hl, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-[#C8A96B] shrink-0 mt-0.5" />
                      <span>{hl}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">From</span>
                  <span className="font-serif font-bold text-lg text-[#0B1220] tabular-nums">
                    {formatCurrency(dev.startingPriceAed, currency)}
                  </span>
                </div>
                <button
                  onClick={onOpenConsultation}
                  className="px-4 py-2 text-xs uppercase tracking-wider font-semibold text-[#0B1220] bg-[#C8A96B] hover:bg-[#DFC58E] transition-colors"
                >
                  Request Allocation
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. AI PROPERTY ADVISOR PROMOTIONAL SECTION */}
      <section className="py-20 bg-[#0B1220] border-y border-[#C8A96B]/30 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[#DFC58E] uppercase tracking-wider bg-[#111C30] px-3 py-1 border border-[#C8A96B]/30">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span>Intelligent Dubai Advisory</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight text-white leading-tight">
              Consult Our AI Property Specialist.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
              Trained on Dubai Land Department historical transactions, current rental yields, off-plan escrow milestones, and 10-Year UAE Golden Visa frameworks. Get immediate answers tailored to your capital profile.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <button
                onClick={onOpenAdvisor}
                className="px-6 py-3 bg-[#C8A96B] hover:bg-[#DFC58E] text-[#0B1220] text-xs uppercase tracking-widest font-bold transition-all shadow-lg flex items-center gap-2"
              >
                <span>Launch Advisor Conversation</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenConsultation}
                className="px-6 py-3 bg-[#111C30] hover:bg-slate-800 text-white text-xs uppercase tracking-widest font-semibold border border-slate-700 transition-colors"
              >
                Human Senior Broker Desk
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#111C30] border border-[#C8A96B]/40 p-6 space-y-3">
            <span className="text-[11px] font-mono uppercase tracking-wider text-[#DFC58E] block">
              Sample Inquiries Handled:
            </span>
            <div className="space-y-2 text-xs">
              <div
                onClick={onOpenAdvisor}
                className="p-3 bg-[#0B1220] border border-slate-700 hover:border-[#C8A96B] cursor-pointer text-slate-300 hover:text-white transition-colors"
              >
                "Show beachfront villas on Palm Jumeirah under 70M AED with private beach frontage."
              </div>
              <div
                onClick={onOpenAdvisor}
                className="p-3 bg-[#0B1220] border border-slate-700 hover:border-[#C8A96B] cursor-pointer text-slate-300 hover:text-white transition-colors"
              >
                "What is the minimum equity required for a 10-Year UAE Golden Visa for my family?"
              </div>
              <div
                onClick={onOpenAdvisor}
                className="p-3 bg-[#0B1220] border border-slate-700 hover:border-[#C8A96B] cursor-pointer text-slate-300 hover:text-white transition-colors"
              >
                "Compare rental yields in Downtown Dubai vs Dubai Marina for executive 2-bedroom units."
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE HS ESTATE (Proof & Rigor) */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#A38446] font-semibold block mb-2">
            The HS ESTATE Standard
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0B1220] tracking-tight">
            Why Discerning Capital Trusts Us
          </h2>
          <p className="text-xs text-slate-500 mt-2">
            Independent advisory free from developer bias, dedicated exclusively to the buyer’s strategic interest.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="p-6 bg-[#F6F7F9] border border-slate-200">
            <div className="w-10 h-10 bg-[#0B1220] text-[#C8A96B] flex items-center justify-center mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#0B1220] mb-2">Off-Market Access</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Over 35% of our ultra-luxury transactions occur entirely off-market between verified private principals.
            </p>
          </div>

          <div className="p-6 bg-[#F6F7F9] border border-slate-200">
            <div className="w-10 h-10 bg-[#0B1220] text-[#C8A96B] flex items-center justify-center mb-4">
              <Landmark className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#0B1220] mb-2">Golden Visa Protocol</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              End-to-end legal processing of the 10-Year UAE Golden Visa through our in-house government relations desk.
            </p>
          </div>

          <div className="p-6 bg-[#F6F7F9] border border-slate-200">
            <div className="w-10 h-10 bg-[#0B1220] text-[#C8A96B] flex items-center justify-center mb-4">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#0B1220] mb-2">Quantitative Rigor</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Detailed cashflow modeling, net yield projections, service charge audits, and currency risk mitigation.
            </p>
          </div>

          <div className="p-6 bg-[#F6F7F9] border border-slate-200">
            <div className="w-10 h-10 bg-[#0B1220] text-[#C8A96B] flex items-center justify-center mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#0B1220] mb-2">RERA Licensed & Insured</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Strict compliance with the Dubai Real Estate Regulatory Agency (ORN 29481) and escrow protections.
            </p>
          </div>
        </div>
      </section>

      {/* 8. SAMPLE TESTIMONIALS (Clearly Identified) */}
      <section className="py-24 bg-[#F6F7F9] border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#A38446] font-semibold block mb-2">
              Client Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0B1220] tracking-tight">
              Perspectives from Our Private Clients
            </h2>
            <p className="text-[11px] text-slate-400 font-mono mt-1">
              [Note: Illustrative client case profiles reflecting typical ultra-HNW acquisitions]
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SAMPLE_TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 p-8 flex flex-col justify-between shadow-sm relative"
              >
                <div className="text-[#C8A96B] font-serif text-5xl leading-none mb-3">“</div>
                <p className="text-xs text-slate-700 leading-relaxed italic mb-6">
                  {t.quote}
                </p>
                <div className="pt-4 border-t border-slate-100">
                  <div className="font-serif font-bold text-[#0B1220] text-sm">{t.author}</div>
                  <div className="text-xs text-slate-500">{t.role}</div>
                  <div className="text-[11px] font-mono text-[#A38446] mt-1">{t.verifiedType} · {t.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. VIP CALL-TO-ACTION */}
      <section className="py-20 bg-[#0B1220] text-white text-center border-t border-[#C8A96B]/30">
        <div className="max-w-3xl mx-auto px-6 space-y-6">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#DFC58E]">
            Confidential Representation
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight text-balance">
            Begin Your Dubai Acquisition.
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed text-balance">
            Whether seeking an off-market beachfront sanctuary on Palm Jumeirah or curating a high-yielding institutional residential portfolio, our Senior Partners are at your disposal.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <button
              onClick={onOpenConsultation}
              className="px-8 py-3.5 bg-[#C8A96B] hover:bg-[#DFC58E] text-[#0B1220] text-xs uppercase tracking-widest font-bold transition-colors shadow-lg"
            >
              Schedule Private Consultation
            </button>
            <button
              onClick={() => onNavigateToListings()}
              className="px-8 py-3.5 bg-transparent hover:bg-white/5 text-white text-xs uppercase tracking-widest font-semibold border border-slate-600 transition-colors"
            >
              View Available Listings
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
