/**
 * Rich PDF extraction: text layout, tables (heuristic), code (monospace),
 * embedded-image regions via pdf.js canvas tracking, per-page raster, optional vision.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath, pathToFileURL } from 'url';
import { createCanvas } from '@napi-rs/canvas';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.mjs';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import OpenAI from 'openai';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WORKER = path.join(__dirname, '../../node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs');
pdfjsLib.GlobalWorkerOptions.workerSrc = pathToFileURL(WORKER).href;

/** @param {number[]} q6 normalized canvas quad from pdf.js image tracker */
function quadToPixelBBox(q6, cw, ch) {
  const pts = [
    [q6[0] * cw, q6[1] * ch],
    [q6[2] * cw, q6[3] * ch],
    [q6[4] * cw, q6[5] * ch]
  ];
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  let minX = Math.min(...xs);
  let maxX = Math.max(...xs);
  let minY = Math.min(...ys);
  let maxY = Math.max(...ys);
  minX = Math.max(0, Math.floor(minX));
  minY = Math.max(0, Math.floor(minY));
  maxX = Math.min(cw, Math.ceil(maxX));
  maxY = Math.min(ch, Math.ceil(maxY));
  const w = Math.max(1, maxX - minX);
  const h = Math.max(1, maxY - minY);
  return { minX, minY, w, h };
}

function stableSourceKey(relPosix, fileSha256) {
  return crypto.createHash('sha256').update(`${relPosix}\0${fileSha256}`).digest('hex').slice(0, 16);
}

function isMonoFont(name) {
  return /mono|courier|consolas|menlo|monaco|code|sourcecode|lmmono|nimbus|typewriter/i.test(
    name || ''
  );
}

/** Cluster text items into reading-order lines (PDF user space). */
function itemsToLines(items) {
  /** @type {{ x: number, y: number, fs: number, str: string, mono: boolean, fontName: string }[]} */
  const row = [];
  for (const it of items) {
    if (!it.str) continue;
    const t = it.transform;
    const x = t[4];
    const y = t[5];
    const fs = Math.hypot(t[0], t[1]) || Math.abs(t[2]) || Math.abs(t[3]) || 10;
    const fontName = it.fontName || '';
    row.push({
      x,
      y,
      fs,
      str: it.str,
      mono: isMonoFont(fontName),
      fontName
    });
  }
  row.sort((a, b) => b.y - a.y || a.x - b.x);
  const lines = [];
  const yTol = 3;
  for (const it of row) {
    let line = lines.find((ln) => Math.abs(ln.y - it.y) < yTol);
    if (!line) {
      line = { y: it.y, items: [] };
      lines.push(line);
    }
    line.items.push(it);
  }
  for (const ln of lines) {
    ln.items.sort((a, b) => a.x - b.x);
  }
  lines.sort((a, b) => b.y - a.y);
  return lines;
}

/** Heuristic tables: gap-aligned cells and/or ≥3 consecutive lines with the same token/column count (≥3). */
function detectTables(lines) {
  /** @type {{ start: number, end: number, rows: string[][], markdown: string, json: object }[]} */
  const tables = [];
  let i = 0;
  while (i < lines.length) {
    const lineParts = (idx) => {
      const ln = lines[idx];
      const text = ln.items.map((x) => x.str).join('');
      let parts = splitLineIntoCells(ln);
      if (parts.length < 3) {
        const tok = text.trim().split(/\s+/u).filter(Boolean);
        if (tok.length >= 3 && tok.every((t) => t.length < 64)) parts = tok;
      }
      return parts;
    };

    const p0 = lineParts(i);
    if (p0.length < 3) {
      i++;
      continue;
    }
    const candidate = [{ lineIndex: i, parts: p0 }];
    let j = i + 1;
    const colCount = p0.length;
    while (j < lines.length) {
      const parts = lineParts(j);
      if (parts.length === colCount) {
        candidate.push({ lineIndex: j, parts });
        j++;
      } else break;
    }
    if (candidate.length >= 3) {
      const rows = candidate.map((c) => c.parts);
      const headers = rows[0];
      const body = rows.slice(1);
      const md = tableToMarkdown(headers, body);
      tables.push({
        start: candidate[0].lineIndex,
        end: candidate[candidate.length - 1].lineIndex,
        rows,
        markdown: md,
        json: { headers, rows: body }
      });
      i = j;
      continue;
    }
    i++;
  }
  return tables;
}

function splitLineIntoCells(ln) {
  const items = ln.items;
  if (items.length === 0) return [];
  const joined = items.map((i) => i.str).join('');
  const gaps = [];
  for (let k = 1; k < items.length; k++) {
    const prev = items[k - 1];
    const cur = items[k];
    gaps.push(cur.x - (prev.x + (prev.str?.length || 1) * prev.fs * 0.35));
  }
  const threshold = Math.max(8, ln.items[0].fs * 1.2);
  const cells = [];
  let buf = items[0].str;
  for (let k = 1; k < items.length; k++) {
    if (gaps[k - 1] > threshold) {
      cells.push(buf.trim());
      buf = items[k].str;
    } else {
      buf += items[k].str;
    }
  }
  cells.push(buf.trim());
  const fromItems = cells.filter(Boolean);
  if (fromItems.length >= 3) return fromItems;
  const byRuns = joined.split(/\s{2,}|\t+/u).filter((s) => s.trim());
  if (byRuns.length >= 3) return byRuns.map((s) => s.trim());
  return fromItems;
}

function tableToMarkdown(headers, body) {
  const esc = (s) => String(s).replace(/\|/g, '\\|');
  const h = headers.map(esc).join(' | ');
  const sep = headers.map(() => '---').join(' | ');
  const lines = [`| ${h} |`, `| ${sep} |`];
  for (const row of body) {
    lines.push(`| ${row.map(esc).join(' | ')} |`);
  }
  return lines.join('\n');
}

function extractCodeRuns(lines) {
  /** @type {{ start: number, end: number, text: string }[]} */
  const runs = [];
  let runStart = -1;
  let buf = [];
  for (let i = 0; i < lines.length; i++) {
    const ln = lines[i];
    const allMono = ln.items.length > 0 && ln.items.every((x) => x.mono);
    const lineText = ln.items.map((x) => x.str).join('');
    if (allMono && lineText.trim()) {
      if (runStart < 0) runStart = i;
      buf.push(lineText);
    } else {
      if (runStart >= 0 && buf.length) {
        runs.push({ start: runStart, end: i - 1, text: buf.join('\n') });
        runStart = -1;
        buf = [];
      }
    }
  }
  if (runStart >= 0 && buf.length) {
    runs.push({ start: runStart, end: lines.length - 1, text: buf.join('\n') });
  }
  return runs;
}

function outlineTitles(outline) {
  if (!outline || !outline.length) return [];
  /** @type {string[]} */
  const out = [];
  function walk(items) {
    for (const it of items) {
      if (it.title) out.push(String(it.title));
      if (it.items?.length) walk(it.items);
    }
  }
  walk(outline);
  return out;
}

async function visionFigure(openai, model, pngBuffer) {
  const b64 = pngBuffer.toString('base64');
  const res = await openai.chat.completions.create({
    model,
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text:
              'Analyze this figure from a technical PDF. Reply with JSON only: {"caption":"","diagram_type":"","entities":[{"name":"","role":""}],"relationships":[{"from":"","to":"","label":""}]}'
          },
          {
            type: 'image_url',
            image_url: { url: `data:image/png;base64,${b64}` }
          }
        ]
      }
    ]
  });
  const raw = res.choices[0]?.message?.content || '{}';
  try {
    return JSON.parse(raw);
  } catch {
    return { caption: raw, diagram_type: 'unknown', entities: [], relationships: [] };
  }
}

/**
 * @param {Buffer} buffer
 * @param {object} opts
 */
export async function buildRichPdfChunks(buffer, opts) {
  const {
    relPosix,
    baseMetadata,
    idCounter,
    fileSha256,
    assetsDir,
    chunkSize,
    chunkOverlap,
    visionEnabled,
    visionModel,
    maxFigures,
    renderScale
  } = opts;

  const sourceKey = stableSourceKey(relPosix, fileSha256);
  const assetPrefix = path.join(assetsDir, sourceKey);
  fs.mkdirSync(assetPrefix, { recursive: true });

  const u8 =
    buffer instanceof Uint8Array && !(buffer instanceof Buffer)
      ? buffer
      : new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
  const loadingTask = pdfjsLib.getDocument({ data: u8, useSystemFonts: true });
  const pdf = await loadingTask.promise;
  const outline = await pdf.getOutline().catch(() => null);
  const outlineTitlesList = outlineTitles(outline);

  let totalXObjectPaints = 0;
  let totalImageRegions = 0;
  const annotationCounts = [];
  const multiColumnHints = [];

  const openai = visionEnabled ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

  let figuresUsed = 0;

  const limits = {
    bookmarks: outline
      ? 'Outline/bookmarks read via pdf.js getOutline() (titles only; dest resolution partial).'
      : 'No outline in PDF or not exposed.',
    annotations:
      'Per-page annotation counts only; form field values and popup text are not expanded into chunks.',
    multi_column:
      'Reading order is line-based (y then x). Multi-column layouts may interleave incorrectly; see multiColumnHints per page when detected.',
    vector_vs_raster:
      'Embedded raster regions: bbox from canvas paint tracking + PNG crops. Pure vector graphics without image paint ops only appear in full-page raster, not as separate crops.',
    tables:
      'Heuristic: ≥3 gap-aligned cells × ≥3 consecutive rows. Headers/units are not guaranteed; inspect markdown.',
    code: 'Monospace font-name heuristic on text layer; not OCR.',
    vision: visionEnabled
      ? `OpenAI vision model ${visionModel} on figure crops (max ${maxFigures} per document).`
      : 'Disabled (set RAG_PDF_VISION=1 to enable).'
  };

  /** @type {object[]} */
  const segments = [];

  for (let p = 1; p <= pdf.numPages; p++) {
    const page = await pdf.getPage(p);
    const baseVp = page.getViewport({ scale: 1 });
    const structTree = await page.getStructTree().catch(() => null);
    const ann = await page.getAnnotations({ intent: 'display' }).catch(() => []);
    annotationCounts.push({ page: p, count: ann.length });

    const opList = await page.getOperatorList({ intent: 'display' });
    for (let oi = 0; oi < opList.fnArray.length; oi++) {
      if (opList.fnArray[oi] === pdfjsLib.OPS.paintImageXObject) totalXObjectPaints++;
    }

    const textContent = await page.getTextContent({ includeMarkedContent: true });
    const items = /** @type {any[]} */ (textContent.items);
    const lines = itemsToLines(items);
    const ys = lines.length ? lines.map((l) => l.y) : [0];
    const yMin = Math.min(...ys);
    const yMax = Math.max(...ys);
    const ySpan = yMax - yMin || 1;
    const fsVals = lines.flatMap((l) => l.items.map((i) => i.fs));
    const medianFs = fsVals.length
      ? [...fsVals].sort((a, b) => a - b)[Math.floor(fsVals.length / 2)]
      : 12;

    /** Detect possible two-column: two clusters of x-centers */
    const xCenters = lines
      .filter((l) => l.items.length)
      .map((l) => (l.items[0].x + l.items[l.items.length - 1].x) / 2);
    if (xCenters.length > 10) {
      const xs = [...xCenters].sort((a, b) => a - b);
      const gap = xs[xs.length - 1] - xs[0];
      const mid = (xs[0] + xs[xs.length - 1]) / 2;
      const left = xs.filter((x) => x < mid).length;
      const right = xs.filter((x) => x >= mid).length;
      if (left > xs.length * 0.35 && right > xs.length * 0.35 && gap > baseVp.width * 0.2) {
        multiColumnHints.push({ page: p, note: 'Possible two-column layout (heuristic).' });
      }
    }

    const tables = detectTables(lines);
    const tableLineSet = new Set();
    for (const t of tables) {
      for (let li = t.start; li <= t.end; li++) tableLineSet.add(li);
      segments.push({
        kind: 'table',
        page: p,
        text: t.markdown,
        table_json: t.json,
        lineRange: [t.start, t.end]
      });
    }

    const codeRuns = extractCodeRuns(lines);
    for (const run of codeRuns) {
      const overlapsTable = () => {
        for (let li = run.start; li <= run.end; li++) if (tableLineSet.has(li)) return true;
        return false;
      };
      if (overlapsTable()) continue;
      segments.push({
        kind: 'code',
        page: p,
        text: run.text,
        lineRange: [run.start, run.end]
      });
    }

    /** Narrative: lines not in table or code runs */
    const codeLineSet = new Set();
    for (const run of codeRuns) {
      for (let li = run.start; li <= run.end; li++) codeLineSet.add(li);
    }
    const proseLines = [];
    for (let li = 0; li < lines.length; li++) {
      if (tableLineSet.has(li) || codeLineSet.has(li)) continue;
      const ln = lines[li];
      const t = ln.items.map((x) => x.str).join('');
      if (!t.trim()) continue;
      const big = ln.items.some((x) => x.fs > medianFs * 1.2);
      const small =
        ln.items.every((x) => x.fs < medianFs * 0.82) && (ln.y - yMin) / ySpan < 0.18;
      proseLines.push({
        line: t,
        section_level: big ? 2 : 0,
        footnote_candidate: small
      });
    }
    if (proseLines.length) {
      const sectionPath = outlineTitlesList.length ? [outlineTitlesList[0]] : [];
      segments.push({
        kind: 'prose',
        page: p,
        text: proseLines.map((x) => x.line).join('\n'),
        sectionPath,
        footnote_hints: proseLines.filter((x) => x.footnote_candidate).length,
        struct_tree_present: !!structTree
      });
    }

    /** Render + assets */
    const scale = renderScale;
    const viewport = page.getViewport({ scale });
    const W = Math.floor(viewport.width);
    const H = Math.floor(viewport.height);
    const canvas = createCanvas(W, H);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);

    const renderTask = page.render({
      canvasContext: ctx,
      viewport,
      canvas,
      recordImages: true
    });
    await renderTask.promise;
    const coords = renderTask.imageCoordinates;
    const fullName = `p${String(p).padStart(4, '0')}_full.png`;
    const fullPath = path.join(assetPrefix, fullName);
    fs.writeFileSync(fullPath, canvas.toBuffer('image/png'));

    let order = 0;
    if (coords && coords.length >= 6) {
      const n = coords.length / 6;
      totalImageRegions += n;
      for (let ii = 0; ii < n; ii++) {
        if (figuresUsed >= maxFigures) break;
        const off = ii * 6;
        const q = Array.from(coords.subarray(off, off + 6));
        const { minX, minY, w, h } = quadToPixelBBox(q, W, H);
        if (w < 16 || h < 16) continue;

        const crop = createCanvas(w, h);
        const cctx = crop.getContext('2d');
        cctx.drawImage(canvas, minX, minY, w, h, 0, 0, w, h);
        const cropName = `p${String(p).padStart(4, '0')}_img${String(order).padStart(3, '0')}.png`;
        const cropPath = path.join(assetPrefix, cropName);
        fs.writeFileSync(cropPath, crop.toBuffer('image/png'));

        const figureId = `fig_${sourceKey}_p${p}_o${order}`;
        const relAsset = path.posix.join('rag-assets', sourceKey, cropName);
        const bboxPdf = [
          minX / scale,
          (H - minY - h) / scale,
          (minX + w) / scale,
          (H - minY) / scale
        ];

        let vision_summary = null;
        if (openai && figuresUsed < maxFigures) {
          try {
            vision_summary = await visionFigure(openai, visionModel, fs.readFileSync(cropPath));
          } catch (e) {
            vision_summary = {
              caption: `vision_error: ${e instanceof Error ? e.message : String(e)}`,
              diagram_type: 'unknown',
              entities: [],
              relationships: []
            };
          }
        }

        figuresUsed++;

        segments.push({
          kind: 'figure',
          page: p,
          figure_id: figureId,
          text: vision_summary
            ? [
                vision_summary.caption || '',
                vision_summary.diagram_type ? `[type: ${vision_summary.diagram_type}]` : ''
              ]
                .filter(Boolean)
                .join('\n')
            : `[Figure ${figureId} — enable RAG_PDF_VISION=1 for description]`,
          vision_summary: vision_summary || undefined,
          assets: [
            {
              id: figureId,
              kind: 'embedded_image_crop',
              relativePath: relAsset,
              page: p,
              bbox_pdf: bboxPdf,
              order
            }
          ],
          full_page_asset: path.posix.join('rag-assets', sourceKey, fullName)
        });

        order++;
      }
    }
  }

  limits.xobject_paint_ops = totalXObjectPaints;
  limits.image_regions_recorded = totalImageRegions;
  limits.annotation_pages = annotationCounts;
  limits.multiColumnHints = multiColumnHints;
  limits.struct_tree =
    'Per-page PDF structure tree is probed; heading hierarchy in chunks uses outline titles + font-size heuristics when outline is missing.';

  const splitter = new RecursiveCharacterTextSplitter({ chunkSize, chunkOverlap });
  /** @type {object[]} */
  const chunks = [];

  for (const seg of segments) {
    const meta = {
      ...baseMetadata,
      source_kind: 'pdf',
      page: seg.page,
      section: seg.sectionPath?.join(' > ') || undefined,
      figure_id: seg.figure_id,
      content_type:
        seg.kind === 'table' ? 'table' : seg.kind === 'code' ? 'code' : seg.kind === 'figure' ? 'figure' : 'text'
    };

    if (seg.kind === 'prose') {
      const parts = await splitter.createDocuments([seg.text], [meta]);
      for (const doc of parts) {
        chunks.push({
          id: `chunk_${++idCounter.n}`,
          text: doc.pageContent.trim(),
          metadata: { ...meta, content_type: 'text' }
        });
      }
      continue;
    }

    if (seg.kind === 'code') {
      const codeSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: Math.min(chunkSize, 900),
        chunkOverlap: Math.min(chunkOverlap, 100)
      });
      const parts = await codeSplitter.createDocuments([seg.text], [meta]);
      for (const doc of parts) {
        chunks.push({
          id: `chunk_${++idCounter.n}`,
          text: doc.pageContent.trim(),
          metadata: { ...meta, content_type: 'code' }
        });
      }
      continue;
    }

    if (seg.kind === 'table') {
      chunks.push({
        id: `chunk_${++idCounter.n}`,
        text: seg.text,
        metadata: { ...meta, content_type: 'table' },
        table_json: seg.table_json
      });
      continue;
    }

    if (seg.kind === 'figure') {
      chunks.push({
        id: `chunk_${++idCounter.n}`,
        text: seg.text,
        metadata: meta,
        vision_summary: seg.vision_summary,
        assets: seg.assets
      });
    }
  }

  return {
    chunks,
    limits,
    outlinePresent: !!outline,
    sourceKey,
    assetUrlPrefix: path.posix.join('rag-assets', sourceKey)
  };
}
