import { extractClaims } from './claim-engine.js';
import { DEMO_LISTING } from './demo-data.js';
import { loadAnalysis, saveAnalysis, clearAnalysis, SCHEMA_VERSION } from './storage.js';
import { renderResults, renderEmptyResults } from './render.js';

const form = document.querySelector('[data-listing-form]');
const textarea = document.querySelector('[data-listing-input]');
const inputPanel = document.querySelector('[data-input-panel]');
const resultsRoot = document.querySelector('[data-results-root]');
const errorNode = document.querySelector('[data-form-error]');
const demoButton = document.querySelector('[data-load-demo]');
const resetButton = document.querySelector('[data-reset]');
const demoCaption = document.querySelector('[data-demo-caption]');
const recordingDemoMode = new URLSearchParams(window.location.search).get('record') === '1';

let currentAnalysis = null;

function motionAllowed() {
  return !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

function showInput({ keepText = true } = {}) {
  inputPanel.hidden = false;
  resultsRoot.hidden = true;
  if (!keepText) textarea.value = '';
  textarea.focus();
}

function showResults({ focusResults = false } = {}) {
  inputPanel.hidden = true;
  resultsRoot.hidden = false;
  if (focusResults) {
    requestAnimationFrame(() => resultsRoot.scrollIntoView({ behavior: motionAllowed() ? 'smooth' : 'auto', block: 'start' }));
  }
}

function persistAndRender({ focusResults = false } = {}) {
  saveAnalysis(currentAnalysis);
  renderResults(resultsRoot, currentAnalysis);
  showResults({ focusResults });
}

function analyze(text) {
  const clean = text.trim();
  errorNode.textContent = '';

  if (clean.length < 20) {
    errorNode.textContent = 'Paste a little more of the listing so ProofGrid has enough context to analyze.';
    textarea.focus();
    return;
  }

  const claims = extractClaims(clean);
  currentAnalysis = {
    schemaVersion: SCHEMA_VERSION,
    listingText: clean,
    analyzedAt: new Date().toISOString(),
    claims,
  };

  if (!claims.length) {
    clearAnalysis();
    renderEmptyResults(resultsRoot);
    showResults({ focusResults: true });
    return;
  }

  persistAndRender({ focusResults: true });
}

function loadDemo({ analyzeImmediately = false } = {}) {
  textarea.value = DEMO_LISTING;
  errorNode.textContent = '';
  if (analyzeImmediately) analyze(DEMO_LISTING);
  else textarea.focus();
}

async function copyQuestions() {
  const source = resultsRoot.querySelector('[data-question-source]');
  const feedback = resultsRoot.querySelector('[data-copy-feedback]');
  if (!source) return;

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(source.value);
    } else {
      source.hidden = false;
      source.select();
      document.execCommand('copy');
      source.hidden = true;
    }
    if (feedback) feedback.textContent = 'Copied — ready to paste into a message to the seller.';
  } catch {
    source.hidden = false;
    source.focus();
    source.select();
    if (feedback) feedback.textContent = 'Copy was blocked. The questions are selected so you can copy them manually.';
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  analyze(textarea.value);
});

demoButton.addEventListener('click', () => loadDemo({ analyzeImmediately: true }));

resetButton.addEventListener('click', () => {
  clearAnalysis();
  currentAnalysis = null;
  textarea.value = '';
  resultsRoot.innerHTML = '';
  showInput({ keepText: false });
});

resultsRoot.addEventListener('click', async (event) => {
  const statusButton = event.target.closest('[data-status-button]');
  if (statusButton && currentAnalysis) {
    const claim = currentAnalysis.claims.find((item) => item.id === statusButton.dataset.statusButton);
    if (!claim) return;
    claim.status = statusButton.dataset.statusValue;
    persistAndRender();
    return;
  }

  const jumpNode = event.target.closest('[data-jump-claim]');
  if (jumpNode) {
    const target = resultsRoot.querySelector(`[data-claim-id="${CSS.escape(jumpNode.dataset.jumpClaim)}"]`);
    target?.scrollIntoView({ behavior: motionAllowed() ? 'smooth' : 'auto', block: 'center' });
    return;
  }

  const actionNode = event.target.closest('[data-action]');
  if (!actionNode) return;

  if (actionNode.dataset.action === 'edit-listing') {
    textarea.value = currentAnalysis?.listingText ?? textarea.value;
    showInput();
    return;
  }

  if (actionNode.dataset.action === 'load-demo-from-empty') {
    showInput();
    loadDemo({ analyzeImmediately: true });
    return;
  }

  if (actionNode.dataset.action === 'copy-questions') {
    await copyQuestions();
    return;
  }

  if (actionNode.dataset.action === 'view-questions') {
    resultsRoot.querySelector('#seller-questions')?.scrollIntoView({ behavior: motionAllowed() ? 'smooth' : 'auto', block: 'start' });
    return;
  }

  if (actionNode.dataset.action === 'toggle-questions') {
    const extras = [...resultsRoot.querySelectorAll('.question-extra')];
    const currentlyHidden = extras.some((item) => item.hidden);
    extras.forEach((item) => { item.hidden = !currentlyHidden; });
    actionNode.textContent = currentlyHidden ? 'Show fewer' : `View all ${4 + Number(actionNode.dataset.hiddenCount ?? 0)}`;
  }
});

function wait(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function setDemoCaption(text = '') {
  if (!demoCaption) return;
  demoCaption.textContent = text;
  demoCaption.hidden = !text;
}

function clearDemoFocus() {
  document.querySelectorAll('.demo-focus, .demo-pulse').forEach((node) => {
    node.classList.remove('demo-focus', 'demo-pulse');
  });
}

function focusForDemo(node, { pulse = false, block = 'center' } = {}) {
  clearDemoFocus();
  if (!node) return;
  node.classList.add('demo-focus');
  if (pulse) node.classList.add('demo-pulse');
  node.scrollIntoView({ behavior: motionAllowed() ? 'smooth' : 'auto', block });
}

function setClaimStatusForDemo(claimId, status) {
  if (!currentAnalysis) return;
  const claim = currentAnalysis.claims.find((item) => item.id === claimId);
  if (!claim) return;
  claim.status = status;
  persistAndRender();
}

async function runRecordingDemo() {
  document.body.classList.add('is-recording-demo');
  clearAnalysis();
  currentAnalysis = null;
  textarea.value = '';
  resultsRoot.innerHTML = '';
  showInput({ keepText: false });
  window.scrollTo({ top: 0, behavior: 'auto' });

  setDemoCaption('Used-car listings make reassuring claims. But a claim is not proof.');
  await wait(4800);

  loadDemo();
  focusForDemo(document.querySelector('.input-card'), { pulse: true, block: 'center' });
  setDemoCaption('ProofGrid separates what the seller says from what can actually be verified.');
  await wait(4300);

  analyze(DEMO_LISTING);
  await wait(1200);
  focusForDemo(resultsRoot.querySelector('.summary-panel'), { pulse: true, block: 'center' });
  setDemoCaption('Eight evidence-bearing claims are extracted — without inventing a trust score.');
  await wait(5200);

  const serviceCard = resultsRoot.querySelector('[data-claim-id="service-full-history"]');
  focusForDemo(serviceCard, { block: 'center' });
  setDemoCaption('Each claim is matched with the evidence that would actually support it.');
  await wait(4300);

  setClaimStatusForDemo('service-full-history', 'evidence_seen');
  await wait(450);
  focusForDemo(resultsRoot.querySelector('[data-claim-id="service-full-history"]'), { pulse: true, block: 'center' });
  setDemoCaption('See real documentation? Mark that claim as verified.');
  await wait(3500);

  setClaimStatusForDemo('repair-timing-belt', 'evidence_seen');
  await wait(350);
  setClaimStatusForDemo('repair-brakes', 'evidence_seen');
  await wait(700);
  focusForDemo(resultsRoot.querySelector('.proof-summary'), { pulse: true, block: 'center' });
  setDemoCaption('The Proof Grid updates claim by claim as evidence is checked.');
  await wait(4300);

  setClaimStatusForDemo('history-accident-free', 'concern');
  await wait(650);
  focusForDemo(resultsRoot.querySelector('[data-claim-id="history-accident-free"]'), { pulse: true, block: 'center' });
  setDemoCaption('A red flag becomes a concern — not something hidden inside one score.');
  await wait(4400);

  focusForDemo(resultsRoot.querySelector('.next-action-card'), { pulse: true, block: 'center' });
  setDemoCaption('Every remaining evidence gap becomes a concrete next action.');
  await wait(4300);

  const sellerPanel = resultsRoot.querySelector('#seller-questions');
  focusForDemo(sellerPanel, { block: 'center' });
  setDemoCaption('ProofGrid turns uncertainty into specific questions you can send to the seller.');
  await wait(5200);

  focusForDemo(resultsRoot.querySelector('.trust-note'), { pulse: true, block: 'center' });
  setDemoCaption('It is a verification aid — not a vehicle-quality score or purchase recommendation.');
  await wait(5100);

  focusForDemo(resultsRoot.querySelector('.summary-panel'), { pulse: true, block: 'center' });
  setDemoCaption('Know what is claimed. Know what is proven. Know what to ask next.');
  await wait(7000);

  clearDemoFocus();
  setDemoCaption('ProofGrid');
  window.__proofGridDemoDone = true;
}

if (recordingDemoMode) {
  showInput();
  window.setTimeout(() => { runRecordingDemo(); }, 800);
} else {
  const restored = loadAnalysis();
  if (restored?.claims?.length) {
    currentAnalysis = restored;
    textarea.value = restored.listingText;
    renderResults(resultsRoot, currentAnalysis);
    showResults();
  } else {
    showInput();
  }
}
