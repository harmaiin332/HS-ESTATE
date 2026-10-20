import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Property, Inquiry, UserProfile, FilterState } from '../types';
import { SAMPLE_PROPERTIES, SAMPLE_INQUIRIES, CURRENT_USER } from '../data/mockData';

// Supabase Environment Variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseUrl.startsWith('http') &&
  supabaseAnonKey &&
  supabaseAnonKey.length > 10 &&
  !supabaseUrl.includes('your-project-ref')
);

// Create standard client
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Local persistent state for seamless fallback when Supabase env vars are pending
const LOCAL_STORAGE_PROPERTIES_KEY = 'hs_estate_properties_v2';
const LOCAL_STORAGE_FAVORITES_KEY = 'hs_estate_favorites_v2';
const LOCAL_STORAGE_INQUIRIES_KEY = 'hs_estate_inquiries_v2';
const LOCAL_STORAGE_SAVED_SEARCHES_KEY = 'hs_estate_saved_searches_v2';
const LOCAL_STORAGE_USER_KEY = 'hs_estate_current_user_v2';

// Initialize local stores
function getStoredProperties(): Property[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROPERTIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // ignore
  }
  return SAMPLE_PROPERTIES;
}

function saveStoredProperties(props: Property[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_PROPERTIES_KEY, JSON.stringify(props));
  } catch (e) {}
}

function getStoredInquiries(): Inquiry[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_INQUIRIES_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return SAMPLE_INQUIRIES;
}

function saveStoredInquiries(inqs: Inquiry[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_INQUIRIES_KEY, JSON.stringify(inqs));
  } catch (e) {}
}

// Convert Database Row to TypeScript Property
function mapRowToProperty(row: any, images: string[] = []): Property {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    purpose: row.purpose,
    type: row.property_type,
    priceAed: Number(row.price_aed),
    rentalPeriod: row.rental_period,
    location: row.location,
    neighborhood: row.neighborhood,
    bedrooms: row.bedrooms,
    bathrooms: row.bathrooms,
    sqft: row.sqft,
    plotSqft: row.plot_sqft,
    completionYear: row.completion_year,
    developer: row.developer,
    isExclusive: row.is_exclusive,
    isFeatured: row.is_featured,
    isNewLaunch: row.is_new_launch,
    roiEstimate: row.roi_estimate,
    description: row.description,
    features: row.features || [],
    amenities: row.amenities || [],
    coordinates: {
      lat: Number(row.latitude) || 25.12,
      lng: Number(row.longitude) || 55.15,
    },
    images: images.length > 0 ? images : (row.property_images?.map((img: any) => img.image_url) || [SAMPLE_PROPERTIES[0].images[0]]),
    agent: {
      name: row.agent_name || 'Alexander Sterling',
      role: row.agent_role || 'Managing Director, Ultra-Prime Advisory',
      photo: row.agent_photo || SAMPLE_PROPERTIES[0].agent.photo,
      phone: row.agent_phone || '+971 4 821 9900',
      whatsapp: row.agent_whatsapp || '+971 50 123 4567',
      email: row.agent_email || 'private.desk@hsestate.ae',
      languages: row.agent_languages || ['English', 'German', 'French'],
      reraNumber: row.agent_rera_number || 'BRN 48291',
    },
  };
}

// ==============================================================================
// PROPERTY DATABASE OPERATIONS
// ==============================================================================

export interface QueryPropertiesParams {
  search?: string;
  purpose?: string;
  type?: string;
  neighborhood?: string;
  bedrooms?: string | number;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'featured' | 'price-asc' | 'price-desc' | 'sqft-desc' | 'newest';
  page?: number;
  pageSize?: number;
}

export async function fetchDatabaseProperties(params: QueryPropertiesParams = {}): Promise<{
  data: Property[];
  count: number;
  isLiveSupabase: boolean;
}> {
  const {
    search,
    purpose,
    type,
    neighborhood,
    bedrooms,
    minPrice,
    maxPrice,
    sortBy = 'featured',
    page = 1,
    pageSize = 12,
  } = params;

  if (isSupabaseConfigured && supabase) {
    try {
      let query = supabase
        .from('properties')
        .select('*, property_images(image_url, display_order)', { count: 'exact' })
        .eq('status', 'published');

      if (purpose && purpose !== 'all') {
        query = query.eq('purpose', purpose);
      }
      if (type && type !== 'all') {
        query = query.eq('property_type', type);
      }
      if (neighborhood && neighborhood !== 'all') {
        query = query.eq('neighborhood', neighborhood);
      }
      if (bedrooms && bedrooms !== 'all') {
        const bedNum = Number(bedrooms);
        if (bedNum === 5) {
          query = query.gte('bedrooms', 5);
        } else {
          query = query.eq('bedrooms', bedNum);
        }
      }
      if (minPrice && minPrice > 0) {
        query = query.gte('price_aed', minPrice);
      }
      if (maxPrice && maxPrice > 0) {
        query = query.lte('price_aed', maxPrice);
      }
      if (search && search.trim()) {
        const q = `%${search.trim()}%`;
        query = query.or(`title.ilike.${q},location.ilike.${q},neighborhood.ilike.${q},description.ilike.${q}`);
      }

      // Sorting
      if (sortBy === 'price-asc') {
        query = query.order('price_aed', { ascending: true });
      } else if (sortBy === 'price-desc') {
        query = query.order('price_aed', { ascending: false });
      } else if (sortBy === 'sqft-desc') {
        query = query.order('sqft', { ascending: false });
      } else if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else {
        query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
      }

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (!error && data && data.length > 0) {
        const formatted = data.map((row: any) => {
          const imgs = (row.property_images || [])
            .sort((a: any, b: any) => a.display_order - b.display_order)
            .map((img: any) => img.image_url);
          return mapRowToProperty(row, imgs);
        });

        return { data: formatted, count: count || formatted.length, isLiveSupabase: true };
      }
    } catch (err) {
      console.warn('Supabase query error, falling back to cached catalog:', err);
    }
  }

  // Fallback to local stored database
  let localList = getStoredProperties();

  if (purpose && purpose !== 'all') {
    localList = localList.filter((p) => p.purpose === purpose);
  }
  if (type && type !== 'all') {
    localList = localList.filter((p) => p.type === type);
  }
  if (neighborhood && neighborhood !== 'all') {
    localList = localList.filter((p) => p.neighborhood === neighborhood);
  }
  if (bedrooms && bedrooms !== 'all') {
    const beds = Number(bedrooms);
    localList = localList.filter((p) => (beds === 5 ? p.bedrooms >= 5 : p.bedrooms === beds));
  }
  if (minPrice && minPrice > 0) {
    localList = localList.filter((p) => p.priceAed >= minPrice);
  }
  if (maxPrice && maxPrice > 0) {
    localList = localList.filter((p) => p.priceAed <= maxPrice);
  }
  if (search && search.trim()) {
    const q = search.toLowerCase();
    localList = localList.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.neighborhood.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (sortBy === 'price-asc') {
    localList.sort((a, b) => a.priceAed - b.priceAed);
  } else if (sortBy === 'price-desc') {
    localList.sort((a, b) => b.priceAed - a.priceAed);
  } else if (sortBy === 'sqft-desc') {
    localList.sort((a, b) => b.sqft - a.sqft);
  }

  const total = localList.length;
  const from = (page - 1) * pageSize;
  const paginated = localList.slice(from, from + pageSize);

  return { data: paginated, count: total, isLiveSupabase: false };
}

// Fetch single property by slug or ID
export async function fetchPropertyBySlug(slug: string): Promise<Property | null> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*, property_images(image_url, display_order)')
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .single();

      if (!error && data) {
        const imgs = (data.property_images || [])
          .sort((a: any, b: any) => a.display_order - b.display_order)
          .map((i: any) => i.image_url);
        return mapRowToProperty(data, imgs);
      }
    } catch (e) {
      console.warn('Property fetch by slug error:', e);
    }
  }

  const local = getStoredProperties();
  return local.find((p) => p.slug === slug || p.id === slug) || null;
}

// ==============================================================================
// FAVORITES OPERATIONS
// ==============================================================================

export async function fetchUserFavorites(userId: string): Promise<string[]> {
  if (isSupabaseConfigured && supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('property_id')
        .eq('user_id', userId);

      if (!error && data) {
        return data.map((f: any) => f.property_id);
      }
    } catch (e) {}
  }

  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_FAVORITES_KEY}_${userId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return CURRENT_USER.savedPropertyIds;
}

export async function toggleUserFavorite(userId: string, propertyId: string, currentlySaved: boolean): Promise<boolean> {
  if (isSupabaseConfigured && supabase && userId) {
    try {
      if (currentlySaved) {
        await supabase
          .from('favorites')
          .delete()
          .match({ user_id: userId, property_id: propertyId });
        return false;
      } else {
        await supabase
          .from('favorites')
          .insert({ user_id: userId, property_id: propertyId });
        return true;
      }
    } catch (e) {
      console.warn('Supabase toggle favorite error:', e);
    }
  }

  // Local fallback
  const favs = await fetchUserFavorites(userId);
  let updated: string[];
  let isSavedNow = false;

  if (favs.includes(propertyId)) {
    updated = favs.filter((id) => id !== propertyId);
    isSavedNow = false;
  } else {
    updated = [...favs, propertyId];
    isSavedNow = true;
  }

  try {
    localStorage.setItem(`${LOCAL_STORAGE_FAVORITES_KEY}_${userId}`, JSON.stringify(updated));
  } catch (e) {}

  return isSavedNow;
}

// ==============================================================================
// SAVED SEARCHES
// ==============================================================================

export interface SavedSearch {
  id: string;
  name: string;
  filters: any;
  created_at: string;
}

export async function fetchUserSavedSearches(userId: string): Promise<SavedSearch[]> {
  if (isSupabaseConfigured && supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((d) => ({
          id: d.id,
          name: d.search_name,
          filters: d.filters,
          created_at: d.created_at,
        }));
      }
    } catch (e) {}
  }

  try {
    const raw = localStorage.getItem(`${LOCAL_STORAGE_SAVED_SEARCHES_KEY}_${userId}`);
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  return [
    {
      id: 'srch-1',
      name: 'Palm Jumeirah · Beachfront Villas',
      filters: { neighborhood: 'Palm Jumeirah', type: 'Villa' },
      created_at: '2026-10-18',
    },
    {
      id: 'srch-2',
      name: 'Downtown Sky Penthouses · Buy',
      filters: { neighborhood: 'Downtown Dubai', type: 'Penthouse' },
      created_at: '2026-10-15',
    },
  ];
}

export async function saveUserSearch(userId: string, name: string, filters: any): Promise<SavedSearch> {
  if (isSupabaseConfigured && supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('saved_searches')
        .insert({
          user_id: userId,
          search_name: name,
          filters,
        })
        .select()
        .single();

      if (!error && data) {
        return {
          id: data.id,
          name: data.search_name,
          filters: data.filters,
          created_at: data.created_at,
        };
      }
    } catch (e) {}
  }

  const existing = await fetchUserSavedSearches(userId);
  const newSearch: SavedSearch = {
    id: 'srch-' + Date.now(),
    name,
    filters,
    created_at: new Date().toISOString().split('T')[0],
  };
  const updated = [newSearch, ...existing];
  try {
    localStorage.setItem(`${LOCAL_STORAGE_SAVED_SEARCHES_KEY}_${userId}`, JSON.stringify(updated));
  } catch (e) {}
  return newSearch;
}

export async function deleteUserSavedSearch(userId: string, id: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('saved_searches').delete().eq('id', id);
    } catch (e) {}
  }

  const existing = await fetchUserSavedSearches(userId);
  const updated = existing.filter((s) => s.id !== id);
  try {
    localStorage.setItem(`${LOCAL_STORAGE_SAVED_SEARCHES_KEY}_${userId}`, JSON.stringify(updated));
  } catch (e) {}
}

// ==============================================================================
// PROPERTY INQUIRIES
// ==============================================================================

export async function submitPropertyInquiry(inquiryData: {
  propertyId?: string;
  propertyTitle?: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  inquiryType: 'Viewing' | 'Brochure' | 'Investment Consultation' | 'General';
  preferredDate?: string;
  message: string;
  userId?: string;
}): Promise<Inquiry> {
  // First attempt server endpoint with server-side validation
  try {
    const res = await fetch('/api/inquiries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(inquiryData),
    });

    if (res.ok) {
      const json = await res.json();
      if (json.inquiry) {
        const inq: Inquiry = {
          id: json.inquiry.id,
          propertyId: json.inquiry.property_id || inquiryData.propertyId,
          propertyTitle: inquiryData.propertyTitle || 'General Advisory',
          userName: json.inquiry.user_name || inquiryData.userName,
          userEmail: json.inquiry.user_email || inquiryData.userEmail,
          userPhone: json.inquiry.user_phone || inquiryData.userPhone,
          inquiryType: json.inquiry.inquiry_type || inquiryData.inquiryType,
          preferredDate: json.inquiry.preferred_date || inquiryData.preferredDate,
          message: json.inquiry.message || inquiryData.message,
          status: json.inquiry.status || 'New',
          createdAt: json.inquiry.created_at || new Date().toISOString().split('T')[0],
        };

        // Cache locally for immediate view
        const currentInqs = getStoredInquiries();
        saveStoredInquiries([inq, ...currentInqs]);
        return inq;
      }
    }
  } catch (e) {
    console.warn('Server inquiry post fallback:', e);
  }

  // Direct Supabase insert if server route wasn't reached
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('property_inquiries')
        .insert({
          property_id: inquiryData.propertyId || null,
          user_id: inquiryData.userId || null,
          user_name: inquiryData.userName,
          user_email: inquiryData.userEmail,
          user_phone: inquiryData.userPhone,
          inquiry_type: inquiryData.inquiryType,
          preferred_date: inquiryData.preferredDate || null,
          message: inquiryData.message,
          status: 'New',
        })
        .select()
        .single();

      if (!error && data) {
        const inq: Inquiry = {
          id: data.id,
          propertyId: data.property_id,
          propertyTitle: inquiryData.propertyTitle,
          userName: data.user_name,
          userEmail: data.user_email,
          userPhone: data.user_phone,
          inquiryType: data.inquiry_type,
          preferredDate: data.preferred_date,
          message: data.message,
          status: data.status,
          createdAt: data.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
        };
        const currentInqs = getStoredInquiries();
        saveStoredInquiries([inq, ...currentInqs]);
        return inq;
      }
    } catch (e) {}
  }

  // Local persistent fallback
  const mockInq: Inquiry = {
    id: 'inq-' + Date.now(),
    propertyId: inquiryData.propertyId,
    propertyTitle: inquiryData.propertyTitle || 'General Advisory',
    userName: inquiryData.userName,
    userEmail: inquiryData.userEmail,
    userPhone: inquiryData.userPhone,
    inquiryType: inquiryData.inquiryType,
    preferredDate: inquiryData.preferredDate,
    message: inquiryData.message,
    status: 'New',
    createdAt: new Date().toISOString().split('T')[0],
  };

  const current = getStoredInquiries();
  saveStoredInquiries([mockInq, ...current]);
  return mockInq;
}

export async function fetchUserInquiries(userId?: string, userEmail?: string): Promise<Inquiry[]> {
  if (isSupabaseConfigured && supabase && (userId || userEmail)) {
    try {
      let query = supabase
        .from('property_inquiries')
        .select('*, properties(title)')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      } else if (userEmail) {
        query = query.eq('user_email', userEmail.toLowerCase());
      }

      const { data, error } = await query;
      if (!error && data) {
        return data.map((d) => ({
          id: d.id,
          propertyId: d.property_id,
          propertyTitle: d.properties?.title || 'General Advisory',
          userName: d.user_name,
          userEmail: d.user_email,
          userPhone: d.user_phone,
          inquiryType: d.inquiry_type,
          preferredDate: d.preferred_date,
          message: d.message,
          status: d.status,
          createdAt: d.created_at?.split('T')[0] || '',
        }));
      }
    } catch (e) {}
  }

  return getStoredInquiries();
}

// ==============================================================================
// ADMIN OPERATIONS (PROTECTED)
// ==============================================================================

export async function adminFetchAllInquiries(): Promise<Inquiry[]> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('property_inquiries')
        .select('*, properties(title)')
        .order('created_at', { ascending: false });

      if (!error && data) {
        return data.map((d) => ({
          id: d.id,
          propertyId: d.property_id,
          propertyTitle: d.properties?.title || 'General Advisory',
          userName: d.user_name,
          userEmail: d.user_email,
          userPhone: d.user_phone,
          inquiryType: d.inquiry_type,
          preferredDate: d.preferred_date,
          message: d.message,
          status: d.status,
          createdAt: d.created_at?.split('T')[0] || '',
        }));
      }
    } catch (e) {}
  }

  return getStoredInquiries();
}

export async function adminUpdateInquiryStatus(id: string, newStatus: Inquiry['status']): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('property_inquiries')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (!error) return true;
    } catch (e) {}
  }

  // Update in local store
  const inqs = getStoredInquiries();
  const updated = inqs.map((i) => (i.id === id ? { ...i, status: newStatus } : i));
  saveStoredInquiries(updated);
  return true;
}

export async function adminCreateProperty(newProperty: Property): Promise<Property> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('properties')
        .insert({
          title: newProperty.title,
          slug: newProperty.slug,
          purpose: newProperty.purpose,
          property_type: newProperty.type,
          status: 'published',
          price_aed: newProperty.priceAed,
          location: newProperty.location,
          neighborhood: newProperty.neighborhood,
          bedrooms: newProperty.bedrooms,
          bathrooms: newProperty.bathrooms,
          sqft: newProperty.sqft,
          plot_sqft: newProperty.plotSqft || null,
          completion_year: newProperty.completionYear ? Number(newProperty.completionYear) : null,
          developer: newProperty.developer,
          is_exclusive: newProperty.isExclusive || false,
          is_featured: newProperty.isFeatured || false,
          description: newProperty.description,
          features: newProperty.features,
          amenities: newProperty.amenities,
          agent_name: newProperty.agent.name,
          agent_role: newProperty.agent.role,
          agent_phone: newProperty.agent.phone,
          agent_email: newProperty.agent.email,
          agent_rera_number: newProperty.agent.reraNumber,
        })
        .select()
        .single();

      if (!error && data) {
        // Insert images
        if (newProperty.images.length > 0) {
          const imageRows = newProperty.images.map((url, idx) => ({
            property_id: data.id,
            image_url: url,
            display_order: idx,
          }));
          await supabase.from('property_images').insert(imageRows);
        }

        const mapped = mapRowToProperty(data, newProperty.images);
        const current = getStoredProperties();
        saveStoredProperties([mapped, ...current]);
        return mapped;
      }
    } catch (e) {
      console.warn('Admin create property error:', e);
    }
  }

  const current = getStoredProperties();
  saveStoredProperties([newProperty, ...current]);
  return newProperty;
}

export async function adminDeleteProperty(id: string): Promise<boolean> {
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('properties').delete().eq('id', id);
      if (!error) {
        const current = getStoredProperties().filter((p) => p.id !== id);
        saveStoredProperties(current);
        return true;
      }
    } catch (e) {}
  }

  const current = getStoredProperties().filter((p) => p.id !== id);
  saveStoredProperties(current);
  return true;
}
