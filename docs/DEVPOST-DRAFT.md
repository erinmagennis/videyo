# Devpost submission draft

Status: draft only. Do not submit without Erin's approval.

## Project name

Videyo

## Tagline

A production control room for generative media, with every asset and decision traceable.

## Inspiration

Generative media work quickly turns into scattered prompts, downloads, versions, and folders. The creative decision is separated from the model settings and source that produced it. Videyo keeps the work visible as one production record.

## What it does

A creator enters a visual brief and runs a generation workflow. Videyo shows the output beside its provider, model, run state, asset hash, canonical manifest hash, and storage location. Live outputs and their provenance records are stored in Backblaze B2. A credential-free demonstration mode lets anyone inspect the workflow without triggering paid generation.

## How we built it

The public interface calls a Python serverless endpoint. The live path uses a Genblaze `Pipeline` with the OpenAI image provider and a Genblaze `ObjectStorageSink` configured for Backblaze B2. Genblaze records the run, moves the generated asset into B2, and creates the verified provenance manifest. The demonstration path uses Genblaze's run and manifest builders around a deterministic local preview, and clearly labels that no external generation occurred.

## Challenges

The hardest product boundary was making a useful public demo without exposing a paid endpoint to unlimited use. Videyo fails closed unless all server-side credentials and an explicit live-generation flag exist. The public-safe demonstration still exercises the provenance model without pretending it ran an external provider.

## Accomplishments

The focused slice connects a creator-facing workflow to Genblaze's run model and B2's durable object storage. The returned record includes both the asset SHA-256 and Genblaze canonical manifest hash. Automated tests cover validation, deterministic hashing, manifest verification, and missing-credential failure.

## What we learned

Provenance is most useful when it is part of the creation path. Storing a manifest later can lose the exact provider settings or relationship to the asset. Genblaze and B2 make the generation and record one operation.

## What's next

The next slice adds image-to-video, narration, streamed pipeline events, and versioned review decisions. The longer Videyo specification extends the same record into timelines, continuity, and model-aware production planning.

## Providers and models

- OpenAI through `genblaze-openai`
- `gpt-image-1.5`, 1024 by 1024, medium quality
- Credential-free deterministic preview for public demonstration

## Backblaze B2 and Genblaze usage

Genblaze executes the provider step, assigns run and asset identity, transfers live output through `ObjectStorageSink`, produces a canonical provenance manifest, and verifies its integrity. Backblaze B2 stores the live asset and manifest as the durable output of the same pipeline.
