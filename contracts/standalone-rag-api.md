# Standalone RAG API Contract

This contract lets users plug one exported RAG index into any chat model client (Cursor, Codex, Claude, custom apps) through one retriever/chat API.

## Goals

- Keep retrieval and generation separate.
- Require embedding compatibility for retrieval.
- Allow any chat model for answer generation.

## Export Artifacts

The current `rager export` output is:

- `manifest.json`
- `chunks.jsonl`
- optional `vectors.jsonl` with `--vectors-only`

Each chunk line in `chunks.jsonl` includes:

- `id`
- `text`
- `metadata`
- `embedding`

## Embedding Compatibility Rule

Query embeddings must be produced by the same embedding model (or exact compatible space) as index vectors. If not, retrieval quality is undefined.

## HTTP API

### `POST /search`

Retrieve top chunks for a user query.

Request body:

```json
{
  "query": "How does compressor knee work?",
  "profile": "openai-text-embedding-3-small",
  "topK": 5,
  "minScore": 0.2,
  "filters": {
    "source": "DesigningAudioEffectPlugins.pdf"
  }
}
```

Response body:

```json
{
  "query": "How does compressor knee work?",
  "profile": "openai-text-embedding-3-small",
  "topK": 5,
  "matches": [
    {
      "id": "chunk_182",
      "score": 0.8342,
      "text": "Soft knee introduces a gradual ratio transition...",
      "metadata": {
        "source": "DesigningAudioEffectPlugins.pdf",
        "path": "pdf/DesigningAudioEffectPlugins.pdf"
      }
    }
  ]
}
```

Validation rules:

- `query` required, non-empty string.
- `topK` optional, integer 1..50 (default 5).
- `profile` optional if only one retrieval profile exists.
- `matches` sorted by descending `score`.

### `POST /chat`

Run retrieval and answer generation in one call.

Request body:

```json
{
  "query": "When should I use lookahead limiting?",
  "profile": "openai-text-embedding-3-small",
  "topK": 5,
  "chatModel": {
    "provider": "anthropic",
    "model": "claude-sonnet-4",
    "temperature": 0.2
  },
  "systemPrompt": "Answer only from context. If missing, say you do not know."
}
```

Response body:

```json
{
  "answer": "Lookahead limiting reduces overshoot by delaying gain reduction...",
  "citations": [
    {
      "id": "chunk_311",
      "source": "DesigningAudioEffectPlugins.pdf"
    }
  ],
  "retrieval": {
    "profile": "openai-text-embedding-3-small",
    "topK": 5,
    "matches": [
      {
        "id": "chunk_311",
        "score": 0.8122
      }
    ]
  },
  "chatModel": {
    "provider": "anthropic",
    "model": "claude-sonnet-4"
  }
}
```

Validation rules:

- `query` required.
- `chatModel.provider` required.
- `chatModel.model` required.
- Server should return selected citations that map back to `chunk.id`.

## Error Contract

Suggested status codes:

- `400`: invalid request (missing `query`, invalid `topK`)
- `404`: unknown retrieval `profile`
- `409`: embedding profile mismatch for loaded index
- `422`: generation provider/model unavailable
- `500`: unexpected server failure

Suggested error payload:

```json
{
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "Unknown retrieval profile: openai-large",
    "details": {}
  }
}
```

## Client Integration Notes

- Cursor/Codex/Claude integrations only need:
  1. call `/search` or `/chat`
  2. render answer
  3. show citations
- Chat model choice is independent of retrieval profile.
- Retrieval profile must match query embedding space.

## Recommended Next Step

Add a new optional field in exported `manifest.json`:

- `retrievalProfiles[]` with provider, model, dimension, metric, vectors file.

This enables future multi-profile exports without breaking existing consumers.
