/**
 * @typedef {import('../dist/index.d.ts').SearchRequest} SearchRequest
 * @typedef {import('../dist/index.d.ts').SearchResponse} SearchResponse
 * @typedef {import('../dist/index.d.ts').SearchCandidate} SearchCandidate
 * @typedef {import('../dist/index.d.ts').RankedCandidate} RankedCandidate
 * @typedef {import('../dist/index.d.ts').RankOptions} RankOptions
 * @typedef {import('../dist/index.d.ts').Citation} Citation
 * @typedef {import('../dist/index.d.ts').CoreRuntimeExtensions} CoreRuntimeExtensions
 */

const TOKEN_REGEX = /[^a-z0-9]+/g;

/**
 * Normalize free text for simple lexical ranking.
 * @param {string} value
 * @returns {string}
 */
export function normalizeText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(TOKEN_REGEX, ' ')
    .trim();
}

/**
 * Tokenize normalized text.
 * @param {string} value
 * @returns {string[]}
 */
export function tokenize(value) {
  const normalized = normalizeText(value);
  return normalized ? normalized.split(/\s+/g) : [];
}

/**
 * Rank candidates using lexical overlap + optional semantic score.
 * @param {SearchRequest} request
 * @param {SearchCandidate[]} candidates
 * @param {RankOptions} [options]
 * @returns {RankedCandidate[]}
 */
export function rankCandidates(request, candidates, options = {}) {
  const queryTokens = new Set(tokenize(request.query));
  const lexicalWeight = options.lexicalWeight ?? 0.65;
  const semanticWeight = options.semanticWeight ?? 0.35;
  const normalizeSemantic = options.normalizeSemantic ?? true;

  return candidates
    .map((candidate) => {
      const candidateTokens = tokenize(candidate.text);
      let overlap = 0;
      for (const token of candidateTokens) {
        if (queryTokens.has(token)) overlap += 1;
      }

      const lexical = candidateTokens.length > 0 ? overlap / candidateTokens.length : 0;
      const semanticRaw = Number(candidate.semanticScore ?? 0);
      const semantic = normalizeSemantic
        ? Math.max(0, Math.min(1, semanticRaw))
        : semanticRaw;

      const score = (lexical * lexicalWeight) + (semantic * semanticWeight);

      return {
        ...candidate,
        lexicalScore: lexical,
        semanticScore: semantic,
        score,
      };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Build compact citations for UI/chat responses.
 * @param {RankedCandidate[]} ranked
 * @param {{ maxCitations?: number, minScore?: number }} [options]
 * @returns {Citation[]}
 */
export function buildCitations(ranked, options = {}) {
  const maxCitations = options.maxCitations ?? 5;
  const minScore = options.minScore ?? 0;

  return ranked
    .filter((item) => item.score >= minScore)
    .slice(0, maxCitations)
    .map((item, index) => ({
      id: item.id,
      rank: index + 1,
      score: item.score,
      source: item.source,
      title: item.title,
      snippet: item.text.slice(0, 220),
    }));
}

/**
 * Create a typed search response from ranked candidates.
 * @param {SearchRequest} request
 * @param {RankedCandidate[]} ranked
 * @param {{ maxResults?: number, maxCitations?: number, minCitationScore?: number }} [options]
 * @returns {SearchResponse}
 */
export function createSearchResponse(request, ranked, options = {}) {
  const maxResults = options.maxResults ?? request.limit ?? 5;
  const top = ranked.slice(0, maxResults);

  return {
    query: request.query,
    tookMs: 0,
    totalCandidates: ranked.length,
    results: top,
    citations: buildCitations(top, {
      maxCitations: options.maxCitations,
      minScore: options.minCitationScore,
    }),
  };
}

/**
 * Optional extension points for acceleration/runtime-specific behavior.
 * @param {CoreRuntimeExtensions} [extensions]
 */
export function createCoreRuntime(extensions = {}) {
  return {
    vectorSearch: extensions.vectorSearch,
    rerank: extensions.rerank,
    acceleration: {
      wasm: Boolean(extensions.acceleration?.wasm),
      provider: extensions.acceleration?.provider ?? null,
    },
  };
}

/**
 * Execute search with optional vector/rerank extensions.
 * @param {SearchRequest} request
 * @param {SearchCandidate[]} seedCandidates
 * @param {CoreRuntimeExtensions} [extensions]
 * @returns {Promise<SearchResponse>}
 */
export async function search(request, seedCandidates, extensions = {}) {
  const started = Date.now();
  let candidates = seedCandidates;

  if (typeof extensions.vectorSearch === 'function') {
    const vectorCandidates = await extensions.vectorSearch(request);
    if (Array.isArray(vectorCandidates)) candidates = vectorCandidates;
  }

  let ranked = rankCandidates(request, candidates, request.rankOptions);

  if (typeof extensions.rerank === 'function') {
    const reranked = await extensions.rerank(request, ranked);
    if (Array.isArray(reranked)) ranked = reranked;
  }

  const response = createSearchResponse(request, ranked, {
    maxResults: request.limit,
    maxCitations: request.limit,
    minCitationScore: request.minScore,
  });

  response.tookMs = Date.now() - started;
  return response;
}
