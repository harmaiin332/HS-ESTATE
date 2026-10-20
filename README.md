# HS ESTATE — Ultra-Prime Dubai Real Estate Platform

**HS ESTATE** (*Discover Better. Live Smarter.*) is a luxury real estate application engineered for the Dubai, UAE property market. It caters to international property buyers, family offices, and institutional investors, with currency denominated in AED (with live conversion to USD, EUR, and GBP).

---

## Key Features & Gemini AI Architecture

### 1. Feature 1: AI Natural Language Property Search (`/api/ai/search`)
- **Natural Language Parsing**: Visitors can enter organic real estate search queries such as:
  - *"Find a 2-bedroom apartment in Dubai Marina under AED 1.5 million."*
  - *"Show villas with swimming pools in Dubai Hills Estate."*
  - *"Find rental properties under AED 100,000 per year."*
  - *"Show penthouses with three bedrooms and a sea view."*
- **Structured Extraction**: Powered by server-side `gemini-3.8-flash` with a strict `responseSchema` that extracts:
  - `purpose`: `'buy' | 'rent' | 'invest' | 'all'`
  - `propertyType`: `'Villa' | 'Penthouse' | 'Apartment' | 'Mansion' | 'Townhouse' | 'all'`
  - `neighborhood`: Dubai district name (e.g. `Palm Jumeirah`, `Dubai Hills Estate`, `Dubai Marina`, `Downtown Dubai`)
  - `bedrooms`: exact count or null
  - `maxPriceAed`: parsed integer in AED (converting verbal expressions like "1.5 million" -> `1500000`)
  - `amenities`: list of verified amenities (e.g. `Swimming Pool`, `Sea View`, `Private Beach`)
- **Strict Database Grounding**: The extracted parameters are used strictly to query the catalog (Supabase PostgreSQL / verified catalog). **The model never invents, hallucinates, or creates fictitious listings.**
- **Deterministic Fallback**: If `GEMINI_API_KEY` is unavailable or if an API failure occurs, a deterministic regex & keyword extraction engine automatically parses the query and returns matching properties without breaking the user experience.

---

### 2. Feature 2: HS Property Assistant (`/api/ai/chat`)
- **Conversational Intelligence**: Floating AI Advisor widget provides real-time advisory on Dubai regulations, RERA processes, and ROI yields.
- **Context Preservation**: Maintains multi-turn conversation history across questions.
- **Context-Aware Property Browsing**: When viewing a property detail page, the assistant automatically incorporates the active property's specifications into the conversation.
- **Side-by-Side Property Comparison**: Matched listings inside the chat bubble feature quick-action "+ Compare" buttons that link directly to the app-wide comparison dock.
- **Clarifying Questions**: When a query is broad or ambiguous, the model asks an intelligent clarifying question rendered in a distinct callout.
- **Suggested Follow-up Questions**: Dynamically generated interactive chips tailored to the ongoing topic.
- **Contact Agent Escalation**: Automatically surfaces a direct consultation CTA with Alexander Sterling or Soraya Mansoor when appropriate.
- **Graceful Error Recovery**: Inline retry controls allow users to re-dispatch their query if network connectivity drops.

---

### 3. Feature 3: Personalized Recommendations Engine (`/api/ai/recommendations`)
- **Tailored to Client Mandate**: Recommends properties based on the client's target budget, preferred Dubai enclaves, and investor category (`Individual HNW`, `Family Office Principal`, `Institutional Fund`).
- **Grounded Justifications**: Explains why each recommended residence fits the client's capital criteria, citing actual plot size, Golden Visa eligibility, and neighborhood rental yields.
- **Relevance Scoring**: Computes a strategic match score (e.g., `98% Strategic Match`) for each allocation.
- **Deterministic Fallback**: Evaluates budget proximity, area mandate, and net yield deterministically when AI is in standby.

---

## Security & Reliability Safeguards

1. **Server-Side API Routes**: All Gemini SDK interactions occur exclusively within `server.ts` and `server/aiService.ts`. The client never imports `@google/genai` and the `GEMINI_API_KEY` is never transmitted to the browser.
2. **No Generated SQL Execution**: The application never executes LLM-generated SQL statements. All database operations use parameterized Supabase / PostgreSQL queries or validated schema-bounded filtering.
3. **Rate Limiting**: In-memory sliding window rate limiter protects endpoints against volumetric abuse.
4. **Data Privacy**: No private user credentials or sensitive personal information are transmitted to the LLM; only search parameters and anonymized catalog digests are evaluated.

---

## Configuration & Environment Variables

Copy `.env.example` to `.env`:

```env
# 1. Google Gemini AI API Key
GEMINI_API_KEY="your-gemini-api-key"

# 2. Supabase Cloud Configuration (Optional)
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# 3. Server Port
PORT=3000
NODE_ENV="development"
```

---

## Running the Application

```bash
# Start full-stack development server on port 3000
npm run dev

# Build production assets
npm run build
```
