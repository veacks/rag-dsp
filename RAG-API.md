# Plan : API `/search` et `/chat` — Dual-target Node.js + Browser

## Contexte

Le projet **flowise-dsp-rag** exporte déjà des vecteurs SQLite (`schema.sql` + `data.sql`) et un worker WASM pour le browser. Il manque une vraie API HTTP avec `/search` et `/chat` côté Node.js, et les endpoints restent non câblés côté browser. Ce plan ajoute les deux cibles en un seul export propre.

---

## Avertissement sur `@dao-xyz/sqlite3-vec`

Ce package requiert **better-sqlite3 >= 12**. Le projet contient actuellement **better-sqlite3 v9.6.0** (via Flowise). On utilisera **sqlite-vec v0.1.x** à la place — c’est la bibliothèque officielle d’asg017, compatible toutes versions de **better-sqlite3**, et dont l’API de chargement est identique (`load(db)`). Le schéma SQL existant (`vec0`, `vec_distance_cosine`) est inchangé.

> Si `@dao-xyz/sqlite3-vec` est une version interne ou un fork avec une autre API, préciser la version exacte avant implémentation.

---

## Nouvelles dépendances

| Package            | Cible   | Usage                                      |
| ------------------ | ------- | ------------------------------------------ |
| `sqlite-vec`       | Node.js | Extension native SQLite pour `vec0`      |
| `better-sqlite3`   | Node.js | Ajout en dep directe (déjà transitive via Flowise) |
| `@anthropic-ai/sdk`| Node.js | Provider Anthropic pour `/chat`            |

**openai** est déjà une dépendance.

---

## Structure des fichiers à créer

```
scripts/
  api/
    node/
      db.mjs         ← better-sqlite3 + sqlite-vec adapter (knnSearch)
      embed.mjs      ← embedQuery() via OpenAI SDK
      llm.mjs        ← callLLM() : anthropic | openai
      router.mjs     ← handleSearch() / handleChat() (framework-agnostic)
      server.mjs     ← HTTP server (native node:http, JSON body, CORS)
      build-db.mjs   ← construit rag.db binaire depuis chunks.jsonl
  serve-api.mjs      ← dev server (appelé par rager serve:api)
```

---

## Fichiers modifiés

| Fichier | Modification |
| ------- | ------------ |
| `scripts/export-vector-db.mjs` | Ajouter flags `--node-api` / `--browser-api` + fonctions d’export |
| `bin/rager.mjs` | Ajouter case `serve:api` + help text |
| `export/vector-db/web/rag-sqlite.worker.js` | Ajouter `filters`, `minScore` dans le handler search |
| `export/vector-db/web/rag-api.js` | Signature `search({ embedding, topK, minScore, filters })` |
| `package.json` | Ajouter `sqlite-vec`, `better-sqlite3`, `@anthropic-ai/sdk`, script `serve:api` |

---

## Output des exports

### `rager export --node-api` → `export/api/node/`

```
export/api/node/
  rag.db        ← SQLite binaire avec rag_chunks + rag_vec vec0(float[1536])
  index.mjs     ← API standalone self-contained (toutes fonctions inlinées)
  package.json  ← { better-sqlite3, sqlite-vec, openai, @anthropic-ai/sdk }
```

**Usage programmatique :**

```js
import { createRagApi } from './export/api/node/index.mjs';
const api = createRagApi({ dbPath: './export/api/node/rag.db' });

// Programmatic
const results = await api.search({ query: 'knee compressor', topK: 5 });

// HTTP server
api.serve(3737); // → POST /search, POST /chat
```

### `rager export --browser-api` → `export/api/browser/`

```
export/api/browser/
  rag-sqlite.worker.js  ← worker mis à jour (filter + minScore)
  rag-api.js            ← RagWasmClient mis à jour
  rows.jsonl
  manifest.json
```

**Usage :**

```js
import { RagWasmClient } from './rag-api.js';
const client = new RagWasmClient();
await client.init({ storage: 'opfs' });
await client.importRows('./rows.jsonl');

const { hits } = await client.search({
  embedding: queryVector,  // app gère l'embedding
  topK: 5,
  minScore: 0.2,
  filters: { source: 'foo.pdf' }
});
// Pour /chat : app appelle le LLM directement avec les hits
```

---

## Contrat API HTTP (Node.js)

Conforme à `contracts/standalone-rag-api.md`.

### `POST /search`

**Requête :**

```json
{
  "query": "knee compressor",
  "topK": 5,
  "minScore": 0.2,
  "filters": { "source": "foo.pdf" }
}
```

**Réponse :**

```json
{
  "query": "...",
  "profile": "...",
  "topK": 5,
  "matches": [
    { "id": "...", "score": 0.0, "text": "...", "metadata": {} }
  ]
}
```

### `POST /chat`

**Requête :**

```json
{
  "query": "...",
  "topK": 5,
  "chatModel": {
    "provider": "anthropic",
    "model": "claude-sonnet-4-6",
    "temperature": 0.2
  },
  "systemPrompt": "Answer only from context."
}
```

**Réponse :**

```json
{
  "answer": "...",
  "citations": [],
  "retrieval": {},
  "chatModel": {}
}
```

---

## Détails techniques clés

1. **Score cosine** : `vec_distance_cosine()` retourne `1 - similarity`. On expose `score = 1 - distance` pour avoir `score ∈ [0,1]` cohérent avec le worker browser.

2. **ESM + better-sqlite3 (CJS)** : utiliser `createRequire(import.meta.url)` pour importer `better-sqlite3` dans un contexte `"type":"module"`.

3. **Embedding OpenAI v4 SDK** : le SDK retourne `Float32Array` si pas de `encoding_format`. Toujours faire `Array.from(raw)` avant `JSON.stringify()` pour sqlite-vec.

4. **KNN + filtres** : le fast-path `vec0 MATCH` n’est pas compatible avec un `JOIN`. Pour les filtres metadata, on fait deux requêtes : (1) KNN `SELECT rowid, vec_distance_cosine(...) FROM rag_vec ORDER BY ... LIMIT N*3`, (2) filtrer les `rowid`s dans `rag_chunks`. Pour datasets <10k chunks, la version `JOIN` simple est suffisante.

5. **`index.mjs` self-contained** : toutes les fonctions sont inlinées dans un seul fichier pour que l’export soit utilisable sans dépendances sur `scripts/`.

---

## Ordre d’implémentation

1. `package.json` — ajout des dépendances
2. `scripts/api/node/embed.mjs`
3. `scripts/api/node/db.mjs`
4. `scripts/api/node/llm.mjs`
5. `scripts/api/node/router.mjs`
6. `scripts/api/node/server.mjs`
7. `scripts/api/node/build-db.mjs`
8. `scripts/serve-api.mjs`
9. `scripts/export-vector-db.mjs` — flags + `writeNodeApiExport()` + `writeBrowserApiExport()`
10. `export/vector-db/web/rag-sqlite.worker.js` — filter + minScore
11. `export/vector-db/web/rag-api.js` — nouvelle signature search
12. `bin/rager.mjs` — `serve:api` case + help

---

## Vérification

```bash
# 1. Build binary .db + export node API
rager export --node-api

# 2. Start dev server
rager serve:api --port 3737
# ou: node export/api/node/index.mjs serve 3737

# 3. Test /search
curl -X POST http://localhost:3737/search \
  -H "Content-Type: application/json" \
  -d '{"query":"compressor knee","topK":3}'

# 4. Test /chat (avec clé Anthropic dans .env)
curl -X POST http://localhost:3737/chat \
  -H "Content-Type: application/json" \
  -d '{"query":"explain knee","chatModel":{"provider":"anthropic","model":"claude-sonnet-4-6"}}'

# 5. Browser API
rager export --browser-api
# → ouvrir export/api/browser/ dans un serveur local, importer rag-api.js
```
