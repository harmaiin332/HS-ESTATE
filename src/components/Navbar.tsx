import React, { useState } from 'react';
import { Bookmark, User, Shield, Menu, X, Globe } from 'lucide-react';
import { Currency, CURRENCY_RATES } from '../utils/formatters';

interface NavbarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  savedCount: number;
  currency: Currency;
  setCurrency: (c: Currency) => void;
  onOpenAuth: () => void;
  isLoggedIn: boolean;
  onOpenDashboard: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  setActivePage,
  savedCount,
  currency,
  setCurrency,
  onOpenAuth,
  isLoggedIn,
  onOpenDashboard,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currencyDropdownOpen, setCurrencyDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'listings', label: 'Properties' },
    { id: 'neighborhoods', label: 'Neighborhoods' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Private Desk' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B1220]/95 backdrop-blur-md border-b border-[#C8A96B]/20 transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element Brand Wordmark */}
        <button
          onClick={() => { setActivePage('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="flex items-center gap-3 text-left group focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C8A96B]"
          aria-label="HS ESTATE Home"
        >
          <div className="w-10 h-10 border border-[#C8A96B] flex items-center justify-center bg-[#111C30] transition-colors group-hover:border-white">
            <span className="font-serif text-[#C8A96B] text-xl font-bold tracking-widest group-hover:text-white transition-colors">HS</span>
          </div>
          <span className="text-xl font-serif tracking-[0.2em] font-semibold text-white uppercase whitespace-nowrap shrink-0">
            HS ESTATE
          </span>
        </button>

        {/* Zone 2: 4-5 single-line clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-[0.15em] font-medium text-slate-300">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => {
                setActivePage(link.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activePage === link.id
                  ? 'text-[#C8A96B] border-[#C8A96B]'
                  : 'border-transparent hover:text-white hover:border-slate-500'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: 1 primary action + luxury utility cluster */}
        <div className="hidden lg:flex items-center gap-4 shrink-0">
          {/* Currency Selector */}
          <div className="relative">
            <button
              onClick={() => setCurrencyDropdownOpen(!currencyDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-mono text-slate-300 hover:text-white border border-slate-700 hover:border-[#C8A96B] transition-colors bg-[#111C30]/60"
              title="Change Currency"
            >
              <Globe className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span className="font-semibold">{currency}</span>
            </button>
            {currencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-[#111C30] border border-[#C8A96B]/30 shadow-2xl py-1 z-50">
                {(Object.keys(CURRENCY_RATES) as Currency[]).map((cur) => (
                  <button
                    key={cur}
                    onClick={() => {
                      setCurrency(cur);
                      setCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex justify-between items-center transition-colors ${
                      currency === cur ? 'bg-[#C8A96B]/20 text-[#C8A96B]' : 'text-slate-300 hover:bg-[#0B1220] hover:text-white'
                    }`}
                  >
                    <span>{cur}</span>
                    <span className="text-[10px] text-slate-400">{CURRENCY_RATES[cur].symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Saved properties button */}
          <button
            onClick={() => {
              setActivePage('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-[#C8A96B] transition-colors px-2 py-1 relative"
            title="Saved Properties"
          >
            <Bookmark className="w-4 h-4" />
            {savedCount > 0 && (
              <span className="font-mono text-[11px] bg-[#C8A96B] text-[#0B1220] font-bold px-1.5 py-0.2 rounded-sm">
                {savedCount}
              </span>
            )}
          </button>

          {/* Admin shortcut */}
          <button
            onClick={onOpenAdmin}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors flex items-center gap-1 px-2 py-1"
            title="Admin Portal"
          >
            <Shield className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden xl:inline">Admin</span>
          </button>

          {/* Primary Action Button */}
          {isLoggedIn ? (
            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-2 px-4 py-2.5 text-xs uppercase tracking-wider font-semibold text-[#0B1220] bg-[#C8A96B] hover:bg-[#DFC58E] transition-colors whitespace-nowrap shrink-0 shadow-md"
            >
              <User className="w-3.5 h-3.5" />
              <span>VIP Portal</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 text-xs uppercase tracking-widest font-semibold text-[#0B1220] bg-[#C8A96B] hover:bg-[#DFC58E] transition-colors whitespace-nowrap shrink-0 shadow-md"
            >
              Client Login
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => {
              setActivePage('dashboard');
            }}
            className="p-2 text-slate-300"
            aria-label="Saved"
          >
            <Bookmark className="w-5 h-5 text-[#C8A96B]" />
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-200 hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0B1220] border-b border-[#C8A96B]/30 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3 pb-4 border-b border-slate-800">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActivePage(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`text-left text-sm uppercase tracking-wider font-medium py-1.5 ${
                  activePage === link.id ? 'text-[#C8A96B]' : 'text-slate-300'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Currency:</span>
              {(['AED', 'USD', 'EUR', 'GBP'] as Currency[]).map((cur) => (
                <button
                  key={cur}
                  onClick={() => setCurrency(cur)}
                  className={`text-xs px-2 py-1 font-mono ${
                    currency === cur ? 'bg-[#C8A96B] text-[#0B1220] font-bold' : 'text-slate-300 bg-slate-800'
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (isLoggedIn) onOpenDashboard();
                else onOpenAuth();
              }}
              className="w-full py-3 text-center text-xs uppercase tracking-widest font-semibold bg-[#C8A96B] text-[#0B1220]"
            >
              {isLoggedIn ? 'Access VIP Portal' : 'Client Access / Login'}
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="w-full py-2 text-center text-xs text-slate-400 hover:text-slate-200"
            >
              Admin Management Portal
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
