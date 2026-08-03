# Videyo hackathon build spec

Kickoff: 2026-08-03

## Intent

Erin's direction:

> “make the platform actually usable for a user”

> “it looks like a very primitive knowledge graph i want it more dynamic and more dots connecting things”

> “also needs to map much more cleanly to the timeline”

> “build for the hackathon - promote genblaze etc to make that clear to the judges”

Videyo should demonstrate a friendly, game-like video creation workflow where a creator builds a character and story world, explores a living knowledge graph, points Yo at a node or scene, and turns that context into generated media.

## Narrow end-to-end slice

1. Open a seeded project and see a populated character, location, idea, and scene graph.
2. Create or edit a character and connect it to scenes, locations, motifs, and other characters.
3. Explore a dynamic graph with draggable nodes, zoom, pan, clustering, relationship density, and animated connections.
4. Select a graph node or timeline scene. Yo's floating chat stays tethered to the selected context.
5. Ask Yo to revise or extend that selected section. The graph and timeline update together.
6. Generate one real media artifact through Genblaze, upload the output and project metadata to B2, and show the evidence in the interface.
7. Offer a judge-safe mock/demo path if a shared generation credential is unavailable, plus BYOK for creators who supply their own provider keys.

## Decisions

- Judge path: shared, rate-limited demo or deterministic mock fallback so judges can try the product without entering credentials.
- Creator path: BYOK generation keys, entered for the current session and never exposed in the client or persisted by Videyo.
- Graph: interactive force-directed graph with explicit node types, weighted edges, clustering, selection state, and animation.
- Timeline: every scene is a first-class object with stable IDs. Graph nodes connect to scenes through visible, inspectable relationships. Selecting either surface highlights the other.
- Storage: B2 stores project JSON, graph snapshots, generated media, and provenance metadata. Local state is the resilience fallback for the demo.
- Generation: Genblaze is the primary demonstrated provider. The UI names the provider, model, prompt, input context, output, and storage destination so judges can see the integration.

## Action boundaries

Always do:

- Keep graph and timeline IDs synchronized.
- Preserve graph connectivity during every view transition.
- Show provider and storage provenance for generated media.
- Keep the seeded demo usable without credentials.

Ask first:

- Enabling paid generation beyond the hackathon demo.
- Adding additional providers or persistent user accounts.
- Making projects public or sharing generated media publicly.

Never do:

- Put provider keys in browser-visible code, URLs, project JSON, or B2 objects.
- Claim Genblaze or B2 usage without a verifiable request, response, or stored artifact.
- Replace graph relationships with decorative lines that do not map to real scene data.

## Definition of Done

- Browser evidence shows the seeded project, dynamic graph, timeline, selection tether, and graph-to-timeline highlighting in one continuous flow.
- A user can add or edit a character, scene, relationship, and prompt without editing code.
- Graph and timeline remain synchronized after unwind, return, node selection, and regeneration.
- A successful Genblaze request produces a media artifact with provider/model/prompt metadata.
- The artifact and project JSON are retrievable from B2, with a visible object key or provenance record.
- A judge can complete the mock/demo flow without a credential.
- BYOK is session-scoped, server-mediated, and not persisted.
- `node --check public/app.js`, `git diff --check`, and the relevant browser flow pass.

## Experiment instrumentation

- Target first external test: hackathon judge walkthrough.
- Record: time to first graph edit, time to first Yo interaction, graph-to-timeline selection success, generation success/fallback, B2 upload success, and judge completion without credentials.
- Actual days-to-first-ship: fill after the first verified end-to-end slice.

## Open assumptions

- The current Genblaze integration surface and available model endpoint must be verified against the project credentials without reading secret files.
- A shared judge demo path may need a server-side rate limit and a bounded output size.
- B2 object naming and access policy must keep judge artifacts retrievable without exposing application keys.

## What would make this plan wrong

1. Genblaze cannot be called from the available project runtime or does not return a usable media artifact.
2. B2 cannot safely serve the required judge-visible artifact without a separate signed-access flow.
3. The dynamic graph makes the core story harder to understand than the current curated layout during a short judge walkthrough.
