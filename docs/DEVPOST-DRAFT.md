# Devpost submission answers

Status: paste-ready draft. Erin will handle the live Devpost form and final submission.

## Project name

Videyo

## Tagline

Show Yo what you see. Your video friend connects the dots.

## Links

- Working app: https://videyo.erinmagennis.com
- GitHub: https://github.com/erinmagennis/videyo
- Demo video: add the final public video URL here

The GitHub repository is private. Add `b2genblaze` as a collaborator before submitting so the judges can review it.

## Inspiration

Generative video projects lose their memory quickly. A character lives in one prompt. A story idea sits in a document. Scene versions pile up in downloads. The creator has to remember how everything connects.

Videyo gives the project a creative friend named Yo. Point Yo toward a character, place, idea, or scene. Yo sees the same part of the project, follows the connections behind it, and brings back something useful. It might notice that two characters only disagree once, that a location disappears halfway through the story, or that an unused idea belongs in the ending.

Behind that friendly creative process, Videyo keeps a production record for generated media. The creator can stay inside the story while Genblaze and Backblaze B2 keep track of how each result was made.

## What it does

Videyo turns a video project into a living story graph with Yo beside it. A creator can:

- See how characters, locations, motifs, and scenes connect.
- Unwind the graph into story order without losing the original relationships.
- Point to any part of the story and talk with Yo about exactly what is selected.
- Build a character sheet before shaping the plot.
- Regenerate one scene while preserving the rest of the project.
- Review the provider, model, asset hash, manifest hash, storage location, and verification state for a generation run.

Yo is visibly tethered to the selected circle, so the conversation never feels detached from the work. When the graph unwinds into story order, the relationship lines stay visible. The creator can see the timeline and the connections behind it at the same time.

The public app defaults to a credential-free demonstration. It creates deterministic preview media and a verified Genblaze manifest without making a paid provider call. The live production path uses Genblaze to generate an image, store the asset and canonical manifest in a private Backblaze B2 bucket, and return a one-hour signed review URL.

## How we built it

The interface is a responsive HTML, CSS, and JavaScript workspace deployed on Vercel. A Python serverless endpoint receives a scene brief and runs one of two paths.

Demonstration mode creates a deterministic SVG, builds a Genblaze run, calculates the asset SHA-256, creates the canonical manifest, and verifies it. This gives judges a safe way to test the full production record.

Live mode uses a Genblaze `Pipeline` with the OpenAI image provider. Genblaze's `ObjectStorageSink` sends the generated asset and provenance manifest to a private Backblaze B2 bucket. The endpoint does not call OpenAI or B2 directly. Genblaze owns the provider step, run identity, storage handoff, hashes, and verification.

The repository has automated tests for prompt validation, deterministic asset hashing, manifest verification, and fail-closed live configuration.

## Challenges

The hardest boundary was giving judges a working public app without leaving a paid media endpoint open to unlimited requests. Videyo solves this with an explicit server-side live-generation flag and a demonstration mode that exercises the provenance workflow without claiming an external model ran.

Private B2 storage created a second challenge. Generated work should stay private, but reviewers still need to see it. Live runs keep the durable object private and return a signed URL that expires after one hour.

The product challenge was making production evidence feel like part of a creative friendship. Yo stays focused on the story. Genblaze and B2 connect the technical dots behind the scenes.

## Accomplishments

Videyo has a graph-to-story interaction that preserves the relationships between story elements while revealing their order. Yo stays attached to the selected node, sees what the creator is seeing, and comments in that context. A creator can regenerate one scene and receive a verified production record beside the result.

The working pipeline uses official Genblaze packages. Live output is designed to land in private B2 storage with its canonical manifest. The public demonstration produces deterministic media and passes Genblaze manifest verification. Eight focused tests pass.

## What we learned

A useful creative friend needs to remember the world and the work behind it. Videyo's graph remembers the characters, places, ideas, and scenes. Its production record remembers which provider, prompt, model, and asset produced a result. The friend can connect those memories because they share one interface.

Genblaze makes provenance part of the run itself. B2 gives that run a durable home. This is safer than trying to reconstruct the history after files have already been downloaded and renamed.

## What's next

The current hackathon slice generates images for video scenes. Next, Yo will be able to watch new footage with the creator, point to continuity problems, and suggest where an unused idea could help. Videyo will add image-to-video, narration, and versioned review decisions while the knowledge graph keeps the whole world connected.

Before opening live generation broadly, Videyo will add per-user authentication, rate limits, durable job state, and streamed progress events.

## Providers and models

OpenAI through `genblaze-openai`, using `gpt-image-1.5` at 1024 by 1024 with medium quality. The public demonstration uses a deterministic SVG preview so judges can test the workflow without triggering a paid generation request.

## B2 and Genblaze usage

Genblaze runs the media provider, assigns the run and asset identity, records the generation metadata, calculates the asset hash, creates the canonical provenance manifest, and verifies its integrity.

For live runs, Genblaze's `ObjectStorageSink` stores the generated asset and its provenance manifest together in a private Backblaze B2 bucket. Videyo returns a signed review URL that expires after one hour, while the durable files remain private in B2.

## Built with

Backblaze B2, Genblaze, Python, Vercel, OpenAI, HTML, CSS, and JavaScript.
