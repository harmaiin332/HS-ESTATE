import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  SlidersHorizontal,
  Grid,
  Map,
  RotateCcw,
  Check,
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BookmarkPlus,
  Database,
  Loader2,
  Sparkles,
  ArrowRight,
  X,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Property, PropertyPurpose, PropertyType } from '../types';
import { Currency, formatCurrency } from '../utils/formatters';
import { PropertyCard } from '../components/PropertyCard';
import { fetchDatabaseProperties, saveUserSearch, isSupabaseConfigured } from '../lib/supabase';
import { searchPropertiesWithAI, AiSearchResult } from '../lib/geminiClient';
import { ExtractedSearchFilters } from '../../server/aiService';

interface ListingsPageProps {
  properties: Property[];
  currency: Currency;
  savedPropertyIds: string[];
  onToggleSave: (id: string, e: React.MouseEvent) => void;
  onSelectProperty: (p: Property) => void;
  initialFilter?: any;
  onQuickInquire: (p: Property, e: React.MouseEvent) => void;
  comparePropertyIds: string[];
  onToggleCompare: (property: Property, e: React.MouseEvent) => void;
  userId?: string;
}

export const ListingsPage: React.FC<ListingsPageProps> = ({
  properties: initialProperties,
  currency,
  savedPropertyIds,
  onToggleSave,
  onSelectProperty,
  initialFilter,
  onQuickInquire,
  comparePropertyIds,
  onToggleCompare,
  userId,
}) => {
  // Filter States
  const [searchKeyword, setSearchKeyword] = useState(initialFilter?.searchQuery || '');
  const [purpose, setPurpose] = useState<PropertyPurpose | 'all'>(initialFilter?.purpose || 'all');
  const [selectedType, setSelectedType] = useState<string>(initialFilter?.type || 'all');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>(initialFilter?.neighborhood || 'all');
  const [selectedBedrooms, setSelectedBedrooms] = useState<string>(initialFilter?.bedrooms || 'all');
  const [maxPrice, setMaxPrice] = useState<number>(initialFilter?.maxPrice || 150000000);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'sqft-desc'>('featured');
  const [viewMode, setViewMode] = useState<'grid' | 'split'>('grid');
  const [selectedPinProperty, setSelectedPinProperty] = useState<Property | null>(null);

  // AI Natural Language Search State
  const [aiSearchInput, setAiSearchInput] = useState(initialFilter?.aiQuery || '');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [isAiSearchActive, setIsAiSearchActive] = useState(Boolean(initialFilter?.aiQuery));
  const [aiExtractedFilters, setAiExtractedFilters] = useState<ExtractedSearchFilters | null>(null);
  const [aiSearchError, setAiSearchError] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const [totalCount, setTotalCount] = useState(initialProperties.length);
  const [displayProperties, setDisplayProperties] = useState<Property[]>(initialProperties.slice(0, pageSize));
  const [isLoading, setIsLoading] = useState(false);
  const [isLiveDb, setIsLiveDb] = useState(isSupabaseConfigured);
  const [searchSavedMessage, setSearchSavedMessage] = useState('');

  // Sample prompt chips matching required use cases
  const sampleAiQueries = [
    "Find a 2-bedroom apartment in Dubai Marina under AED 1.5 million.",
    "Show villas with swimming pools in Dubai Hills Estate.",
    "Find rental properties under AED 100,000 per year.",
    "Show penthouses with three bedrooms and a sea view.",
  ];

  // Load from database / client service
  const loadProperties = useCallback(async () => {
    // If an AI search is active, do not overwrite with standard filter fetch
    if (isAiSearchActive) return;

    setIsLoading(true);
    try {
      const res = await fetchDatabaseProperties({
        search: searchKeyword,
        purpose,
        type: selectedType,
        neighborhood: selectedNeighborhood,
        bedrooms: selectedBedrooms,
        maxPrice,
        sortBy,
        page: currentPage,
        pageSize,
      });

      setDisplayProperties(res.data);
      setTotalCount(res.count);
      setIsLiveDb(res.isLiveSupabase);
      if (res.data.length > 0) {
        setSelectedPinProperty(res.data[0]);
      }
    } catch (err) {
      console.error('Failed to load listings from database:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAiSearchActive, searchKeyword, purpose, selectedType, selectedNeighborhood, selectedBedrooms, maxPrice, sortBy, currentPage]);

  useEffect(() => {
    if (!isAiSearchActive) {
      loadProperties();
    }
  }, [loadProperties, isAiSearchActive]);

  // Execute Natural Language Search via Gemini AI
  const executeAiSearch = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    setIsAiSearching(true);
    setAiSearchError(null);

    try {
      const result: AiSearchResult = await searchPropertiesWithAI(q);

      setAiExtractedFilters(result.extractedFilters);
      setIsAiSearchActive(true);
      setTotalCount(result.properties.length);
      setDisplayProperties(result.properties);
      setCurrentPage(1);

      if (result.properties.length > 0) {
        setSelectedPinProperty(result.properties[0]);
      }
    } catch (err: any) {
      console.error('AI Search execution error:', err);
      setAiSearchError(err.message || 'Unable to process natural language search.');
    } finally {
      setIsAiSearching(false);
    }
  };

  // If initialFilter had aiQuery, auto-trigger on mount
  useEffect(() => {
    if (initialFilter?.aiQuery) {
      executeAiSearch(initialFilter.aiQuery);
    }
  }, [initialFilter]);

  // Reset to page 1 when filter parameters change
  const handleFilterChange = (setter: any, value: any) => {
    if (isAiSearchActive) {
      setIsAiSearchActive(false);
      setAiExtractedFilters(null);
    }
    setter(value);
    setCurrentPage(1);
  };

  const handleClearAiSearch = () => {
    setIsAiSearchActive(false);
    setAiExtractedFilters(null);
    setAiSearchInput('');
    setAiSearchError(null);
    setCurrentPage(1);
    loadProperties();
  };

  const handleResetFilters = () => {
    setSearchKeyword('');
    setPurpose('all');
    setSelectedType('all');
    setSelectedNeighborhood('all');
    setSelectedBedrooms('all');
    setMaxPrice(150000000);
    setSortBy('featured');
    setIsAiSearchActive(false);
    setAiExtractedFilters(null);
    setAiSearchInput('');
    setAiSearchError(null);
    setCurrentPage(1);
  };

  const handleSaveCurrentSearch = async () => {
    const searchName = isAiSearchActive && aiExtractedFilters
      ? `AI Search: "${aiSearchInput.slice(0, 40)}..."`
      : `${purpose.toUpperCase()} · ${selectedNeighborhood === 'all' ? 'All Areas' : selectedNeighborhood} · ${selectedType === 'all' ? 'All Types' : selectedType}`;

    const filters = isAiSearchActive
      ? { aiQuery: aiSearchInput, aiFilters: aiExtractedFilters }
      : {
          searchKeyword,
          purpose,
          selectedType,
          selectedNeighborhood,
          selectedBedrooms,
          maxPrice,
          sortBy,
        };

    await saveUserSearch(userId || 'guest-user', searchName, filters);
    setSearchSavedMessage(`Search saved to your portfolio!`);
    setTimeout(() => setSearchSavedMessage(''), 3000);
  };

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return (
    <div className="min-h-screen bg-[#F6F7F9] py-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Title & Database Status */}
        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#A38446]">
              Dubai Prime Real Estate Catalog
            </div>

            {/* Database indicator */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono border bg-white shadow-xs">
              <Database className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span className="text-slate-600">
                Database: <strong className="text-[#0B1220]">{isLiveDb ? 'Supabase PostgreSQL' : 'Local Verified Store'}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#0B1220]">
                Available Properties
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Showing {totalCount} verified luxury residences across Dubai, UAE
              </p>
            </div>

            {/* Actions: Save Search + View Mode Toggle */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleSaveCurrentSearch}
                className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[#0B1220] bg-white border border-slate-300 hover:border-[#C8A96B] transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <BookmarkPlus className="w-3.5 h-3.5 text-[#C8A96B]" />
                <span>Save Current Search</span>
              </button>

              <div className="flex items-center bg-white border border-slate-200 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 text-xs flex items-center gap-1.5 transition-colors ${
                    viewMode === 'grid' ? 'bg-[#0B1220] text-white font-medium' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  aria-label="Grid View"
                >
                  <Grid className="w-4 h-4" />
                  <span className="hidden sm:inline">Grid</span>
                </button>
                <button
                  onClick={() => setViewMode('split')}
                  className={`p-1.5 text-xs flex items-center gap-1.5 transition-colors ${
                    viewMode === 'split' ? 'bg-[#0B1220] text-white font-medium' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  aria-label="Split Map View"
                >
                  <Map className="w-4 h-4" />
                  <span className="hidden sm:inline">Map View</span>
                </button>
              </div>
            </div>
          </div>

          {searchSavedMessage && (
            <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>{searchSavedMessage}</span>
            </div>
          )}
        </div>

        {/* ==================================================================== */}
        {/* FEATURE 1: AI NATURAL LANGUAGE PROPERTY SEARCH INTERFACE */}
        {/* ==================================================================== */}
        <div className="bg-[#0B1220] border border-[#C8A96B]/50 p-6 mb-8 text-white shadow-xl relative overflow-hidden">
          {/* Subtle gold glow banner */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#C8A96B] flex items-center justify-center text-[#0B1220] font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-white tracking-wide">
                  Gemini AI Property Search
                </h3>
                <p className="text-[11px] text-slate-300 font-sans">
                  Describe what you want in natural language. Gemini extracts structured filters to query actual database listings.
                </p>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#111C30] border border-[#C8A96B]/30 text-[10px] font-mono text-[#DFC58E] self-start md:self-auto">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C8A96B]" />
              <span>Verified Supabase Records · No Invented Properties</span>
            </div>
          </div>

          {/* AI Search Bar Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              executeAiSearch(aiSearchInput);
            }}
            className="flex flex-col sm:flex-row gap-2"
          >
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#C8A96B] absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={aiSearchInput}
                onChange={(e) => setAiSearchInput(e.target.value)}
                placeholder="e.g. Find a 2-bedroom apartment in Dubai Marina under AED 1.5 million..."
                className="w-full bg-[#111C30] border border-slate-700 text-white text-xs pl-10 pr-4 py-3 focus:outline-none focus:border-[#C8A96B] placeholder:text-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={isAiSearching || !aiSearchInput.trim()}
              className="px-6 py-3 bg-[#C8A96B] hover:bg-[#DFC58E] disabled:opacity-40 text-[#0B1220] text-xs uppercase tracking-widest font-bold transition-all flex items-center justify-center gap-2 shrink-0 shadow-md"
            >
              {isAiSearching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#0B1220]" />
                  <span>Extracting Criteria...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#0B1220]" />
                  <span>Search with AI</span>
                </>
              )}
            </button>
          </form>

          {/* Sample Prompts Row */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#DFC58E] block mb-2">
              Try Sample AI Searches:
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleAiQueries.map((queryText, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setAiSearchInput(queryText);
                    executeAiSearch(queryText);
                  }}
                  className="text-[11px] px-3 py-1.5 bg-[#111C30] hover:bg-slate-800 border border-slate-700 hover:border-[#C8A96B]/60 text-slate-300 hover:text-white transition-all text-left"
                >
                  "{queryText}"
                </button>
              ))}
            </div>
          </div>

          {/* AI Extracted Criteria Display Banner */}
          {isAiSearchActive && aiExtractedFilters && (
            <div className="mt-4 p-4 bg-[#111C30] border border-[#C8A96B]/40 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-700/60">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[#DFC58E] font-bold">
                    AI Extracted Criteria:
                  </span>
                </div>
                <button
                  onClick={handleClearAiSearch}
                  className="text-[11px] text-slate-400 hover:text-red-400 font-mono uppercase flex items-center gap-1 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear AI Filter & View All</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                <span className="px-2.5 py-1 bg-[#0B1220] border border-slate-700 text-slate-200">
                  Purpose: <strong className="text-[#DFC58E] uppercase">{aiExtractedFilters.purpose}</strong>
                </span>

                {aiExtractedFilters.propertyType !== 'all' && (
                  <span className="px-2.5 py-1 bg-[#0B1220] border border-slate-700 text-slate-200">
                    Typology: <strong className="text-white">{aiExtractedFilters.propertyType}</strong>
                  </span>
                )}

                {aiExtractedFilters.neighborhood && (
                  <span className="px-2.5 py-1 bg-[#0B1220] border border-slate-700 text-slate-200">
                    Enclave: <strong className="text-white">{aiExtractedFilters.neighborhood}</strong>
                  </span>
                )}

                {aiExtractedFilters.bedrooms !== null && (
                  <span className="px-2.5 py-1 bg-[#0B1220] border border-slate-700 text-slate-200">
                    Bedrooms: <strong className="text-white">{aiExtractedFilters.bedrooms}</strong>
                  </span>
                )}

                {aiExtractedFilters.maxPriceAed !== null && (
                  <span className="px-2.5 py-1 bg-[#0B1220] border border-slate-700 text-slate-200">
                    Max Price: <strong className="text-[#DFC58E]">{aiExtractedFilters.maxPriceAed.toLocaleString()} AED</strong>
                  </span>
                )}

                {aiExtractedFilters.amenities && aiExtractedFilters.amenities.length > 0 && (
                  <span className="px-2.5 py-1 bg-[#0B1220] border border-slate-700 text-slate-200">
                    Amenities: <strong className="text-white">{aiExtractedFilters.amenities.join(', ')}</strong>
                  </span>
                )}
              </div>

              <div className="mt-2 text-[10px] text-slate-400 italic">
                {aiExtractedFilters.searchSummary}
              </div>
            </div>
          )}

          {aiSearchError && (
            <div className="mt-3 p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <span>{aiSearchError}</span>
              </div>
              <button
                type="button"
                onClick={() => setAiSearchError(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Standard Filter Toolbar */}
        <div className="bg-white border border-slate-200 p-6 mb-8 shadow-sm space-y-4">
          
          {/* Row 1: Search bar + Purpose Tabs */}
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => handleFilterChange(setSearchKeyword, e.target.value)}
                placeholder="Search by keywords, villa name, beachfront, Frond, Burj Khalifa..."
                className="w-full bg-[#F6F7F9] border border-slate-200 text-xs text-[#0B1220] pl-9 pr-4 py-3 focus:outline-none focus:border-[#C8A96B]"
              />
            </div>

            {/* Purpose Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 border border-slate-200 shrink-0">
              {(['all', 'buy', 'rent', 'invest'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => handleFilterChange(setPurpose, p)}
                  className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                    purpose === p ? 'bg-[#0B1220] text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p === 'all' ? 'All' : p}
                </button>
              ))}
            </div>
          </div>

          {/* Row 2: Dropdowns for Location, Type, Beds, Price, Sort */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-3 border-t border-slate-100 text-xs">
            
            {/* Location */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                District
              </label>
              <select
                value={selectedNeighborhood}
                onChange={(e) => handleFilterChange(setSelectedNeighborhood, e.target.value)}
                className="w-full bg-[#F6F7F9] border border-slate-200 text-[#0B1220] px-2.5 py-2 focus:border-[#C8A96B] focus:outline-none"
              >
                <option value="all">All Enclaves</option>
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
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Typology
              </label>
              <select
                value={selectedType}
                onChange={(e) => handleFilterChange(setSelectedType, e.target.value)}
                className="w-full bg-[#F6F7F9] border border-slate-200 text-[#0B1220] px-2.5 py-2 focus:border-[#C8A96B] focus:outline-none"
              >
                <option value="all">All Typologies</option>
                <option value="Villa">Villa</option>
                <option value="Penthouse">Penthouse</option>
                <option value="Apartment">Apartment</option>
                <option value="Mansion">Mansion</option>
                <option value="Townhouse">Townhouse</option>
              </select>
            </div>

            {/* Bedrooms */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Bedrooms
              </label>
              <select
                value={selectedBedrooms}
                onChange={(e) => handleFilterChange(setSelectedBedrooms, e.target.value)}
                className="w-full bg-[#F6F7F9] border border-slate-200 text-[#0B1220] px-2.5 py-2 focus:border-[#C8A96B] focus:outline-none"
              >
                <option value="all">Any Beds</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4 Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>
            </div>

            {/* Price Max */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Max Price (AED)
              </label>
              <select
                value={maxPrice}
                onChange={(e) => handleFilterChange(setMaxPrice, Number(e.target.value))}
                className="w-full bg-[#F6F7F9] border border-slate-200 text-[#0B1220] px-2.5 py-2 focus:border-[#C8A96B] focus:outline-none"
              >
                <option value={150000000}>No Limit</option>
                <option value={100000}>Up to 100K AED (Lease)</option>
                <option value={1500000}>Up to 1.5M AED</option>
                <option value={20000000}>Up to 20M AED</option>
                <option value={50000000}>Up to 50M AED</option>
                <option value={80000000}>Up to 80M AED</option>
                <option value={120000000}>Up to 120M AED</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Sort Order
              </label>
              <select
                value={sortBy}
                onChange={(e) => handleFilterChange(setSortBy, e.target.value as any)}
                className="w-full bg-[#F6F7F9] border border-slate-200 text-[#0B1220] px-2.5 py-2 focus:border-[#C8A96B] focus:outline-none"
              >
                <option value="featured">Curated Marquee</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="sqft-desc">Area: Largest First</option>
              </select>
            </div>

          </div>

          {/* Active Filter chips & Reset */}
          <div className="flex items-center justify-between pt-2 text-xs">
            <div className="flex items-center gap-2 text-slate-500">
              <span className="font-mono text-[11px] text-slate-400">Filtering:</span>
              <span className="font-medium text-[#0B1220]">
                {purpose.toUpperCase()} · {selectedNeighborhood === 'all' ? 'All Districts' : selectedNeighborhood} · {selectedType === 'all' ? 'All Typologies' : selectedType}
              </span>
            </div>

            <button
              onClick={handleResetFilters}
              className="text-xs text-[#A38446] hover:text-[#0B1220] flex items-center gap-1 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All</span>
            </button>
          </div>

        </div>

        {/* Loading State Skeleton */}
        {isLoading || isAiSearching ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((sk) => (
              <div key={sk} className="bg-white border border-slate-200 h-96 animate-pulse p-4 space-y-4">
                <div className="bg-slate-200 aspect-[4/3] w-full" />
                <div className="h-4 bg-slate-200 w-2/3" />
                <div className="h-6 bg-slate-200 w-1/2" />
                <div className="h-3 bg-slate-200 w-full" />
              </div>
            ))}
          </div>
        ) : displayProperties.length === 0 ? (
          <div className="bg-white border border-slate-200 p-16 text-center max-w-lg mx-auto shadow-sm my-12">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4 text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-serif font-bold text-[#0B1220]">No Properties Found</h3>
            <p className="text-xs text-slate-500 mt-2 mb-6 leading-relaxed">
              We currently don't have public listings matching your exact search parameters in the database. Our Private Client Desk often holds confidential off-market inventory.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-[#0B1220] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#111C30] transition-colors"
            >
              Clear Filters & View Catalog
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  currency={currency}
                  isSaved={savedPropertyIds.includes(property.id)}
                  onToggleSave={onToggleSave}
                  onSelect={onSelectProperty}
                  onQuickInquire={onQuickInquire}
                  isComparing={comparePropertyIds.includes(property.id)}
                  onToggleCompare={onToggleCompare}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            {!isAiSearchActive && totalPages > 1 && (
              <div className="pt-8 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-mono">
                  Page {currentPage} of {totalPages} ({totalCount} total listings)
                </span>

                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="p-2 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-9 h-9 text-xs font-mono font-medium transition-colors ${
                        currentPage === i + 1
                          ? 'bg-[#0B1220] text-white border border-[#0B1220]'
                          : 'bg-white border border-slate-300 text-slate-700 hover:border-[#C8A96B]'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    className="p-2 border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Split Map View */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Properties Scrollable Grid */}
            <div className="lg:col-span-7 space-y-6 max-h-[850px] overflow-y-auto pr-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {displayProperties.map((property) => (
                  <div
                    key={property.id}
                    onMouseEnter={() => setSelectedPinProperty(property)}
                    className={`transition-all duration-200 ${
                      selectedPinProperty?.id === property.id
                        ? 'ring-2 ring-[#C8A96B] shadow-lg'
                        : ''
                    }`}
                  >
                    <PropertyCard
                      property={property}
                      currency={currency}
                      isSaved={savedPropertyIds.includes(property.id)}
                      onToggleSave={onToggleSave}
                      onSelect={onSelectProperty}
                      onQuickInquire={onQuickInquire}
                      isComparing={comparePropertyIds.includes(property.id)}
                      onToggleCompare={onToggleCompare}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Interactive Map Placeholder */}
            <div className="lg:col-span-5 sticky top-24 bg-white border border-slate-200 p-4 shadow-sm">
              <div className="relative aspect-[4/5] bg-[#0B1220] overflow-hidden flex flex-col justify-between p-6">
                
                {/* Background Map Visual Stylization */}
                <div className="absolute inset-0 opacity-25 pointer-events-none bg-[radial-gradient(#C8A96B_1px,transparent_1px)] [background-size:16px_16px]" />
                
                {/* Map Header */}
                <div className="relative z-10 flex items-center justify-between text-white">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#DFC58E] block">
                      Dubai Geographic Distribution
                    </span>
                    <h4 className="font-serif font-bold text-lg">Interactive Map</h4>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 bg-[#111C30] border border-slate-700 text-slate-300">
                    {displayProperties.length} Pins
                  </span>
                </div>

                {/* Simulated Pins in Dubai Coordinates */}
                <div className="relative z-10 my-auto h-64 w-full flex items-center justify-center">
                  <div className="relative w-full h-full">
                    {displayProperties.map((p, idx) => {
                      const isSelected = selectedPinProperty?.id === p.id;
                      const leftPos = 20 + ((idx * 27) % 65);
                      const topPos = 25 + ((idx * 33) % 55);

                      return (
                        <button
                          key={p.id}
                          style={{ left: `${leftPos}%`, top: `${topPos}%` }}
                          onClick={() => setSelectedPinProperty(p)}
                          className={`absolute -translate-x-1/2 -translate-y-1/2 group transition-transform ${
                            isSelected ? 'scale-125 z-20' : 'z-10 hover:scale-110'
                          }`}
                          aria-label={`Select ${p.title}`}
                        >
                          <div
                            className={`px-2 py-1 text-[10px] font-mono font-bold tracking-tight shadow-md flex items-center gap-1 border transition-colors ${
                              isSelected
                                ? 'bg-[#C8A96B] text-[#0B1220] border-white'
                                : 'bg-[#0B1220] text-white border-[#C8A96B]'
                            }`}
                          >
                            <MapPin className="w-3 h-3 text-[#C8A96B]" />
                            <span>{formatCurrency(p.priceAed, currency)}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Selected Pin Details Preview Card */}
                {selectedPinProperty && (
                  <div className="relative z-10 bg-[#111C30] border border-[#C8A96B]/50 p-3 text-white flex items-center gap-3">
                    <img
                      src={selectedPinProperty.images[0]}
                      alt={selectedPinProperty.title}
                      className="w-14 h-14 object-cover shrink-0 border border-slate-700"
                    />
                    <div className="overflow-hidden flex-1">
                      <h5 className="font-serif font-bold text-xs truncate text-white">
                        {selectedPinProperty.title}
                      </h5>
                      <p className="text-[10px] text-slate-400 truncate">{selectedPinProperty.location}</p>
                      <div className="text-xs font-serif font-bold text-[#DFC58E] tabular-nums mt-0.5">
                        {formatCurrency(selectedPinProperty.priceAed, currency)}
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectProperty(selectedPinProperty)}
                      className="px-3 py-1.5 bg-[#C8A96B] text-[#0B1220] text-[10px] uppercase font-bold tracking-wider hover:bg-[#DFC58E] transition-colors shrink-0"
                    >
                      View
                    </button>
                  </div>
                )}

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
