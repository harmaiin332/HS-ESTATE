import { Property, UserProfile } from '../types';
import { ExtractedSearchFilters } from '../../server/aiService';

export interface AiSearchResult {
  success: boolean;
  query: string;
  extractedFilters: ExtractedSearchFilters;
  properties: Property[];
  totalMatches: number;
  aiGrounded: boolean;
}

export interface AiChatReply {
  success: boolean;
  reply: string;
  matchedProperties: Property[];
  clarifyingQuestion: string | null;
  suggestedQuestions: string[];
  showContactAgentOption: boolean;
  isAiGrounded: boolean;
}

export interface AiRecommendationItem {
  property: Property;
  relevanceScore: number;
  aiJustification: string;
}

export interface AiRecommendationsResult {
  success: boolean;
  recommendations: AiRecommendationItem[];
  isAiGenerated: boolean;
}

// 1. Natural Language AI Property Search
export async function searchPropertiesWithAI(query: string): Promise<AiSearchResult> {
  const response = await fetch('/api/ai/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to process AI property search.');
  }

  return response.json();
}

// 2. Conversational HS Property Advisor Chat
export async function chatWithAiAdvisor(
  message: string,
  history: { role: 'user' | 'model'; text: string }[] = [],
  propertyIdContext?: string
): Promise<AiChatReply> {
  const response = await fetch('/api/ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      message,
      history,
      propertyIdContext,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'AI advisor communication failure.');
  }

  return response.json();
}

// 3. Personalized AI Recommendations
export async function fetchAiRecommendations(
  userProfile: Partial<UserProfile>
): Promise<AiRecommendationsResult> {
  const response = await fetch('/api/ai/recommendations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userProfile }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch AI recommendations.');
  }

  return response.json();
}
