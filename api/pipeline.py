from __future__ import annotations

import json

from videyo.pipeline import live_is_configured, run_demo, run_live


def app(environ, start_response):
    method = environ.get("REQUEST_METHOD", "GET").upper()
    if method == "GET":
        return _respond(start_response, "200 OK", {"ok": True, "liveConfigured": live_is_configured()})
    if method != "POST":
        return _respond(start_response, "405 Method Not Allowed", {"ok": False, "error": "Method not allowed."})

    try:
        length = min(int(environ.get("CONTENT_LENGTH") or "0"), 4096)
        payload = json.loads(environ["wsgi.input"].read(length) or b"{}")
        mode = payload.get("mode", "demo")
        if mode not in {"demo", "live"}:
            raise ValueError("Mode must be demo or live.")
        result = run_live(payload.get("prompt"), provider=payload.get("provider"), api_key=payload.get("providerKey")) if mode == "live" else run_demo(payload.get("prompt"))
        return _respond(start_response, "200 OK", {"ok": True, "result": result.to_dict()})
    except (ValueError, json.JSONDecodeError) as exc:
        return _respond(start_response, "400 Bad Request", {"ok": False, "error": str(exc)})
    except RuntimeError as exc:
        return _respond(start_response, "503 Service Unavailable", {"ok": False, "error": str(exc)})
    except Exception:
        return _respond(
            start_response,
            "500 Internal Server Error",
            {"ok": False, "error": "The pipeline failed safely. Try demonstration mode."},
        )


def _respond(start_response, status: str, payload: dict):
    body = json.dumps(payload).encode("utf-8")
    headers = [
        ("Content-Type", "application/json"),
        ("Cache-Control", "no-store"),
        ("Content-Length", str(len(body))),
        ("X-Content-Type-Options", "nosniff"),
    ]
    start_response(status, headers)
    return [body]
