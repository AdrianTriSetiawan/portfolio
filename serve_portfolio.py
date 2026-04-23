#!/usr/bin/env python3
import json
import os
import subprocess
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import URLError
from urllib.request import Request, urlopen


ROOT = Path("/home/ubuntu/portfolio")
DIST_DIR = ROOT / "dist"
AGENT_CONFIG = ROOT / "public" / "agents" / "portfolio-agent.json"
PORT = 18891
HOST = "127.0.0.1"
GATEWAY_URL = "http://127.0.0.1:18789/health"
GATEWAY_TOKEN = "REDACTED"
OPENCLAW_AGENT_ID = "portfolio-website"
OPENCLAW_AGENT_TIMEOUT_SECONDS = 35
OPENCLAW_NODE_BIN_DIR = "/home/ubuntu/.nvm/versions/node/v22.22.2/bin"
OPENCLAW_BIN = f"{OPENCLAW_NODE_BIN_DIR}/openclaw"


def load_agent():
    with AGENT_CONFIG.open("r", encoding="utf-8") as handle:
        return json.load(handle)


AGENT = load_agent()


def check_gateway():
    request = Request(
        GATEWAY_URL,
        headers={"Authorization": f"Bearer {GATEWAY_TOKEN}"},
    )
    try:
        with urlopen(request, timeout=2) as response:
            payload = json.loads(response.read().decode("utf-8"))
        return {"ok": True, "payload": payload}
    except (URLError, TimeoutError, json.JSONDecodeError, OSError) as error:
        return {"ok": False, "error": str(error)}


def run_openclaw_agent(message: str):
    return run_openclaw_agent_with_session(message, None)


def run_openclaw_agent_with_session(message: str, session_id: str | None):
    command = [
        OPENCLAW_BIN,
        "agent",
        "--agent",
        OPENCLAW_AGENT_ID,
        "--message",
        message,
        "--json",
        "--timeout",
        str(OPENCLAW_AGENT_TIMEOUT_SECONDS),
    ]
    if session_id:
        command.extend(["--session-id", session_id])
    try:
        completed = subprocess.run(
            command,
            check=True,
            capture_output=True,
            text=True,
            timeout=OPENCLAW_AGENT_TIMEOUT_SECONDS + 15,
            env={
                **os.environ,
                "PATH": f"{OPENCLAW_NODE_BIN_DIR}:{os.environ.get('PATH', '')}",
                "HOME": "/home/ubuntu",
            },
        )
        payload = json.loads(completed.stdout)
        result = payload.get("result", {})
        meta = result.get("meta", {})
        system_prompt_report = meta.get("systemPromptReport", {})
        final_text = (
            system_prompt_report.get("finalAssistantVisibleText")
            or system_prompt_report.get("finalAssistantRawText")
        )
        if not final_text:
            final_text = next(
                (
                    entry.get("text", "").strip()
                    for entry in reversed(result.get("payloads", []))
                    if entry.get("text", "").strip()
                ),
                "",
            )
        if not final_text:
            raise ValueError("OpenClaw returned no final assistant text")
        return {
            "ok": True,
            "reply": final_text,
            "payload": payload,
            "sessionId": meta.get("agentMeta", {}).get("sessionId"),
            "durationMs": meta.get("durationMs"),
            "provider": meta.get("agentMeta", {}).get("provider"),
            "model": meta.get("agentMeta", {}).get("model"),
        }
    except (
        subprocess.SubprocessError,
        subprocess.TimeoutExpired,
        json.JSONDecodeError,
        ValueError,
    ) as error:
        return {"ok": False, "error": str(error)}


def build_reply(message: str) -> str:
    normalized = "".join(ch.lower() if ch.isalnum() or ch.isspace() else " " for ch in message)
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

    if has_any("lunaria", "who are you", "who is this agent", "who are u"):
      return (
          "I am Lady Lunaria Eldharia, the public-facing guide for Adrian's portfolio. "
          "I keep my replies warm, clear, and limited to Adrian's work, profile, and contact context, "
          "while the website presents me through Adrian's Clawbot visual layer."
      )

    if has_any("pira", "piramida", "customer service", "helpdesk", "chatbot"):
        return (
            "PIRA stands for Piramida Inteligence Response Assistant. It is Adrian's AI chatbot direction "
            "for helpdesk and customer service workflows, built around responsive support interaction, structured assistance, "
            "and a Clawbot-based visual presentation."
        )

    if has_any("lunaria project", "lady lunaria", "assistant system", "discord assistant"):
        return (
            "Lunaria is both Adrian's AI identity layer and a real assistant-system direction. "
            "It combines character consistency, practical utility, a warm but precise interaction style, "
            "and a Clawbot visual shell on this public website."
        )

    if has_any("project", "cctv", "recognition", "face", "vision"):
        return (
            f"{project['name']} is a private computer vision case study focused on {project['summary'].lower()} "
            f"The stack shown in the portfolio is {', '.join(project['stack'])}."
        )

    if has_any("strength", "skills", "adapt", "team", "solo", "good at"):
        return f"Adrian is strongest in {', '.join(strengths).lower()}."

    if has_any("contact", "email", "github", "hire", "reach"):
        return (
            f"You can reach Adrian at {contact['email']}. His public work is available at "
            f"{contact['github']}, and he is based in {base}."
        )

    if has_any("education", "university", "study", "background"):
        return f"{name} studied {education}. His current professional direction combines {focus.lower()}"

    if has_any("bio", "summary", "who is", "headline", "about"):
        return (
            f"{name} is a {headline}. He focuses on {focus.lower()} and works across research, "
            "experimentation, and implementation."
        )

    return (
        "I only handle Adrian's portfolio context. You can ask me about Adrian's profile, strengths, "
        "Lunaria, PIRA, Recognition CCTV, education, technical focus, or contact details."
    )


class PortfolioHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(DIST_DIR), **kwargs)

    def end_json(self, payload: dict, status: int = HTTPStatus.OK):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        if self.path == "/api/health":
            gateway = check_gateway()
            return self.end_json(
                {
                    "ok": True,
                    "site": "live",
                    "persona": AGENT["displayName"],
                    "agentId": OPENCLAW_AGENT_ID,
                    "gateway": "live" if gateway["ok"] else "unreachable",
                    "gatewayPayload": gateway.get("payload"),
                }
            )
        return super().do_GET()

    def do_POST(self):
        if self.path != "/api/portfolio-chat":
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

        gateway = check_gateway()
        agent_run = run_openclaw_agent_with_session(message, session_id)
        reply = agent_run["reply"] if agent_run["ok"] else build_reply(message)
        return self.end_json(
            {
                "ok": True,
                "reply": reply,
                "persona": AGENT["displayName"],
                "agentId": OPENCLAW_AGENT_ID,
                "source": "openclaw-subagent" if agent_run["ok"] else "portfolio-backend-fallback",
                "gateway": "live" if gateway["ok"] else "unreachable",
                "model": agent_run.get("model"),
                "provider": agent_run.get("provider"),
                "sessionId": agent_run.get("sessionId"),
                "durationMs": agent_run.get("durationMs"),
                "fallbackUsed": not agent_run["ok"],
            }
        )

    def log_message(self, format, *args):
        return super().log_message(format, *args)


def main():
    os.chdir(DIST_DIR)
    server = ThreadingHTTPServer((HOST, PORT), PortfolioHandler)
    server.serve_forever()


if __name__ == "__main__":
    main()
