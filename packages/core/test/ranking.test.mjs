import test from 'node:test';
import assert from 'node:assert/strict';
import { buildCitations, rankCandidates } from '../src/index.mjs';

test('rankCandidates sorts by weighted score', () => {
  const ranked = rankCandidates(
    { query: 'flowise rag citation ranking' },
    [
      { id: 'a', text: 'flowise rag ranking', semanticScore: 0.2 },
      { id: 'b', text: 'citation helper for rag', semanticScore: 0.9 },
      { id: 'c', text: 'unrelated content', semanticScore: 0.1 },
    ],
    { lexicalWeight: 0.5, semanticWeight: 0.5 },
  );

  assert.equal(ranked[0].id, 'b');
  assert.equal(ranked[ranked.length - 1].id, 'c');
  assert.ok(ranked[0].score >= ranked[1].score);
});

test('buildCitations applies min score and max citations', () => {
  const ranked = [
    { id: '1', text: 'alpha beta gamma', score: 0.91, lexicalScore: 0.9, semanticScore: 0.92 },
    { id: '2', text: 'delta epsilon', score: 0.65, lexicalScore: 0.6, semanticScore: 0.7 },
    { id: '3', text: 'zeta eta', score: 0.2, lexicalScore: 0.2, semanticScore: 0.2 },
  ];

  const citations = buildCitations(ranked, { minScore: 0.6, maxCitations: 1 });

  assert.equal(citations.length, 1);
  assert.equal(citations[0].id, '1');
  assert.equal(citations[0].rank, 1);
});
