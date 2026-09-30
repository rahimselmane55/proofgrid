---
doc: spec
status: approved
---
# ProofGrid — Technical Spec

## How This Works, In Plain Language
ProofGrid will be a small local-first web application that runs entirely in the browser. The listing text never needs to leave the device. A deterministic analysis module scans the listing for supported evidence-bearing claim patterns, turns matches into structured claim objects, and maps each claim to the documentary evidence that would normally support it. The interface lets the user update evidence states; a summary module recalculates evidence coverage and a question module generates the next seller questions from unresolved claims.

The proposed implementation deliberately avoids a backend, API keys, databases, frameworks, and external AI services for the POC. This keeps the demo fast, reproducible, inspectable, and resilient during judging while proving the product's unique evidence-gap model.

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.

1. User opens the app → `app.js` restores the latest local analysis if one exists.
2. User pastes listing text or loads the labeled demo listing → the input state updates.
3. User clicks **Analyze evidence** → `claim-engine.js` normalizes the text and runs supported claim detectors.
4. Detected claims are deduplicated and enriched with category, evidence requirement, explanation, and seller-question template.
5. The state store saves the analysis to `localStorage` and triggers rendering.
6. `coverage.js` computes Evidence Coverage from user-controlled statuses only.
7. `questions.js` derives unresolved seller questions and concern items.
8. User changes a claim status → state updates immediately, coverage/questions rerender, and the latest state is persisted.
9. User copies seller questions or resets the analysis.

## Stack
**Proposed consequential choice — pending learner approval.**

- **HTML5** — semantic application shell and accessible form controls.
- **CSS3** — custom responsive styling; no UI framework.
- **Modern JavaScript (ES modules)** — application logic and browser state.
- **Node.js 20+ built-ins** — local static server and automated unit tests; no runtime npm dependencies.
- **`node:test` + `node:assert`** — deterministic unit tests for claim extraction, deduplication, coverage math, and seller-question generation.
- **Browser `localStorage`** — latest-analysis persistence.
- **Clipboard API** with a graceful fallback for copying seller questions.

Why this stack: it is intentionally boring infrastructure around a distinctive product idea. It minimizes failure points, avoids keys/costs, makes the public repository easy for judges to understand, and keeps nearly all active work focused on UX, evidence logic, and presentation.

Tradeoff: deterministic claim extraction will support a deliberately bounded vocabulary rather than arbitrary multilingual natural language. The UI will state that this is a proof of concept. The later enhancement path is an optional LLM extraction layer with the deterministic engine retained as a fallback.

## Where It Runs and How Someone Tries It
- Runtime: modern desktop/mobile browser.
- Requirement for local server/tests: Node.js 20+.
- No API keys or environment variables required for the POC.
- Start command: `node server.mjs`
- Open: `http://localhost:4173`
- Run tests: `node --test tests/*.test.js`
- The required competition demo video records this local app. Public deployment can be added later but is not required for the product to work.

## Look and Feel
Implements `prd.md > Look and Feel`.

- Restrained inspection/audit aesthetic rather than chat/AI styling.
- Warm neutral page background with dark high-contrast typography.
- One strong accent for the product identity; semantic evidence states remain visually distinct without alarmist styling.
- Large Evidence Coverage number/ring or bar as the memorable visual anchor.
- Clear card hierarchy: claim first, then evidence needed, rationale, and status controls.
- Spacious on desktop, compact stacked layout on mobile.
- Interface copy stays factual: “Not provided”, “Evidence seen”, “Concern”.
- Accessibility: visible focus states, native controls where practical, status conveyed by text as well as styling, responsive contrast.

## Components

### Application Shell
Implements `prd.md > Screens and Layout`.

Owns the header, input/results state switch, reset/new-analysis actions, and global notices. It delegates domain logic to modules rather than embedding claim rules in UI handlers.

### Listing Input and Demo Loader
Implements `prd.md > Listing Input and Demo`.

- Validates meaningful non-whitespace input.
- Loads a clearly labeled example listing.
- Keeps input editable after analysis.
- Presents concise inline errors only when needed.

### Claim Engine
Implements `prd.md > Claim Extraction`.

Pure functions transform listing text into claim objects. Each detector defines:
- category;
- recognition patterns;
- source-text extraction/shortening;
- expected evidence;
- why it matters;
- seller-question template;
- stable semantic key for deduplication.

Supported initial categories: service history, recent repair/replacement, accident/history, inspection/roadworthiness, ownership, mileage, identity/documentation.

The engine ignores broad sales adjectives unless they contain an evidence-bearing factual assertion.

### Evidence State Store
Implements `prd.md > Evidence States` and `prd.md > Local Persistence`.

Stores one current analysis with listing text, claims, statuses, schema version, and timestamp. Only explicit user interaction can change a claim from the default `not_provided` state.

### Evidence Coverage Calculator
Implements `prd.md > Evidence Coverage`.

Pure calculation:
`evidence_seen_count / total_claims * 100`, rounded consistently for display.

A zero-claim analysis returns no percentage rather than a misleading 0% score. UI language repeatedly frames this as documentation/evidence coverage, never trust or safety.

### Claim Cards
Implements `prd.md > Evidence States`.

For each claim:
- category label;
- seller claim/source text;
- evidence needed;
- why it matters;
- three explicit status choices.

Updating a card immediately updates summary, questions, and persistence.

### Seller Question Generator
Implements `prd.md > Seller Questions`.

Derives questions from unresolved claims. `evidence_seen` removes the question; `not_provided` keeps it in the request list; `concern` moves the item into a separate attention section. Copy output is plain text suitable for a marketplace message.

### Results Summary
Implements `prd.md > Evidence Coverage` and `prd.md > States and Boundaries`.

Displays evidence coverage, total claims, evidence-seen count, unresolved count, and concern count. Handles all-resolved and concern-present states without issuing any buy/don't-buy verdict.

## Data Model

```js
{
  schemaVersion: 1,
  listingText: string,
  analyzedAt: string, // ISO timestamp
  claims: [
    {
      id: string,
      semanticKey: string,
      category: 'service' | 'repair' | 'history' | 'inspection' | 'ownership' | 'mileage' | 'identity',
      sourceText: string,
      evidenceNeeded: string,
      whyItMatters: string,
      sellerQuestion: string,
      status: 'not_provided' | 'evidence_seen' | 'concern'
    }
  ]
}
```

Persistence key: `proofgrid.analysis.v1` in browser `localStorage`.

## File Structure

```text
proofgrid/
├── index.html                 # semantic application shell
├── styles.css                 # complete responsive visual layer
├── server.mjs                 # tiny no-dependency local static server
├── src/
│   ├── app.js                 # orchestration + browser event wiring
│   ├── claim-engine.js        # deterministic claim extraction
│   ├── claim-rules.js         # bounded claim/evidence rule definitions
│   ├── coverage.js            # transparent coverage math
│   ├── questions.js           # seller-question derivation
│   ├── storage.js             # localStorage schema/read/write/reset
│   ├── render.js              # DOM rendering functions
│   └── demo-data.js           # clearly labeled sample listing
├── tests/
│   ├── claim-engine.test.js
│   ├── coverage.test.js
│   └── questions.test.js
├── devpost/
│   ├── learner-profile.md
│   ├── scope.md
│   ├── prd.md
│   ├── spec.md
│   └── checklist.md           # created by build workflow
├── README.md
└── LICENSE
```

## External Services and Dependencies
None for the POC.

- No model API.
- No database.
- No VIN/history provider.
- No analytics SDK.
- No account/auth provider.
- No paid service.

This is a deliberate reliability/privacy choice, not an omission hidden from the submission.

## Important Failure Modes
- **Listing contains no supported documentary claims** → show a “No evidence-bearing claims found” state, explain the POC boundary, keep the text editable, and offer the demo listing.
- **A listing matches the same factual claim in several phrasings** → semantic deduplication keeps one useful claim card rather than inflating coverage denominator.
- **Stored state is malformed or from a future schema** → discard it safely and start clean; never break app startup.
- **Clipboard permission/API fails** → fall back to a selectable text area/manual copy message.

## What Was Simplified and Why
- **Deterministic extraction** instead of an LLM/API — makes behavior reproducible and free while proving the unique kernel. Arbitrary multilingual extraction is deferred.
- **One latest analysis** instead of analysis history/accounts — enough to prove persistence and the repeat loop.
- **User-attested evidence state** instead of document upload/authenticity checking — avoids pretending the POC can verify documents it has never inspected.
- **Local app** instead of mandatory cloud deployment — deployment adds no proof to the core evidence-gap idea and the contest requires a video plus public repository anyway.

## Verification Strategy
- Unit-test every pure domain module with Node's built-in test runner.
- Create a fixed demo listing whose expected extracted categories are asserted in tests.
- Assert marketing-only text yields zero claims.
- Assert duplicate factual wording is deduplicated.
- Assert coverage boundaries: zero seen → 0%; all seen → 100%.
- Assert question removal/movement as evidence states change.
- Manual browser acceptance pass against every PRD acceptance criterion before video recording.

## Decisions and Open Issues
- **Product architecture recommendation:** static local-first browser app with no external services. Pending learner approval before implementation.
- **Technical learning uncertainty:** none explicitly identified by the learner; build will keep explanations concise and focus on visible product progress.
- **Optional later decision:** public static hosting for judge convenience. It does not block implementation or demo recording.
