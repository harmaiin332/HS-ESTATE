export type PropertyType = 'Villa' | 'Penthouse' | 'Apartment' | 'Mansion' | 'Townhouse';
export type PropertyPurpose = 'buy' | 'rent' | 'invest';

export interface Property {
  id: string;
  title: string;
  slug: string;
  purpose: PropertyPurpose;
  type: PropertyType;
  priceAed: number;
  rentalPeriod?: 'year' | 'month';
  location: string;
  neighborhood: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  plotSqft?: number;
  completionYear?: number | string;
  developer?: string;
  isExclusive?: boolean;
  isNewLaunch?: boolean;
  isFeatured?: boolean;
  roiEstimate?: string;
  images: string[];
  description: string;
  features: string[];
  amenities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  agent: {
    name: string;
    role: string;
    photo: string;
    phone: string;
    whatsapp: string;
    email: string;
    languages: string[];
    reraNumber: string;
  };
}

export interface Neighborhood {
  id: string;
  name: string;
  tagline: string;
  description: string;
  avgPricePerSqft: number;
  image: string;
  propertyCount: number;
  popularFor: string[];
}

export interface Development {
  id: string;
  name: string;
  developer: string;
  location: string;
  handover: string;
  startingPriceAed: number;
  paymentPlan: string;
  projectType: string;
  image: string;
  projectHighlights: string[];
}

export interface Inquiry {
  id: string;
  propertyId?: string;
  propertyTitle?: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  inquiryType: 'Viewing' | 'Brochure' | 'General' | 'Investment Consultation';
  preferredDate?: string;
  message: string;
  status: 'New' | 'Contacted' | 'Viewing Scheduled' | 'Closed';
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'investor' | 'buyer' | 'admin';
  investorType: 'Individual HNW' | 'Family Office' | 'Institutional';
  targetBudgetAed: number;
  preferredAreas: string[];
  savedPropertyIds: string[];
}

export interface FilterState {
  searchQuery: string;
  purpose: PropertyPurpose | 'all';
  type: string;
  neighborhood: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: string;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'sqft-desc' | 'newest';
}
