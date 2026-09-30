---
doc: scope
status: approved
---
# ProofGrid

One line: ProofGrid turns used-car listing claims into an evidence checklist so buyers can see what is claimed, what is actually supported, and what to ask for next.

## The Unique Kernel
ProofGrid does not guess whether a car is “good” or “bad.” It separates seller claims from the evidence needed to support them, exposes evidence gaps, and turns those gaps into concrete follow-up questions.

## Who It's For
A person shopping for a used car online who sees reassuring claims like “full service history,” “accident-free,” or “new clutch” but does not know what documentation would actually substantiate those claims.

## The Core Loop
The buyer pastes a listing, ProofGrid extracts meaningful claims, maps each claim to the evidence that would support it, shows which claims are currently unverified, and generates the exact questions/documents the buyer should request. The buyer can then mark evidence as seen and watch coverage improve.

## Inspiration & Identity
Calm, trustworthy, forensic rather than alarmist. It should feel closer to a clean inspection report than a generic AI chatbot. The interface should make uncertainty visible rather than hiding it behind a single opaque score.

## Why This Matters to the Learner
The project should be strong enough for a serious competition submission and demonstrate a repeatable process for building polished, useful projects with AI assistance.

## What "Working" Looks Like
A user pastes a realistic car listing and, within seconds, sees an evidence-coverage summary, a structured set of claims, the proof needed for each claim, and a prioritized list of questions to send the seller. The memorable demo moment is watching coverage increase as evidence is marked as verified.

## The POC Boundary
Single-user browser experience; paste listing text; detect key claims; map claims to expected evidence; mark evidence status; calculate evidence coverage; generate seller questions; include demo data; persist locally.

## Later
OCR/photo evidence review, VIN/history integrations, market-price comparison, collaborative sharing, cloud accounts, multilingual extraction, exportable PDF buyer report.

## Explicitly Cut
- Buy/don't-buy verdict — would encourage false certainty and weaken the product's evidence-first differentiation.
- Dealer/scam accusation — not supportable from listing text alone.
- VIN APIs and paid vehicle-history services — add cost and integration risk without proving the core idea.
- OCR/document authenticity detection — too large for the POC and not needed for the central demo.
