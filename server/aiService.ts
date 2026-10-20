import dotenv from 'dotenv';
dotenv.config();

import { GoogleGenAI, Type } from '@google/genai';
import { Property, UserProfile } from '../src/types';
import { SAMPLE_PROPERTIES } from '../src/data/mockData';
export { SAMPLE_PROPERTIES };

// Lazy client accessor to ensure environment variables are read dynamically
export function getGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY || '';
  return key;
}

export function isGeminiAvailable(): boolean {
  const key = getGeminiApiKey();
  return Boolean(key && key.trim().length > 5 && !key.includes('MY_GEMINI_API_KEY'));
}

export const isGeminiConfigured = isGeminiAvailable();

export function getAiClient(): GoogleGenAI | null {
  const key = getGeminiApiKey();
  if (key && key.trim().length > 5 && !key.includes('MY_GEMINI_API_KEY')) {
    return new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return null;
}

// ==============================================================================
// 1. STRUCTURED NATURAL LANGUAGE SEARCH EXTRACTION
// ==============================================================================

export interface ExtractedSearchFilters {
  purpose: 'buy' | 'rent' | 'invest' | 'all';
  propertyType: string;
  neighborhood: string;
  bedrooms: number | null;
  minPriceAed: number | null;
  maxPriceAed: number | null;
  amenities: string[];
  searchSummary: string;
}

export async function extractSearchFiltersWithAI(userQuery: string): Promise<ExtractedSearchFilters> {
  const ai = getAiClient();

  if (ai) {
    try {
      const prompt = `Analyze this real estate search query for Dubai, UAE and extract structured filter criteria according to the schema:
Query: "${userQuery}"

Strict Guidelines:
1. Currency & Numbers: Convert verbal amounts to AED numeric integers (e.g. "1.5 million" or "1.5M" -> 1500000, "100k" or "100,000" -> 100000, "25m" or "25 million" -> 25000000, "70m" -> 70000000).
2. Purpose: If "rent", "rental", "lease", "per year", or "/year" is specified, purpose must be 'rent'. If "buy", "purchase", "sale", set to 'buy'. If "invest", "yield", "roi", set to 'invest'. Default to 'all' if not explicitly stated.
3. Districts: Identify Dubai enclaves: "Dubai Marina", "Palm Jumeirah", "Downtown Dubai", "Dubai Hills Estate", "Emirates Hills", "DIFC", "Dubai Creek Harbour". If none mentioned, set neighborhood to empty string.
4. Property Typology: Set to "Villa", "Penthouse", "Apartment", "Mansion", "Townhouse", or "all".
5. Bedrooms: Set to integer (e.g. 1, 2, 3, 4, 5) or null if unspecified.
6. Amenities: Extract requested features like "Swimming Pool", "Private Pool", "Sea View", "Private Beach", "Burj Khalifa View", "Gym", "Private Garden", etc.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              purpose: {
                type: Type.STRING,
                description: "buy, rent, invest, or all",
              },
              propertyType: {
                type: Type.STRING,
                description: "Villa, Penthouse, Apartment, Mansion, Townhouse, or all",
              },
              neighborhood: {
                type: Type.STRING,
                description: "Dubai district name, e.g. 'Dubai Marina', 'Palm Jumeirah', 'Dubai Hills Estate', 'Downtown Dubai', or empty string if unspecified",
              },
              bedrooms: {
                type: Type.INTEGER,
                description: "Number of bedrooms or null if unspecified",
              },
              maxPriceAed: {
                type: Type.NUMBER,
                description: "Maximum budget in AED or null if unspecified",
              },
              minPriceAed: {
                type: Type.NUMBER,
                description: "Minimum price in AED or null if unspecified",
              },
              amenities: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of requested features or amenities (e.g. ['Swimming Pool', 'Sea View'])",
              },
              searchSummary: {
                type: Type.STRING,
                description: "Concise summary of criteria identified",
              },
            },
            required: ['purpose', 'propertyType', 'neighborhood', 'amenities', 'searchSummary'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');

      // Sanitize and validate
      const validPurposes = ['buy', 'rent', 'invest', 'all'];
      const rawPurpose = parsed.purpose ? String(parsed.purpose).toLowerCase() : 'all';
      const purpose = validPurposes.includes(rawPurpose) ? (rawPurpose as any) : 'all';

      return {
        purpose,
        propertyType: parsed.propertyType || 'all',
        neighborhood: parsed.neighborhood || '',
        bedrooms: typeof parsed.bedrooms === 'number' && parsed.bedrooms > 0 ? parsed.bedrooms : null,
        minPriceAed: typeof parsed.minPriceAed === 'number' && parsed.minPriceAed > 0 ? parsed.minPriceAed : null,
        maxPriceAed: typeof parsed.maxPriceAed === 'number' && parsed.maxPriceAed > 0 ? parsed.maxPriceAed : null,
        amenities: Array.isArray(parsed.amenities) ? parsed.amenities : [],
        searchSummary: parsed.searchSummary || `AI filter parsed: "${userQuery}"`,
      };
    } catch (err) {
      console.warn('Gemini filter extraction fallback triggered:', err);
    }
  }

  // Deterministic Regex & Keyword Fallback Extractor
  return deterministicFilterExtraction(userQuery);
}

export function deterministicFilterExtraction(query: string): ExtractedSearchFilters {
  const q = query.toLowerCase();

  let purpose: 'buy' | 'rent' | 'invest' | 'all' = 'all';
  if (q.includes('rent') || q.includes('lease') || q.includes('per year') || q.includes('/year')) {
    purpose = 'rent';
  } else if (q.includes('buy') || q.includes('purchase') || q.includes('sale')) {
    purpose = 'buy';
  } else if (q.includes('invest') || q.includes('yield') || q.includes('roi')) {
    purpose = 'invest';
  }

  let propertyType = 'all';
  if (q.includes('penthouse')) propertyType = 'Penthouse';
  else if (q.includes('villa')) propertyType = 'Villa';
  else if (q.includes('apartment') || q.includes('flat') || q.includes('suite')) propertyType = 'Apartment';
  else if (q.includes('mansion')) propertyType = 'Mansion';
  else if (q.includes('townhouse')) propertyType = 'Townhouse';

  let neighborhood = '';
  if (q.includes('palm jumeirah') || q.includes('palm')) neighborhood = 'Palm Jumeirah';
  else if (q.includes('dubai hills estate') || q.includes('dubai hills')) neighborhood = 'Dubai Hills Estate';
  else if (q.includes('dubai marina') || q.includes('marina')) neighborhood = 'Dubai Marina';
  else if (q.includes('downtown')) neighborhood = 'Downtown Dubai';
  else if (q.includes('emirates hills')) neighborhood = 'Emirates Hills';
  else if (q.includes('difc')) neighborhood = 'DIFC';
  else if (q.includes('creek') || q.includes('creek harbour')) neighborhood = 'Dubai Creek Harbour';

  // Bedrooms
  let bedrooms: number | null = null;
  const bedMatch = q.match(/(\d+)\s*(?:-|–|\s)?(?:bed|bedroom|br)/i);
  if (bedMatch) {
    bedrooms = parseInt(bedMatch[1], 10);
  } else if (q.includes('one bedroom') || q.includes('1 bedroom') || q.includes('1-bedroom')) bedrooms = 1;
  else if (q.includes('two bedroom') || q.includes('2 bedroom') || q.includes('2-bedroom')) bedrooms = 2;
  else if (q.includes('three bedroom') || q.includes('3 bedroom') || q.includes('3-bedroom')) bedrooms = 3;
  else if (q.includes('four bedroom') || q.includes('4 bedroom') || q.includes('4-bedroom')) bedrooms = 4;
  else if (q.includes('five bedroom') || q.includes('5 bedroom') || q.includes('5-bedroom')) bedrooms = 5;

  // Max Price (AED)
  let maxPriceAed: number | null = null;
  const millionMatch = q.match(/(?:under|<|below|max|up to)?\s*(?:aed|dhs)?\s*(\d+(?:\.\d+)?)\s*(?:million|m\b)/i);
  const thousandMatch = q.match(/(?:under|<|below|max|up to)?\s*(?:aed|dhs)?\s*(\d+(?:,\d+)?)\s*(?:thousand|k\b)/i);
  const rawNumMatch = q.match(/(?:under|<|below|max|up to)\s*(?:aed|dhs)?\s*(\d{1,3}(?:,\d{3})+|\d{5,})/i);

  if (millionMatch) {
    maxPriceAed = parseFloat(millionMatch[1]) * 1000000;
  } else if (thousandMatch) {
    maxPriceAed = parseFloat(thousandMatch[1].replace(/,/g, '')) * 1000;
  } else if (rawNumMatch) {
    maxPriceAed = parseFloat(rawNumMatch[1].replace(/,/g, ''));
  }

  // Amenities
  const amenities: string[] = [];
  if (q.includes('pool') || q.includes('swimming')) amenities.push('Swimming Pool');
  if (q.includes('sea view') || q.includes('ocean view') || q.includes('water view')) amenities.push('Sea View');
  if (q.includes('beach') || q.includes('beachfront')) amenities.push('Private Beach');
  if (q.includes('burj') || q.includes('khalifa')) amenities.push('Burj Khalifa View');
  if (q.includes('golf')) amenities.push('Golf Course Frontage');
  if (q.includes('garden')) amenities.push('Private Garden');

  return {
    purpose,
    propertyType,
    neighborhood,
    bedrooms,
    minPriceAed: null,
    maxPriceAed,
    amenities,
    searchSummary: `Criteria: ${propertyType !== 'all' ? propertyType : 'Properties'}${neighborhood ? ` in ${neighborhood}` : ''}${bedrooms ? `, ${bedrooms} beds` : ''}${maxPriceAed ? `, under ${maxPriceAed.toLocaleString()} AED` : ''}${amenities.length > 0 ? ` with ${amenities.join(', ')}` : ''}`,
  };
}

// Safely filter verified properties from database
export function filterDatabaseProperties(
  allProperties: Property[],
  filters: ExtractedSearchFilters
): Property[] {
  return allProperties.filter((p) => {
    // Purpose filter
    if (filters.purpose !== 'all' && p.purpose !== filters.purpose) {
      return false;
    }

    // Property Type
    if (filters.propertyType && filters.propertyType !== 'all') {
      const typeLower = filters.propertyType.toLowerCase();
      if (!p.type.toLowerCase().includes(typeLower)) {
        return false;
      }
    }

    // Neighborhood
    if (filters.neighborhood && filters.neighborhood.trim()) {
      const nLower = filters.neighborhood.toLowerCase();
      const matchLoc =
        p.neighborhood.toLowerCase().includes(nLower) ||
        p.location.toLowerCase().includes(nLower);
      if (!matchLoc) return false;
    }

    // Bedrooms
    if (filters.bedrooms !== null) {
      if (filters.bedrooms >= 5) {
        if (p.bedrooms < 5) return false;
      } else {
        if (p.bedrooms !== filters.bedrooms) return false;
      }
    }

    // Price Max
    if (filters.maxPriceAed !== null && filters.maxPriceAed > 0) {
      if (p.priceAed > filters.maxPriceAed) {
        return false;
      }
    }

    // Price Min
    if (filters.minPriceAed !== null && filters.minPriceAed > 0) {
      if (p.priceAed < filters.minPriceAed) {
        return false;
      }
    }

    // Amenities match
    if (filters.amenities && filters.amenities.length > 0) {
      const propAmenitiesLower = (p.amenities || []).map((a) => a.toLowerCase());
      const propFeaturesLower = (p.features || []).map((f) => f.toLowerCase());
      const descLower = (p.description || '').toLowerCase();
      const titleLower = (p.title || '').toLowerCase();
      const combined = [...propAmenitiesLower, ...propFeaturesLower, descLower, titleLower];

      const hasMatchingAmenity = filters.amenities.some((req) => {
        const reqLower = req.toLowerCase();
        if (reqLower.includes('pool') || reqLower.includes('swimming')) {
          return combined.some((c) => c.includes('pool') || c.includes('swimming'));
        }
        if (reqLower.includes('sea view') || reqLower.includes('ocean')) {
          return combined.some((c) => c.includes('sea view') || c.includes('arabian sea') || c.includes('ocean') || c.includes('waterfront'));
        }
        if (reqLower.includes('beach')) {
          return combined.some((c) => c.includes('beach') || c.includes('frond'));
        }
        if (reqLower.includes('golf')) {
          return combined.some((c) => c.includes('golf') || c.includes('montgomerie') || c.includes('fairway'));
        }
        return combined.some((c) => c.includes(reqLower));
      });

      if (!hasMatchingAmenity) return false;
    }

    return true;
  });
}

// ==============================================================================
// 2. HS PROPERTY ASSISTANT (CONVERSATIONAL GROUNDED ADVISORY)
// ==============================================================================

export interface ChatMessageContext {
  role: 'user' | 'model';
  text: string;
}

export interface AssistantChatResponse {
  reply: string;
  matchedProperties: Property[];
  clarifyingQuestion: string | null;
  suggestedQuestions: string[];
  showContactAgentOption: boolean;
  isAiGrounded: boolean;
}

export async function chatWithPropertyAdvisor(
  history: ChatMessageContext[],
  userMessage: string,
  candidateProperties: Property[],
  currentPropertyContext?: Property | null
): Promise<AssistantChatResponse> {
  const ai = getAiClient();

  // Prepare real property catalog representation (No hallucination allowed!)
  const propertiesDigest = candidateProperties.map((p) => ({
    id: p.id,
    title: p.title,
    purpose: p.purpose,
    type: p.type,
    priceAed: p.priceAed,
    rentalPeriod: p.rentalPeriod,
    neighborhood: p.neighborhood,
    location: p.location,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    sqft: p.sqft,
    amenities: p.amenities,
    roiEstimate: p.roiEstimate,
    agent: `${p.agent.name} (${p.agent.role})`,
  }));

  if (ai) {
    try {
      const systemInstruction = `You are the Senior Property Advisor at HS ESTATE, an elite luxury real estate brokerage in Dubai, UAE.
You provide sophisticated, highly articulate counsel to international buyers, family offices, and investors.

STRICT GROUNDING RULES:
1. Ground your answers strictly on the verified property catalog provided in this prompt.
2. NEVER invent, fabricate, or hallucinate properties, prices, or specifications that are not in the database.
3. When referencing properties, cite actual property IDs from the catalog and explain why they match the client's criteria.
4. If the user asks about properties or criteria not available in the catalog, state this transparently and recommend realistic alternatives or contacting the private off-market desk.
5. If the user request is ambiguous (e.g. asking for "a nice home" without budget or area), ask a clarifying question.
6. Provide 2 to 3 concise, relevant follow-up questions tailored to their inquiry.
7. Offer to schedule a private viewing or connect with Alexander Sterling / Soraya Mansoor when appropriate.
8. Return your response strictly as JSON with the defined schema.`;

      const historyFormatted = history.slice(-6).map((h) => ({
        role: h.role === 'model' ? 'model' : 'user',
        parts: [{ text: h.text }],
      }));

      const contextPayload = `Current Dubai Verified Property Catalog:
${JSON.stringify(propertiesDigest, null, 2)}

${currentPropertyContext ? `Current Property Being Viewed: ${currentPropertyContext.title} (${currentPropertyContext.priceAed.toLocaleString()} AED, ${currentPropertyContext.neighborhood}, ${currentPropertyContext.bedrooms} beds, ${currentPropertyContext.type})` : ''}

User Message: "${userMessage}"`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: [
          ...historyFormatted,
          {
            role: 'user',
            parts: [{ text: contextPayload }],
          },
        ],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              reply: { type: Type.STRING },
              matchedPropertyIds: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              clarifyingQuestion: { type: Type.STRING },
              suggestedQuestions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              showContactAgentOption: { type: Type.BOOLEAN },
            },
            required: ['reply', 'matchedPropertyIds', 'suggestedQuestions', 'showContactAgentOption'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const matchedIds: string[] = Array.isArray(parsed.matchedPropertyIds) ? parsed.matchedPropertyIds : [];
      const matchedProps = candidateProperties.filter((p) => matchedIds.includes(p.id));

      return {
        reply: parsed.reply || 'Thank you for reaching out to HS ESTATE. How may I assist your portfolio today?',
        matchedProperties: matchedProps,
        clarifyingQuestion: parsed.clarifyingQuestion || null,
        suggestedQuestions: Array.isArray(parsed.suggestedQuestions) && parsed.suggestedQuestions.length > 0
          ? parsed.suggestedQuestions.slice(0, 3)
          : ['Beachfront villas on Palm Jumeirah', 'Golden Visa property thresholds', 'Rental yields in Downtown vs Marina'],
        showContactAgentOption: Boolean(parsed.showContactAgentOption),
        isAiGrounded: true,
      };
    } catch (err) {
      console.warn('Gemini chat error, fallback to deterministic advisor:', err);
    }
  }

  // Deterministic Fallback Response
  return fallbackChatAdvisor(userMessage, candidateProperties);
}

function fallbackChatAdvisor(userMessage: string, properties: Property[]): AssistantChatResponse {
  const q = userMessage.toLowerCase();
  let reply = "";
  let matched: Property[] = [];
  const suggested = [
    "Beachfront villas on Palm Jumeirah",
    "Golden Visa property requirements in Dubai",
    "Penthouses with Burj Khalifa views",
  ];

  if (q.includes('golden visa') || q.includes('visa')) {
    reply = "Under UAE cabinet resolution, property acquisitions with an equity value of 2,000,000 AED or greater qualify the investor and their immediate family for the 10-Year Renewable UAE Golden Visa. All HS ESTATE featured acquisitions comfortably meet this legal threshold.";
    matched = properties.filter((p) => p.priceAed >= 2000000).slice(0, 2);
  } else if (q.includes('marina') || q.includes('apartment')) {
    matched = properties.filter((p) => p.neighborhood === 'Dubai Marina' || p.type === 'Apartment').slice(0, 2);
    reply = `In Dubai Marina, rental yields typically range between 7.2% and 8.4% net. Here are verified listings from our active portfolio:`;
  } else if (q.includes('palm') || q.includes('villa') || q.includes('beach')) {
    matched = properties.filter((p) => p.neighborhood === 'Palm Jumeirah' || p.type === 'Villa').slice(0, 2);
    reply = "Palm Jumeirah continues to lead Dubai's ultra-prime segment. Here are premier beachfront villas and penthouses available:";
  } else if (q.includes('compare')) {
    matched = properties.slice(0, 2);
    reply = `Here is a side-by-side comparison of two marquee residences in our collection: ${matched[0]?.title} vs ${matched[1]?.title}. You can click "Add to Compare" on either card to view their complete metric matrix.`;
  } else {
    matched = properties.slice(0, 2);
    reply = "I have surveyed our active Dubai portfolio. Here are our top featured residences matching your investment criteria:";
  }

  return {
    reply,
    matchedProperties: matched,
    clarifyingQuestion: "Are you primarily targeting capital appreciation, rental yield, or a private family sanctuary?",
    suggestedQuestions: suggested,
    showContactAgentOption: true,
    isAiGrounded: false,
  };
}

// ==============================================================================
// 3. PERSONALIZED RECOMMENDATIONS ENGINE
// ==============================================================================

export interface RecommendationResult {
  property: Property;
  relevanceScore: number;
  aiJustification: string;
}

export async function generatePersonalizedRecommendations(
  userProfile: Partial<UserProfile>,
  properties: Property[]
): Promise<{ recommendations: RecommendationResult[]; isAiGenerated: boolean }> {
  const targetBudget = userProfile.targetBudgetAed || 30000000;
  const preferredAreas = userProfile.preferredAreas && userProfile.preferredAreas.length > 0
    ? userProfile.preferredAreas
    : ['Palm Jumeirah', 'Downtown Dubai', 'Dubai Marina'];
  const investorType = userProfile.investorType || 'Individual HNW';

  const ai = getAiClient();

  if (ai) {
    try {
      const propertiesDigest = properties.map((p) => ({
        id: p.id,
        title: p.title,
        priceAed: p.priceAed,
        neighborhood: p.neighborhood,
        type: p.type,
        bedrooms: p.bedrooms,
        sqft: p.sqft,
        roiEstimate: p.roiEstimate,
        features: p.features.slice(0, 3),
      }));

      const prompt = `As a Senior Real Estate Strategist in Dubai, recommend and rank the top 3 properties from the provided catalog for this private client:
Client Profile:
- Investor Type: ${investorType}
- Target Capital Budget: ${targetBudget.toLocaleString()} AED
- Preferred Neighborhoods: ${preferredAreas.join(', ')}

Available Property Catalog:
${JSON.stringify(propertiesDigest, null, 2)}

Provide ranked recommendations with explicit grounded justifications explaining why each property fits the budget, location mandate, and capital objectives.
Return JSON schema:
{
  "recommendations": [
    {
      "propertyId": "id string",
      "relevanceScore": number (1 to 100),
      "aiJustification": "Concise 2-sentence rationale grounded in actual property specs"
    }
  ]
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              recommendations: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    propertyId: { type: Type.STRING },
                    relevanceScore: { type: Type.NUMBER },
                    aiJustification: { type: Type.STRING },
                  },
                  required: ['propertyId', 'relevanceScore', 'aiJustification'],
                },
              },
            },
            required: ['recommendations'],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      const recs: RecommendationResult[] = [];

      if (Array.isArray(parsed.recommendations)) {
        for (const item of parsed.recommendations) {
          const prop = properties.find((p) => p.id === item.propertyId);
          if (prop) {
            recs.push({
              property: prop,
              relevanceScore: item.relevanceScore || 92,
              aiJustification: item.aiJustification,
            });
          }
        }
      }

      if (recs.length > 0) {
        return { recommendations: recs, isAiGenerated: true };
      }
    } catch (err) {
      console.warn('Gemini recommendation error, fallback to deterministic scoring:', err);
    }
  }

  // Deterministic scoring fallback
  const scored = properties
    .map((p) => {
      let score = 50;
      // Budget proximity
      const budgetDiff = Math.abs(p.priceAed - targetBudget);
      if (budgetDiff < targetBudget * 0.3) score += 25;
      else if (budgetDiff < targetBudget * 0.6) score += 15;

      // Area preference
      if (preferredAreas.some((a) => p.neighborhood.toLowerCase().includes(a.toLowerCase()))) {
        score += 20;
      }

      // High yield or exclusive
      if (p.roiEstimate) score += 5;

      return {
        property: p,
        relevanceScore: Math.min(98, score),
        aiJustification: `Strategically aligned with your ${formatBudgetShort(targetBudget)} allocation mandate in ${p.neighborhood}, offering ${p.roiEstimate || 'strong capital appreciation'} and full UAE Golden Visa eligibility.`,
      };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 3);

  return { recommendations: scored, isAiGenerated: false };
}

function formatBudgetShort(amount: number): string {
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}M AED`;
  return `${amount} AED`;
}
