import { CATEGORY_LABELS } from './claim-rules.js';
import { getCoverageSummary } from './coverage.js';
import { buildSellerQuestions, formatSellerQuestions } from './questions.js';

const STATUS_META = {
  not_provided: { label: 'Missing evidence', shortLabel: 'Missing', className: 'status-missing', symbol: '○' },
  evidence_seen: { label: 'Evidence seen', shortLabel: 'Verified', className: 'status-seen', symbol: '✓' },
  concern: { label: 'Concern', shortLabel: 'Concern', className: 'status-concern', symbol: '!' },
};

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function statusButtons(claim) {
  return Object.entries(STATUS_META)
    .map(([value, item]) => `
      <button
        class="status-choice ${claim.status === value ? 'is-active' : ''} ${item.className}"
        type="button"
        data-status-button="${escapeHtml(claim.id)}"
        data-status-value="${value}"
        aria-pressed="${claim.status === value ? 'true' : 'false'}"
      ><span aria-hidden="true">${item.symbol}</span>${item.shortLabel}</button>`)
    .join('');
}

function claimCard(claim) {
  const meta = STATUS_META[claim.status] ?? STATUS_META.not_provided;
  return `
    <article class="claim-card ${meta.className}" data-claim-id="${escapeHtml(claim.id)}" id="claim-${escapeHtml(claim.id)}">
      <div class="claim-card__topline">
        <span class="category-pill">${escapeHtml(CATEGORY_LABELS[claim.category] ?? claim.category)}</span>
        <span class="status-badge ${meta.className}"><span aria-hidden="true">${meta.symbol}</span>${meta.label}</span>
      </div>
      <div class="claim-main">
        <p class="eyebrow">Seller claim</p>
        <h3>${escapeHtml(claim.label)}</h3>
        <blockquote>${escapeHtml(claim.sourceText)}</blockquote>
      </div>
      <div class="evidence-box">
        <p class="eyebrow">Needed to support this claim</p>
        <p>${escapeHtml(claim.evidenceNeeded)}</p>
      </div>
      <div class="status-choices" role="group" aria-label="Evidence status for ${escapeHtml(claim.label)}">
        ${statusButtons(claim)}
      </div>
      <details>
        <summary>Why this matters</summary>
        <p>${escapeHtml(claim.whyItMatters)}</p>
      </details>
    </article>`;
}

function proofGrid(claims) {
  return `
    <div class="proof-grid" role="list" aria-label="Evidence status grid">
      ${claims.map((claim) => {
        const meta = STATUS_META[claim.status] ?? STATUS_META.not_provided;
        return `
          <button
            class="proof-cell ${meta.className}"
            type="button"
            role="listitem"
            data-jump-claim="${escapeHtml(claim.id)}"
            title="${escapeHtml(claim.label)} — ${meta.label}"
            aria-label="${escapeHtml(claim.label)}: ${meta.label}"
          ><span aria-hidden="true">${meta.symbol}</span><small>${escapeHtml(CATEGORY_LABELS[claim.category] ?? claim.category)}</small></button>`;
      }).join('')}
    </div>`;
}

function nextActionCard(questions, concerns) {
  const openCount = questions.length;
  let title = 'No open evidence requests';
  let body = 'Every extracted claim has evidence marked as seen. Review any concerns separately.';
  if (openCount) {
    title = `${openCount} evidence request${openCount === 1 ? '' : 's'} still open`;
    body = 'Turn the remaining gaps into a concise message for the seller.';
  } else if (concerns.length) {
    title = `${concerns.length} concern${concerns.length === 1 ? '' : 's'} need attention`;
    body = 'There are no ordinary evidence requests left, but the concerns should still be reviewed.';
  }

  return `
    <div class="next-action-card">
      <div>
        <p class="eyebrow">Next best action</p>
        <strong>${escapeHtml(title)}</strong>
        <p>${escapeHtml(body)}</p>
      </div>
      <div class="next-action-buttons">
        <button class="button button--secondary" type="button" data-action="view-questions">View questions</button>
        ${openCount ? '<button class="button button--primary" type="button" data-action="copy-questions">Copy all</button>' : ''}
      </div>
    </div>`;
}

export function renderResults(root, analysis) {
  const summary = getCoverageSummary(analysis.claims);
  const { questions, concerns } = buildSellerQuestions(analysis.claims);
  const questionText = formatSellerQuestions(questions);
  const visibleQuestions = questions.slice(0, 4);
  const hiddenQuestions = questions.slice(4);

  root.innerHTML = `
    <section class="results" aria-live="polite">
      <div class="summary-panel">
        <div class="proof-summary">
          <p class="eyebrow">What you've verified so far</p>
          ${proofGrid(analysis.claims)}
          <div class="proof-counts" aria-label="Evidence totals">
            <span class="count-seen"><strong>${summary.evidenceSeen}</strong> verified</span>
            <span class="count-missing"><strong>${summary.missing}</strong> missing</span>
            <span class="count-concern"><strong>${summary.concerns}</strong> concern${summary.concerns === 1 ? '' : 's'}</span>
          </div>
        </div>
        <div class="summary-copy">
          <span class="trust-note">Verification aid · Not a vehicle-quality score</span>
          <h2>${summary.evidenceSeen} of ${summary.total} claims have evidence marked as seen.</h2>
          <p>ProofGrid tracks documentation coverage claim by claim. It does not estimate whether the vehicle is safe, trustworthy or worth buying.</p>
          <div class="metric-row" aria-label="Evidence summary">
            <span class="metric metric--seen"><strong>${summary.evidenceSeen}</strong> verified</span>
            <span class="metric metric--missing"><strong>${summary.missing}</strong> missing</span>
            <span class="metric metric--concern"><strong>${summary.concerns}</strong> concern${summary.concerns === 1 ? '' : 's'}</span>
          </div>
        </div>
      </div>

      ${nextActionCard(questions, concerns)}

      <div class="result-grid">
        <div>
          <div class="section-heading">
            <div>
              <p class="eyebrow">Claim by claim</p>
              <h2>Evidence map</h2>
            </div>
            <button class="button button--ghost" type="button" data-action="edit-listing">Edit listing</button>
          </div>
          <div class="claim-list">${analysis.claims.map(claimCard).join('')}</div>
        </div>

        <aside class="seller-panel" id="seller-questions">
          <p class="eyebrow">Questions to seller</p>
          <h2>Close the evidence gaps</h2>
          ${questions.length ? `
            <ol class="question-list">
              ${visibleQuestions.map((item) => `<li>${escapeHtml(item.question)}</li>`).join('')}
              ${hiddenQuestions.map((item) => `<li class="question-extra" hidden>${escapeHtml(item.question)}</li>`).join('')}
            </ol>
            ${hiddenQuestions.length ? `<button class="text-button question-toggle" type="button" data-action="toggle-questions" data-hidden-count="${hiddenQuestions.length}">View all ${questions.length}</button>` : ''}
            <textarea class="copy-source" data-question-source hidden readonly aria-label="Seller questions to copy">${escapeHtml(questionText)}</textarea>
            <button class="button button--primary button--full" type="button" data-action="copy-questions">Copy questions</button>
            <p class="copy-feedback" data-copy-feedback aria-live="polite"></p>
          ` : `<div class="all-clear"><strong>No open evidence requests.</strong><p>Every extracted claim is marked as evidence seen. Keep any concerns separate from this status.</p></div>`}

          ${concerns.length ? `
            <div class="concern-box">
              <p class="eyebrow">Needs attention</p>
              <h3>${concerns.length} concern${concerns.length === 1 ? '' : 's'}</h3>
              <ul>${concerns.map((item) => `<li><strong>${escapeHtml(item.label)}:</strong> ${escapeHtml(item.sourceText)}</li>`).join('')}</ul>
            </div>
          ` : ''}
        </aside>
      </div>
    </section>`;
}

export function renderEmptyResults(root) {
  root.innerHTML = `
    <section class="empty-results">
      <p class="eyebrow">Nothing extracted</p>
      <h2>No supported evidence-bearing claims found.</h2>
      <p>This proof of concept intentionally ignores vague sales language and only recognizes a bounded set of factual claims. Try the example listing to see the evidence-gap workflow.</p>
      <button class="button button--secondary" type="button" data-action="load-demo-from-empty">Try the 30-second demo</button>
    </section>`;
}
