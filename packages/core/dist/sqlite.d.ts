export * from './index.d.ts';

import type { SearchCandidate, SearchRequest } from './index.d.ts';

export interface SqliteVectorSearchOptions {
  database?: string;
  mode?: 'auto' | 'native' | 'wasm';
  directory?: string;
  databaseName?: string;
  loadExtension?: string;
  limit?: number;
  logger?: {
    print?: (...args: unknown[]) => void;
    printErr?: (...args: unknown[]) => void;
  };
}

export interface SqliteVectorSearch {
  (request: SearchRequest): Promise<SearchCandidate[]>;
  close(): Promise<void>;
  database: unknown;
}

export function createSqliteVectorSearch(
  options?: SqliteVectorSearchOptions,
): Promise<SqliteVectorSearch>;
