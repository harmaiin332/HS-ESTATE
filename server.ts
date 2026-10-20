import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser
app.use(express.json());

// Supabase Server Admin Client (Uses SERVICE_ROLE_KEY if provided for secure server-side operations)
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

const isSupabaseConfigured = Boolean(supabaseUrl && supabaseUrl.startsWith('http') && supabaseServiceRoleKey);

const supabaseAdmin = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

import {
  isGeminiAvailable,
  extractSearchFiltersWithAI,
  filterDatabaseProperties,
  chatWithPropertyAdvisor,
  generatePersonalizedRecommendations
} from './server/aiService.ts';
import { SAMPLE_PROPERTIES } from './src/data/mockData.ts';
import { Property } from './src/types/index.ts';

// Helper to retrieve properties from Supabase or fallback
async function getCatalogProperties(): Promise<Property[]> {
  if (supabaseAdmin) {
    try {
      const { data, error } = await supabaseAdmin
        .from('properties')
        .select('*, property_images(image_url, display_order)')
        .eq('status', 'published');

      if (!error && data && data.length > 0) {
        return data.map((row: any) => {
          const imgs = (row.property_images || [])
            .sort((a: any, b: any) => a.display_order - b.display_order)
            .map((img: any) => img.image_url);

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
            images: imgs.length > 0 ? imgs : [SAMPLE_PROPERTIES[0].images[0]],
            agent: {
              name: row.agent_name || 'Alexander Sterling',
              role: row.agent_role || 'Managing Director, Ultra-Prime Advisory',
              photo: row.agent_photo || SAMPLE_PROPERTIES[0].agent.photo,
              phone: row.agent_phone || '+971 4 821 9900',
              whatsapp: row.agent_whatsapp || '+971 50 123 4567',
              email: row.agent_email || 'private.desk@hsestate.ae',
              languages: row.agent_languages || ['English', 'German'],
              reraNumber: row.agent_rera_number || 'BRN 48291',
            },
          };
        });
      }
    } catch (e) {
      console.warn('Supabase catalog fetch error in server, using sample properties:', e);
    }
  }
  return SAMPLE_PROPERTIES;
}

// Simple in-memory rate limiter (sliding window by IP)
const requestRateMap = new Map<string, { count: number; timestamp: number }>();
const checkRateLimit = (req: Request, maxPerMinute = 40): boolean => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const entry = requestRateMap.get(ip);

  if (!entry || now - entry.timestamp > 60000) {
    requestRateMap.set(ip, { count: 1, timestamp: now });
    return true;
  }

  if (entry.count >= maxPerMinute) {
    return false;
  }

  entry.count++;
  return true;
};

// ==============================================================================
// PUBLIC API ROUTES
// ==============================================================================

// Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'HS ESTATE Dubai Luxury Real Estate',
    supabaseConnected: isSupabaseConfigured,
    geminiConfigured: isGeminiAvailable(),
    time: new Date().toISOString(),
  });
});

// System Status (Safe public exposure of configuration state)
app.get('/api/status', (req: Request, res: Response) => {
  res.json({
    isSupabaseConfigured,
    isGeminiConfigured: isGeminiAvailable(),
    supabaseUrl: isSupabaseConfigured ? supabaseUrl.replace(/(\/\/[^:]+:)[^@]+@/, '$1***@') : null,
  });
});

// ==============================================================================
// FEATURE 1: AI PROPERTY SEARCH (NATURAL LANGUAGE -> STRUCTURED EXTRACTION -> DB MATCH)
// ==============================================================================
app.post('/api/ai/search', async (req: Request, res: Response) => {
  if (!checkRateLimit(req)) {
    return res.status(429).json({ error: 'Request threshold reached. Please wait a moment.' });
  }

  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return res.status(400).json({ error: 'A natural language search query is required.' });
    }

    if (query.length > 500) {
      return res.status(400).json({ error: 'Search query exceeds maximum allowed length (500 characters).' });
    }

    // 1. Extract structured filters with Gemini AI
    const extractedFilters = await extractSearchFiltersWithAI(query.trim());

    // 2. Query real properties from database
    const allProperties = await getCatalogProperties();

    // 3. Filter database records strictly with validated parameters
    const matchingProperties = filterDatabaseProperties(allProperties, extractedFilters);

    return res.json({
      success: true,
      query: query.trim(),
      extractedFilters,
      properties: matchingProperties,
      totalMatches: matchingProperties.length,
      aiGrounded: isGeminiAvailable(),
    });
  } catch (err: any) {
    console.error('AI Property Search API Error:', err);
    res.status(500).json({
      error: 'An error occurred processing your property search.',
      details: err.message,
    });
  }
});

// ==============================================================================
// FEATURE 2: HS PROPERTY ASSISTANT (CONVERSATIONAL GROUNDED AI ADVISOR)
// ==============================================================================
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  if (!checkRateLimit(req)) {
    return res.status(429).json({ error: 'Request threshold reached. Please wait a moment.' });
  }

  try {
    const { message, history = [], propertyIdContext } = req.body;
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'User message is required.' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message exceeds maximum length (1000 characters).' });
    }

    const allProperties = await getCatalogProperties();
    let currentProp: Property | null = null;
    if (propertyIdContext) {
      currentProp = allProperties.find((p) => p.id === propertyIdContext || p.slug === propertyIdContext) || null;
    }

    const advisorResponse = await chatWithPropertyAdvisor(
      Array.isArray(history) ? history : [],
      message.trim(),
      allProperties,
      currentProp
    );

    return res.json({
      success: true,
      ...advisorResponse,
    });
  } catch (err: any) {
    console.error('AI Property Chat API Error:', err);
    res.status(500).json({
      error: 'Failed to complete assistant request.',
      details: err.message,
    });
  }
});

// ==============================================================================
// FEATURE 3: PERSONALIZED RECOMMENDATIONS (GROUNDED EXPLANATIONS & FALLBACK)
// ==============================================================================
app.post('/api/ai/recommendations', async (req: Request, res: Response) => {
  if (!checkRateLimit(req)) {
    return res.status(429).json({ error: 'Request threshold reached. Please wait a moment.' });
  }

  try {
    const { userProfile = {} } = req.body;
    const allProperties = await getCatalogProperties();

    const result = await generatePersonalizedRecommendations(userProfile, allProperties);

    return res.json({
      success: true,
      recommendations: result.recommendations,
      isAiGenerated: result.isAiGenerated,
    });
  } catch (err: any) {
    console.error('AI Recommendations API Error:', err);
    res.status(500).json({
      error: 'Failed to generate recommendations.',
      details: err.message,
    });
  }
});

// Server-side inquiry submission with rigorous validation
app.post('/api/inquiries', async (req: Request, res: Response) => {
  try {
    const { propertyId, userName, userEmail, userPhone, inquiryType, preferredDate, message } = req.body;

    // Server-side validation
    if (!userName || typeof userName !== 'string' || userName.trim().length < 2) {
      return res.status(400).json({ error: 'Valid client legal name is required.' });
    }

    if (!userEmail || typeof userEmail !== 'string' || !userEmail.includes('@')) {
      return res.status(400).json({ error: 'Valid email address is required for confidential dispatch.' });
    }

    if (!userPhone || typeof userPhone !== 'string' || userPhone.trim().length < 6) {
      return res.status(400).json({ error: 'Valid contact phone number is required.' });
    }

    const validTypes = ['Viewing', 'Brochure', 'Investment Consultation', 'General'];
    const sanitizedType = validTypes.includes(inquiryType) ? inquiryType : 'General';

    // If Supabase is connected, insert to PostgreSQL
    if (supabaseAdmin) {
      const { data, error } = await supabaseAdmin
        .from('property_inquiries')
        .insert({
          property_id: propertyId || null,
          user_name: userName.trim(),
          user_email: userEmail.trim().toLowerCase(),
          user_phone: userPhone.trim(),
          inquiry_type: sanitizedType,
          preferred_date: preferredDate || null,
          message: (message || 'Client requested private consultation.').trim(),
          status: 'New',
        })
        .select()
        .single();

      if (error) {
        console.error('Supabase inquiry insert error:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({ success: true, inquiry: data });
    }

    // In demo/offline mode, return simulated persisted success
    const mockId = 'inq-srv-' + Date.now();
    return res.status(201).json({
      success: true,
      inquiry: {
        id: mockId,
        property_id: propertyId,
        user_name: userName,
        user_email: userEmail,
        user_phone: userPhone,
        inquiry_type: sanitizedType,
        preferred_date: preferredDate,
        message,
        status: 'New',
        created_at: new Date().toISOString(),
      },
      mode: 'demo_persisted',
    });
  } catch (err: any) {
    console.error('Inquiry submission error:', err);
    res.status(500).json({ error: err.message || 'Server error processing inquiry.' });
  }
});

// ==============================================================================
// PROTECTED ADMIN API ROUTES
// ==============================================================================

// Admin token/role verification middleware
const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    // Check if development preview mode allow-list is active
    if (!isSupabaseConfigured) {
      return next(); // Permit in demo mode for UI evaluation
    }
    return res.status(401).json({ error: 'Authorization header required.' });
  }

  const token = authHeader.replace(/^Bearer\s+/i, '');
  if (!supabaseAdmin) {
    return next();
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid authentication token.' });
    }

    // Check role in user_profiles
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return res.status(403).json({ error: 'RERA Managing Partner authorization required.' });
    }

    (req as any).user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Authentication verification failure.' });
  }
};

// Admin: List all inquiries
app.get('/api/admin/inquiries', requireAdmin, async (req: Request, res: Response) => {
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('property_inquiries')
      .select('*, properties(title, location)')
      .order('created_at', { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ inquiries: data });
  }

  res.json({ inquiries: [] });
});

// Admin: Update inquiry status
app.patch('/api/admin/inquiries/:id', requireAdmin, async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, adminNotes } = req.body;

  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin
      .from('property_inquiries')
      .update({
        status,
        admin_notes: adminNotes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    return res.json({ success: true, inquiry: data });
  }

  res.json({ success: true, id, status });
});

// ==============================================================================
// VITE DEV SERVER / PRODUCTION STATIC ASSET MOUNT
// ==============================================================================

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    // Serve production build
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    // In development, mount Vite middleware Mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`[HS ESTATE] Full-stack luxury server active on http://localhost:${PORT}`);
    console.log(`[HS ESTATE] Supabase Status: ${isSupabaseConfigured ? 'CONNECTED' : 'STANDBY (Awaiting VITE_SUPABASE_URL)'}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to initialize HS ESTATE server:', err);
});
