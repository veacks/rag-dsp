export type MetadataValue = string | number | boolean | null;

export interface SearchCandidate {
  id: string;
  text: string;
  source?: string;
  title?: string;
  semanticScore?: number;
  metadata?: Record<string, MetadataValue>;
}

export interface RankedCandidate extends SearchCandidate {
  lexicalScore: number;
  score: number;
  semanticScore: number;
}

export interface RankOptions {
  lexicalWeight?: number;
  semanticWeight?: number;
  normalizeSemantic?: boolean;
}

export interface SearchRequest {
  query: string;
  embedding?: number[] | Float32Array;
  limit?: number;
  minScore?: number;
  rankOptions?: RankOptions;
}

export interface Citation {
  id: string;
  rank: number;
  score: number;
  source?: string;
  title?: string;
  snippet: string;
}

export interface SearchResponse {
  query: string;
  tookMs: number;
  totalCandidates: number;
  results: RankedCandidate[];
  citations: Citation[];
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  search: SearchRequest;
}

export interface ChatResponse {
  answer: string;
  citations: Citation[];
}

export interface CoreRuntimeExtensions {
  vectorSearch?: (request: SearchRequest) => Promise<SearchCandidate[]> | SearchCandidate[];
  rerank?: (
    request: SearchRequest,
    ranked: RankedCandidate[],
  ) => Promise<RankedCandidate[]> | RankedCandidate[];
  acceleration?: {
    wasm?: boolean;
    provider?: string;
  };
}

export function normalizeText(value: string): string;
export function tokenize(value: string): string[];
export function rankCandidates(
  request: SearchRequest,
  candidates: SearchCandidate[],
  options?: RankOptions,
): RankedCandidate[];
export function buildCitations(
  ranked: RankedCandidate[],
  options?: { maxCitations?: number; minScore?: number },
): Citation[];
export function createSearchResponse(
  request: SearchRequest,
  ranked: RankedCandidate[],
  options?: { maxResults?: number; maxCitations?: number; minCitationScore?: number },
): SearchResponse;
export function createCoreRuntime(extensions?: CoreRuntimeExtensions): {
  vectorSearch: CoreRuntimeExtensions['vectorSearch'];
  rerank: CoreRuntimeExtensions['rerank'];
  acceleration: { wasm: boolean; provider: string | null };
};
export function search(
  request: SearchRequest,
  seedCandidates: SearchCandidate[],
  extensions?: CoreRuntimeExtensions,
): Promise<SearchResponse>;
