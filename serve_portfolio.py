#!/usr/bin/env python3
import datetime
import email.utils
import gzip
import http.client
import io
import json
import mimetypes
import os
import ssl
import threading
import urllib.parse
import urllib.request
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

mimetypes.add_type("model/gltf-binary", ".glb")
mimetypes.add_type("application/javascript", ".js")

ROOT = Path(os.environ.get("PORTFOLIO_ROOT", "/home/ubuntu/portfolio"))
DIST_DIR = ROOT / "dist"
AGENT_CONFIG = ROOT / "public" / "agents" / "portfolio-agent.json"   # public (display)
AGENT_FULL_CONFIG = ROOT / "agents" / "portfolio-agent.json"          # full knowledge base
PORT = int(os.environ.get("PORTFOLIO_PORT", 18891))
HOST = "127.0.0.1"

# Session history: {session_id: [{"role": ..., "content": ...}, ...]}
_sessions: dict = {}
_sessions_lock = threading.Lock()
MAX_HISTORY = 8  # messages (user+assistant pairs)


# ---------------------------------------------------------------------------
# Config & system prompt
# ---------------------------------------------------------------------------

def _load_api_config() -> dict:
    return {
        "router9_url": os.environ.get("ROUTER9_URL", "http://127.0.0.1:20128/v1"),
        "router9_key": os.environ.get("ROUTER9_API_KEY", ""),
        "moonshot_key": os.environ.get("MOONSHOT_API_KEY", ""),
    }


def _load_agent() -> dict:
    # Public config (displayName, persona) — served to browser
    with AGENT_CONFIG.open("r", encoding="utf-8") as f:
        return json.load(f)


def _load_full_agent() -> dict:
    # Full config with complete knowledge base — server-side only
    path = AGENT_FULL_CONFIG if AGENT_FULL_CONFIG.exists() else AGENT_CONFIG
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def _build_system_prompt(agent: dict) -> str:
    k = agent["knowledge"]
    lines = [agent["systemPrompt"], ""]
    lines += [
        f"Name: {k['name']}",
        f"Headline: {k['headline']}",
        f"Base: {k['base']}",
        f"Focus: {k['focus']}",
        f"Education: {k['education']}",
        "Strengths: " + "; ".join(k["strengths"]),
        f"Contact: email={k['contact']['email']}, github={k['contact']['github']}",
        "",
        "Projects:",
    ]
    for repo in k.get("repositories", []):
        line = f"- {repo['name']}: {repo.get('summary', '')}"
        if repo.get("url"):
            line += f" (public download/repo: {repo['url']})"
        lines.append(line)
    lines += ["", "Rules:"]
    for rule in agent.get("rules", []):
        lines.append(f"- {rule}")
    return "\n".join(lines)


AGENT = _load_agent()           # public display info
_FULL_AGENT = _load_full_agent()  # full knowledge for LLM
API_CONFIG = _load_api_config()
SYSTEM_PROMPT = _build_system_prompt(_FULL_AGENT)


# ---------------------------------------------------------------------------
# LLM streaming
# ---------------------------------------------------------------------------

def _stream_provider(url: str, api_key: str, model: str, messages: list, result: dict = None):
    """Generator: yields text chunks from an OpenAI-compatible streaming endpoint.

    ``result`` (if given) receives ``finish_reason`` from the terminal chunk, so
    callers can detect a token-budget cutoff (``length``/``max_tokens``) instead
    of silently treating a truncated answer as complete.
    """
    parsed = urllib.parse.urlparse(url)
    is_https = parsed.scheme == "https"
    host = parsed.hostname
    port = parsed.port or (443 if is_https else 80)
    path = parsed.path + ("?" + parsed.query if parsed.query else "")

    payload = json.dumps({
        "model": model,
        "messages": messages,
        "stream": True,
        "max_tokens": 4096,
    }).encode("utf-8")

    if is_https:
        ctx = ssl.create_default_context()
        conn = http.client.HTTPSConnection(host, port, timeout=30, context=ctx)
    else:
        conn = http.client.HTTPConnection(host, port, timeout=30)

    try:
        conn.request("POST", path, body=payload, headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
            "Content-Length": str(len(payload)),
        })
        resp = conn.getresponse()
        if resp.status != 200:
            raise ConnectionError(f"HTTP {resp.status}: {resp.read(200).decode()}")

        buf = b""
        while True:
            chunk = resp.read(512)
            if not chunk:
                break
            buf += chunk
            while b"\n" in buf:
                raw_line, buf = buf.split(b"\n", 1)
                line = raw_line.decode("utf-8", errors="replace").strip()
                if not line.startswith("data: "):
                    continue
                data_str = line[6:]
                if data_str == "[DONE]":
                    return
                try:
                    data = json.loads(data_str)
                    choice = data["choices"][0]
                    content = choice["delta"].get("content") or ""
                    if content:
                        yield content
                    finish_reason = choice.get("finish_reason")
                    if finish_reason and result is not None:
                        result["finish_reason"] = finish_reason
                except Exception:
                    pass
    finally:
        conn.close()


def stream_llm(messages: list, provider_used: dict = None):
    """Try 9router then moonshot. Yields text chunks.

    ``provider_used`` (if given) gets ``{"name": ...}`` set to whichever
    provider actually produced the response, so the "done" SSE event reports
    the real source instead of a fixed model string regardless of which
    provider in the fallback chain answered.
    """
    providers = []
    if API_CONFIG["router9_key"]:
        providers.append({
            "url": API_CONFIG["router9_url"] + "/chat/completions",
            "key": API_CONFIG["router9_key"],
            "model": "gc/gemini-2.5-flash",
            "name": "9router:gc/gemini-2.5-flash",
        })
    if API_CONFIG["moonshot_key"]:
        providers.append({
            "url": "https://api.moonshot.ai/v1/chat/completions",
            "key": API_CONFIG["moonshot_key"],
            "model": "kimi-k2.5",
            "name": "moonshot:kimi-k2.5",
        })

    last_error = None
    for p in providers:
        try:
            yielded = False
            for chunk in _stream_provider(p["url"], p["key"], p["model"], messages, result=provider_used):
                yield chunk
                yielded = True
            if yielded:
                if provider_used is not None:
                    provider_used["name"] = p["name"]
                return
        except Exception as exc:
            last_error = exc
            continue

    raise RuntimeError(f"All LLM providers failed: {last_error}")


# ---------------------------------------------------------------------------
# Rule-based fallback (used only when all LLM providers fail)
# ---------------------------------------------------------------------------

def build_reply(message: str) -> str:
    normalized = "".join(
        ch.lower() if ch.isalnum() or ch.isspace() else " " for ch in message
    )
    knowledge = AGENT["knowledge"]
    name = knowledge["name"]
    headline = knowledge["headline"]
    focus = knowledge["focus"]
    project = knowledge["featuredProject"]
    strengths = knowledge["strengths"]
    contact = knowledge["contact"]
    base = knowledge["base"]
    education = knowledge["education"]

    def has_any(*terms: str) -> bool:
        return any(term in normalized for term in terms)

    if has_any("lunaria", "who are you", "who is this agent", "who are u", "kamu siapa", "lo siapa"):
        return (
            "I am Lady Lunaria Eldharia, the public-facing guide for Adrian's portfolio. "
            "I keep my replies warm, clear, and limited to Adrian's work, profile, and contact context."
        )
    if has_any("pira", "piramida", "customer service", "helpdesk", "chatbot"):
        return (
            "PIRA stands for Piramida Inteligence Response Assistant — Adrian's AI chatbot direction "
            "for helpdesk and customer service workflows."
        )
    if has_any("project", "cctv", "recognition", "face", "vision"):
        return (
            f"{project['name']} is a private computer vision case study. "
            f"Stack: {', '.join(project['stack'])}."
        )
    if has_any("strength", "skill", "adapt", "team", "solo", "good at", "keahlian", "kemampuan"):
        return f"Adrian is strongest in: {', '.join(strengths).lower()}."
    if has_any("contact", "email", "github", "hire", "reach", "kontak", "hubungi"):
        return (
            f"📩 Kontak langsung Adrian: {contact['email']}\n"
            f"🔗 GitHub: {contact['github']}"
        )
    if has_any("education", "university", "study", "background", "kuliah", "pendidikan"):
        return f"{name} studied {education}. Focus: {focus.lower()}"
    if has_any("bio", "summary", "who is", "siapa", "headline", "about", "adrian itu", "tentang adrian", "cerita"):
        return (
            f"{name} is a {headline}. He focuses on {focus.lower()} and works across "
            "research, experimentation, and implementation."
        )
    return (
        "I only handle Adrian's portfolio context. You can ask about his profile, "
        "strengths, projects, education, or contact details."
    )


# ---------------------------------------------------------------------------
# Gateway health check
# ---------------------------------------------------------------------------

def check_gateway() -> dict:
    req = urllib.request.Request(
        API_CONFIG["router9_url"] + "/models",
        headers={"Authorization": f"Bearer {API_CONFIG['router9_key']}"},
    )
    try:
        with urllib.request.urlopen(req, timeout=8) as response:
            payload = json.loads(response.read().decode("utf-8"))
        return {"ok": True, "payload": payload}
    except Exception as error:
        return {"ok": False, "error": str(error)}


# ---------------------------------------------------------------------------
# HTTP handler
# ---------------------------------------------------------------------------

_gzip_cache: dict = {}
_gzip_lock = threading.Lock()

COMPRESSIBLE_TYPES = {
    "application/javascript",
    "application/json",
    "image/svg+xml",
    "model/gltf-binary",
}


def is_compressible(ctype: str, path: str = "") -> bool:
    if not ctype:
        ctype = ""
    base_type = ctype.split(";")[0].strip().lower()
    if base_type.startswith("text/"):
        return True
    if base_type in COMPRESSIBLE_TYPES:
        return True
    if base_type == "application/octet-stream" and path.lower().endswith(".glb"):
        return True
    if path.lower().endswith(".glb"):
        return True
    return False


def get_compressed_data(file_path: str, mtime: float) -> bytes:
    key = (file_path, mtime)
    with _gzip_lock:
        if key in _gzip_cache:
            return _gzip_cache[key]
    with open(file_path, "rb") as f_in:
        raw = f_in.read()
    compressed = gzip.compress(raw, compresslevel=6)
    with _gzip_lock:
        _gzip_cache[key] = compressed
    return compressed


class PortfolioHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST_DIR), **kwargs)

    def end_json(self, payload: dict, status: int = HTTPStatus.OK):
        body = json.dumps(payload).encode("utf-8")
        encoding = self.headers.get("Accept-Encoding", "")
        use_gzip = "gzip" in encoding.lower()
        if use_gzip:
            body = gzip.compress(body)
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        if use_gzip:
            self.send_header("Content-Encoding", "gzip")
            self.send_header("Vary", "Accept-Encoding")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def send_sse(self, event: str, data: dict):
        line = f"event: {event}\ndata: {json.dumps(data)}\n\n"
        self.wfile.write(line.encode("utf-8"))
        self.wfile.flush()

    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            parts = urllib.parse.urlsplit(self.path)
            if not parts.path.endswith('/'):
                self.send_response(HTTPStatus.MOVED_PERMANENTLY)
                new_parts = (parts[0], parts[1], parts[2] + '/',
                             parts[3], parts[4])
                new_url = urllib.parse.urlunsplit(new_parts)
                self.send_header("Location", new_url)
                self.send_header("Content-Length", "0")
                self.end_headers()
                return None
            for index in "index.html", "index.htm":
                index = os.path.join(path, index)
                if os.path.isfile(index):
                    path = index
                    break
            else:
                return self.list_directory(path)

        ctype = self.guess_type(path)
        if path.endswith("/"):
            self.send_error(HTTPStatus.NOT_FOUND, "File not found")
            return None

        try:
            fs = os.stat(path)
        except OSError:
            self.send_error(HTTPStatus.NOT_FOUND, "File not found")
            return None

        # Determine caching header
        clean_url_path = urllib.parse.urlsplit(self.path).path
        cache_control = None
        if clean_url_path in ("/", "/index.html") or os.path.basename(path) == "index.html":
            cache_control = "no-cache, must-revalidate"
        elif clean_url_path.startswith(("/assets/", "/models/", "/sounds/")):
            cache_control = "public, max-age=31536000, immutable"

        # Check If-Modified-Since
        if "If-Modified-Since" in self.headers and "If-None-Match" not in self.headers:
            try:
                ims = email.utils.parsedate_to_datetime(self.headers["If-Modified-Since"])
            except (TypeError, IndexError, OverflowError, ValueError):
                pass
            else:
                if ims.tzinfo is None:
                    ims = ims.replace(tzinfo=datetime.timezone.utc)
                if ims.tzinfo is datetime.timezone.utc:
                    last_modif = datetime.datetime.fromtimestamp(fs.st_mtime, datetime.timezone.utc)
                    last_modif = last_modif.replace(microsecond=0)
                    if last_modif <= ims:
                        self.send_response(HTTPStatus.NOT_MODIFIED)
                        if cache_control:
                            self.send_header("Cache-Control", cache_control)
                        self.end_headers()
                        return None

        # Check gzip compression
        accept_encoding = self.headers.get("Accept-Encoding", "")
        supports_gzip = "gzip" in accept_encoding.lower()
        should_compress = supports_gzip and is_compressible(ctype, path)

        if should_compress:
            try:
                compressed = get_compressed_data(path, fs.st_mtime)
            except OSError:
                self.send_error(HTTPStatus.NOT_FOUND, "File not found")
                return None
            f = io.BytesIO(compressed)
            content_length = len(compressed)
        else:
            try:
                f = open(path, "rb")
            except OSError:
                self.send_error(HTTPStatus.NOT_FOUND, "File not found")
                return None
            content_length = fs.st_size

        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", ctype)
        if should_compress:
            self.send_header("Content-Encoding", "gzip")
            self.send_header("Vary", "Accept-Encoding")
        self.send_header("Content-Length", str(content_length))
        self.send_header("Last-Modified", self.date_time_string(fs.st_mtime))
        if cache_control:
            self.send_header("Cache-Control", cache_control)
        self.end_headers()
        return f

    def do_HEAD(self):
        if self.path == "/api/health":
            gateway = check_gateway()
            return self.end_json({
                "ok": True,
                "site": "live",
                "persona": AGENT["displayName"],
                "agentId": "portfolio-website",
                "gateway": "live" if gateway["ok"] else "degraded",
                "gatewayPayload": gateway.get("payload"),
            })
        return super().do_HEAD()

    def do_GET(self):
        if self.path == "/api/health":
            gateway = check_gateway()
            return self.end_json({
                "ok": True,
                "site": "live",
                "persona": AGENT["displayName"],
                "agentId": "portfolio-website",
                "gateway": "live" if gateway["ok"] else "degraded",
                "gatewayPayload": gateway.get("payload"),
            })
        return super().do_GET()

    def do_POST(self):
        if self.path not in ("/api/portfolio-chat", "/api/chat"):
            return self.end_json({"ok": False, "error": "Not found"}, HTTPStatus.NOT_FOUND)

        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length).decode("utf-8"))
            message = str(payload.get("message", "")).strip()
            session_id = str(payload.get("sessionId", "")).strip() or None
        except (ValueError, json.JSONDecodeError):
            return self.end_json({"ok": False, "error": "Invalid request"}, HTTPStatus.BAD_REQUEST)

        if not message:
            return self.end_json({"ok": False, "error": "Message is required"}, HTTPStatus.BAD_REQUEST)

        # Build messages with history
        with _sessions_lock:
            history = list(_sessions.get(session_id, [])) if session_id else []

        messages = (
            [{"role": "system", "content": SYSTEM_PROMPT}]
            + history
            + [{"role": "user", "content": message}]
        )

        # SSE response headers
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "text/event-stream; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("X-Accel-Buffering", "no")
        self.end_headers()

        # True streaming: buffer until word boundary, then send to browser
        full_text = ""
        fallback_used = False
        word_buf = ""

        provider_used: dict = {}
        try:
            for chunk in stream_llm(messages, provider_used):
                full_text += chunk
                word_buf += chunk
                # Flush on word boundary (space or newline) to avoid mid-word splits
                if " " in word_buf or "\n" in word_buf:
                    self.send_sse("token", {"text": word_buf})
                    word_buf = ""
            if word_buf:
                self.send_sse("token", {"text": word_buf})

            if provider_used.get("finish_reason") in ("length", "max_tokens"):
                notice = "\n\n(Response truncated — ask me to continue, or email Adrian for the rest.)"
                full_text += notice
                self.send_sse("token", {"text": notice})
        except (BrokenPipeError, ConnectionResetError):
            return
        except Exception:
            # All LLM providers failed — use rule-based fallback
            fallback_used = True
            reply = build_reply(message)
            full_text = reply
            words = reply.split(" ")
            try:
                for i, word in enumerate(words):
                    self.send_sse("token", {"text": word if i == 0 else " " + word})
            except (BrokenPipeError, ConnectionResetError):
                return

        # Update session history
        if session_id and full_text:
            with _sessions_lock:
                hist = _sessions.setdefault(session_id, [])
                hist.append({"role": "user", "content": message})
                hist.append({"role": "assistant", "content": full_text})
                _sessions[session_id] = hist[-MAX_HISTORY:]

        try:
            self.send_sse("done", {
                "sessionId": session_id,
                "fallbackUsed": fallback_used,
                "model": "rule-based" if fallback_used else provider_used.get("name", "unknown"),
            })
        except (BrokenPipeError, ConnectionResetError):
            pass

    def log_message(self, format, *args):
        return super().log_message(format, *args)


def main():
    os.chdir(DIST_DIR)
    server = ThreadingHTTPServer((HOST, PORT), PortfolioHandler)
    server.serve_forever()


if __name__ == "__main__":
    main()
