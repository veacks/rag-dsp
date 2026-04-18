const resultsEl = document.getElementById('results');
const askBtn = document.getElementById('askBtn');
const questionEl = document.getElementById('question');

let ragData = [];
let ragMeta = null;

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;
  const n = Math.min(a.length, b.length);
  for (let i = 0; i < n; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

/** Placeholder embedding — replace with a local WASM/WebGPU embedder matching the build model. */
async function fakeEmbed(text) {
  const vec = new Array(256).fill(0);
  for (let i = 0; i < text.length; i++) {
    vec[i % vec.length] += text.charCodeAt(i) / 255;
  }
  return vec;
}

async function loadRagData() {
  const res = await fetch('./rag.json');
  if (!res.ok) {
    resultsEl.textContent = `Could not load rag.json (${res.status}). Run: npm run build:rag`;
    return;
  }
  const raw = await res.json();
  if (Array.isArray(raw)) {
    ragData = raw;
    ragMeta = null;
  } else {
    ragData = raw.chunks ?? [];
    ragMeta = raw;
  }
  const ver =
    ragMeta?.schemaVersion != null
      ? ` schema v${ragMeta.schemaVersion}`
      : '';
  const built = ragMeta?.builtAt ? ` · built ${ragMeta.builtAt}` : '';
  const src = (() => {
    const s = ragMeta?.source;
    if (!s) return '';
    if (s.type === 'urls' && s.fetchedCount != null) {
      return ` · ${s.fetchedCount} URL(s) from list`;
    }
    if (s.sha256) return ` · source ${s.sha256.slice(0, 12)}…`;
    return '';
  })();
  resultsEl.textContent = `Loaded ${ragData.length} chunks${ver}${built}${src}`;
}

async function search(question, topK = 5) {
  const qVec = await fakeEmbed(question);
  const scored = ragData.map((item) => ({
    ...item,
    score: cosineSimilarity(qVec, item.embedding.slice(0, 256))
  }));
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, topK);
}

askBtn.addEventListener('click', async () => {
  const question = questionEl.value.trim();
  if (!question) return;
  if (!ragData.length) {
    resultsEl.textContent = 'No data loaded.';
    return;
  }
  const top = await search(question, 5);
  resultsEl.textContent = top
    .map((r, i) => {
      const meta = r.metadata || {};
      const lines = [
        `#${i + 1} score=${r.score.toFixed(4)}`,
        `source=${meta.source || ''}`
      ];
      if (meta.path) lines.push(`path=${meta.path}`);
      if (meta.sitePath) lines.push(`sitePath=${meta.sitePath}`);
      if (meta.url) lines.push(`url=${meta.url}`);
      lines.push(r.text.slice(0, 800), '');
      return lines.join('\n');
    })
    .join('\n----------------------\n');
});

await loadRagData();
