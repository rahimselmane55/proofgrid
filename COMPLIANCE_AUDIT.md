# ProofGrid — Build With AI: Basics Compliance Audit

**Audit date:** 2026-09-30  
**Official rules checked:** https://learn-ai-basics.devpost.com/rules  
**Competition deadline:** 2026-10-26 17:00 EDT = 22:00 Luxembourg time (CET)

## Status summary

**Overall:** Submission package is technically ready, with two external blockers remaining: a public repository URL and the final public YouTube/Vimeo demo video.

## Rule-by-rule audit

### Eligibility
- [x] Adult-individual format supported by the rules.
- [x] Luxembourg is not listed among excluded jurisdictions in the current official rules.
- [x] No purchase/payment required to enter.

### Project requirements
- [x] Working proof of concept performs an end-to-end function.
- [x] Source code is included.
- [x] `devpost/scope.md` exists and is `status: approved`.
- [x] `devpost/prd.md` exists and is `status: approved`.
- [x] `devpost/spec.md` exists and is `status: approved`.
- [x] Project runs on a standard desktop browser.
- [x] Runtime behavior matches the planned demo flow.
- [x] No third-party API, SDK, or paid runtime dependency requiring separate authorization.

### New-project / originality requirement
- [x] ProofGrid was built during the 2026 submission period in this workflow.
- [ ] **Evidence to preserve:** public Git commit history should begin within the submission period and should not import pre-existing ProofGrid code.
- [x] Any standard tools used are development infrastructure rather than pre-existing project code.

### Repository requirement
- [ ] **BLOCKER:** create/publish a public GitHub, GitLab, or Bitbucket repository.
- [x] Repository-ready package contains source code, assets, tests, planning docs, and run instructions.
- [x] Top-level `LICENSE` exists.
- [x] License is MIT, an OSI-recognized open-source license.
- [ ] After publishing, confirm GitHub detects the license and shows it visibly on the repository page/About area.

### Functionality and testing
- [x] Local run command documented: `node server.mjs`.
- [x] Guided demo URL documented: `http://127.0.0.1:4173/?record=1`.
- [x] Test command documented: `node --test tests/*.test.js`.
- [x] Current baseline: 12/12 tests passing.
- [x] No API key or login required for judging.

### Submission text and language
- [x] English submission copy prepared in `DEVPOST_SUBMISSION.md`.
- [x] Testing instructions are in English.
- [x] Screenshot captions are in English.

### Demo video
- [x] Demo script/timeline/subtitles prepared in `demo/`.
- [x] App includes guided demo mode.
- [ ] **BLOCKER:** record the final real screen capture.
- [ ] **BLOCKER:** upload final video publicly to YouTube or Vimeo.
- [ ] Confirm final runtime is under 3 minutes; target is approximately 60–90 seconds.
- [ ] Confirm video contains no copyrighted music or unauthorized third-party branding.

### Intellectual property
- [x] ProofGrid application code and visual system are original project work.
- [x] No proprietary third-party data is bundled.
- [x] No copyrighted music is required.
- [ ] Before upload, inspect final recording for accidental browser tabs/logos/third-party marks not needed for the demo.

### Images / presentation
- [x] 3:2 thumbnail prepared.
- [x] Five final screenshot assets prepared in recommended order.
- [x] Product is shown before process documentation.
- [x] Screenshots communicate Design, Innovation, Impact, and Presentation without requiring the judge to run the app.

## Final blockers before submission

1. **Publish public repository.**
2. **Record real demo video and upload publicly to YouTube/Vimeo.**
3. Paste `DEVPOST_SUBMISSION.md` into Devpost and complete the account-specific questionnaire truthfully.
4. Confirm public repo links, video link, and screenshots work while logged out.
5. Submit before the internal safety deadline rather than waiting for 22:00 Luxembourg time on Oct 26.

## Final pre-submit checks

- [ ] Repository is public while logged out.
- [ ] `LICENSE` detected by GitHub/GitLab/Bitbucket.
- [ ] `scope.md`, `prd.md`, `spec.md` visible in repository.
- [ ] README launch commands work on a fresh checkout.
- [ ] 12/12 tests pass on final commit.
- [ ] Demo video is public and plays while logged out.
- [ ] Demo is < 3 minutes.
- [ ] Devpost thumbnail is the 3:2 asset.
- [ ] Screenshot order matches `DEVPOST_SUBMISSION.md`.
- [ ] No unsupported claims or fabricated metrics in submission text.
- [ ] Submission completed before deadline.
