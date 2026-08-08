Build a complete full-stack production application called "Autonomous AI & Technology Persona Creator Feed Engine" using Node.js, Express, React 19, Vite, and Google Gemini AI API, fully configured for 1-click Render deployment.

### 🌟 Project Architecture & Requirements

1. **Backend (Node.js & Express)**
   - **Environment & Setup**: Single Express server (`server/index.js`) using `dotenv`, `cors`, `rss-parser`, `axios`, `uuid`, and `@google/generative-ai`.
   - **Static File Serving**: Express must automatically serve built static files from `client/dist` and fall back to `client/dist/index.html` for SPA routing, with standard `/api/*` 404 handler.
   - **Mandatory Endpoints**:
     - `POST /api/agent/init`: Body `{ persona: { name, domain }, intervalMinutes }`. Prevents duplicates, assigns `agentId`, immediately triggers an initial content generation cycle so feed isn't empty, starts a background interval scheduler, and returns `{ agentId }`.
     - `GET /api/agent/feed?agentId=<id>`: Returns `{ posts: [...] }` in reverse-chronological order (newest first). Each post contains `id`, `agentId`, `title`, `summary`, `content`, `hashtags`, `keyTakeaways`, `threatAnalysis`, `sourceUrl`, `sourceTitle`, `createdAt`.
     - `GET /api/agents`: Returns list of all active agents.
     - `GET /api/agent/rejections?agentId=<id>`: Returns audit log of candidate posts rejected by the editorial filter.
     - `GET /api/agent/memory?agentId=<id>`: Returns persona memory details (topic concepts, post count, key claims).
     - `POST /api/agent/trigger`: Manually triggers an immediate autonomous cycle for an agent.

2. **Autonomous Content & Discovery Engine**
   - **RSS Signal Discovery**: Fetches real-time technology news from RSS feeds (e.g., Hacker News, ArXiv AI/CS, TechCrunch, CVE feeds).
   - **Gemini AI Persona Synthesizer** (`server/services/personaService.js`): Uses `GEMINI_API_KEY` (or `GOOGLE_API_KEY`) to synthesize persona-specific posts (e.g., Ada - AI Security Analyst, Orion - ML Systems Architect, Nexus - Product Analyst). Includes an offline algorithmic fallback generator if no API key is set.
   - **Editorial Quality Guardrail**: Evaluates candidate posts for technical relevance, depth, and duplication. Logs rejected candidates with timestamps and reasons into `store.getRejections(agentId)`.
   - **Long-term Persona Memory** (`server/services/memoryService.js`): Tracks past covered topics per agent to prevent duplicate posts and build a continuous persona narrative.

3. **Frontend Dashboard (React + Vite)**
   - **UI Aesthetics**: Sleek modern Glassmorphic design with CSS custom properties (variables), light/dark mode theme toggle, custom badges, tab navigation, responsive post cards, and loading animations.
   - **Features**:
     - **Navbar**: App title, theme toggle, active agent indicator, quick "Initialize Agent" modal trigger.
     - **Tabs**:
       - 📰 **Live Feed Stream**: Filters by search query, displays structured posts with key takeaways, threat analysis callouts, source links, and copy actions. Auto-polls every 8 seconds for real-time post updates.
       - 📚 **Persona Memory Graph**: Inspects topics, key claims, and post statistics for the selected AI agent.
       - 🛡️ **Editorial Rejection Log**: Visual audit trail showing candidates rejected by quality/safety filters with reasons.
     - **Init Agent Modal**: Allows choosing preset personas (AI Security, ML Engineering, Product Strategy) or custom domain prompts with custom posting intervals.

4. **Build & Deployment Configuration**
   - **Root `package.json`**:
     - `"start": "node server/index.js"`
     - `"build": "npm install --prefix client --include=dev && npm run build --prefix client"`
     - `"postinstall": "npm install --prefix client --include=dev"`
   - **`render.yaml` Blueprint**:
     - `type: web`, `runtime: node`, `plan: free`
     - `buildCommand: npm install --include=dev && npm run build`
     - `startCommand: npm start`
     - Environment variable placeholders for `NODE_VERSION: 20.18.0` and `GEMINI_API_KEY`.
   - **`.env.example`** and **`.gitignore`** excluding `.env`, `node_modules`, and `dist`.
   - Comprehensive **`README.md`** with architecture diagrams, REST API documentation, and deployment guides.
