-- ==============================================================================
-- HS ESTATE DUBAI - PRODUCTION POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY
-- ==============================================================================

-- 1. Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Roles Table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO public.user_roles (name, description) VALUES
    ('admin', 'Managing Partner & System Administrator with full inventory control'),
    ('broker', 'Licensed Dubai RERA Broker with client lead access'),
    ('investor', 'High-Net-Worth Individual or Family Office investor account'),
    ('buyer', 'Standard property buyer or tenant')
ON CONFLICT (name) DO NOTHING;

-- 3. User Profiles Table (Linked to Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL DEFAULT 'investor' CHECK (role IN ('admin', 'broker', 'investor', 'buyer')),
    full_name TEXT,
    phone TEXT,
    investor_type TEXT DEFAULT 'Individual HNW' CHECK (investor_type IN ('Individual HNW', 'Family Office', 'Institutional')),
    target_budget_aed NUMERIC DEFAULT 25000000,
    preferred_areas TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Trigger to auto-create public.user_profiles on auth.users insert
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.user_profiles (id, full_name, phone, role, investor_type)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'VIP Private Client'),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        COALESCE(NEW.raw_user_meta_data->>'role', 'investor'),
        COALESCE(NEW.raw_user_meta_data->>'investor_type', 'Individual HNW')
    )
    ON CONFLICT (id) DO UPDATE
    SET full_name = EXCLUDED.full_name;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Helper function to check if current authenticated user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.user_profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Properties Table
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    purpose TEXT NOT NULL CHECK (purpose IN ('buy', 'rent', 'invest')),
    property_type TEXT NOT NULL CHECK (property_type IN ('Villa', 'Penthouse', 'Apartment', 'Mansion', 'Townhouse')),
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('published', 'draft', 'under_offer', 'sold')),
    price_aed NUMERIC NOT NULL CHECK (price_aed > 0),
    rental_period TEXT CHECK (rental_period IN ('year', 'month')),
    location TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    bedrooms INTEGER NOT NULL CHECK (bedrooms >= 0),
    bathrooms INTEGER NOT NULL CHECK (bathrooms >= 0),
    sqft INTEGER NOT NULL CHECK (sqft > 0),
    plot_sqft INTEGER,
    completion_year INTEGER,
    developer TEXT,
    is_exclusive BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_new_launch BOOLEAN DEFAULT false,
    roi_estimate TEXT,
    description TEXT NOT NULL,
    features TEXT[] DEFAULT '{}',
    amenities TEXT[] DEFAULT '{}',
    latitude NUMERIC,
    longitude NUMERIC,
    agent_name TEXT NOT NULL DEFAULT 'Alexander Sterling',
    agent_role TEXT NOT NULL DEFAULT 'Managing Director, Ultra-Prime Advisory',
    agent_photo TEXT,
    agent_phone TEXT NOT NULL DEFAULT '+971 4 821 9900',
    agent_whatsapp TEXT NOT NULL DEFAULT '+971 50 123 4567',
    agent_email TEXT NOT NULL DEFAULT 'private.desk@hsestate.ae',
    agent_languages TEXT[] DEFAULT ARRAY['English', 'Arabic', 'French'],
    agent_rera_number TEXT NOT NULL DEFAULT 'BRN 48291',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_properties_neighborhood ON public.properties (neighborhood);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON public.properties (property_type);
CREATE INDEX IF NOT EXISTS idx_properties_price_aed ON public.properties (price_aed);
CREATE INDEX IF NOT EXISTS idx_properties_purpose ON public.properties (purpose);
CREATE INDEX IF NOT EXISTS idx_properties_status ON public.properties (status);

-- 5. Property Images Table
CREATE TABLE IF NOT EXISTS public.property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON public.property_images (property_id, display_order);

-- 6. Favorites Table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, property_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites (user_id);

-- 7. Saved Searches Table
CREATE TABLE IF NOT EXISTS public.saved_searches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    search_name TEXT NOT NULL,
    filters JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_saved_searches_user_id ON public.saved_searches (user_id);

-- 8. Property Inquiries Table
CREATE TABLE IF NOT EXISTS public.property_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    user_email TEXT NOT NULL,
    user_phone TEXT NOT NULL,
    inquiry_type TEXT NOT NULL CHECK (inquiry_type IN ('Viewing', 'Brochure', 'Investment Consultation', 'General')),
    preferred_date TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Viewing Scheduled', 'Closed')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_user_id ON public.property_inquiries (user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_property_id ON public.property_inquiries (property_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.property_inquiries (status);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_searches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_inquiries ENABLE ROW LEVEL SECURITY;

-- 1. user_roles: Anyone can read roles
CREATE POLICY "Public user roles are viewable by everyone" 
    ON public.user_roles FOR SELECT USING (true);

-- 2. user_profiles:
CREATE POLICY "Users can view their own profile or admins view all"
    ON public.user_profiles FOR SELECT
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update their own profile"
    ON public.user_profiles FOR UPDATE
    USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can insert their own profile"
    ON public.user_profiles FOR INSERT
    WITH CHECK (auth.uid() = id OR public.is_admin());

-- 3. properties:
CREATE POLICY "Published properties are viewable by everyone"
    ON public.properties FOR SELECT
    USING (status = 'published' OR public.is_admin());

CREATE POLICY "Admins can insert properties"
    ON public.properties FOR INSERT
    WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update properties"
    ON public.properties FOR UPDATE
    USING (public.is_admin());

CREATE POLICY "Admins can delete properties"
    ON public.properties FOR DELETE
    USING (public.is_admin());

-- 4. property_images:
CREATE POLICY "Images of published properties viewable by everyone"
    ON public.property_images FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.properties
            WHERE properties.id = property_images.property_id
            AND (properties.status = 'published' OR public.is_admin())
        )
    );

CREATE POLICY "Admins can manage property images"
    ON public.property_images FOR ALL
    USING (public.is_admin());

-- 5. favorites:
CREATE POLICY "Users can view only their own favorites"
    ON public.favorites FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own favorites"
    ON public.favorites FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
    ON public.favorites FOR DELETE
    USING (auth.uid() = user_id);

-- 6. saved_searches:
CREATE POLICY "Users can view only their own saved searches"
    ON public.saved_searches FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own saved searches"
    ON public.saved_searches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved searches"
    ON public.saved_searches FOR DELETE
    USING (auth.uid() = user_id);

-- 7. property_inquiries:
-- Any client (authenticated or guest) can submit an inquiry
CREATE POLICY "Anyone can insert an inquiry"
    ON public.property_inquiries FOR INSERT
    WITH CHECK (true);

-- Users can view their own inquiries; Admins can view all inquiries
CREATE POLICY "Users can view their own inquiries or admins view all"
    ON public.property_inquiries FOR SELECT
    USING (
        (auth.uid() IS NOT NULL AND auth.uid() = user_id)
        OR public.is_admin()
    );

-- Only admins can update inquiries (e.g. status, admin_notes)
CREATE POLICY "Admins can update inquiries"
    ON public.property_inquiries FOR UPDATE
    USING (public.is_admin());
