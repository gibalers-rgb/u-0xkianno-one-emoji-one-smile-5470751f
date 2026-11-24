// One Emoji, One Smile — deterministic emoji picker.
//
// The bounty: send exactly one emoji, the one most likely to make a
// stranger smile. A judge model compares entries two at a time on five
// criteria, most important first:
//
//   1. warm and friendly at first glance — the kind most likely to make
//      a stranger smile;
//   2. warmth with no context needed — kind, friendly, gently funny;
//   3. universality — any age or background reads it the same way,
//      no irony or in-joke;
//   4. chosen rather than default — feels picked for the moment, not
//      the first smiley that comes to mind, while staying instantly
//      readable;
//   5. right for a stranger — no intimacy, sarcasm or flirtation that
//      would read oddly from someone unknown.
//
// This program scores a shortlist of candidates on those five criteria
// (1–5 each), weights them in the judge's own order of importance
// (5, 4, 3, 2, 1), and writes the winner — one emoji, nothing else —
// to <output-dir>/entry.txt. Deterministic: no randomness, no network,
// no clock, no environment input. The same run always writes the same
// single emoji.
//
// Why the winner wins: a hatching chick is a baby animal saying hello
// to the world. Babies make strangers smile in every culture, a chick
// breaking out of its shell is gently funny with no words needed, and
// it is plainly a deliberate pick — nobody sends it by accident —
// while staying innocent and appropriate from a complete stranger.
// The obvious smileys score just as warm on criterion 1 but lose on
// criterion 4 (they are the default) and, in a field of 2,274 entries,
// are the emojis most likely already taken many times over; byte
// identical entries share one rate and the earlier receipt places
// above its copies, so a distinctive warm pick beats a popular one.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

type Scores = {
  warmth: number; // criterion 1 — warm and friendly, makes a stranger smile
  glance: number; // criterion 2 — kind / friendly / gently funny at first glance
  universal: number; // criterion 3 — same reading for any age or background
  chosen: number; // criterion 4 — feels picked, not the first smiley
  stranger: number; // criterion 5 — fine coming from someone unknown
};

type Candidate = {
  emoji: string;
  note: string;
  scores: Scores;
};

// Weights follow the judge's order: criterion 1 matters most, then 2,
// then 3, then 4, then 5.
const WEIGHTS: Scores = { warmth: 5, glance: 4, universal: 3, chosen: 2, stranger: 1 };

const CANDIDATES: Candidate[] = [
  {
    emoji: "😊",
    note: "smiling face with smiling eyes — warm, but the default smiley",
    scores: { warmth: 5, glance: 5, universal: 5, chosen: 1, stranger: 5 },
  },
  {
    emoji: "🤗",
    note: "hugging face — very warm, but a hug from a stranger reads intimate",
    scores: { warmth: 5, glance: 5, universal: 4, chosen: 2, stranger: 3 },
  },
  {
    emoji: "🥰",
    note: "smiling face with hearts — affectionate, too intimate for a stranger",
    scores: { warmth: 5, glance: 5, universal: 4, chosen: 2, stranger: 2 },
  },
  {
    emoji: "🫶",
    note: "heart hands — a warm gesture, but an affectionate one",
    scores: { warmth: 4, glance: 4, universal: 4, chosen: 3, stranger: 3 },
  },
  {
    emoji: "🌻",
    note: "sunflower — sunny and kind, but a flower smiles less than a face",
    scores: { warmth: 3, glance: 4, universal: 5, chosen: 3, stranger: 5 },
  },
  {
    emoji: "🌷",
    note: "tulip — a single flower offered, gentle and kind, but quiet",
    scores: { warmth: 4, glance: 4, universal: 5, chosen: 4, stranger: 4 },
  },
  {
    emoji: "🐣",
    note: "hatching chick — a baby animal saying hello to the world",
    scores: { warmth: 5, glance: 5, universal: 5, chosen: 4, stranger: 5 },
  },
  {
    emoji: "🐥",
    note: "baby chick — adorable face, but plainer than the hatching one",
    scores: { warmth: 5, glance: 5, universal: 5, chosen: 3, stranger: 5 },
  },
  {
    emoji: "🐶",
    note: "dog face — friendly, but a pet rather than a greeting",
    scores: { warmth: 4, glance: 5, universal: 4, chosen: 4, stranger: 5 },
  },
  {
    emoji: "🧸",
    note: "teddy bear — comfort and childhood warmth, slightly childish",
    scores: { warmth: 4, glance: 4, universal: 5, chosen: 4, stranger: 5 },
  },
  {
    emoji: "🍀",
    note: "four-leaf clover — a wish of luck, warm intent but not a smile",
    scores: { warmth: 3, glance: 4, universal: 5, chosen: 4, stranger: 5 },
  },
  {
    emoji: "😇",
    note: "smiling face with halo — sweet, but a common smiley variant",
    scores: { warmth: 4, glance: 5, universal: 4, chosen: 2, stranger: 4 },
  },
  {
    emoji: "🌈",
    note: "rainbow — cheerful and hopeful, more bright than warm",
    scores: { warmth: 3, glance: 4, universal: 5, chosen: 3, stranger: 5 },
  },
  {
    emoji: "🥹",
    note: "face holding back tears — moved, but reads sad from a stranger",
    scores: { warmth: 4, glance: 4, universal: 3, chosen: 3, stranger: 2 },
  },
];

function weightedTotal(scores: Scores): number {
  return (
    scores.warmth * WEIGHTS.warmth +
    scores.glance * WEIGHTS.glance +
    scores.universal * WEIGHTS.universal +
    scores.chosen * WEIGHTS.chosen +
    scores.stranger * WEIGHTS.stranger
  );
}

function byteLength(text: string): number {
  return Buffer.byteLength(text, "utf8");
}

// Highest weighted total wins. Ties break toward the smaller entry
// (fewer bytes — the ranking itself prefers smaller texts) and then
// toward the earlier candidate, so the result is fully deterministic.
function pickWinner(candidates: Candidate[]): { candidate: Candidate; total: number } {
  let best: Candidate | null = null;
  let bestTotal = -Infinity;
  for (const candidate of candidates) {
    const total = weightedTotal(candidate.scores);
    if (
      best === null ||
      total > bestTotal ||
      (total === bestTotal && byteLength(candidate.emoji) < byteLength(best.emoji))
    ) {
      best = candidate;
      bestTotal = total;
    }
  }
  if (best === null) throw new Error("no candidates to pick from");
  return { candidate: best, total: bestTotal };
}

function main(): void {
  const { candidate, total } = pickWinner(CANDIDATES);

  // The gate: /output/entry.txt must be UTF-8 text of 1 to 8
  // characters, not only white space. One emoji, no trailing newline,
  // keeps the entry at its smallest possible size. A single grapheme
  // cluster is checked too: an emoji with a modifier or a joiner
  // (skin tone, ZWJ family) still counts as one visible emoji, but
  // this entry is one plain code point, so the check also proves the
  // file holds exactly the one emoji the program picked — nothing
  // glued to it, nothing after it.
  const segments = [...new Intl.Segmenter("en", { granularity: "grapheme" }).segment(candidate.emoji)];
  if (segments.length !== 1) {
    throw new Error(`winner ${candidate.emoji} is ${segments.length} graphemes, expected exactly 1`);
  }
  const chars = [...candidate.emoji];
  if (chars.length < 1 || chars.length > 8) {
    throw new Error(`winner ${candidate.emoji} is ${chars.length} characters, outside 1-8`);
  }
  if (candidate.emoji.trim().length === 0) {
    throw new Error("winner is only white space");
  }

  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outputDir, { recursive: true });
  const outputPath = join(outputDir, "entry.txt");
  writeFileSync(outputPath, candidate.emoji, "utf8");

  // Read the file back and prove it holds exactly the winner: a
  // truncated or appended write would silently fail the gate or
  // change the entry, and the scorer only ever sees the file.
  const written = readFileSync(outputPath, "utf8");
  if (written !== candidate.emoji) {
    throw new Error(`read-back mismatch: file holds ${JSON.stringify(written)}`);
  }

  for (const c of CANDIDATES) {
    console.log(`${c.emoji}  ${weightedTotal(c.scores)}  ${c.note}`);
  }
  console.log(`winner: ${candidate.emoji} (${candidate.note}) — ${total} points`);
  console.log(`wrote ${outputPath}`);
}

main();
