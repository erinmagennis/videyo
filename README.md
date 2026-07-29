# Videyo

Status: kickoff gate complete for the first slice. **Videyo** is the confirmed working name.

This project is Erin's personal AI-assisted media-production system. It must eventually support short marketing work, longer entertainment or character-led films, podcasts, talks, pitch videos, and social cutdowns. Erin may share it with others later, but v1 is optimized for her rather than generalized public use.

- Interview source: `/Users/erinmagennis/foundation/interviews/2026-07-29-video-production-system-retrospective.md`
- Research inputs: `resources/2026-07-29-inputs.md`
- First production evidence: `/Users/erinmagennis/Projects/clients/Arkhai_everything/arkhai-launch-video/`

## Initial proof suite

1. Revise the Arkhai launch video using the new review, transition, prompt, and asset-management workflow.
2. Generate a short narrative film that tests character, location, and visual continuity.
3. Edit a one-hour podcast through transcript, suggested filler cuts, audio cleanup, captions, and short-clip discovery.
4. Create a speaker reel from talks, screen or slide material, transcript analysis, music, and selected highlights.

The generated narrative-film target is one hour. Production must be staged through a short continuity proof and then approved sequences or acts; it is not submitted as one uncontrolled generation run.

## First usable slice

Build the Arkhai review hub first. It brings the timeline, scene purpose and neighbors, source and generated assets, prompt gist and full prompt, planned transitions, music, voice, sound cues, agent critique, versions, approvals, and file locations into one place.

## Local project intake

Videyo is macOS-only and local-only in v1. Each project has an Import or Project Inbox surface for drag-and-drop, file selection, or a watched local folder. Originals remain immutable. The platform creates metadata, thumbnails, proxies, and reversible project references or managed copies.

For external review, Videyo exports a GitHub-ready review package rather than hosting an account-based collaboration service. Source media is excluded by default.

## Production methodology

Videyo uses the same controlled production method across modes, with the details adapted to the model and content type:

1. **Intake:** import immutable source material into the Project Inbox and capture the brief, audience, format, budget, references, and approval constraints.
2. **Contract:** define the story or content structure, visual language, audio direction, recurring assets, model routing, and acceptance criteria before generation or editing.
3. **Plan:** build the timeline and design each transition using a visible picture, motion, sound, or narrative anchor.
4. **Proof:** test approved stills, the hardest motion or continuity problem, and temporary audio before producing at scale.
5. **Produce:** generate or edit versioned candidates at the lowest resolution that answers the current question. Prompts are optimized for the selected model and retain their scene context.
6. **Review:** judge each scene with its goal, neighboring scenes, prompt, assets, audiovisual timeline, and Videyo's independent critique visible together.
7. **Finish:** perform deterministic trims, transitions, transcript edits, captions, brand treatment, audio mixing, and final quality control.
8. **Export:** create the required masters and a GitHub-ready review package whose `OVERVIEW.md` contains the project goal, methodology, steps, software and models used, costs, decisions, status, and links to review videos.
9. **Learn:** preserve all evidence locally, then use the handoff interview to decide whether each lesson remains video-specific or is promoted to client, content-type, or global guidance.

The agent owns organization, analysis, repeatable operations, reversible drafts, logging, and recommendations. Erin owns taste, material creative choices, approvals, spend, and what ships.

## Local learning policy

All production evidence is saved locally and every learning is retained at least in its originating project or client workspace. At handoff, the system asks Erin whether each reusable learning belongs only to this video, to the client or brand, to a series or content type, or globally. It may also be marked historical-only. Nothing silently becomes a global rule.

Rule precedence is: global < content type or series < client or brand < project < shot-specific direction.

## Cost baseline

The replacement benchmark is Erin's discounted Descript plan at approximately $35 per month. Local editing should not require a recurring service. Optional sync, hosted review, and model usage are separate and must remain visible, estimated, budgeted, and approval-gated.
