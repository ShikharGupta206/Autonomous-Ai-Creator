const { GoogleGenerativeAI } = require('@google/generative-ai');
const memoryService = require('./memoryService');

// Check for Gemini API key
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
let genAI = null;
if (geminiApiKey) {
  try {
    genAI = new GoogleGenerativeAI(geminiApiKey);
  } catch (err) {
    console.warn('Gemini API init warning:', err.message);
  }
}

/**
 * Persona Profiles & Voice Guidelines
 */
const PERSONA_PROFILES = {
  'ada': {
    name: 'Ada',
    domain: 'AI Security',
    role: 'Senior AI Security Researcher & Vulnerability Analyst',
    voice: 'Vigilant, analytical, technically precise, authoritative.',
    perspective: 'Always evaluates AI advancements through threat models, attack surfaces, alignment integrity, and defensive engineering.',
    hashtags: '#AISecurity #RedTeaming #LLMSafety #AppSec #CyberSecurity'
  },
  'machine learning': {
    name: 'Orion',
    domain: 'Machine Learning Engineering',
    role: 'Principal ML Systems Architect',
    voice: 'Pragmatic, systems-focused, performance-obsessed, empirical.',
    perspective: 'Evaluates developments on GPU efficiency, memory bandwidth, inference throughput, and production scalability.',
    hashtags: '#MLEngineering #LLMOptimization #SystemArchitecture #AIInfra'
  },
  'ai product analyst': {
    name: 'Nexus',
    domain: 'AI Product Analyst',
    role: 'Strategic AI Market & Product Analyst',
    voice: 'Sharp, metric-driven, user-centric, forward-looking.',
    perspective: 'Analyzes user value, unit economics, developer experience (DX), enterprise readiness, and platform dynamics.',
    hashtags: '#AIProduct #ProductStrategy #TechTrends #EnterpriseAI'
  },
  'robotics engineer': {
    name: 'Kora',
    domain: 'Robotics & Embodied AI',
    role: 'Robotics & Vision-Language-Action Systems Lead',
    voice: 'Physics-grounded, systems-oriented, empirical, innovative.',
    perspective: 'Focuses on real-world actuation, spatial perception, sim-to-real transfer, and hardware-software co-design.',
    hashtags: '#Robotics #EmbodiedAI #SpatialIntelligence #Hardware'
  }
};

function getPersonaConfig(personaInput) {
  const name = personaInput.name || 'Ada';
  const domain = personaInput.domain || 'AI Security';
  const key = domain.toLowerCase();

  for (const [pKey, profile] of Object.entries(PERSONA_PROFILES)) {
    if (key.includes(pKey) || pKey.includes(key)) {
      return { ...profile, name }; // Keep requested name if custom
    }
  }

  // Custom fallback persona profile
  return {
    name,
    domain,
    role: `${domain} Specialist & AI Researcher`,
    voice: 'Insightful, objective, analytical, concise.',
    perspective: `Analyzes developments in ${domain} with a focus on real-world impact, technical rigor, and architectural implications.`,
    hashtags: `#${domain.replace(/\s+/g, '')} #ArtificialIntelligence #TechInsights`
  };
}

/**
 * Generate post using Gemini API if key is available
 */
async function generatePostWithGemini(personaConfig, winningEvaluation, rejectedCandidates, memoryContext) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `You are ${personaConfig.name}, a ${personaConfig.role}.
Voice: ${personaConfig.voice}
Perspective: ${personaConfig.perspective}

Topic Selected: "${winningEvaluation.candidate.title}"
Source: ${winningEvaluation.candidate.url}
Source Summary: ${winningEvaluation.candidate.snippet}

${memoryContext.hasHistory ? `Continuity context: In your previous post, you analyzed "${memoryContext.lastPostTitle}". Explicitly build upon or connect to this previous discussion.` : ''}

Candidates rejected in this editorial cycle:
${rejectedCandidates.map(r => `- "${r.title}" (Reason: ${r.reason})`).slice(0, 3).join('\n')}

Format your response strictly as valid JSON with this exact schema:
{
  "text": "The main social/editorial post content written in your authentic persona voice (approx 150-250 words). Include technical insights, critical perspective, and 2-3 hashtags.",
  "rationale": "Detailed publishing rationale explaining: 1) Why this topic was selected, 2) Why it is relevant right now, and 3) Why it was chosen over the rejected candidates.",
  "extractedConcepts": ["concept1", "concept2", "concept3"]
}`;

    const result = await model.generateContent(prompt);
    const textResponse = result.response.text();
    
    // Parse JSON safely
    const jsonMatch = textResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        text: parsed.text,
        rationale: parsed.rationale,
        extractedConcepts: parsed.extractedConcepts || []
      };
    }
  } catch (err) {
    console.warn('Gemini generation fallback triggered:', err.message);
  }
  return null; // Fallback to local engine
}

/**
 * Local Persona Synthesis Engine (Generates high quality persona content offline)
 */
function generateLocalPersonaPost(personaConfig, winningEvaluation, rejectedCandidates, memoryContext) {
  const candidate = winningEvaluation.candidate;
  const scores = winningEvaluation.scores;
  const domain = personaConfig.domain;

  // Build persona post text
  let postText = '';
  const continuityPrefix = memoryContext.hasHistory
    ? `Following up on our recent analysis regarding ${memoryContext.lastPostTitle.substring(0, 45)}...\n\n`
    : '';

  if (domain.toLowerCase().includes('security')) {
    postText = `${continuityPrefix}Critical focus on "${candidate.title}":\n\n${candidate.snippet}\n\nFrom a threat model standpoint, as autonomous systems gain agency, verifying input sanitation and zero-trust execution boundaries becomes non-negotiable. We cannot treat modern AI interfaces as black-box APIs when unconstrained tool usage exposes memory and network surfaces to adversary manipulation.\n\nKey Takeaway: Defensive evaluation must move from static prompt benchmarks to dynamic runtime sandboxing.\n\n${personaConfig.hashtags}`;
  } else if (domain.toLowerCase().includes('machine learning') || domain.toLowerCase().includes('ml')) {
    postText = `${continuityPrefix}Key technical update: "${candidate.title}":\n\n${candidate.snippet}\n\nExamining the compute footprint and memory bandwidth utilization: optimization techniques like speculative decoding and KV-cache compression are becoming foundational for production serving. The bottleneck is no longer raw FLOPs—it's high-bandwidth memory IOPS during memory-bound decoding phases.\n\nEmpirical observation: Scalability comes down to memory latency optimization.\n\n${personaConfig.hashtags}`;
  } else if (domain.toLowerCase().includes('product')) {
    postText = `${continuityPrefix}Product & Market analysis on "${candidate.title}":\n\n${candidate.snippet}\n\nWhat matters here is developer ergonomics and marginal API unit economics. As base model performance commoditizes, competitive moats shift toward workflow integration, agent latency, and deterministic output guarantees.\n\nStrategic Insight: Teams prioritizing developer experience and zero-latency orchestration will win adoption.\n\n${personaConfig.hashtags}`;
  } else {
    postText = `${continuityPrefix}Analysis on "${candidate.title}":\n\n${candidate.snippet}\n\nAs we evaluate this advancement within the broader ${domain} ecosystem, the architectural implications point toward tighter integration of deterministic validation pipelines with probabilistic model outputs.\n\nCore takeaway: Rigorous testing frameworks and domain-specific benchmarks remain essential as systems scale.\n\n${personaConfig.hashtags}`;
  }

  // Build explicit publishing rationale
  const rationale = `Topic Selected: "${candidate.title}" (Editorial Composite Score: ${winningEvaluation.compositeScore}/100).\n\n1. Selection Reason: High alignment with ${personaConfig.name}'s ${domain} focus (Domain Score: ${scores.domain}/100) and strong technical substance (${scores.substance}/100).\n2. Timeliness: Source (${candidate.sourceName}) published fresh data relevant to current industry discussions.\n3. Comparison: Selected over ${rejectedCandidates.length} other candidate topics, including '${rejectedCandidates[0]?.title || 'generic tech news'}' which was rejected due to: ${rejectedCandidates[0]?.reason || 'lower editorial priority'}.`;

  const extractedConcepts = [
    domain.toLowerCase().replace(/\s+/g, '-'),
    candidate.sourceName.toLowerCase().replace(/\s+/g, '-'),
    'technical-analysis'
  ];

  return {
    text: postText,
    rationale,
    extractedConcepts
  };
}

/**
 * Main post generation dispatcher
 */
async function generatePersonaPost(personaInput, winningEvaluation, rejectedCandidates, agentId) {
  const personaConfig = getPersonaConfig(personaInput);
  const memoryContext = memoryService.getContinuityContext(agentId);

  let generated = null;
  if (genAI) {
    generated = await generatePostWithGemini(personaConfig, winningEvaluation, rejectedCandidates, memoryContext);
  }

  if (!generated) {
    generated = generateLocalPersonaPost(personaConfig, winningEvaluation, rejectedCandidates, memoryContext);
  }

  const candidate = winningEvaluation.candidate;

  const post = {
    id: `p-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    createdAt: new Date().toISOString(),
    text: generated.text,
    rationale: generated.rationale,
    sources: [candidate.url]
  };

  return {
    post,
    extractedConcepts: generated.extractedConcepts
  };
}

module.exports = {
  getPersonaConfig,
  generatePersonaPost
};
