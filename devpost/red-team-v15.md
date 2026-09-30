# ProofGrid V1.5 — Red-Team Review

Date: 2026-09-30
Scope: visual clarity, product credibility, demo strength, accessibility spot-check, and obvious product-risk claims.

## What improved from V1

- Replaced the donut percentage with a claim-by-claim **Proof Grid** so the product no longer visually resembles a trust score.
- Split state into **verified / missing / concern** with distinct counts and symbols.
- Replaced the status dropdown with direct state buttons for faster demo interaction.
- Added **Next best action** before the long evidence map.
- Moved seller questions before the claim list on narrow screens.
- Shortened claim cards and made supporting evidence more scannable.
- Made privacy/local execution visible at the input surface.
- Added a clear "Verification aid · Not a vehicle-quality score" label near results.
- Replaced the generic PG badge with a small 2×2 grid mark tied to the product concept.

## Red-team findings

### Critical / high

No unresolved critical visual or product-credibility issue found in the V1.5 rendered states.

A copy-source textarea was initially visible in the rendered result panel. It was a real presentation bug and has been fixed by keeping the source hidden unless clipboard fallback is required.

### Medium

1. **"Verified" is still user-attested.**
   - Risk: a viewer could read "verified" as ProofGrid authenticating a document.
   - Mitigation already present: copy says evidence is "marked as seen" and explicitly states this is documentation coverage, not a trust/safety/vehicle-quality score.
   - Submission/video requirement: say once that the POC does not authenticate documents; the user marks evidence they have seen.

2. **Deterministic extraction has bounded vocabulary.**
   - Risk: judges may test arbitrary wording and miss claims.
   - Mitigation: demo listing is labeled and the README states the English-focused bounded POC limitation.
   - Next iteration: broaden patterns only if it does not destabilize the demo; do not add an external LLM solely for novelty.

3. **Mobile result pages remain long by nature.**
   - Mitigation: seller questions and next action now appear before the claim cards; claim cards are compact and "Why this matters" is collapsed.
   - Not worth adding tabs in the POC because that adds navigation complexity without strengthening the kernel.

### Low

- Full-page desktop screenshots make body copy appear smaller than it feels at normal viewport scale; submission screenshots should crop to the hero/results summary rather than use a giant full-page image.
- The proof-grid cells use abbreviated category labels; their accessible names contain the full claim label and state.

## Accessibility spot-check

- Native buttons, textarea, details/summary and semantic headings are used.
- All interactive proof cells have accessible labels with claim + status.
- Status buttons expose `aria-pressed`.
- Keyboard focus styles are visible.
- Status meaning is represented by text/symbols in addition to color.
- Primary text/status color pairs checked in the design tokens meet or exceed 4.5:1 contrast for the combinations used in small text.
- `prefers-reduced-motion` disables transitions/smooth behavior.

This is a spot-check, not a full WCAG audit.

## Judge-view score estimate — current build only

The official competition should be scored only with its current published rubric. For internal prioritization, using the four equal axes already identified for this challenge:

| Axis | Internal estimate | Main reason |
|---|---:|---|
| Design | 22/25 | Distinct visual identity, clear state system, responsive hierarchy; final submission crops still pending. |
| Potential impact | 20/25 | Real buyer problem and immediately actionable output; POC does not yet prove usage outcomes. |
| Innovation / idea | 21/25 | Evidence-gap framing is clearer than opaque deal/trust scoring; deterministic POC is intentionally narrow. |
| Presentation | 18/25 | Product is demo-ready, but final <3 minute video and Devpost story are not produced yet. |
| **Total** | **81/100** | Approximate internal score, not a prediction of judging. |

Uncertainty: ±6 points because external judges, competing entries, final video quality and the precise final submission all remain outside this build-only review.

## Highest-value next work

1. Produce two submission-quality cropped screenshots: input/hero and result summary + first claim.
2. Write and record a 60–90 second core demo before expanding functionality.
3. Draft Devpost copy directly against the four judging axes.
4. Do the final rule/conformity audit immediately before submission.
