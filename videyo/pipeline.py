from __future__ import annotations

import hashlib
import html
import os
from dataclasses import dataclass
from pathlib import Path

from genblaze_core import (
    KeyStrategy,
    Manifest,
    Modality,
    ObjectStorageSink,
    Pipeline,
    RunBuilder,
    StepBuilder,
    StepStatus,
)
from genblaze_openai import DalleProvider
from genblaze_s3 import S3StorageBackend


MAX_PROMPT_LENGTH = 600


@dataclass(frozen=True)
class PipelineResponse:
    mode: str
    run_id: str
    provider: str
    model: str
    asset_url: str
    asset_sha256: str
    manifest_hash: str
    manifest_verified: bool
    storage: str

    def to_dict(self) -> dict[str, str | bool]:
        return self.__dict__.copy()


def normalize_prompt(raw_prompt: object) -> str:
    if not isinstance(raw_prompt, str):
        raise ValueError("Prompt must be text.")
    prompt = " ".join(raw_prompt.split())
    if len(prompt) < 12:
        raise ValueError("Describe the image in at least 12 characters.")
    if len(prompt) > MAX_PROMPT_LENGTH:
        raise ValueError(f"Keep the brief under {MAX_PROMPT_LENGTH} characters.")
    return prompt


def live_is_configured() -> bool:
    required = ("B2_KEY_ID", "B2_APP_KEY", "B2_BUCKET", "B2_REGION", "OPENAI_API_KEY")
    return os.getenv("VIDEYO_LIVE_GENERATION", "false").lower() == "true" and all(
        os.getenv(name) for name in required
    )


def run_demo(raw_prompt: object) -> PipelineResponse:
    prompt = normalize_prompt(raw_prompt)
    svg = _demo_svg(prompt)
    digest = hashlib.sha256(svg).hexdigest()
    asset_path = Path("/tmp/videyo-demo.svg")
    asset_path.write_bytes(svg)

    step = (
        StepBuilder("videyo-demo", "deterministic-svg-1")
        .prompt(prompt)
        .modality(Modality.IMAGE)
        .params(size="1200x800", mode="credential-free demonstration")
        .status(StepStatus.SUCCEEDED)
        .asset(asset_path.as_uri(), "image/svg+xml", sha256=digest)
        .build()
    )
    run = RunBuilder("videyo-demo-pipeline").add_step(step).build()
    manifest = Manifest.from_run(run)
    return PipelineResponse(
        mode="demo",
        run_id=run.run_id,
        provider=step.provider,
        model=step.model,
        asset_url=f"data:image/svg+xml;charset=utf-8,{_quote_svg(svg)}",
        asset_sha256=digest,
        manifest_hash=manifest.canonical_hash,
        manifest_verified=manifest.verify(),
        storage="In-memory demo. Live runs use Backblaze B2.",
    )


def run_live(raw_prompt: object) -> PipelineResponse:
    prompt = normalize_prompt(raw_prompt)
    if not live_is_configured():
        raise RuntimeError("Live generation is not configured. Use demonstration mode.")

    backend = S3StorageBackend.for_backblaze(os.environ["B2_BUCKET"])
    storage = ObjectStorageSink(
        backend,
        prefix="videyo",
        key_strategy=KeyStrategy.HIERARCHICAL,
    )
    result = (
        Pipeline("videyo-image-production")
        .step(
            DalleProvider(),
            model="gpt-image-1.5",
            prompt=prompt,
            modality=Modality.IMAGE,
            size="1024x1024",
            quality="medium",
        )
        .run(sink=storage, timeout=180, max_retries=1)
    )
    asset = result.run.steps[0].assets[0]
    asset_key = backend.key_from_url(asset.url)
    review_url = backend.presigned_get_url(asset_key, expires_in=3600) if asset_key else asset.url
    return PipelineResponse(
        mode="live",
        run_id=result.run.run_id,
        provider=result.run.steps[0].provider,
        model=result.run.steps[0].model,
        asset_url=review_url,
        asset_sha256=asset.sha256 or "unavailable",
        manifest_hash=result.manifest.canonical_hash,
        manifest_verified=result.manifest.verify(),
        storage="Private Backblaze B2 · one-hour signed view",
    )


def _demo_svg(prompt: str) -> bytes:
    safe = html.escape(prompt[:180])
    svg = f"""<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">
<rect width="1200" height="800" fill="#f2efe8"/>
<circle cx="920" cy="180" r="210" fill="#d86f45"/>
<path d="M0 610 C250 430 390 730 650 535 C850 385 1020 530 1200 410 V800 H0Z" fill="#24362f"/>
<text x="72" y="96" fill="#27302c" font-family="Arial, sans-serif" font-size="22">VIDEYO / PIPELINE PROOF</text>
<text x="72" y="162" fill="#27302c" font-family="Georgia, serif" font-size="42">{safe}</text>
<text x="72" y="738" fill="#f2efe8" font-family="Arial, sans-serif" font-size="20">Deterministic preview · Genblaze provenance attached</text>
</svg>"""
    return svg.encode("utf-8")


def _quote_svg(svg: bytes) -> str:
    from urllib.parse import quote

    return quote(svg.decode("utf-8"), safe="")
