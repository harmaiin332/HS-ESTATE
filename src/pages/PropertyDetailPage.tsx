import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Bookmark,
  Share2,
  Bed,
  Bath,
  Maximize,
  Calendar,
  Building,
  Check,
  Shield,
  Phone,
  MessageCircle,
  Mail,
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { Property } from '../types';
import { Currency, formatCurrency } from '../utils/formatters';
import { MortgageCalculator } from '../components/MortgageCalculator';
import { PropertyCard } from '../components/PropertyCard';

interface PropertyDetailPageProps {
  property: Property;
  allProperties: Property[];
  currency: Currency;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onBack: () => void;
  onSelectProperty: (p: Property) => void;
  onOpenViewingModal: (p: Property) => void;
  isComparing?: boolean;
  onToggleCompare?: (p: Property, e: React.MouseEvent) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({
  property,
  allProperties,
  currency,
  isSaved,
  onToggleSave,
  onBack,
  onSelectProperty,
  onOpenViewingModal,
  isComparing = false,
  onToggleCompare,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const similarProperties = allProperties
    .filter((p) => p.id !== property.id && (p.neighborhood === property.neighborhood || p.type === property.type))
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] pb-24">
      
      {/* Top Breadcrumb & Action Bar */}
      <div className="bg-white border-b border-slate-200 py-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-3 text-xs">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-slate-600 hover:text-[#0B1220] font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dubai Properties</span>
          </button>

          <div className="flex items-center gap-3">
            {onToggleCompare && (
              <button
                onClick={(e) => onToggleCompare(property, e)}
                className={`flex items-center gap-1.5 px-3 py-1.5 border transition-colors ${
                  isComparing
                    ? 'bg-[#0B1220] text-white border-[#0B1220]'
                    : 'border-slate-300 text-slate-700 hover:border-slate-400'
                }`}
              >
                <span>{isComparing ? '✓ Comparing Residence' : '+ Add to Compare'}</span>
              </button>
            )}

            <button
              onClick={(e) => onToggleSave(property.id, e)}
              className={`flex items-center gap-1.5 px-3 py-1.5 border transition-colors ${
                isSaved ? 'bg-[#C8A96B]/10 border-[#C8A96B] text-[#A38446]' : 'border-slate-300 text-slate-700 hover:border-slate-400'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#C8A96B] text-[#C8A96B]' : ''}`} />
              <span>{isSaved ? 'Saved in Portfolio' : 'Save Residence'}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 text-slate-700 hover:border-slate-400 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{isCopied ? 'Link Copied!' : 'Share'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-8">
        
        {/* Title & Price Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#A38446] mb-1">
              <span>{property.neighborhood}</span>
              <span aria-hidden="true">·</span>
              <span>{property.type}</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-500">{property.purpose.toUpperCase()}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#0B1220] tracking-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2 font-mono">
              <MapPin className="w-4 h-4 text-[#C8A96B]" />
              <span>{property.location}</span>
            </div>
          </div>

          <div className="text-left lg:text-right shrink-0">
            <div className="text-3xl sm:text-4xl font-serif font-bold text-[#0B1220] tabular-nums">
              {formatCurrency(property.priceAed, currency)}
            </div>
            {property.rentalPeriod && (
              <span className="text-xs text-slate-500 font-sans block mt-0.5">
                per {property.rentalPeriod} · Renewable lease
              </span>
            )}
            {property.roiEstimate && (
              <span className="inline-block mt-1 text-xs font-mono text-[#A38446] font-semibold bg-[#C8A96B]/15 px-2 py-0.5 border border-[#C8A96B]/30">
                {property.roiEstimate}
              </span>
            )}
          </div>
        </div>

        {/* 1. Large Image Gallery */}
        <div className="space-y-4 mb-12">
          {/* Main Hero Viewer */}
          <div className="relative aspect-[16/9] w-full bg-slate-900 overflow-hidden shadow-xl border border-slate-200 group">
            <img
              src={property.images[activeImageIndex] || property.images[0]}
              alt={property.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            
            <button
              onClick={() => setFullscreenImage(property.images[activeImageIndex] || property.images[0])}
              className="absolute bottom-4 right-4 bg-[#0B1220]/80 backdrop-blur-md text-white px-3 py-2 text-xs font-mono flex items-center gap-2 border border-white/20 hover:border-[#C8A96B] transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>Expand High-Res View</span>
            </button>
          </div>

          {/* Thumbnails Row */}
          {property.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {property.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-28 sm:w-36 aspect-[16/10] shrink-0 overflow-hidden border-2 transition-all ${
                    activeImageIndex === idx ? 'border-[#C8A96B] shadow-md scale-102' : 'border-slate-300 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Main Content Split Grid (7 Col Details, 5 Col Sticky Agent & Booking) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
          
          {/* Left Column: Specifications, Narrative, Features, Calculator */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Key Specifications Bar */}
            <div className="bg-white border border-slate-200 p-6 shadow-sm">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#A38446] font-semibold mb-4">
                Architectural Specifications
              </h3>
              
              {/* Clean Unboxed Metadata Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-xs tabular-nums">
                <div className="border-l-2 border-[#C8A96B] pl-3">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Bedrooms</span>
                  <span className="text-lg font-serif font-bold text-[#0B1220]">{property.bedrooms} En-Suite</span>
                </div>
                <div className="border-l-2 border-[#C8A96B] pl-3">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Bathrooms</span>
                  <span className="text-lg font-serif font-bold text-[#0B1220]">{property.bathrooms} Baths</span>
                </div>
                <div className="border-l-2 border-[#C8A96B] pl-3">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">Built-up Area</span>
                  <span className="text-lg font-serif font-bold text-[#0B1220]">{property.sqft.toLocaleString()} sqft</span>
                </div>
                <div className="border-l-2 border-[#C8A96B] pl-3">
                  <span className="text-slate-400 block text-[10px] uppercase font-mono">
                    {property.plotSqft ? 'Plot Size' : 'Year / Status'}
                  </span>
                  <span className="text-lg font-serif font-bold text-[#0B1220]">
                    {property.plotSqft ? `${property.plotSqft.toLocaleString()} sqft` : property.completionYear || 'Ready'}
                  </span>
                </div>
              </div>
            </div>

            {/* Narrative Description */}
            <div className="bg-white border border-slate-200 p-8 shadow-sm">
              <h3 className="text-xl font-serif font-bold text-[#0B1220] mb-4">
                The Architectural Residence
              </h3>
              <p className="text-sm text-slate-700 leading-relaxed font-sans mb-6">
                {property.description}
              </p>

              {/* Distinctive Features */}
              <h4 className="text-xs font-mono uppercase tracking-widest text-[#A38446] font-semibold mb-3">
                Key Distinctive Attributes
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                {property.features.map((feat, i) => (
                  <div key={i} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 text-[#C8A96B] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curated Amenities */}
            <div className="bg-white border border-slate-200 p-8 shadow-sm">
              <h3 className="text-xl font-serif font-bold text-[#0B1220] mb-4">
                Curated Amenities & Facilities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-700">
                {property.amenities.map((amenity, i) => (
                  <div key={i} className="p-3 bg-[#F6F7F9] border border-slate-200 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#C8A96B] rounded-full"></span>
                    <span className="font-medium">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Dubai Location Context & Highlights */}
            <div className="bg-white border border-slate-200 p-8 shadow-sm">
              <h3 className="text-xl font-serif font-bold text-[#0B1220] mb-2">
                Prime Location Proximity
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Positioned strategically within Dubai’s most connected luxury arterial corridors.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-4 bg-[#F6F7F9] border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase">Dubai International (DXB)</div>
                  <div className="font-bold text-sm text-[#0B1220] mt-1">20 - 25 Minutes</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">VIP Chauffeur route</div>
                </div>
                <div className="p-4 bg-[#F6F7F9] border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase">DIFC / Financial Hub</div>
                  <div className="font-bold text-sm text-[#0B1220] mt-1">10 - 15 Minutes</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Direct Sheikh Zayed Rd</div>
                </div>
                <div className="p-4 bg-[#F6F7F9] border border-slate-200">
                  <div className="text-slate-400 text-[10px] uppercase">Marina Yacht Club</div>
                  <div className="font-bold text-sm text-[#0B1220] mt-1">Direct / 5 Minutes</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Berth access privileges</div>
                </div>
              </div>
            </div>

            {/* Interactive Mortgage Calculator Component */}
            <MortgageCalculator initialPriceAed={property.priceAed} currency={currency} />

          </div>

          {/* Right Column: Sticky Verified Senior Agent Panel */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            
            {/* Senior Broker Profile Card */}
            <div className="bg-[#0B1220] border border-[#C8A96B]/40 p-6 text-white shadow-xl">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#DFC58E] block mb-3">
                HS ESTATE Senior Broker
              </span>

              <div className="flex items-center gap-4 mb-5 pb-5 border-b border-slate-800">
                <img
                  src={property.agent.photo}
                  alt={property.agent.name}
                  referrerPolicy="no-referrer"
                  className="w-16 h-16 object-cover border border-[#C8A96B]"
                />
                <div>
                  <h4 className="font-serif font-bold text-base text-white">{property.agent.name}</h4>
                  <p className="text-xs text-slate-300 font-sans">{property.agent.role}</p>
                  <span className="text-[10px] font-mono text-[#DFC58E]">{property.agent.reraNumber}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 text-xs text-slate-300 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-500">Languages:</span>
                  <span>{property.agent.languages.join(', ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Desk Phone:</span>
                  <span>{property.agent.phone}</span>
                </div>
              </div>

              {/* Primary Action Buttons */}
              <div className="space-y-2.5">
                <button
                  onClick={() => onOpenViewingModal(property)}
                  className="w-full py-3.5 bg-[#C8A96B] hover:bg-[#DFC58E] text-[#0B1220] text-xs uppercase tracking-widest font-bold transition-colors shadow-lg"
                >
                  Schedule Private Viewing
                </button>

                <button
                  onClick={() => onOpenViewingModal(property)}
                  className="w-full py-3 bg-[#111C30] hover:bg-slate-800 text-white text-xs uppercase tracking-wider font-semibold border border-slate-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4 text-[#C8A96B]" />
                  <span>Request Confidential Dossier</span>
                </button>

                <a
                  href={`https://wa.me/${property.agent.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 bg-[#0B1220] hover:bg-[#111C30] text-[#25D366] text-xs uppercase tracking-wider font-semibold border border-[#25D366]/40 transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Direct Private Line</span>
                </a>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2 text-[11px] text-slate-400">
                <Shield className="w-4 h-4 text-[#C8A96B] shrink-0" />
                <span>Confidential NDA & escort services upon request.</span>
              </div>
            </div>

            {/* UAE Golden Visa Banner */}
            <div className="bg-white border border-slate-200 p-5 shadow-sm text-xs">
              <h5 className="font-serif font-bold text-sm text-[#0B1220] mb-1">
                10-Year UAE Golden Visa Eligible
              </h5>
              <p className="text-slate-600 leading-relaxed mb-3">
                This residence satisfies the 2,000,000 AED property investment threshold for family residency visas with 100% foreign ownership.
              </p>
              <button
                onClick={() => onOpenViewingModal(property)}
                className="text-[#A38446] font-semibold hover:underline flex items-center gap-1"
              >
                <span>Request Golden Visa Briefing</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>

        {/* 3. Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="pt-12 border-t border-slate-200">
            <div className="flex items-center justify-between mb-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#A38446] font-semibold block mb-1">
                  Complementary Assets
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0B1220]">
                  Similar Dubai Residences
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarProperties.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  currency={currency}
                  isSaved={false}
                  onToggleSave={onToggleSave}
                  onSelect={onSelectProperty}
                />
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Fullscreen Lightbox Modal */}
      {fullscreenImage && (
        <div
          onClick={() => setFullscreenImage(null)}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 cursor-zoom-out animate-in fade-in duration-200"
        >
          <img
            src={fullscreenImage}
            alt="Expanded view"
            className="max-w-full max-h-[90vh] object-contain border border-[#C8A96B]"
          />
        </div>
      )}

    </div>
  );
};
