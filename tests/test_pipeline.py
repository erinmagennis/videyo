import hashlib
from urllib.parse import unquote

import pytest

from videyo.pipeline import live_is_configured, normalize_prompt, run_demo, run_live


def test_demo_returns_verified_genblaze_manifest() -> None:
    result = run_demo("A field recorder documenting a thunderstorm at dusk")

    assert result.mode == "demo"
    assert result.provider == "videyo-demo"
    assert result.manifest_verified is True
    assert result.asset_sha256
    assert result.manifest_hash


def test_demo_asset_hash_matches_returned_svg() -> None:
    result = run_demo("A ceramic robot preparing tea in a quiet workshop")
    encoded = result.asset_url.split(",", 1)[1]
    svg = unquote(encoded).encode("utf-8")

    assert hashlib.sha256(svg).hexdigest() == result.asset_sha256


@pytest.mark.parametrize("prompt", [None, "tiny", " ", 42])
def test_prompt_rejects_invalid_input(prompt: object) -> None:
    with pytest.raises(ValueError):
        normalize_prompt(prompt)


def test_prompt_rejects_excessive_input() -> None:
    with pytest.raises(ValueError):
        normalize_prompt("x" * 601)


def test_live_fails_closed_without_credentials(monkeypatch: pytest.MonkeyPatch) -> None:
    for name in ("B2_KEY_ID", "B2_APP_KEY", "B2_BUCKET", "B2_REGION", "OPENAI_API_KEY"):
        monkeypatch.delenv(name, raising=False)
    monkeypatch.setenv("VIDEYO_LIVE_GENERATION", "false")

    assert live_is_configured() is False
    with pytest.raises(RuntimeError, match="not configured"):
        run_live("A wide shot of a solar observatory above the clouds")
