---
doc: prd
status: approved
---
# ProofGrid — Product Requirements

ProofGrid is an evidence-gap checker for people evaluating used-car listings online. It converts seller claims into a transparent verification checklist instead of pretending to know whether a vehicle is safe or worth buying.

Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`.

## The Core Journey
1. The user opens ProofGrid and immediately sees one main action: paste a used-car listing.
2. A realistic example listing is available as a one-click demo so the experience can be understood without preparation.
3. The user clicks **Analyze evidence**.
4. ProofGrid extracts meaningful factual claims from the listing, such as service history, recent repairs, accident history, ownership, mileage, or inspection claims.
5. Each claim is shown as a card containing:
   - the seller's claim;
   - the evidence that would normally support it;
   - the current evidence state;
   - why that evidence matters.
6. At the top of the results, ProofGrid shows **Evidence Coverage**: the share of extracted claims for which supporting evidence has been marked as seen.
7. The user can mark evidence as **Seen**, **Not provided**, or **Concern**.
8. Coverage and the summary update instantly as statuses change.
9. ProofGrid generates a prioritized **Questions to ask the seller** list from unresolved evidence gaps.
10. The user can copy the seller questions and return later without losing the current analysis in the same browser.

Success is not “ProofGrid tells the user whether to buy.” Success is that the user can identify exactly which important claims remain unsupported and knows what proof to request next.

Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

## Screens and Layout
ProofGrid is a single-page application with two main states rather than multiple screens.

### Input state
- Compact top bar with ProofGrid name and short evidence-first tagline.
- Hero area explaining the core promise in one sentence.
- Large listing text area.
- Primary **Analyze evidence** button.
- Secondary **Load example listing** action.
- Short privacy note explaining that the POC processes the text locally in the browser.

### Results state
- The input remains accessible at the top in collapsed/editable form.
- Summary strip with:
  - Evidence Coverage percentage;
  - total extracted claims;
  - verified/evidence-seen count;
  - unresolved count;
  - concern count.
- Main claim grid/list.
- Seller-question panel below the claims.
- Reset/new-analysis action.

There is no separate dashboard, account page, onboarding wizard, or chatbot view.

## Look and Feel
- Trustworthy, calm, evidence-oriented, premium but restrained.
- Visual language inspired by inspection/audit tools rather than conversational AI.
- Spacious layout with strong typography and clear hierarchy.
- Neutral background, dark text, restrained semantic status accents.
- Avoid glowing gradients, robot imagery, chat bubbles, excessive glassmorphism, and generic “AI SaaS” styling.
- Copy should be precise and non-alarmist: “Evidence not provided” rather than “Suspicious”; “Concern” only when the user explicitly marks one.
- The evidence-coverage visualization should be visually memorable but easy to understand in under two seconds.

## Features and Behavior

### Listing Input and Demo
The user can paste plain listing text into a large text area. The app refuses analysis when the field is effectively empty and gives a concise inline message.

A **Load example listing** action fills the field with a deliberately realistic demo listing containing multiple verifiable claims. Demo content is clearly labeled as sample data.

Acceptance criteria:
- [ ] Empty input cannot start analysis.
- [ ] Example listing loads with one click.
- [ ] User-entered text remains editable.

### Claim Extraction
ProofGrid identifies only claims that imply evidence could exist. It should ignore generic sales language such as “beautiful car,” “drives great,” or “must see.”

POC claim categories:
- service history;
- recent repair/replacement;
- accident/history claim;
- inspection/roadworthiness claim;
- ownership/number of owners;
- mileage-related claim;
- identity/documentation claim when explicitly mentioned.

Each extracted claim contains the exact or shortened source claim, category, expected evidence, explanation, and evidence status.

Acceptance criteria:
- [ ] Demo listing yields multiple distinct claim cards.
- [ ] Pure opinion/marketing language is not presented as documentary fact.
- [ ] Duplicate claims are not shown twice.
- [ ] Every claim has an evidence recommendation and explanation.

### Evidence States
Each claim supports three user-controlled states:
- **Not provided** — default; the listing makes the claim but no supporting proof has been confirmed by the user.
- **Evidence seen** — the user says they have seen relevant supporting evidence.
- **Concern** — the user has evidence or information that raises a problem or contradiction.

ProofGrid never automatically marks evidence as verified based only on listing text.

Acceptance criteria:
- [ ] All claims start as Not provided.
- [ ] Changing a state immediately updates the summary.
- [ ] State choice persists for the current saved analysis.

### Evidence Coverage
Evidence Coverage is calculated transparently as:

`claims marked Evidence seen / total extracted claims × 100`

It is a coverage measure, not a vehicle quality score and not a probability that claims are true.

Acceptance criteria:
- [ ] 0 evidence-seen claims produces 0% coverage.
- [ ] Marking all extracted claims Evidence seen produces 100%.
- [ ] The interface explicitly labels coverage as documentation/evidence coverage, not trust or safety.

### Seller Questions
For every unresolved claim, ProofGrid generates one concise evidence-oriented question. Questions should request the specific document or proof that maps to the claim.

Examples:
- “Could you send the dated service invoices showing mileage?”
- “Do you have the invoice for the clutch replacement, including the date and workshop?”
- “Can you provide documentation supporting the accident-free claim?”

Questions marked as resolved disappear from the unresolved list when the associated claim becomes Evidence seen. Concern items remain visible in a separate attention section.

Acceptance criteria:
- [ ] Every unresolved claim can produce a useful next question.
- [ ] Resolved questions disappear automatically.
- [ ] Questions can be copied to clipboard as a clean text block.

### Local Persistence
The current listing, extracted claims, and evidence states survive a page refresh in the same browser.

Acceptance criteria:
- [ ] Refreshing restores the previous working state.
- [ ] Reset removes the saved analysis after confirmation or clearly deliberate action.

## States and Boundaries
- **First use** — empty listing input with example CTA.
- **Ready to analyze** — non-empty listing; primary action enabled.
- **No meaningful claims found** — explain that ProofGrid only tracks claims that can reasonably be supported by evidence and invite the user to paste a more detailed listing.
- **Results** — claim cards, coverage summary, and seller questions.
- **All evidence seen** — coverage reaches 100%; seller-question list becomes empty and displays a neutral completion message, not a purchase recommendation.
- **Concern present** — summary highlights count and corresponding claims remain visible.
- **Persistence** — only the latest analysis is stored locally in the POC.

## Product Decisions
- Use an evidence-gap model instead of a “good deal / bad deal” score because the product should expose uncertainty rather than disguise it.
- Keep the product single-page so the entire value proposition can be demonstrated within a short competition video.
- Include a one-click realistic demo because judges should be able to understand the product immediately.
- Avoid automatic verification: only the user can say that evidence was actually seen.
- Keep the POC local-first to reduce privacy concerns, remove account friction, and concentrate effort on the core idea.

## What We're Building
- Single-page responsive web app.
- Listing paste/edit area.
- Demo listing.
- Deterministic POC claim extraction for the supported categories.
- Claim-to-evidence mapping.
- User-controlled evidence status.
- Transparent Evidence Coverage.
- Dynamic seller-question list.
- Copy-to-clipboard.
- Local persistence and reset.
- Polished states for empty input, no claims, results, all resolved, and concerns.

## Deferred From the POC
- LLM/API extraction — potentially useful later, but the competition demo must remain reliable and reproducible even without an external key.
- OCR/photo and document upload — expands scope significantly.
- VIN/history API — creates paid/external dependency and legal/data complexity.
- User accounts/cloud sync — unnecessary for proving the kernel.
- Price valuation — a different problem from evidence verification.
- Automatic document authenticity verification — too large and potentially misleading for this POC.

## Possible Later Enhancements
- Optional LLM-assisted extraction for arbitrary multilingual listings, while retaining deterministic fallbacks.
- Photo/PDF document evidence workspace.
- VIN and inspection-history connectors where legally and technically available.
- Exportable “buyer evidence pack.”
- Shared analysis link for a buyer and mechanic.

## Non-Goals
- No buy/don't-buy recommendation.
- No fraud/scam accusation.
- No mechanical diagnosis.
- No market-price valuation.
- No guarantee that a seller claim is true merely because a document exists.
- No background vehicle-history lookup in the POC.

## Open Questions
None that block technical planning. The technical spec should determine the smallest reliable browser implementation and verification strategy while preserving this product behavior.
