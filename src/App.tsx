/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Property, Neighborhood, Development, Inquiry, UserProfile, PropertyPurpose } from './types';
import {
  SAMPLE_PROPERTIES,
  DUBAI_NEIGHBORHOODS,
  NEW_DEVELOPMENTS,
  SAMPLE_INQUIRIES,
  CURRENT_USER
} from './data/mockData';
import { Currency } from './utils/formatters';

import {
  supabase,
  isSupabaseConfigured,
  fetchDatabaseProperties,
  fetchUserFavorites,
  toggleUserFavorite,
  adminCreateProperty,
  adminDeleteProperty,
  adminUpdateInquiryStatus
} from './lib/supabase';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AiAdvisorWidget } from './components/AiAdvisorWidget';
import { AuthModal } from './components/AuthModal';
import { ViewingModal } from './components/ViewingModal';
import { PropertyCompareModal } from './components/PropertyCompareModal';
import { CompareFloatingBar } from './components/CompareFloatingBar';

import { HomePage } from './pages/HomePage';
import { ListingsPage } from './pages/ListingsPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { UserDashboardPage } from './pages/UserDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';

export default function App() {
  // Navigation & View States
  const [activePage, setActivePage] = useState<string>('home');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(SAMPLE_PROPERTIES[0]);
  const [activeFilter, setActiveFilter] = useState<any>(null);

  // Core Data States
  const [properties, setProperties] = useState<Property[]>(SAMPLE_PROPERTIES);
  const [neighborhoods] = useState<Neighborhood[]>(DUBAI_NEIGHBORHOODS);
  const [developments] = useState<Development[]>(NEW_DEVELOPMENTS);
  const [inquiries, setInquiries] = useState<Inquiry[]>(SAMPLE_INQUIRIES);
  const [savedPropertyIds, setSavedPropertyIds] = useState<string[]>(CURRENT_USER.savedPropertyIds);

  // User & Currency States
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(CURRENT_USER);
  const [currency, setCurrency] = useState<Currency>('AED');

  // Property Comparison State
  const [compareList, setCompareList] = useState<Property[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Modals & Floating Widgets
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isViewingModalOpen, setIsViewingModalOpen] = useState(false);
  const [viewingTargetProperty, setViewingTargetProperty] = useState<Property | null>(null);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);

  // Database initialization & Session sync
  useEffect(() => {
    async function initApp() {
      // 1. Fetch live published properties
      try {
        const res = await fetchDatabaseProperties({ pageSize: 50 });
        if (res.data && res.data.length > 0) {
          setProperties(res.data);
          if (!selectedProperty) {
            setSelectedProperty(res.data[0]);
          }
        }
      } catch (e) {
        console.warn('Initial properties load warning:', e);
      }

      // 2. Check Supabase session
      if (isSupabaseConfigured && supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from('user_profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const loggedIn: UserProfile = {
              id: session.user.id,
              name: profile?.full_name || session.user.user_metadata?.full_name || 'VIP Client',
              email: session.user.email || '',
              phone: profile?.phone || '',
              role: profile?.role || 'investor',
              investorType: profile?.investor_type || 'Individual HNW',
              targetBudgetAed: profile?.target_budget_aed || 25000000,
              preferredAreas: profile?.preferred_areas || [],
              savedPropertyIds: [],
            };

            setCurrentUser(loggedIn);

            // Fetch user favorites
            const favs = await fetchUserFavorites(session.user.id);
            setSavedPropertyIds(favs);
          }
        } catch (err) {
          console.warn('Session init check:', err);
        }
      }
    }

    initApp();
  }, []);

  // Handlers for Save/Favorite
  const handleToggleSave = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isCurrentlySaved = savedPropertyIds.includes(id);

    if (currentUser?.id) {
      const isSavedNow = await toggleUserFavorite(currentUser.id, id, isCurrentlySaved);
      setSavedPropertyIds((prev) =>
        isSavedNow ? [...prev, id] : prev.filter((item) => item !== id)
      );
    } else {
      setSavedPropertyIds((prev) =>
        isCurrentlySaved ? prev.filter((item) => item !== id) : [...prev, id]
      );
    }
  };

  // Property Comparison Handlers
  const handleToggleCompare = (property: Property, e: React.MouseEvent) => {
    e.stopPropagation();
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === property.id);
      if (exists) {
        return prev.filter((p) => p.id !== property.id);
      }
      if (prev.length >= 4) {
        alert('You can compare up to 4 Dubai residences simultaneously.');
        return prev;
      }
      return [...prev, property];
    });
  };

  const handleRemoveFromCompare = (id: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== id));
  };

  const handleClearCompare = () => {
    setCompareList([]);
    setIsCompareModalOpen(false);
  };

  // Selection & Navigation
  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    setActivePage('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToListings = (filterParams?: any) => {
    if (filterParams) {
      setActiveFilter(filterParams);
    } else {
      setActiveFilter(null);
    }
    setActivePage('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchFromHero = (params: {
    purpose: PropertyPurpose;
    neighborhood: string;
    type: string;
    minPrice: number;
    maxPrice: number;
    bedrooms: string;
  }) => {
    setActiveFilter(params);
    setActivePage('listings');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenViewingModal = (property: Property | null) => {
    setViewingTargetProperty(property);
    setIsViewingModalOpen(true);
  };

  const handleInquirySubmitted = (newInquiry: Inquiry) => {
    setInquiries((prev) => [newInquiry, ...prev]);
  };

  // Admin Actions
  const handleAddProperty = async (newProperty: Property) => {
    const created = await adminCreateProperty(newProperty);
    setProperties((prev) => [created, ...prev]);
  };

  const handleDeleteProperty = async (id: string) => {
    await adminDeleteProperty(id);
    setProperties((prev) => prev.filter((p) => p.id !== id));
  };

  const handleUpdateInquiryStatus = async (id: string, newStatus: Inquiry['status']) => {
    await adminUpdateInquiryStatus(id, newStatus);
    setInquiries((prev) =>
      prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
    );
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, ...updated });
    }
  };

  const handleLogout = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setCurrentUser(null);
    setActivePage('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#0B1220] selection:bg-[#C8A96B] selection:text-[#0B1220]">
      {/* 1. Universal Top Navigation Bar */}
      <Navbar
        activePage={activePage}
        setActivePage={(page) => {
          if (page === 'neighborhoods') {
            setActivePage('home');
            setTimeout(() => {
              const el = document.getElementById('neighborhoods-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          } else {
            setActivePage(page);
          }
        }}
        savedCount={savedPropertyIds.length}
        currency={currency}
        setCurrency={setCurrency}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isLoggedIn={Boolean(currentUser)}
        onOpenDashboard={() => {
          if (!currentUser) {
            setIsAuthModalOpen(true);
          } else {
            setActivePage('dashboard');
          }
        }}
        onOpenAdmin={() => {
          setActivePage('admin');
        }}
      />

      {/* 2. Main Page Render */}
      <main className="flex-grow">
        {activePage === 'home' && (
          <div id="home-view">
            <HomePage
              properties={properties}
              neighborhoods={neighborhoods}
              developments={developments}
              currency={currency}
              savedPropertyIds={savedPropertyIds}
              onToggleSave={handleToggleSave}
              onSelectProperty={handleSelectProperty}
              onSearch={handleSearchFromHero}
              onNavigateToListings={handleNavigateToListings}
              onOpenAdvisor={() => setIsAiAdvisorOpen(true)}
              onOpenConsultation={() => handleOpenViewingModal(null)}
            />
          </div>
        )}

        {activePage === 'listings' && (
          <ListingsPage
            properties={properties}
            currency={currency}
            savedPropertyIds={savedPropertyIds}
            onToggleSave={handleToggleSave}
            onSelectProperty={handleSelectProperty}
            initialFilter={activeFilter}
            onQuickInquire={(p, e) => {
              e.stopPropagation();
              handleOpenViewingModal(p);
            }}
            comparePropertyIds={compareList.map((p) => p.id)}
            onToggleCompare={handleToggleCompare}
            userId={currentUser?.id}
          />
        )}

        {activePage === 'detail' && selectedProperty && (
          <PropertyDetailPage
            property={selectedProperty}
            allProperties={properties}
            currency={currency}
            isSaved={savedPropertyIds.includes(selectedProperty.id)}
            onToggleSave={handleToggleSave}
            onBack={() => setActivePage('listings')}
            onSelectProperty={handleSelectProperty}
            onOpenViewingModal={handleOpenViewingModal}
            isComparing={compareList.some((p) => p.id === selectedProperty.id)}
            onToggleCompare={handleToggleCompare}
          />
        )}

        {activePage === 'dashboard' && currentUser && (
          <UserDashboardPage
            user={currentUser}
            savedProperties={properties.filter((p) => savedPropertyIds.includes(p.id))}
            inquiries={inquiries}
            currency={currency}
            onRemoveSaved={(id) => handleToggleSave(id, { stopPropagation: () => {} } as any)}
            onSelectProperty={handleSelectProperty}
            onUpdateProfile={handleUpdateProfile}
            onLogout={handleLogout}
            onNavigateToListings={handleNavigateToListings}
            onOpenViewingModal={handleOpenViewingModal}
          />
        )}

        {activePage === 'admin' && (
          <AdminDashboardPage
            properties={properties}
            inquiries={inquiries}
            currency={currency}
            onAddProperty={handleAddProperty}
            onDeleteProperty={handleDeleteProperty}
            onUpdateInquiryStatus={handleUpdateInquiryStatus}
            onSelectProperty={handleSelectProperty}
            onExitAdmin={() => setActivePage('home')}
          />
        )}

        {activePage === 'about' && (
          <AboutPage
            onOpenConsultation={() => handleOpenViewingModal(null)}
            onNavigateToListings={() => handleNavigateToListings()}
          />
        )}

        {activePage === 'contact' && (
          <ContactPage onInquirySubmitted={handleInquirySubmitted} />
        )}
      </main>

      {/* 3. Universal Professional Footer */}
      <Footer
        onNavigate={(page) => {
          setActivePage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 4. Floating Comparison Dock & Modal */}
      <CompareFloatingBar
        compareList={compareList}
        onOpenCompare={() => setIsCompareModalOpen(true)}
        onRemove={handleRemoveFromCompare}
        onClear={handleClearCompare}
      />

      <PropertyCompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        properties={compareList}
        currency={currency}
        onRemoveProperty={handleRemoveFromCompare}
        onSelectProperty={handleSelectProperty}
        onBookViewing={(p) => handleOpenViewingModal(p)}
        onClearAll={handleClearCompare}
      />

      {/* 5. Floating AI Property Advisor Widget */}
      <AiAdvisorWidget
        isOpen={isAiAdvisorOpen}
        onToggle={() => setIsAiAdvisorOpen(!isAiAdvisorOpen)}
        properties={properties}
        currency={currency}
        onSelectProperty={handleSelectProperty}
        onOpenConsultation={() => handleOpenViewingModal(null)}
        currentPropertyContext={activePage === 'detail' ? selectedProperty : null}
        comparePropertyIds={compareList.map((p) => p.id)}
        onToggleCompare={handleToggleCompare}
      />

      {/* 6. Client Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setActivePage('dashboard');
        }}
      />

      {/* 7. Private Viewing & Brochure Booking Modal */}
      <ViewingModal
        isOpen={isViewingModalOpen}
        onClose={() => setIsViewingModalOpen(false)}
        property={viewingTargetProperty}
        onInquirySubmitted={handleInquirySubmitted}
      />
    </div>
  );
}
