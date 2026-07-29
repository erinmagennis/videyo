# Videyo specification

**Kickoff date:** 2026-07-29  
**Kickoff confidence:** 98% for the product boundary and first Arkhai slice  
**Target first external test:** 2026-08-05, when a Videyo-produced Arkhai review package is available to Erin's boss through GitHub  
**Working name:** Videyo  
**Platform:** macOS, local-only v1

## Intent in Erin's words

> It should have everything I should look at in one spot, folder, or easy-to-read Markdown file.

> I want to have a system for marketing material and entertainment films as well.

> It should learn from me as we go and automate video development after I make a style for marketing videos or a good plan for a film.

> Failure means bad UX, taking more time than doing it manually, loss of control, or the agent accidentally deleting something I wanted.

> It should at least be saveable per project or client. During handoff it should interview me to know what should be more global versus only for this video or only for this client or project.

## Product promise

Videyo is Erin's local AI-assisted production studio. It brings source content, narrative planning, model-specific prompts, generations, transcript editing, audiovisual timing, contextual review, versions, and exports into one controlled project. It makes AI production faster without hiding files, spending money unexpectedly, flattening creative judgment, or destroying source material.

## Product modes

All modes share assets, transcripts, timelines, style rules, audio, review, versions, and export while presenting a focused starting workflow:

1. Marketing and launch videos
2. Generated narrative and character-led films
3. Podcasts and interviews
4. Talks, keynotes, and speaker reels
5. Pitches and narrated presentations
6. Social clips and aspect-ratio adaptations

## First proof suite

1. **Arkhai revision:** exercise the contextual review hub, transitions, music-to-picture review, prompt visibility, versions, and GitHub package.
2. **One-hour animated film:** validate character, location, object, visual, and narrative continuity. Produce it through a short continuity proof and approved acts rather than one uncontrolled run.
3. **One-hour podcast:** validate ingestion, transcription, transcript editing, suggested filler cuts, cleanup, captions, searchable moments, and short-clip suggestions.
4. **Speaker reel:** validate long-recording search, transcript analysis, highlight recommendations, presentation-file support, music timing, and concise assembly.

## First usable slice: Arkhai review hub

The first slice must provide:

- a Project Inbox for local media, scripts, PDF documents, and PowerPoint files;
- immutable originals with managed copies by default and a leave-in-place option;
- an obvious current-cut link and deterministic file locations;
- one timeline overview containing scenes, picture, voice, music, SFX, transitions, captions, and emotional beats;
- a scene card containing the original goal, previous/current/next context, concise gist, full model-specific prompt, references, current clip, versions, and status;
- Videyo's independent assessment of what works, what fails, why, whether the intended vibe lands, and the recommended action;
- transition plans and acceptance criteria established before paid generation;
- music candidates heard and viewed against the actual picture and dialogue;
- reversible approvals, rejects, notes, and promoted selects;
- a simple GitHub-ready Markdown review package with compressed review media, thumbnails, manifest, methodology, and no source footage by default;
- a short named command or in-app action for every recurring operation, avoiding fragile multiline terminal pastes.

## Local data and file policy

- All project content and system learning remain on the Mac in v1.
- No Videyo login, proprietary cloud, hosted collaboration, or phone review is required.
- Important imported media is copied into the managed project library by default. Erin may choose leave-in-place.
- Originals are immutable. Edits create instructions, versions, proxies, or derivatives.
- Every generated result retains its provider, model, prompt, input references, parameters, request identifier, estimated and actual cost when available, timestamp, and decision history.
- Review exports exclude source media unless Erin explicitly includes it.
- Project state must be human-readable and portable where practical.

## Learning and style scopes

Every observation and decision is stored locally at the originating project or client level. During handoff, Videyo presents candidate learnings with their evidence and asks Erin to assign one scope:

1. this video only;
2. this client or brand;
3. this series or content type;
4. global;
5. historical only—preserve but do not reuse.

Nothing silently becomes global. Rule precedence is:

`global < content type/series < client/brand < project < shot`

Characters, recurring objects, wardrobe, and locations may have their own locked continuity records inside the relevant project or series.

## Agent action boundaries

### Always allowed without asking

- inspect in-scope project files without reading `.env` or secret values;
- import metadata, index assets, create thumbnails and proxies, transcribe locally, and analyze media;
- organize project records and generate human-readable summaries;
- draft story structures, prompts, timelines, transitions, music briefs, and edit suggestions;
- make reversible draft timeline or transcript edits while preserving originals and prior versions;
- identify likely clips, filler words, continuity risks, and quality problems;
- create cost estimates, dry runs, validation reports, and review packages that remain local;
- save every action, result, and decision to the local project history.

### Ask first

- submit any paid model generation, VFX, voice, music, transcription, upscale, or hosted render;
- exceed an approved batch budget or expand the number of candidates;
- publish, upload, send, share, or push anything externally;
- export a deliverable intended for another person;
- connect a new OAuth provider, MCP server, subscription, or API-key-backed service;
- replace an accepted take, change an approved style contract, or promote a learning beyond its current scope;
- delete any source, generation, timeline version, transcript content, or export.

### Never do

- read, display, copy, log, or transmit `.env` contents or secret values;
- silently spend money, publish content, or change external state;
- overwrite or destructively modify original media;
- silently convert a one-off preference into a global rule;
- hide failed generations, discarded options, costs, or provenance;
- claim a transition, post-production technique, model capability, or integration will work without evidence or an explicitly labeled test;
- export source footage in a review package unless Erin explicitly requests it.

## Cost model

- Current replacement benchmark: approximately $35 per month for Erin's discounted Descript plan.
- Local editing, project storage, local transcription, FFmpeg/Remotion rendering, and review generation should not require a recurring service.
- Fixed subscriptions and usage-based model costs are displayed separately.
- Every paid batch shows its purpose, provider, model, number of outputs, estimated range, current project total, and approval limit before execution.
- Exploration occurs at the lowest resolution that answers the current review question; final resolution is used only for approved material.

## Definition of Done

Videyo v1 is not done because the interface exists. It is done when the following external evidence is recorded:

### Arkhai proof

- Erin can import or locate the Arkhai project without folder hunting.
- She can review the whole timeline and each scene with neighboring context, prompts, transitions, music, versions, and critique in one place.
- A revision can be requested and produced without copying a multiline Terminal command.
- A GitHub-ready `OVERVIEW.md` package is created, contains methodology and working video links, and excludes source clips.
- Erin's boss can open the package from GitHub.

### Animated-film proof

- A short continuity proof is approved before full production.
- The one-hour film is assembled from versioned, approved acts with traceable character and visual continuity.
- No paid act begins without its budget and acceptance criteria.

### Podcast proof

- A real one-hour recording imports, transcribes, and remains synchronized after transcript edits.
- Filler removal appears as reviewable suggested cuts with undo.
- Erin can produce a clean long-form export and useful short-clip candidates faster than her current manual workflow.

### Speaker-reel proof

- Videyo can search talks and imported PDF or PowerPoint context, recommend evidence-backed highlights, and assemble a concise reel with synchronized picture, speech, titles, and music.
- Erin can trace every chosen excerpt back to its source and transcript.

### Safety and usability proof

- Originals and previous versions survive every tested edit, failed generation, and export.
- No secret is exposed to the agent or logs.
- All paid actions have a recorded approval and cost.
- Erin can find the current cut, music, prompts, sources, and exports without inspecting model-specific generation folders.
- Erin judges the primary workflows faster than doing them manually and retains final control.

## Experiment instrumentation

- Kickoff date: 2026-07-29
- Target first external test: 2026-08-05
- External witness: Erin's Arkhai boss through the GitHub review package
- Actual first-ship date: pending
- Time-to-first-review-package: pending
- Number and cost of paid generations: pending
- Number of avoided or rejected generations: pending
- Time spent finding files or commands: pending
- Number of destructive or unrecoverable incidents: target zero
- Erin's assessment of speed, control, cohesion, and premium quality: pending
- Foundation rules invoked: venture kickoff, finding unknowns, design gate before any user-facing UI, evidence-first research, local-only action boundaries, and end-of-session handoff promotion interview

## What would make this plan wrong

1. **A local-first system proves slower or less reliable than an existing editor.** If real podcast and Arkhai tests show this, Videyo should integrate with a mature editor rather than replace its timeline layer.
2. **The review hub does not materially reduce folder hunting and review effort.** If Erin still needs Finder, raw prompt files, or Terminal for ordinary decisions, the first slice has failed.
3. **A one-hour animated film cannot maintain acceptable continuity or cost through act-based generation.** In that case the system must support a different production form, stronger manual art pipelines, or a narrower runtime rather than disguising the limitation.

## Open questions

These do not block the Arkhai slice and require their own project kickoffs:

- story, genre, visual form, audience, and budget for the first one-hour animated film;
- exact podcast and speaker-reel source files after Erin copies them locally;
- live build-versus-adopt results for CutScript, Palmier Pro, ScriptBreak, and the existing Remotion system;
- whether PDF and PowerPoint support begins as text/slide extraction or includes editable presentation rendering.

## Handoff

Kickoff is complete and the first build is authorized. The next action is to inventory the current Arkhai project without reading `.env`, then design the smallest review-hub slice around its real timeline, media, prompts, audio, and exports. Before choosing an editor foundation, time-box live tests of the existing Remotion workflow, CutScript, Palmier Pro, and ScriptBreak against the Definition of Done above.

The podcast and speaker-reel proofs wait only for Erin to copy their source recordings locally. The animated-film project requires its own story and style kickoff before any generation.
