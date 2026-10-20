import React from 'react';
import { Bookmark, MapPin, ArrowUpRight } from 'lucide-react';
import { Property } from '../types';
import { Currency, formatCurrency } from '../utils/formatters';

interface PropertyCardProps {
  property: Property;
  currency: Currency;
  isSaved: boolean;
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onSelect: (property: Property) => void;
  onQuickInquire?: (property: Property, e: React.MouseEvent) => void;
  isComparing?: boolean;
  onToggleCompare?: (property: Property, e: React.MouseEvent) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  currency,
  isSaved,
  onToggleSave,
  onSelect,
  onQuickInquire,
  isComparing = false,
  onToggleCompare,
}) => {
  return (
    <article
      onClick={() => onSelect(property)}
      className="group cursor-pointer bg-white border border-slate-200 hover:border-[#C8A96B] transition-all duration-300 flex flex-col h-full shadow-sm hover:shadow-xl relative overflow-hidden"
    >
      {/* Visual Asset Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
        <img
          src={property.images[0]}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          onError={(e) => {
            // Elegant CSS fallback container
            const target = e.currentTarget;
            target.style.display = 'none';
            if (target.parentElement) {
              target.parentElement.classList.add('bg-[#111C30]');
            }
          }}
        />

        {/* Minimal scrim gradient for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1220]/80 via-transparent to-transparent pointer-events-none" />

        {/* Top bar over image: Quiet label + Compare & Save buttons */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="text-[11px] font-mono tracking-widest uppercase bg-[#0B1220]/80 backdrop-blur-md text-[#DFC58E] px-2.5 py-1 border border-[#C8A96B]/30">
            {property.type} · {property.purpose.toUpperCase()}
          </span>

          <div className="flex items-center gap-1.5">
            {onToggleCompare && (
              <button
                onClick={(e) => onToggleCompare(property, e)}
                title={isComparing ? "Remove from comparison" : "Add to comparison"}
                className={`px-2 py-1 text-[10px] font-mono uppercase tracking-wider backdrop-blur-md border transition-colors ${
                  isComparing
                    ? 'bg-[#C8A96B] text-[#0B1220] border-[#C8A96B] font-bold'
                    : 'bg-[#0B1220]/70 text-slate-300 border-white/20 hover:text-white hover:border-[#C8A96B]'
                }`}
              >
                {isComparing ? 'Comparing' : '+ Compare'}
              </button>
            )}

            <button
              onClick={(e) => onToggleSave(property.id, e)}
              aria-label={isSaved ? "Remove from saved" : "Save property"}
              className="w-8 h-8 flex items-center justify-center bg-[#0B1220]/70 backdrop-blur-md border border-white/20 text-white hover:text-[#C8A96B] hover:border-[#C8A96B] transition-colors"
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#C8A96B] text-[#C8A96B]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Bottom price overlay inside media frame */}
        <div className="absolute bottom-3 left-3 right-3 flex items-baseline justify-between text-white">
          <div>
            <div className="text-xl md:text-2xl font-serif font-bold text-white tracking-tight tabular-nums">
              {formatCurrency(property.priceAed, currency)}
            </div>
            {property.rentalPeriod && (
              <div className="text-[11px] text-slate-300 font-sans tracking-wide">
                per {property.rentalPeriod}
              </div>
            )}
          </div>

          {property.roiEstimate && (
            <span className="text-[11px] font-mono text-[#DFC58E] tracking-tight bg-[#0B1220]/60 px-1.5 py-0.5 border border-[#C8A96B]/20">
              {property.roiEstimate}
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-5 flex flex-col flex-grow justify-between bg-white">
        <div>
          {/* Location text */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#C8A96B] shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Title */}
          <h3 className="font-serif text-lg font-bold text-[#0B1220] group-hover:text-[#A38446] transition-colors leading-snug line-clamp-2 mb-3">
            {property.title}
          </h3>

          {/* Zero-Pill Unboxed Metadata with · separator */}
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium py-2 border-y border-slate-100 tabular-nums">
            <span>{property.bedrooms} Beds</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{property.bathrooms} Baths</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>{property.sqft.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* Card Footer Actions */}
        <div className="pt-4 mt-2 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            {property.developer ? (
              <span className="truncate max-w-[140px] block">By {property.developer}</span>
            ) : (
              <span>Private Listing</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {onQuickInquire && (
              <button
                onClick={(e) => onQuickInquire(property, e)}
                className="text-xs uppercase tracking-wider font-semibold text-slate-700 hover:text-[#0B1220] px-2.5 py-1.5 border border-slate-200 hover:border-slate-400 transition-colors"
              >
                Inquire
              </button>
            )}
            <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider font-semibold text-[#0B1220] group-hover:text-[#A38446] transition-colors">
              Details <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
