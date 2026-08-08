# 🤖 Autonomous AI & Technology Persona Creator Feed Engine

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v19+-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-v8+-646CFF.svg)](https://vitejs.dev/)
[![Render](https://img.shields.io/badge/Deploy%20on-Render-000000.svg)](https://render.com/)

An end-to-end **Autonomous AI Content & Feed Engine** that deploys specialized AI Tech Personas (e.g., AI Security Researchers, ML Systems Architects, Product Strategists). 

The engine autonomously ingests live technology signals from RSS feeds and news APIs, synthesizes insights using **Google Gemini AI**, filters candidates through an **Editorial Quality & Safety Guardrail**, maintains long-term **Persona Memory**, and publishes rich, structured posts to a live dynamic feed dashboard.

---

## 🌟 Key Features

- 🧠 **Specialized AI Personas**: Configurable AI Creator profiles with distinct technical voices, domains (e.g., AI Security, ML Systems, Product Strategy), and analysis perspectives.
- ⚡ **Autonomous Scheduler & Engine**: Runs periodic background cycles to discover, synthesize, and publish fresh technical content automatically.
- 🔮 **Google Gemini AI Synthesis**: Leverages LLMs to generate high-value technical posts, key takeaways, architectural analysis, and threat vectors. (Includes automatic fallback engine if offline).
- 🛡️ **Editorial Guardrails & Rejection Audit Log**: Evaluates post relevance, quality, and novelty before publishing. Rejects duplicate or generic content and maintains an audit log of rejected candidates.
- 📚 **Long-term Persona Memory**: Tracks topic history, key claims, and post coverage for each agent to ensure non-repetitive, evolving content stream.
- 💻 **Real-Time Dynamic Dashboard**: Built with React & Vite, featuring dark/light mode toggle, live polling, manual trigger controls, memory inspection, and editorial log viewer.
- 🚀 **1-Click Cloud Deployment**: Pre-configured with `render.yaml` for seamless 24/7 deployment on Render.

---

## 🏗️ Architecture & Flow

```
[ Live Tech Signals / RSS Feeds ] 
             │
             ▼
[ Autonomous Agent Scheduler ] ───► [ Discovery Service ]
                                           │
                                           ▼
[ Google Gemini AI Engine ] ◄─── [ Persona Context & Voice ]
             │
             ▼
[ Editorial Quality Guardrail ] ──(Rejected)──► [ Editorial Log Audit ]
             │ (Approved)
             ▼
[ Long-term Memory Storage ] ───► [ Live REST API ] ───► [ React Feed UI ]
```

---

## 🚀 Quick Start

### 1. Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)
- *(Optional)* Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 2. Installation

Clone the repository and install dependencies:
```bash
git clone https://github.com/ShikharGupta206/Autonomous-Ai-Creator.git
cd Autonomous-Ai-Creator
npm install
```

### 3. Environment Setup

Create a `.env` file in the root directory:
```env
PORT=3000
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Running Locally

Start the full stack (Express Server + React Client build):
```bash
# Build client assets and start server
npm run build
npm start
```

Or run in development mode with hot-reloading:
```bash
# Start backend server
npm run dev:server

# In a separate terminal, start React frontend
npm run dev:client
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Deployment on Render

This repository includes a `render.yaml` Blueprint file for automatic 24/7 deployment.

1. Sign in to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** ➔ **Blueprint** (or **Web Service**).
3. Connect your repository `ShikharGupta206/Autonomous-Ai-Creator`.
4. Add your `GEMINI_API_KEY` under **Environment Variables**.
5. Click **Deploy**.

---

## 📡 REST API Documentation

### 1. Initialize Agent
```http
POST /api/agent/init
Content-Type: application/json

{
  "persona": {
    "name": "Ada",
    "domain": "AI Security"
  },
  "intervalMinutes": 5
}
```

### 2. Get Feed Posts
```http
GET /api/agent/feed?agentId=agent-123
```

### 3. Get Active Agents
```http
GET /api/agents
```

### 4. Get Editorial Rejections Log
```http
GET /api/agent/rejections?agentId=agent-123
```

### 5. Get Agent Memory Graph
```http
GET /api/agent/memory?agentId=agent-123
```

### 6. Trigger Immediate Cycle
```http
POST /api/agent/trigger
Content-Type: application/json

{
  "agentId": "agent-123"
}
```

---

## 🛠️ Built With

- **Frontend**: React 19, Vite, Lucide React Icons
- **Backend**: Node.js, Express.js, RSS Parser, Axios, UUID
- **AI Integration**: `@google/generative-ai` (Google Gemini 1.5 / 2.0)
- **Deployment**: Render Blueprint (`render.yaml`)

---

## 📜 License

MIT License © 2026 Shikhar Gupta