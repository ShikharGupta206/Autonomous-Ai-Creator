const store = require('../data/store');

/**
 * Memory Service
 * Manages memory persistence, continuity references, and topic history for autonomous agents.
 */

function getMemory(agentId) {
  return store.getAgentMemory(agentId);
}

function recordPublication(agentId, post, candidateTopic, extractedConcepts = []) {
  const memory = store.getAgentMemory(agentId);

  // Add published topic
  memory.publishedTopics.unshift({
    postId: post.id,
    title: candidateTopic.title,
    url: candidateTopic.url,
    publishedAt: post.createdAt,
    concepts: extractedConcepts
  });

  // Keep last 50 topics in memory
  if (memory.publishedTopics.length > 50) {
    memory.publishedTopics = memory.publishedTopics.slice(0, 50);
  }

  // Add concepts
  extractedConcepts.forEach(c => {
    if (!memory.concepts.includes(c)) {
      memory.concepts.push(c);
    }
  });

  // Track source URL
  if (candidateTopic.url && !memory.sourceHistory.includes(candidateTopic.url)) {
    memory.sourceHistory.push(candidateTopic.url);
  }

  store.updateAgentMemory(agentId, memory);
}

/**
 * Returns past post context to establish natural editorial continuity
 */
function getContinuityContext(agentId) {
  const memory = store.getAgentMemory(agentId);

  if (!memory.publishedTopics || memory.publishedTopics.length === 0) {
    return { hasHistory: false, lastPostTitle: null };
  }

  const lastPublished = memory.publishedTopics[0];
  return {
    hasHistory: true,
    lastPostTitle: lastPublished.title,
    lastPostId: lastPublished.postId,
    conceptsCovered: memory.concepts.slice(-8)
  };
}

module.exports = {
  getMemory,
  recordPublication,
  getContinuityContext
};
