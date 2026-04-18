const resultsEl = document.getElementById('results');
const askBtn = document.getElementById('askBtn');
const questionEl = document.getElementById('question');

let ragData = [];

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
  ragData = await res.json();
  resultsEl.textContent = `Loaded ${ragData.length} chunks`;
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
      return [
        `#${i + 1} score=${r.score.toFixed(4)}`,
        `source=${r.metadata?.source || ''}`,
        r.text.slice(0, 800),
        ''
      ].join('\n');
    })
    .join('\n----------------------\n');
});

await loadRagData();
