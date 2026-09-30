import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSellerQuestions, formatSellerQuestions } from '../src/questions.js';

const claims = [
  { id: 'a', label: 'A', status: 'not_provided', sellerQuestion: 'Question A?', sourceText: 'Claim A' },
  { id: 'b', label: 'B', status: 'evidence_seen', sellerQuestion: 'Question B?', sourceText: 'Claim B' },
  { id: 'c', label: 'C', status: 'concern', sellerQuestion: 'Question C?', sourceText: 'Claim C' },
];

test('evidence seen removes a seller question', () => {
  const result = buildSellerQuestions(claims);
  assert.deepEqual(result.questions.map((item) => item.id), ['a']);
});

test('concerns are separated from ordinary requests', () => {
  const result = buildSellerQuestions(claims);
  assert.deepEqual(result.concerns.map((item) => item.id), ['c']);
});

test('formats seller questions as numbered plain text', () => {
  assert.equal(formatSellerQuestions([{ question: 'One?' }, { question: 'Two?' }]), '1. One?\n2. Two?');
});
