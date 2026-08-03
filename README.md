# Videyo

Videyo is a production control room for generative media. A creator enters a brief, runs a model through Genblaze, reviews the result, and receives a verified provenance record beside the asset. Backblaze B2 keeps the output and its history together.

This repository contains a focused entry for the 2026 Backblaze Generative Media Hackathon. The larger product specification remains in `SPEC.md`.

## What works

- Credential-free demonstration runs produce deterministic preview media and a verified Genblaze manifest.
- Live runs use the Genblaze OpenAI provider to create an image.
- Genblaze's `ObjectStorageSink` writes the live asset and manifest to a private Backblaze B2 bucket.
- The app returns a one-hour signed review URL while the durable B2 object remains private.
- The response exposes the run ID, provider, model, asset SHA-256, manifest hash, verification result, and storage location.
- Live generation fails closed unless every required credential and the explicit live-generation flag are present.

## Run locally

Requires Python 3.11 or newer.

```bash
python3 -m venv .venv
.venv/bin/pip install -r requirements.txt
.venv/bin/pytest -q
vercel dev
```

Copy `.env.example` to `.env` and add credentials only if you want to test the live path. Never commit that file.

## Live configuration

Create a Backblaze B2 bucket and a bucket-scoped application key. Configure these environment variable names in the deployment service:

```text
B2_KEY_ID
B2_APP_KEY
B2_BUCKET
B2_REGION
OPENAI_API_KEY
VIDEYO_LIVE_GENERATION=true
```

The current live model is `gpt-image-1.5` at `1024x1024` with medium quality. One request produces one asset. The public demonstration mode does not call a paid provider or claim that it did.

## Verify

```bash
.venv/bin/pytest -q
```

The focused test suite covers input validation, deterministic asset hashing, Genblaze manifest verification, and fail-closed live configuration.

## Architecture and submission

- `videyo/pipeline.py`: Genblaze demo and live pipelines
- `api/pipeline.py`: public serverless endpoint
- `public/`: judge-facing interface
- `docs/ARCHITECTURE.md`: request, generation, storage, and provenance flow
- `docs/DEVPOST-DRAFT.md`: submission copy awaiting owner approval
- `docs/DEMO-SCRIPT.md`: three-minute demo outline

## Current limits

The hackathon slice generates images. The product specification also covers video, audio, timelines, review, and continuity, but those modes are outside today's tested surface. The live provider and B2 path remain unverified until deployment credentials are configured and one approved paid generation completes.
