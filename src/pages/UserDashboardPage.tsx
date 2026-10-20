import React, { useState, useEffect } from 'react';
import {
  Bookmark,
  Search,
  Clock,
  User,
  Settings,
  Trash2,
  ArrowUpRight,
  Shield,
  Check,
  Calendar,
  Database,
  BookmarkCheck,
  Sparkles,
  RefreshCw,
  Loader2,
  PhoneCall
} from 'lucide-react';
import { Property, Inquiry, UserProfile } from '../types';
import { Currency, formatCurrency } from '../utils/formatters';
import {
  fetchUserSavedSearches,
  deleteUserSavedSearch,
  SavedSearch,
  fetchUserInquiries,
  isSupabaseConfigured
} from '../lib/supabase';
import { fetchAiRecommendations, AiRecommendationItem } from '../lib/geminiClient';

interface UserDashboardPageProps {
  user: UserProfile;
  savedProperties: Property[];
  inquiries: Inquiry[];
  currency: Currency;
  onRemoveSaved: (id: string) => void;
  onSelectProperty: (p: Property) => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onLogout: () => void;
  onNavigateToListings: (filter?: any) => void;
  onOpenViewingModal: (p: Property | null) => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  user,
  savedProperties,
  inquiries: initialInquiries,
  currency,
  onRemoveSaved,
  onSelectProperty,
  onUpdateProfile,
  onLogout,
  onNavigateToListings,
  onOpenViewingModal,
}) => {
  const [activeTab, setActiveTab] = useState<'saved' | 'recommendations' | 'searches' | 'inquiries' | 'preferences'>('recommendations');
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [targetBudget, setTargetBudget] = useState(user.targetBudgetAed);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Database-backed saved searches & inquiries
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [userInquiries, setUserInquiries] = useState<Inquiry[]>(initialInquiries);

  // AI Recommendations State
  const [recommendations, setRecommendations] = useState<AiRecommendationItem[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);
  const [isAiGeneratedRecs, setIsAiGeneratedRecs] = useState(true);

  // Load Saved Searches & Inquiries
  useEffect(() => {
    async function loadUserData() {
      if (user?.id) {
        const searches = await fetchUserSavedSearches(user.id);
        setSavedSearches(searches);

        const inqs = await fetchUserInquiries(user.id, user.email);
        if (inqs && inqs.length > 0) {
          setUserInquiries(inqs);
        }
      }
    }
    loadUserData();
  }, [user]);

  // Load AI Recommendations
  const loadRecommendations = async () => {
    setIsLoadingRecs(true);
    try {
      const res = await fetchAiRecommendations(user);
      if (res && res.recommendations) {
        setRecommendations(res.recommendations);
        setIsAiGeneratedRecs(res.isAiGenerated);
      }
    } catch (err) {
      console.warn('Failed to fetch recommendations:', err);
    } finally {
      setIsLoadingRecs(false);
    }
  };

  useEffect(() => {
    loadRecommendations();
  }, [user.targetBudgetAed, user.preferredAreas, user.investorType]);

  const handleDeleteSearch = async (id: string) => {
    await deleteUserSavedSearch(user.id, id);
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name,
      phone,
      targetBudgetAed: Number(targetBudget),
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F6F7F9] py-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Welcome Header */}
        <div className="bg-[#0B1220] border border-[#C8A96B]/30 p-8 text-white mb-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#111C30] border border-[#C8A96B] flex items-center justify-center text-[#C8A96B] font-serif font-bold text-xl">
              {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-serif font-bold text-white">{user.name}</h1>
                <span className="text-[10px] font-mono tracking-widest uppercase bg-[#C8A96B] text-[#0B1220] font-bold px-2 py-0.5">
                  {user.investorType}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-mono mt-1">
                {user.email} · Private Client Account · Target Allocation: {formatCurrency(user.targetBudgetAed, currency)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenViewingModal(null)}
              className="px-4 py-2.5 bg-[#C8A96B] hover:bg-[#DFC58E] text-[#0B1220] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Request Consultation</span>
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2.5 bg-[#111C30] hover:bg-slate-800 text-slate-300 hover:text-white text-xs uppercase tracking-wider font-semibold border border-slate-700 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Dashboard Nav Tabs */}
        <div className="flex border-b border-slate-200 mb-8 bg-white px-6 pt-3 shadow-sm text-xs font-semibold uppercase tracking-wider overflow-x-auto">
          {/* FEATURE 3: AI Recommendations Tab */}
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'recommendations' ? 'border-[#C8A96B] text-[#0B1220]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#C8A96B]" />
            <span>AI Recommendations ({recommendations.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('saved')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'saved' ? 'border-[#C8A96B] text-[#0B1220]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bookmark className="w-4 h-4 text-[#C8A96B]" />
            <span>Saved Portfolio ({savedProperties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('searches')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'searches' ? 'border-[#C8A96B] text-[#0B1220]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookmarkCheck className="w-4 h-4 text-[#C8A96B]" />
            <span>Saved Searches ({savedSearches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'inquiries' ? 'border-[#C8A96B] text-[#0B1220]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#C8A96B]" />
            <span>Inquiries & Viewings ({userInquiries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('preferences')}
            className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'preferences' ? 'border-[#C8A96B] text-[#0B1220]' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4 text-[#C8A96B]" />
            <span>Investor Preferences</span>
          </button>
        </div>

        {/* ==================================================================== */}
        {/* TAB: FEATURE 3 - PERSONALIZED AI RECOMMENDATIONS */}
        {/* ==================================================================== */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            
            {/* Context & Controls Banner */}
            <div className="bg-white border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A38446] font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#C8A96B]" />
                  <span>Portfolio Optimization Model</span>
                </div>
                <h2 className="text-xl font-serif font-bold text-[#0B1220]">
                  Grounded AI Acquisition Recommendations
                </h2>
                <p className="text-xs text-slate-500 mt-1 max-w-2xl">
                  Grounded in your capital allocation mandate of <strong>{formatCurrency(user.targetBudgetAed, currency)}</strong>, preferred locations ({user.preferredAreas.join(', ') || 'All prime zones'}), and verified Dubai yields.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-600">
                  {isAiGeneratedRecs ? 'Gemini 3.8 Flash Grounded' : 'Deterministic Algorithm Active'}
                </span>

                <button
                  onClick={loadRecommendations}
                  disabled={isLoadingRecs}
                  className="px-3.5 py-2 bg-[#0B1220] hover:bg-[#111C30] text-white text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingRecs ? 'animate-spin' : ''}`} />
                  <span>Re-Analyze</span>
                </button>
              </div>
            </div>

            {/* Recommendations Grid */}
            {isLoadingRecs ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((sk) => (
                  <div key={sk} className="bg-white border border-slate-200 h-96 animate-pulse p-4 space-y-4">
                    <div className="bg-slate-200 aspect-[16/10] w-full" />
                    <div className="h-4 bg-slate-200 w-2/3" />
                    <div className="h-6 bg-slate-200 w-1/2" />
                    <div className="h-16 bg-slate-100 w-full" />
                  </div>
                ))}
              </div>
            ) : recommendations.length === 0 ? (
              <div className="bg-white border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
                <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-serif font-bold text-lg text-[#0B1220]">No Active Allocations</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Update your capital preferences or click Re-Analyze to generate personalized property opportunities.
                </p>
                <button
                  onClick={loadRecommendations}
                  className="px-6 py-2.5 bg-[#0B1220] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#111C30]"
                >
                  Generate Allocations
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((rec) => {
                  const p = rec.property;
                  return (
                    <div
                      key={p.id}
                      className="bg-white border border-slate-200 hover:border-[#C8A96B] transition-all p-5 shadow-sm flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image + Match Score Tag */}
                        <div className="relative aspect-[16/10] overflow-hidden mb-3 bg-slate-900">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-2 left-2 bg-[#0B1220]/90 text-[#DFC58E] px-2.5 py-1 text-[11px] font-mono border border-[#C8A96B]/50 font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#C8A96B]" />
                            <span>{rec.relevanceScore}% Strategic Match</span>
                          </div>
                        </div>

                        {/* Title and Specs */}
                        <div className="text-[10px] font-mono text-[#A38446] uppercase mb-1">
                          {p.neighborhood} · {p.type} · {p.bedrooms} Beds
                        </div>
                        <h4 className="font-serif font-bold text-base text-[#0B1220] mb-1 line-clamp-1">
                          {p.title}
                        </h4>
                        <div className="text-xl font-serif font-bold text-[#0B1220] tabular-nums mb-3">
                          {formatCurrency(p.priceAed, currency)}
                        </div>

                        {/* AI Grounded Justification Callout */}
                        <div className="p-3 bg-amber-50/80 border-l-2 border-[#C8A96B] text-xs text-slate-700 leading-relaxed mb-4">
                          <span className="font-mono text-[10px] uppercase font-bold text-[#A38446] block mb-1">
                            Grounding Analysis:
                          </span>
                          <p className="italic">"{rec.aiJustification}"</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => onOpenViewingModal(p)}
                          className="text-xs font-semibold text-[#A38446] hover:underline uppercase tracking-wider"
                        >
                          Book Viewing
                        </button>
                        <button
                          onClick={() => onSelectProperty(p)}
                          className="text-xs font-semibold text-[#0B1220] hover:text-[#A38446] flex items-center gap-1 uppercase tracking-wider"
                        >
                          <span>Full Specifications</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#C8A96B]" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

          </div>
        )}

        {/* Tab 1: Saved Properties */}
        {activeTab === 'saved' && (
          <div className="space-y-6">
            {savedProperties.length === 0 ? (
              <div className="bg-white border border-slate-200 p-12 text-center max-w-md mx-auto shadow-sm">
                <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <h3 className="font-serif font-bold text-lg text-[#0B1220]">No Saved Residences</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">
                  Bookmark trophy residences as you explore Dubai to review them privately here.
                </p>
                <button
                  onClick={() => onNavigateToListings()}
                  className="px-6 py-2.5 bg-[#0B1220] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#111C30]"
                >
                  Browse Catalog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedProperties.map((p) => (
                  <div key={p.id} className="bg-white border border-slate-200 p-4 shadow-sm relative flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden mb-3 bg-slate-900">
                        <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                        <button
                          onClick={() => onRemoveSaved(p.id)}
                          title="Remove from saved"
                          className="absolute top-2 right-2 p-1.5 bg-[#0B1220]/80 text-white hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-[10px] font-mono text-[#A38446] uppercase mb-1">
                        {p.neighborhood} · {p.type}
                      </div>
                      <h4 className="font-serif font-bold text-base text-[#0B1220] mb-1 line-clamp-1">
                        {p.title}
                      </h4>
                      <div className="text-lg font-serif font-bold text-[#0B1220] tabular-nums mb-3">
                        {formatCurrency(p.priceAed, currency)}
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => onOpenViewingModal(p)}
                        className="text-xs font-semibold text-[#A38446] hover:underline uppercase tracking-wider"
                      >
                        Book Viewing
                      </button>
                      <button
                        onClick={() => onSelectProperty(p)}
                        className="text-xs font-semibold text-[#0B1220] hover:text-[#A38446] flex items-center gap-1 uppercase tracking-wider"
                      >
                        <span>Details</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Searches */}
        {activeTab === 'searches' && (
          <div className="bg-white border border-slate-200 p-6 shadow-sm">
            <h3 className="font-serif font-bold text-lg text-[#0B1220] mb-4">
              Saved Portfolio Search Queries
            </h3>
            {savedSearches.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center italic">
                No saved searches yet. Click "Save Current Search" on the properties catalog to save your search filters.
              </p>
            ) : (
              <div className="divide-y divide-slate-100 text-xs">
                {savedSearches.map((s) => (
                  <div key={s.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="font-semibold text-sm text-[#0B1220]">{s.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Saved on {s.created_at}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onNavigateToListings(s.filters)}
                        className="px-3 py-1.5 bg-[#0B1220] text-white hover:bg-[#111C30] text-xs uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5"
                      >
                        <span>Execute Search</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#C8A96B]" />
                      </button>
                      <button
                        onClick={() => handleDeleteSearch(s.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500"
                        title="Delete search"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Inquiries & Viewings */}
        {activeTab === 'inquiries' && (
          <div className="bg-white border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#0B1220]">
                  Private Viewing & Consultation Records
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Tracking your direct requests with HS ESTATE Senior Partners
                </p>
              </div>
              <span className="text-xs font-mono text-slate-500">RERA Verified</span>
            </div>

            {userInquiries.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center italic">
                You have not submitted any inquiries or viewing requests yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {userInquiries.map((inq) => (
                  <div key={inq.id} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-serif font-bold text-sm text-[#0B1220]">
                          {inq.propertyTitle || 'General Portfolio Allocation'}
                        </span>
                        <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-slate-100 text-slate-700">
                          {inq.inquiryType}
                        </span>
                      </div>
                      <p className="text-slate-600 italic font-sans max-w-xl">"{inq.message}"</p>
                      {inq.preferredDate && (
                        <p className="text-slate-500 font-mono text-[11px]">
                          Requested Schedule: <strong className="text-slate-700">{inq.preferredDate}</strong>
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 shrink-0">
                      <span className={`px-2.5 py-1 text-[11px] font-mono font-bold uppercase ${
                        inq.status === 'Viewing Scheduled'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : inq.status === 'Contacted'
                          ? 'bg-blue-100 text-blue-800 border border-blue-300'
                          : inq.status === 'Closed'
                          ? 'bg-slate-100 text-slate-600 border border-slate-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        {inq.status}
                      </span>
                      <span className="font-mono text-slate-400 text-[11px]">{inq.createdAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Investor Profile Settings */}
        {activeTab === 'preferences' && (
          <div className="bg-white border border-slate-200 p-8 shadow-sm max-w-2xl">
            <h3 className="font-serif font-bold text-xl text-[#0B1220] mb-2">
              Investor Profile & Acquisition Mandate
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Update your capital preferences. Modifying your budget or preferred areas will automatically re-align your AI property recommendations.
            </p>

            {savedSuccess && (
              <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Acquisition preferences updated successfully in database.</span>
              </div>
            )}

            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Legal Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#F6F7F9] border border-slate-300 text-[#0B1220] p-2.5 focus:border-[#C8A96B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Direct Private Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F6F7F9] border border-slate-300 text-[#0B1220] p-2.5 focus:border-[#C8A96B] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Target Allocation Capital Budget (AED)
                </label>
                <input
                  type="number"
                  value={targetBudget}
                  step={1000000}
                  onChange={(e) => setTargetBudget(Number(e.target.value))}
                  className="w-full bg-[#F6F7F9] border border-slate-300 text-[#0B1220] p-2.5 font-mono focus:border-[#C8A96B] focus:outline-none"
                />
                <span className="text-[11px] text-[#A38446] font-mono mt-1 block">
                  Current Allocation: {formatCurrency(targetBudget, currency)}
                </span>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#0B1220] hover:bg-[#111C30] text-white text-xs uppercase tracking-wider font-semibold transition-colors"
                >
                  Save Mandate Preferences & Re-Align AI
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};
