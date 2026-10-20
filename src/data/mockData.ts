import { Property, Neighborhood, Development, Inquiry, UserProfile } from '../types';

export const HERO_IMAGE = '/src/assets/images/hero_dubai_skyline_1792534461827.jpg';
export const VILLA_PALM_IMAGE = '/src/assets/images/villa_palm_jumeirah_1792534463101.jpg';
export const PENTHOUSE_DOWNTOWN_IMAGE = '/src/assets/images/penthouse_downtown_1792534462687.jpg';
export const APARTMENT_MARINA_IMAGE = '/src/assets/images/apartment_marina_1792534463638.jpg';
export const MANSION_EMIRATES_IMAGE = '/src/assets/images/mansion_emirates_hills_1792534463853.jpg';

export const SAMPLE_PROPERTIES: Property[] = [
  {
    id: 'hs-palm-01',
    title: 'The Solstice Royal Beachfront Villa',
    slug: 'solstice-royal-beachfront-villa-palm-jumeirah',
    purpose: 'buy',
    type: 'Villa',
    priceAed: 68500000,
    location: 'Frond G, Palm Jumeirah, Dubai',
    neighborhood: 'Palm Jumeirah',
    bedrooms: 6,
    bathrooms: 8,
    sqft: 14200,
    plotSqft: 16800,
    completionYear: 2024,
    developer: 'Private Bespoke Build',
    isExclusive: true,
    isFeatured: true,
    roiEstimate: '8.4% Net Yield',
    images: [
      VILLA_PALM_IMAGE,
      HERO_IMAGE,
      PENTHOUSE_DOWNTOWN_IMAGE,
    ],
    description: 'An architectural tour de force situated on the ultra-prestigious "Billionaires Row" on Frond G of Palm Jumeirah. Designed by award-winning European architects, this villa features an 85-foot private beachfront, sunken fire lounge directly overlooking Dubai Marina skyline, infinity pool lined with Italian travertine, custom Poliform Italian cabinetry, and a subterranean automobile gallery.',
    features: [
      '85 ft Private White-Sand Beach Frontage',
      'Cantilevered Infinity Edge Pool & Sunken Firepit',
      'Private Subterranean 6-Car Showroom',
      'Sub-Zero & Gaggenau Show + Prep Kitchens',
      'Private Spa, Sauna & Steam Suite',
      'Full Smart Crestron Home Automation'
    ],
    amenities: [
      'Private Beach',
      'Infinity Pool',
      'Concierge 24/7',
      'Smart Home',
      'Private Elevator',
      'Gym & Wellness Suite',
      'Staff Quarters',
      'Cinema Room'
    ],
    coordinates: { lat: 25.1189, lng: 55.1321 },
    agent: {
      name: 'Alexander Sterling',
      role: 'Managing Director, Ultra-Prime Advisory',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
      phone: '+971 4 821 9900',
      whatsapp: '+971 50 123 4567',
      email: 'alexander.s@hsestate.ae',
      languages: ['English', 'German', 'French'],
      reraNumber: 'BRN 48291'
    }
  },
  {
    id: 'hs-downtown-02',
    title: 'The Sky Palace Duplex Penthouse',
    slug: 'sky-palace-duplex-penthouse-downtown-dubai',
    purpose: 'buy',
    type: 'Penthouse',
    priceAed: 44000000,
    location: 'Opera District, Downtown Dubai',
    neighborhood: 'Downtown Dubai',
    bedrooms: 5,
    bathrooms: 6,
    sqft: 9800,
    completionYear: 2025,
    developer: 'Emaar Properties',
    isExclusive: true,
    isFeatured: true,
    roiEstimate: '7.8% Projected',
    images: [
      PENTHOUSE_DOWNTOWN_IMAGE,
      HERO_IMAGE,
      APARTMENT_MARINA_IMAGE,
    ],
    description: 'Perched in the crown of the Opera Grand in Downtown Dubai, this dual-level penthouse boasts unobstructed 360-degree vistas of the Burj Khalifa and Dubai Fountain. Featuring 7-meter double-height glass facades, bespoke champagne brass detailing, Calacatta Oro book-matched marble, and private plunge pool on a 1,200 sqft wraparound terrace.',
    features: [
      'Direct Front-Row Burj Khalifa & Fountain Views',
      'Double-Height 7m Architectural Glass Ceilings',
      'Private Heated Terrace Plunge Pool',
      'Bespoke Temperature-Controlled Wine Room',
      'Private Biometric High-Speed Lift Entrance',
      'Exclusive Valet & 4 Dedicated Underground Bays'
    ],
    amenities: [
      'Burj Khalifa View',
      'Private Pool',
      'Concierge 24/7',
      'Valet Parking',
      'Wine Cellar',
      'Smart Automation',
      'Private Elevator'
    ],
    coordinates: { lat: 25.1972, lng: 55.2744 },
    agent: {
      name: 'Soraya Mansoor',
      role: 'Senior Partner, Penthouses & Off-Market',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      phone: '+971 4 821 9901',
      whatsapp: '+971 50 987 6543',
      email: 'soraya.m@hsestate.ae',
      languages: ['English', 'Arabic', 'Russian'],
      reraNumber: 'BRN 39104'
    }
  },
  {
    id: 'hs-marina-03',
    title: 'The Marina Horizon Waterfront Residence',
    slug: 'marina-horizon-waterfront-residence',
    purpose: 'rent',
    type: 'Apartment',
    priceAed: 750000,
    rentalPeriod: 'year',
    location: 'Marina Promenade, Dubai Marina',
    neighborhood: 'Dubai Marina',
    bedrooms: 3,
    bathrooms: 4,
    sqft: 3450,
    completionYear: 2023,
    developer: 'Select Group',
    isNewLaunch: false,
    isFeatured: true,
    images: [
      APARTMENT_MARINA_IMAGE,
      HERO_IMAGE,
      VILLA_PALM_IMAGE,
    ],
    description: 'An exemplary luxury residence overlooking the marina yacht haven. Fully furnished with curated Minotti and B&B Italia pieces, this high-floor corner apartment offers floor-to-ceiling glass wrapping around a deep entertaining terrace, high-specification acoustic insulation, and immediate private promenade access.',
    features: [
      'Direct Panoramic Marina Canal & Yacht Basin Views',
      'Deep Shaded Sunset Terrace with Teak Decking',
      'Custom Boffi Kitchen with Miele Appliances',
      'Master Wing with Dressing Lounge and Free-standing Tub',
      '2 Designated Covered Parking Bays'
    ],
    amenities: [
      'Marina View',
      'Swimming Pool',
      'Yacht Berth Access',
      '24/7 Security',
      'Fitness Center',
      'Valet Service'
    ],
    coordinates: { lat: 25.0772, lng: 55.1384 },
    agent: {
      name: 'Alexander Sterling',
      role: 'Managing Director, Ultra-Prime Advisory',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
      phone: '+971 4 821 9900',
      whatsapp: '+971 50 123 4567',
      email: 'alexander.s@hsestate.ae',
      languages: ['English', 'German', 'French'],
      reraNumber: 'BRN 48291'
    }
  },
  {
    id: 'hs-emirates-04',
    title: 'The Elysian Golf Sanctuary Estate',
    slug: 'elysian-golf-sanctuary-estate-emirates-hills',
    purpose: 'buy',
    type: 'Mansion',
    priceAed: 115000000,
    location: 'Sector L, Emirates Hills, Dubai',
    neighborhood: 'Emirates Hills',
    bedrooms: 7,
    bathrooms: 10,
    sqft: 22000,
    plotSqft: 28500,
    completionYear: 2024,
    developer: 'Bespoke Private Commission',
    isExclusive: true,
    isFeatured: true,
    roiEstimate: '6.9% Capital Growth',
    images: [
      MANSION_EMIRATES_IMAGE,
      HERO_IMAGE,
      VILLA_PALM_IMAGE,
    ],
    description: 'Frequently hailed as the "Beverly Hills of Dubai", Emirates Hills provides supreme privacy and manicured tranquility. The Elysian Estate overlooks the championship Montgomerie Golf Course fairways. Constructed with imported Portuguese limestone, bronze sunshades, cascading outdoor water elements, indoor 20m lap pool, and 12-seat private Dolby Atmos theatre.',
    features: [
      'Prime Frontage on the Montgomerie Championship Course',
      '28,500 sqft Manicured Botanical Grounds & Courtyards',
      'Dual Swimming Pools (Indoor Heated Lap + Outdoor Lagoon)',
      '12-Seat DCI Certified Private Cinema',
      'Dedicated Staff Wing (4 En-suite Bedrooms)',
      'Basement Level Wellness Haven with Cryo Chamber Room'
    ],
    amenities: [
      'Golf Course Frontage',
      'Indoor & Outdoor Pools',
      'Private Cinema',
      'Wellness Spa',
      'Smart Automation',
      'Security Post & Guard House',
      'Wine Cellar'
    ],
    coordinates: { lat: 25.0743, lng: 55.1762 },
    agent: {
      name: 'Soraya Mansoor',
      role: 'Senior Partner, Penthouses & Off-Market',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      phone: '+971 4 821 9901',
      whatsapp: '+971 50 987 6543',
      email: 'soraya.m@hsestate.ae',
      languages: ['English', 'Arabic', 'Russian'],
      reraNumber: 'BRN 39104'
    }
  },
  {
    id: 'hs-difc-05',
    title: 'The Sky Collection Residence at DIFC',
    slug: 'sky-collection-residence-difc',
    purpose: 'invest',
    type: 'Apartment',
    priceAed: 12800000,
    location: 'Gate Village, DIFC, Dubai',
    neighborhood: 'DIFC',
    bedrooms: 2,
    bathrooms: 3,
    sqft: 2150,
    completionYear: 2025,
    developer: 'Omniyat',
    isNewLaunch: true,
    isFeatured: false,
    roiEstimate: '9.2% Net Yield',
    images: [
      PENTHOUSE_DOWNTOWN_IMAGE,
      HERO_IMAGE,
      APARTMENT_MARINA_IMAGE,
    ],
    description: 'Located at the global financial epicenter of the Middle East, this turnkey luxury executive residence in DIFC is ideal for high-yielding institutional or family office portfolios. High tenant demand from multinational executive directors, Michelin dining downstairs, and zero local property taxes.',
    features: [
      'Walkable Access to Top 100 Global Banks & Galleries',
      'Managed 5-Star Hotel Brand Concierge Services',
      'Turnkey Fully Furnished by Christian Liaigre',
      'Rooftop Sky Lounge and Cigar Room'
    ],
    amenities: [
      'Concierge 24/7',
      'Valet Parking',
      'Meeting Suites',
      'Fine Dining Access',
      'High-Speed Lifts',
      'Rooftop Pool'
    ],
    coordinates: { lat: 25.2117, lng: 55.2811 },
    agent: {
      name: 'Alexander Sterling',
      role: 'Managing Director, Ultra-Prime Advisory',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
      phone: '+971 4 821 9900',
      whatsapp: '+971 50 123 4567',
      email: 'alexander.s@hsestate.ae',
      languages: ['English', 'German', 'French'],
      reraNumber: 'BRN 48291'
    }
  },
  {
    id: 'hs-creek-06',
    title: 'The Creek Waterfront Grand Haven',
    slug: 'creek-waterfront-grand-haven',
    purpose: 'buy',
    type: 'Townhouse',
    priceAed: 19500000,
    location: 'Creek Marina, Dubai Creek Harbour',
    neighborhood: 'Dubai Creek Harbour',
    bedrooms: 4,
    bathrooms: 5,
    sqft: 5200,
    completionYear: 2024,
    developer: 'Emaar Properties',
    isNewLaunch: false,
    isFeatured: true,
    roiEstimate: '8.1% Yield',
    images: [
      HERO_IMAGE,
      APARTMENT_MARINA_IMAGE,
      VILLA_PALM_IMAGE,
    ],
    description: 'Directly positioned along the serene waters of Dubai Creek with uninterrupted views of the Ras Al Khor wildlife sanctuary and the Downtown skyline across the bay. Features a private courtyard, direct jetty access, and contemporary light-filled layout with organic stone details.',
    features: [
      'Direct Creek Promenade & Yacht Berth Access',
      'Sanctuary Nature Reserve & Flamingos Views',
      'Private Landscaped Waterfront Courtyard',
      'Double Height Glass Living Pavilion'
    ],
    amenities: [
      'Creek View',
      'Marina Access',
      'Private Garden',
      'Covered Parking',
      '24/7 Security',
      'Community Park'
    ],
    coordinates: { lat: 25.1955, lng: 55.3524 },
    agent: {
      name: 'Soraya Mansoor',
      role: 'Senior Partner, Penthouses & Off-Market',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      phone: '+971 4 821 9901',
      whatsapp: '+971 50 987 6543',
      email: 'soraya.m@hsestate.ae',
      languages: ['English', 'Arabic', 'Russian'],
      reraNumber: 'BRN 39104'
    }
  },
  {
    id: 'hs-marina-07',
    title: 'Marina Heights Executive Two-Bedroom',
    slug: 'marina-heights-executive-two-bedroom',
    purpose: 'buy',
    type: 'Apartment',
    priceAed: 1450000,
    location: 'Al Marsa Street, Dubai Marina',
    neighborhood: 'Dubai Marina',
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1280,
    completionYear: 2022,
    developer: 'Emaar Properties',
    isNewLaunch: false,
    isFeatured: true,
    roiEstimate: '8.2% Net Yield',
    images: [
      APARTMENT_MARINA_IMAGE,
      HERO_IMAGE,
    ],
    description: 'An immaculate high-floor two-bedroom residence in Dubai Marina priced under 1.5M AED. Features a generous balcony with partial canal view, contemporary kitchen with Bosch appliances, and walkable access to Marina Mall and the DMCC Metro station.',
    features: [
      'Priced under 1.5M AED for prime turnkey marina acquisition',
      'Walkable 4 minutes to DMCC Metro Station & Marina Promenade',
      'High rental demand yielding over 8% net return',
      'Allocated basement parking bay'
    ],
    amenities: [
      'Swimming Pool',
      'Gym & Wellness Suite',
      'Marina Access',
      '24/7 Security',
      'Concierge 24/7',
      'Covered Parking'
    ],
    coordinates: { lat: 25.0765, lng: 55.1399 },
    agent: {
      name: 'Alexander Sterling',
      role: 'Managing Director, Ultra-Prime Advisory',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
      phone: '+971 4 821 9900',
      whatsapp: '+971 50 123 4567',
      email: 'alexander.s@hsestate.ae',
      languages: ['English', 'German'],
      reraNumber: 'BRN 48291'
    }
  },
  {
    id: 'hs-hills-08',
    title: 'Fairway Serenity Villa with Private Pool',
    slug: 'fairway-serenity-villa-dubai-hills-estate',
    purpose: 'buy',
    type: 'Villa',
    priceAed: 18500000,
    location: 'Fairways Vistas, Dubai Hills Estate',
    neighborhood: 'Dubai Hills Estate',
    bedrooms: 5,
    bathrooms: 6,
    sqft: 6900,
    plotSqft: 8500,
    completionYear: 2024,
    developer: 'Emaar Properties',
    isExclusive: true,
    isFeatured: true,
    roiEstimate: '7.4% Net Yield',
    images: [
      MANSION_EMIRATES_IMAGE,
      VILLA_PALM_IMAGE,
      HERO_IMAGE,
    ],
    description: 'Modern minimalist luxury villa in Dubai Hills Estate overlooking the 18-hole championship golf course. Built with German Reynaers glazing, a sunken outdoor barbecue lounge, private temperature-controlled infinity pool, and double-height foyer.',
    features: [
      'Private Custom Swimming Pool with Baja Shelf',
      'Direct Front-Row Fairway & Downtown Skyline Vistas',
      'Italian Travertine Stone Finishing & Poggenpohl Kitchen',
      'Private Landscaped Garden with Mature Palms'
    ],
    amenities: [
      'Private Pool',
      'Swimming Pool',
      'Golf Course Frontage',
      'Private Garden',
      'Smart Home',
      'Staff Quarters',
      'Covered Parking'
    ],
    coordinates: { lat: 25.1112, lng: 55.2534 },
    agent: {
      name: 'Alexander Sterling',
      role: 'Managing Director, Ultra-Prime Advisory',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
      phone: '+971 4 821 9900',
      whatsapp: '+971 50 123 4567',
      email: 'alexander.s@hsestate.ae',
      languages: ['English', 'German'],
      reraNumber: 'BRN 48291'
    }
  },
  {
    id: 'hs-creek-09',
    title: 'Creek Horizon Waterfront Suite',
    slug: 'creek-horizon-waterfront-suite',
    purpose: 'rent',
    type: 'Apartment',
    priceAed: 95000,
    rentalPeriod: 'year',
    location: 'Creek Island, Dubai Creek Harbour',
    neighborhood: 'Dubai Creek Harbour',
    bedrooms: 1,
    bathrooms: 2,
    sqft: 850,
    completionYear: 2023,
    developer: 'Emaar Properties',
    isFeatured: false,
    images: [
      HERO_IMAGE,
      APARTMENT_MARINA_IMAGE,
    ],
    description: 'Chic 1-bedroom waterfront apartment available for annual lease at 95,000 AED per year. Positioned along the Dubai Creek marina boardwalk with floor-to-ceiling glass and full park views.',
    features: [
      'Under 100,000 AED annual rent in premier master community',
      'Walkable to Creek Marina Yacht Club & Central Park',
      'Built-in wardrobes & open-concept kitchen',
      'Chiller-free cooling included'
    ],
    amenities: [
      'Swimming Pool',
      'Gym & Wellness Suite',
      'Creek View',
      '24/7 Security',
      'Covered Parking'
    ],
    coordinates: { lat: 25.1988, lng: 55.3501 },
    agent: {
      name: 'Soraya Mansoor',
      role: 'Senior Partner, Penthouses & Off-Market',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      phone: '+971 4 821 9901',
      whatsapp: '+971 50 987 6543',
      email: 'soraya.m@hsestate.ae',
      languages: ['English', 'Arabic'],
      reraNumber: 'BRN 39104'
    }
  },
  {
    id: 'hs-palm-10',
    title: 'The Azure Sea Sky Penthouse',
    slug: 'azure-sea-sky-penthouse-palm-jumeirah',
    purpose: 'buy',
    type: 'Penthouse',
    priceAed: 26000000,
    location: 'Crescent West, Palm Jumeirah',
    neighborhood: 'Palm Jumeirah',
    bedrooms: 3,
    bathrooms: 4,
    sqft: 4600,
    completionYear: 2024,
    developer: 'Omniyat',
    isExclusive: true,
    isFeatured: true,
    roiEstimate: '8.0% Net Yield',
    images: [
      VILLA_PALM_IMAGE,
      PENTHOUSE_DOWNTOWN_IMAGE,
      HERO_IMAGE,
    ],
    description: 'A 3-bedroom crown penthouse on Palm Jumeirah offering unbroken turquoise Arabian Sea and Dubai Marina skyline views. Features private sky pool on the terrace, Gaggenau kitchen, and private beach club access.',
    features: [
      'Unbroken 270-degree Arabian Gulf Sea Views',
      'Private Terrace Sky Pool & Sunset Cabana',
      '3 Generous En-Suite Bedrooms with Walk-In Dressing Rooms',
      'Direct Private Beachfront & Valet Concierge'
    ],
    amenities: [
      'Sea View',
      'Private Beach',
      'Private Pool',
      'Swimming Pool',
      'Concierge 24/7',
      'Valet Parking',
      'Smart Home'
    ],
    coordinates: { lat: 25.1221, lng: 55.1189 },
    agent: {
      name: 'Alexander Sterling',
      role: 'Managing Director, Ultra-Prime Advisory',
      photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=80',
      phone: '+971 4 821 9900',
      whatsapp: '+971 50 123 4567',
      email: 'alexander.s@hsestate.ae',
      languages: ['English', 'German'],
      reraNumber: 'BRN 48291'
    }
  }
];

export const DUBAI_NEIGHBORHOODS: Neighborhood[] = [
  {
    id: 'palm-jumeirah',
    name: 'Palm Jumeirah',
    tagline: 'World-Renowned Island of Palatial Beachfront Villas',
    description: 'An iconic engineering marvel offering private beachfront sanctuaries, world-class resort dining, and signature private fronds guarded 24/7.',
    avgPricePerSqft: 4650,
    image: VILLA_PALM_IMAGE,
    propertyCount: 142,
    popularFor: ['Private Frond Villas', 'Atlantis Royal Penthouse', 'Beachfront Living']
  },
  {
    id: 'downtown-dubai',
    name: 'Downtown Dubai',
    tagline: 'The Epicenter of Dubai Luxury, Culture & Burj Khalifa',
    description: 'Home to the Burj Khalifa, Dubai Mall, and Dubai Opera. The undisputed epicenter for duplex penthouses and cosmopolitan prestige.',
    avgPricePerSqft: 3820,
    image: PENTHOUSE_DOWNTOWN_IMAGE,
    propertyCount: 215,
    popularFor: ['Burj Khalifa Views', 'Dubai Opera District', 'Sky Penthouses']
  },
  {
    id: 'dubai-marina',
    name: 'Dubai Marina',
    tagline: 'Vibrant Waterfront Riviera with Premier Yacht Havens',
    description: 'Lined with high-end restaurants, private yacht berths, and gleaming glass high-rises commanding views of the Arabian Sea and Bluewaters.',
    avgPricePerSqft: 2450,
    image: APARTMENT_MARINA_IMAGE,
    propertyCount: 184,
    popularFor: ['Yacht Berths', 'Marina Promenade', 'High-Yield Rentals']
  },
  {
    id: 'emirates-hills',
    name: 'Emirates Hills',
    tagline: 'The Secluded Ultra-Prime Sanctuary for Global Leaders',
    description: 'Often dubbed Dubai’s Beverly Hills, Emirates Hills features ultra-exclusive gated estates overlooking the championship Montgomerie golf fairways.',
    avgPricePerSqft: 5200,
    image: MANSION_EMIRATES_IMAGE,
    propertyCount: 38,
    popularFor: ['Championship Golf', 'Custom Mega-Mansions', 'Total Seclusion']
  },
  {
    id: 'difc',
    name: 'DIFC',
    tagline: 'Global Financial Hub with Michelin-Starred Living',
    description: 'The preferred residential haven for international finance executives, private equity leaders, and contemporary art collectors.',
    avgPricePerSqft: 3100,
    image: HERO_IMAGE,
    propertyCount: 96,
    popularFor: ['Michelin Dining', 'Gate Village Art', 'Executive Pied-à-terre']
  },
  {
    id: 'dubai-creek-harbour',
    name: 'Dubai Creek Harbour',
    tagline: 'The Future Horizon of Sustainable Waterfront Elegance',
    description: 'A masterfully planned modern district facing the historic creek and skyline, blending vast parks, marinas, and sanctuary vistas.',
    avgPricePerSqft: 2280,
    image: HERO_IMAGE,
    propertyCount: 160,
    popularFor: ['Flamingo Sanctuary', 'Waterfront Esplanades', 'Capital Growth']
  }
];

export const NEW_DEVELOPMENTS: Development[] = [
  {
    id: 'dev-01',
    name: 'The Lana Residences, Dorchester Collection',
    developer: 'Omniyat',
    location: 'Marasi Marina, Business Bay',
    handover: 'Q4 2026',
    startingPriceAed: 28000000,
    paymentPlan: '60/40 Payment Structure',
    projectType: 'Branded Ultra-Luxury Residences',
    image: PENTHOUSE_DOWNTOWN_IMAGE,
    projectHighlights: [
      'Interior Architecture by Gilles & Boissier',
      'Dorchester Collection 5-Star White-Glove Hospitality',
      'Private 200m Marina Boardwalk & Yacht Berths',
      'Only 39 Ultra-Exclusive Bespoke Suites'
    ]
  },
  {
    id: 'dev-02',
    name: 'Palm Flower by Norman Foster',
    developer: 'Alpago Properties',
    location: 'Palm Jumeirah West Crescent',
    handover: 'Q2 2027',
    startingPriceAed: 95000000,
    paymentPlan: '50/50 Handover Linked',
    projectType: 'Architectural Trophy Residences',
    image: VILLA_PALM_IMAGE,
    projectHighlights: [
      'Designed by Pritzker-Laureate Foster + Partners',
      'Each Unit Occupies Full Floor with Private Lap Pool',
      'Double-Height Terraces with 360 Sea & Palm Panoramas',
      'Direct Private Beach Haven'
    ]
  },
  {
    id: 'dev-03',
    name: 'Creek Waters Premier Collection',
    developer: 'Emaar Properties',
    location: 'Creek Island, Dubai Creek Harbour',
    handover: 'Q1 2027',
    startingPriceAed: 4500000,
    paymentPlan: '80/20 Construction Linked',
    projectType: 'High-Yield Off-Plan Waterfont',
    image: HERO_IMAGE,
    projectHighlights: [
      'Unbroken Skyline & Ras Al Khor Views',
      'Estimated 8.5% Net Rental Yield',
      'Direct Creek Marina Promenade Access',
      'Eligible for 10-Year UAE Golden Visa'
    ]
  }
];

export const SAMPLE_TESTIMONIALS = [
  {
    quote: "Acquiring our family compound on Palm Jumeirah through HS ESTATE was seamless. Alexander and his advisory team handled our cross-border capital structuring with absolute discretion, securing an off-market frond villa before it reached public listings.",
    author: "Maximilian Von Bernstorff",
    role: "Managing Partner, Alpine Private Capital",
    location: "Zurich, Switzerland",
    verifiedType: "Verified Palm Jumeirah Villa Buyer"
  },
  {
    quote: "HS ESTATE’s quantitative analysis of Dubai rental yields vs London was the deciding factor. We allocated 45M AED across Downtown duplexes and DIFC executive apartments. The post-purchase property management yields 9.1% net consistently.",
    author: "Elena Rostova",
    role: "Principal, Rostova Family Office",
    location: "London, United Kingdom",
    verifiedType: "Verified Portfolio Investor"
  },
  {
    quote: "As a US technology founder relocating to the Emirates, their expedited Golden Visa facilitation desk and VIP private viewings made the entire move stress-free. There is simply no comparable luxury brokerage in the GCC.",
    author: "David Vance",
    role: "Founder & CEO, Horizon Cloud",
    location: "Austin, TX / Dubai",
    verifiedType: "Verified Emirates Hills Buyer"
  }
];

export const SAMPLE_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-101',
    propertyId: 'hs-palm-01',
    propertyTitle: 'The Solstice Royal Beachfront Villa',
    userName: 'Lord Charles Montgomery',
    userEmail: 'c.montgomery@mayfairtrust.co.uk',
    userPhone: '+44 20 7946 0912',
    inquiryType: 'Viewing',
    preferredDate: '2026-11-04 at 16:30 GST',
    message: 'Seeking a private confidential viewing during our Dubai family office delegation visit.',
    status: 'Viewing Scheduled',
    createdAt: '2026-10-18'
  },
  {
    id: 'inq-102',
    propertyId: 'hs-downtown-02',
    propertyTitle: 'The Sky Palace Duplex Penthouse',
    userName: 'Dr. Tariq Al-Hashimi',
    userEmail: 'tariq.hashimi@gulfcapital.ae',
    userPhone: '+971 50 334 1122',
    inquiryType: 'Brochure',
    preferredDate: 'Immediate',
    message: 'Requesting the detailed architectural spec sheet, service charges, and escrow account details.',
    status: 'Contacted',
    createdAt: '2026-10-19'
  },
  {
    id: 'inq-103',
    propertyId: 'hs-emirates-04',
    propertyTitle: 'The Elysian Golf Sanctuary Estate',
    userName: 'Siddharth Mehra',
    userEmail: 's.mehra@apexventures.sg',
    userPhone: '+65 6789 0123',
    inquiryType: 'Investment Consultation',
    preferredDate: '2026-10-25 at 11:00 GST',
    message: 'Interested in UAE Golden Visa eligibility for secondary dependents and corporate structuring.',
    status: 'New',
    createdAt: '2026-10-20'
  }
];

export const CURRENT_USER: UserProfile = {
  id: 'usr-vip-001',
  name: 'Marcus Sterling',
  email: 'm.sterling@sterling-holdings.ch',
  phone: '+41 79 123 4567',
  role: 'investor',
  investorType: 'Family Office',
  targetBudgetAed: 50000000,
  preferredAreas: ['Palm Jumeirah', 'Downtown Dubai', 'Emirates Hills'],
  savedPropertyIds: ['hs-palm-01', 'hs-downtown-02']
};
