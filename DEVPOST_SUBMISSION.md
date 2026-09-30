# ProofGrid — Devpost Submission Copy

## Project name
**ProofGrid**

## Tagline
**Turn used-car claims into a map of what is proven, what is missing, and what to ask next.**

## Inspiration
Used-car listings are full of reassuring claims: “Full service history”, “Accident-free”, “Genuine mileage”, “New clutch”. But a claim is not the same thing as proof.

Many tools reduce a listing to a score or verdict. A confident-looking number can imply certainty the available evidence does not support. ProofGrid started with a simpler question: **what if we stopped guessing whether a listing is trustworthy and instead showed buyers exactly what has — and has not — been verified?**

That became the core principle:

> **Claims are easy. Proof is what matters.**

## What it does
ProofGrid is a verification assistant for people evaluating used-car listings.

Paste a listing and ProofGrid identifies evidence-bearing seller claims such as service history, mileage, accident history, recent repairs, ownership, inspection status, and vehicle identity.

For each claim, it shows:

1. **The claim** — what the seller says.
2. **Evidence needed** — what documentation would support it.
3. **Verification status** — Evidence seen, Missing evidence, or Concern.

Instead of collapsing everything into a trust score, ProofGrid creates a visual **Proof Grid** where each square maps to a real claim and its current verification state.

Missing evidence then becomes concrete seller questions that can be copied in one click.

ProofGrid deliberately does not say “buy this car” or “this vehicle is 87% trustworthy.” It answers a more defensible question: **what has actually been verified, and what still needs proof?**

## How it works
The core journey is:

**Paste listing → Analyze evidence → Extract claims → Map evidence → Build Proof Grid → Update statuses → Generate seller questions**

When a verification status changes, both the grid and remaining seller questions update immediately.

## How we built it
ProofGrid was developed from a new project during the hackathon using the Devpost Learn Skill Pack.

Before implementation, the project was shaped through the required planning artifacts:

- `scope.md`
- `prd.md`
- `spec.md`

That process intentionally reduced a much broader “AI car analyzer” idea into the smallest coherent product that could prove the central concept:

**listing → claims → evidence gaps → verification → next questions**

At runtime, a deterministic claim engine scans the text, maps matches to evidence requirements, removes duplicates, creates structured claim objects, and renders the Proof Grid. Seller questions are generated from unresolved evidence gaps. User state is persisted locally in the browser.

There is no required backend or external API dependency.

## Built with
- HTML5
- CSS3
- JavaScript ES Modules
- Node.js
- Browser LocalStorage
- Node native test runner
- Devpost Learn Skill Pack
- AI-assisted development workflow

## Why we chose a deterministic runtime
We considered adding an LLM API simply because this is an AI-focused hackathon. We decided not to add AI where it did not strengthen the proof of concept.

For this version, deterministic analysis gives us reproducibility, inspectability, easier testing, zero API-key setup, no usage fees, local privacy, and a demo that cannot fail because an external model is unavailable.

AI was used as a development collaborator during planning, implementation, testing, debugging, and design review. The runtime architecture remains modular enough for a future semantic extraction model.

## Challenges we ran into
### Avoiding a fake trust score
Our first results screen used a large “Evidence Coverage” percentage. Although mathematically correct, it looked too much like a confidence score. We replaced it with the Proof Grid so every visual element maps directly to a real claim.

### Separating uncertainty from concern
Missing documentation is not automatically suspicious. We therefore created three distinct states: **Verified**, **Missing**, and **Concern**.

### Keeping the scope small
VIN lookup, OCR, market pricing, accounts, uploads, image analysis, LLM runtime, and purchase recommendations all sounded useful. Most were unnecessary to prove the central idea, so we cut them from the POC.

### Making the result understandable in seconds
We repeatedly audited desktop and mobile layouts and refined hierarchy, card density, verification controls, the Proof Grid, and the “Next best action” section.

## Accomplishments that we're proud of
ProofGrid turns the abstract principle “a claim is not proof” into a complete end-to-end product interaction:

**Paste → Analyze → Inspect → Verify → Flag concerns → Generate questions**

We are also proud that we:

- created a visual model tied directly to the ProofGrid name;
- avoided an artificial trust score;
- kept listing data local to the browser;
- built the core workflow without external runtime dependencies;
- designed for desktop and mobile;
- created a guided demo mode;
- built automated tests for the evidence engine;
- red-teamed the interface instead of stopping at the first working version.

At submission preparation time: **12 / 12 automated tests pass.**

## What we learned
The biggest lesson was the value of planning before coding. The Devpost Learn workflow forced us to separate three questions:

- What problem are we actually solving?
- What user experience proves that idea?
- What is the smallest technical architecture that can deliver it well?

We also learned that mathematically correct information can still communicate the wrong idea visually. Replacing a percentage with the Proof Grid improved both design and product integrity.

Finally, we learned that stating a limitation can strengthen trust. “Verification aid — not a vehicle-quality score” is part of the product philosophy, not a disclaimer hidden in the footer.

## What's next
A future version could let users add service invoices, inspection reports, maintenance-book photos, VIN reports, and repair documents, then associate evidence with the claims it supports.

A semantic language model could extend the deterministic engine to recognize much more varied seller language and support additional languages.

Other possible extensions include OCR, evidence-history tracking, PDF export, mechanic/family sharing, VIN integrations, country-specific evidence guidance, and vehicle comparison.

The principle would remain unchanged:

> **Never turn missing information into false certainty.**

## Privacy
ProofGrid runs locally in the browser. The POC does not require listing text to be uploaded to a ProofGrid backend. User state is stored in browser LocalStorage.

**Runs locally. Nothing uploaded.**

## Testing instructions
Start the application:

```bash
node server.mjs
```

Open:

```text
http://127.0.0.1:4173
```

Guided demo mode:

```text
http://127.0.0.1:4173/?record=1
```

Run tests:

```bash
node --test tests/*.test.js
```

Expected submission-preparation baseline: **12 / 12 tests passing.**

## Closing line
> **ProofGrid does not tell you whether a seller is trustworthy. It shows you what still needs proof.**

## Recommended screenshots
1. `devpost/final-assets/01-home-value-proposition.png`
2. `devpost/final-assets/02-proof-grid.png`
3. `devpost/final-assets/03-claim-to-evidence.png`
4. `devpost/final-assets/04-next-best-action.png`
5. `devpost/final-assets/05-mobile-workflow.png`

Thumbnail: `devpost/final-assets/00-thumbnail-3x2.png`
