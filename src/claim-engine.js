import { CLAIM_RULES } from './claim-rules.js';

const SENTENCE_SPLIT = /(?<=[.!?])\s+|\n+/;

export function normalizeListingText(text) {
  return String(text ?? '')
    .replace(/\u00a0/g, ' ')
    .replace(/[\t ]+/g, ' ')
    .replace(/\r\n?/g, '\n')
    .trim();
}

function compactSource(sentence, max = 180) {
  const cleaned = sentence.trim().replace(/\s+/g, ' ');
  return cleaned.length <= max ? cleaned : `${cleaned.slice(0, max - 1).trimEnd()}…`;
}

function stableId(semanticKey) {
  return semanticKey.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase();
}

export function extractClaims(text, rules = CLAIM_RULES) {
  const normalized = normalizeListingText(text);
  if (!normalized) return [];

  const sentences = normalized
    .split(SENTENCE_SPLIT)
    .map((part) => part.trim())
    .filter(Boolean);

  const seen = new Set();
  const claims = [];

  for (const rule of rules) {
    let matchedSentence = null;

    for (const sentence of sentences) {
      if (rule.patterns.some((pattern) => pattern.test(sentence))) {
        matchedSentence = sentence;
        break;
      }
    }

    if (!matchedSentence || seen.has(rule.semanticKey)) continue;
    seen.add(rule.semanticKey);

    claims.push({
      id: stableId(rule.semanticKey),
      semanticKey: rule.semanticKey,
      category: rule.category,
      label: rule.label,
      sourceText: compactSource(matchedSentence),
      evidenceNeeded: rule.evidenceNeeded,
      whyItMatters: rule.whyItMatters,
      sellerQuestion: rule.sellerQuestion,
      status: 'not_provided',
    });
  }

  return claims;
}
