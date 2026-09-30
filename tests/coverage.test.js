import test from 'node:test';
import assert from 'node:assert/strict';
import { getCoverageSummary } from '../src/coverage.js';

test('zero claims yields no percentage', () => {
  assert.deepEqual(getCoverageSummary([]), {
    total: 0,
    evidenceSeen: 0,
    missing: 0,
    unresolved: 0,
    concerns: 0,
    percentage: null,
  });
});

test('separates missing evidence from concerns', () => {
  const summary = getCoverageSummary([{ status: 'not_provided' }, { status: 'concern' }]);
  assert.equal(summary.percentage, 0);
  assert.equal(summary.missing, 1);
  assert.equal(summary.concerns, 1);
  assert.equal(summary.unresolved, 2);
});

test('all seen yields one hundred percent', () => {
  const summary = getCoverageSummary([{ status: 'evidence_seen' }, { status: 'evidence_seen' }]);
  assert.equal(summary.percentage, 100);
  assert.equal(summary.missing, 0);
  assert.equal(summary.unresolved, 0);
});

test('coverage rounds consistently', () => {
  const summary = getCoverageSummary([
    { status: 'evidence_seen' },
    { status: 'not_provided' },
    { status: 'not_provided' },
  ]);
  assert.equal(summary.percentage, 33);
  assert.equal(summary.missing, 2);
});
