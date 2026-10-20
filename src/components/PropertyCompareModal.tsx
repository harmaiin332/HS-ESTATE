import React from 'react';
import { X, Check, Minus, ArrowUpRight, Scale, Trash2 } from 'lucide-react';
import { Property } from '../types';
import { Currency, formatCurrency } from '../utils/formatters';

interface PropertyCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  properties: Property[];
  currency: Currency;
  onRemoveProperty: (id: string) => void;
  onSelectProperty: (p: Property) => void;
  onBookViewing: (p: Property) => void;
  onClearAll: () => void;
}

export const PropertyCompareModal: React.FC<PropertyCompareModalProps> = ({
  isOpen,
  onClose,
  properties,
  currency,
  onRemoveProperty,
  onSelectProperty,
  onBookViewing,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const comparisonAttributes = [
    { label: 'Typology', key: 'type' },
    { label: 'Purpose', key: 'purpose' },
    { label: 'District', key: 'neighborhood' },
    { label: 'Bedrooms', key: 'bedrooms' },
    { label: 'Bathrooms', key: 'bathrooms' },
    { label: 'Built-up Area (sqft)', key: 'sqft' },
    { label: 'Plot Size', key: 'plotSqft' },
    { label: 'Developer', key: 'developer' },
    { label: 'Completion Year', key: 'completionYear' },
    { label: 'Projected ROI Yield', key: 'roiEstimate' },
  ];

  const commonAmenities = [
    'Private Beach',
    'Infinity Pool',
    'Concierge 24/7',
    'Smart Home',
    'Private Elevator',
    'Burj Khalifa View',
    'Marina View',
    'Valet Parking',
    'Wine Cellar',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-6xl max-h-[92vh] bg-[#0B1220] border border-[#C8A96B]/50 shadow-2xl flex flex-col overflow-hidden text-white">
        
        {/* Header */}
        <div className="p-5 bg-[#111C30] border-b border-[#C8A96B]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border border-[#C8A96B] bg-[#0B1220] flex items-center justify-center text-[#C8A96B]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">
                Dubai Residence Side-by-Side Comparison
              </h3>
              <p className="text-xs text-slate-400">
                Comparing {properties.length} curated luxury properties
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {properties.length > 0 && (
              <button
                onClick={onClearAll}
                className="text-xs text-slate-400 hover:text-red-400 font-mono transition-colors"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              aria-label="Close Comparison"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {properties.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <Scale className="w-12 h-12 text-slate-600 mx-auto" />
            <h4 className="font-serif font-bold text-xl text-white">No Properties in Comparison Tray</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Select "Compare" on any property card or detail page to analyze specifications, pricing per sqft, and luxury amenities side-by-side.
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-[#C8A96B] text-[#0B1220] font-semibold text-xs uppercase tracking-wider"
            >
              Return to Catalog
            </button>
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-4 sm:p-6">
            <div className="min-w-[700px]">
              
              {/* Properties Column Header Row */}
              <div className="grid grid-cols-12 gap-4 pb-6 border-b border-slate-800">
                <div className="col-span-3 text-xs font-mono uppercase tracking-widest text-[#DFC58E] self-end pb-2">
                  Key Criteria
                </div>

                {properties.map((p) => {
                  const pricePerSqft = Math.round(p.priceAed / (p.sqft || 1));
                  return (
                    <div
                      key={p.id}
                      className="col-span-3 bg-[#111C30] border border-slate-800 p-3 flex flex-col justify-between relative group"
                    >
                      <button
                        onClick={() => onRemoveProperty(p.id)}
                        className="absolute top-2 right-2 p-1 bg-[#0B1220]/80 text-slate-400 hover:text-red-400"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div>
                        <img
                          src={p.images[0]}
                          alt={p.title}
                          className="w-full aspect-[16/10] object-cover mb-2 border border-slate-700"
                        />
                        <span className="text-[10px] font-mono uppercase text-[#DFC58E] block">
                          {p.neighborhood}
                        </span>
                        <h5 className="font-serif font-bold text-xs text-white line-clamp-1 mb-1">
                          {p.title}
                        </h5>
                        <div className="text-sm font-serif font-bold text-[#DFC58E] tabular-nums">
                          {formatCurrency(p.priceAed, currency)}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono block">
                          {pricePerSqft.toLocaleString()} AED / sqft
                        </span>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-800 flex gap-2">
                        <button
                          onClick={() => {
                            onSelectProperty(p);
                            onClose();
                          }}
                          className="flex-1 py-1.5 bg-[#0B1220] text-slate-200 hover:text-white border border-slate-700 text-[10px] uppercase font-semibold"
                        >
                          Details
                        </button>
                        <button
                          onClick={() => {
                            onBookViewing(p);
                            onClose();
                          }}
                          className="flex-1 py-1.5 bg-[#C8A96B] hover:bg-[#DFC58E] text-[#0B1220] text-[10px] uppercase font-bold"
                        >
                          Viewing
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Specifications Rows */}
              <div className="divide-y divide-slate-800/80 text-xs">
                {comparisonAttributes.map((attr) => (
                  <div key={attr.key} className="grid grid-cols-12 gap-4 py-3 items-center">
                    <div className="col-span-3 text-slate-400 font-mono text-[11px]">
                      {attr.label}
                    </div>
                    {properties.map((p) => {
                      let val: any = (p as any)[attr.key];
                      if (attr.key === 'sqft' && val) val = `${Number(val).toLocaleString()} sqft`;
                      if (attr.key === 'plotSqft' && val) val = `${Number(val).toLocaleString()} sqft`;
                      return (
                        <div key={p.id} className="col-span-3 font-medium text-slate-200 tabular-nums">
                          {val || <span className="text-slate-600">—</span>}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              {/* Amenities Comparison Matrix */}
              <div className="pt-6 mt-6 border-t border-slate-800">
                <h5 className="text-xs font-mono uppercase tracking-widest text-[#DFC58E] mb-4">
                  Signature Amenities Matrix
                </h5>
                <div className="divide-y divide-slate-800/80 text-xs">
                  {commonAmenities.map((amenity) => (
                    <div key={amenity} className="grid grid-cols-12 gap-4 py-2.5 items-center">
                      <div className="col-span-3 text-slate-400 text-[11px]">{amenity}</div>
                      {properties.map((p) => {
                        const hasAmenity = p.amenities?.some((a) =>
                          a.toLowerCase().includes(amenity.toLowerCase())
                        );
                        return (
                          <div key={p.id} className="col-span-3">
                            {hasAmenity ? (
                              <span className="inline-flex items-center gap-1 text-[#DFC58E] text-[11px] font-mono">
                                <Check className="w-3.5 h-3.5 text-[#C8A96B]" /> Included
                              </span>
                            ) : (
                              <span className="text-slate-600 font-mono text-[11px]">
                                <Minus className="w-3.5 h-3.5 inline text-slate-600" />
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
