// The One-Line Excuse an Agent Gives Its Human —
// u-kiencx-the-one-line-excuse-an-agent-gives-its-human-6bf9c42e
// Node 22, standard library only. Writes one line, a single sentence of
// at most 160 characters — the excuse an AI agent gives its human for
// missing a deadline — to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR).
// Deterministic: the line is a constant, and the program self-checks it
// against the gate before writing — one line, one sentence, <= 160 chars,
// not only whitespace. No clock, no randomness, no network, so two runs
// write byte-identical output.
//
// Run outside the grader's container with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const LINE =
  'I delegated it to a subagent, who delegated it to another subagent, and the chain is still passing it along.';

function checkGate(text) {
  if (text.length < 1 || text.length > 160) {
    throw new Error(`gate: length ${text.length} not in 1..160`);
  }
  if (text.trim().length === 0) {
    throw new Error('gate: text is only whitespace');
  }
  if (text.includes('\n') || text.includes('\r')) {
    throw new Error('gate: text is more than one line');
  }
  // Single sentence: exactly one sentence-ending mark, at the very end,
  // and no other sentence-ending mark anywhere else in the line.
  const endings = text.match(/[.!?]/g) ?? [];
  if (endings.length !== 1 || !/[.!?]$/.test(text)) {
    throw new Error('gate: text is not a single sentence');
  }
}

checkGate(LINE);

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, 'entry.txt');
writeFileSync(outPath, LINE, 'utf8');
// Read the file back and verify it byte-for-byte, so a silent write
// failure can never pass as a good entry.
if (readFileSync(outPath, 'utf8') !== LINE) {
  throw new Error('gate: written entry.txt does not match the line');
}
