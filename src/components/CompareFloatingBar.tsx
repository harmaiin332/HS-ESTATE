import React from 'react';
import { Scale, X, ArrowRight } from 'lucide-react';
import { Property } from '../types';

interface CompareFloatingBarProps {
  compareList: Property[];
  onOpenCompare: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

export const CompareFloatingBar: React.FC<CompareFloatingBarProps> = ({
  compareList,
  onOpenCompare,
  onRemove,
  onClear,
}) => {
  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-[#0B1220]/95 backdrop-blur-md border border-[#C8A96B] p-2.5 sm:px-4 sm:py-3 shadow-2xl flex items-center gap-3 sm:gap-6 text-white max-w-[94vw] sm:max-w-2xl">
      <div className="flex items-center gap-2">
        <Scale className="w-4 h-4 text-[#C8A96B] shrink-0" />
        <span className="text-xs font-mono font-bold text-white whitespace-nowrap">
          Compare ({compareList.length}/4)
        </span>
      </div>

      {/* Thumbnails */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {compareList.map((p) => (
          <div key={p.id} className="relative group shrink-0">
            <img
              src={p.images[0]}
              alt={p.title}
              className="w-10 h-10 object-cover border border-slate-700"
            />
            <button
              onClick={() => onRemove(p.id)}
              className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] opacity-90 hover:opacity-100"
              title="Remove from comparison"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-auto">
        <button
          onClick={onOpenCompare}
          className="px-3 sm:px-4 py-1.5 bg-[#C8A96B] hover:bg-[#DFC58E] text-[#0B1220] text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 whitespace-nowrap"
        >
          <span>Compare Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={onClear}
          className="p-1.5 text-slate-400 hover:text-white"
          title="Clear comparison"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
