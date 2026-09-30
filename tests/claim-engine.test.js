import test from 'node:test';
import assert from 'node:assert/strict';
import { extractClaims, normalizeListingText } from '../src/claim-engine.js';
import { DEMO_LISTING } from '../src/demo-data.js';

test('normalizes listing text safely', () => {
  assert.equal(normalizeListingText('  Full   service\r\nhistory  '), 'Full service\nhistory');
});

test('extracts the expected evidence-bearing categories from demo listing', () => {
  const claims = extractClaims(DEMO_LISTING);
  const keys = claims.map((claim) => claim.semanticKey);
  assert.deepEqual(keys, [
    'service.full_history',
    'repair.timing_belt',
    'repair.brakes',
    'history.accident_free',
    'inspection.valid',
    'ownership.one_owner',
    'mileage.genuine',
    'identity.vin',
  ]);
});

test('marketing-only language yields zero claims', () => {
  const claims = extractClaims('Stunning car. Drives perfectly. Beautiful condition. First to see will buy.');
  assert.equal(claims.length, 0);
});

test('duplicate wording for the same semantic claim yields one card', () => {
  const claims = extractClaims('Full service history. Complete service history with stamped book.');
  assert.equal(claims.length, 1);
  assert.equal(claims[0].semanticKey, 'service.full_history');
});

test('all new claims default to not_provided', () => {
  const claims = extractClaims('New clutch. Accident-free.');
  assert.ok(claims.length >= 2);
  assert.ok(claims.every((claim) => claim.status === 'not_provided'));
});
