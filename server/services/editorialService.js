/**
 * Editorial Judgment Service
 * Evaluates candidate topics against agent persona, domain focus, and published memory history.
 */

// Domain keyword mappings for scoring candidate relevance
const DOMAIN_KEYWORDS = {
  'ai security': ['security', 'vulnerability', 'jailbreak', 'prompt injection', 'attack', 'red team', 'sandbox', 'poisoning', 'exfiltration', 'privacy', 'backdoor', 'alignment', 'robustness', 'threat', 'exploit', 'guardrail', 'cve'],
  'machine learning': ['ml', 'training', 'inference', 'quantization', 'gpu', 'vllm', 'flashattention', 'architecture', 'transformer', 'fine-tuning', 'distributed', 'throughput', 'kv-cache', 'benchmarks', 'weights', 'loss'],
  'ai product analyst': ['product', 'pricing', 'api', 'adoption', 'metrics', 'user experience', 'ux', 'enterprise', 'startup', 'saas', 'agent framework', 'market', 'cost', 'roi', 'ecosystem'],
  'robotics engineer': ['robotics', 'vla', 'actuator', 'kinematics', 'spatial', 'ros2', 'sensor', 'embodied', 'autonomous', 'locomotion', 'manipulation', 'sim2real', 'perception'],
  'developer advocate': ['developer', 'dx', 'open source', 'sdk', 'tutorial', 'integration', 'git', 'cli', 'api', 'framework', 'community', 'tooling', 'ecosystem'],
  'ai ethics researcher': ['ethics', 'bias', 'governance', 'policy', 'fairness', 'copyright', 'transparency', 'regulation', 'disinformation', 'labor', 'societal impact']
};

/**
 * Calculate Jaccard / Levenshtein word similarity ratio
 */
function calculateTextSimilarity(str1, str2) {
  const words1 = new Set(str1.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/));
  const words2 = new Set(str2.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/));
  
  if (words1.size === 0 || words2.size === 0) return 0;
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return (intersection.size / union.size) * 100;
}

/**
 * Score domain relevance (0 - 100)
 */
function scoreDomainRelevance(candidate, persona) {
  const domainLower = (persona.domain || 'ai technology').toLowerCase();
  const textToScore = `${candidate.title} ${candidate.snippet || ''}`.toLowerCase();

  // Find matching keyword set
  let matchedKeywords = [];
  for (const [key, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
    if (domainLower.includes(key) || key.includes(domainLower)) {
      matchedKeywords = keywords;
      break;
    }
  }

  // Base score for any tech / AI candidate
  let score = 45;

  // Check general AI keywords
  const generalAiKeywords = ['ai', 'llm', 'gpt', 'model', 'neural', 'paper', 'algorithm', 'software', 'code', 'agent', 'deepmind', 'openai', 'anthropic', 'huggingface'];
  if (generalAiKeywords.some(kw => textToScore.includes(kw))) {
    score += 15;
  }

  // Boost for domain-specific keywords
  let domainHits = 0;
  matchedKeywords.forEach(kw => {
    if (textToScore.includes(kw)) domainHits++;
  });

  if (domainHits > 0) {
    score += Math.min(40, domainHits * 15);
  }

  if (textToScore.includes(domainLower)) {
    score += 20;
  }

  return Math.min(100, score);
}

/**
 * Score novelty vs memory (0 - 100)
 */
function scoreNoveltyVsMemory(candidate, memory) {
  if (!memory || !memory.publishedTopics || memory.publishedTopics.length === 0) {
    return 100; // Perfect novelty if memory is clean
  }

  const candidateTitle = candidate.title.toLowerCase();
  let maxSimilarity = 0;

  for (const pastTopic of memory.publishedTopics) {
    const pastTitle = (pastTopic.title || pastTopic).toLowerCase();
    const sim = calculateTextSimilarity(candidateTitle, pastTitle);
    if (sim > maxSimilarity) {
      maxSimilarity = sim;
    }
  }

  // Check if candidate URL was already used
  if (memory.sourceHistory && memory.sourceHistory.includes(candidate.url)) {
    return 0; // Immediate rejection for duplicate URL
  }

  const noveltyScore = Math.max(0, Math.round(100 - maxSimilarity * 1.5));
  return noveltyScore;
}

/**
 * Score technical substance & gravity (0 - 100)
 */
function scoreTechnicalSubstance(candidate) {
  const text = `${candidate.title} ${candidate.snippet || ''}`;
  
  // Fluff indicators
  const clickbaitRegex = /top \d+|secret|you won't believe|shocking|unbelievable|mind-blowing|game changer/i;
  if (clickbaitRegex.test(text)) {
    return 35;
  }

  // Technical gravity indicators
  const techRegex = /architecture|benchmark|vulnerability|eval|paper|framework|latency|optimization|throughput|cve|reproducib|methodology|dataset|quantization|injection|arxiv/i;
  const matches = (text.match(techRegex) || []).length;

  return Math.min(100, 60 + matches * 15);
}

/**
 * Evaluate all candidate topics for an agent persona.
 * Returns { winningTopic, rejectedCandidates }
 */
function evaluateEditorialCandidates(candidates, persona, memory) {
  const scoredCandidates = [];
  const rejectedCandidates = [];

  for (const candidate of candidates) {
    const domainScore = scoreDomainRelevance(candidate, persona);
    const noveltyScore = scoreNoveltyVsMemory(candidate, memory);
    const substanceScore = scoreTechnicalSubstance(candidate);
    const timelinessScore = 85; // Default solid timeliness score for live feeds

    const compositeScore = Math.round(
      domainScore * 0.40 +
      noveltyScore * 0.30 +
      substanceScore * 0.20 +
      timelinessScore * 0.10
    );

    const evaluation = {
      candidate,
      compositeScore,
      scores: {
        domain: domainScore,
        novelty: noveltyScore,
        substance: substanceScore,
        timeliness: timelinessScore
      }
    };

    // Editorial Rejection Rules
    let rejectionReason = null;

    if (noveltyScore < 35) {
      rejectionReason = `Rejected: Topic overlaps significantly with previously published post in memory (Novelty: ${noveltyScore}/100). Avoids repetition.`;
    } else if (domainScore < 30) {
      rejectionReason = `Rejected: Insufficient alignment with ${persona.name}'s focus on ${persona.domain} (Domain Relevance: ${domainScore}/100, Threshold: 30).`;
    } else if (compositeScore < 45) {
      rejectionReason = `Rejected: Overall editorial quality score (${compositeScore}/100) below minimum publishing standard (45/100).`;
    }

    if (rejectionReason) {
      rejectedCandidates.push({
        id: `rej-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        rejectedAt: new Date().toISOString(),
        title: candidate.title,
        url: candidate.url,
        sourceName: candidate.sourceName,
        compositeScore,
        reason: rejectionReason,
        breakdown: evaluation.scores
      });
    } else {
      scoredCandidates.push(evaluation);
    }
  }

  // Sort accepted candidates by highest score
  scoredCandidates.sort((a, b) => b.compositeScore - a.compositeScore);

  const winningTopic = scoredCandidates.length > 0 ? scoredCandidates[0] : null;

  // Remaining unchosen candidates are logged as rejected (passed over in favor of higher scoring topic)
  for (let i = 1; i < scoredCandidates.length; i++) {
    const unchosen = scoredCandidates[i];
    rejectedCandidates.push({
      id: `rej-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      rejectedAt: new Date().toISOString(),
      title: unchosen.candidate.title,
      url: unchosen.candidate.url,
      sourceName: unchosen.candidate.sourceName,
      compositeScore: unchosen.compositeScore,
      reason: `Passed over: Lower editorial priority score (${unchosen.compositeScore}/100) compared to winning selection '${winningTopic.candidate.title}' (${winningTopic.compositeScore}/100).`,
      breakdown: unchosen.scores
    });
  }

  return {
    winningTopic,
    rejectedCandidates
  };
}

module.exports = {
  evaluateEditorialCandidates
};
