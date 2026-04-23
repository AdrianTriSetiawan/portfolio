# Adrian Tri Setiawan — Portfolio

Personal portfolio website built with React, Vite, and Tailwind CSS. Features an AI chatbot persona (Lady Lunaria Eldharia) powered by the OpenClaw agent runtime.

**Live site:** [adriansetiawan.dev](https://adriansetiawan.dev) *(or wherever you host it)*

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Animations | Motion (Framer Motion) |
| Icons | react-icons (Simple Icons) |
| AI chatbot | OpenClaw agent runtime |
| Backend | Python `http.server` (serve_portfolio.py) |
| Hosting | Self-hosted / Cloudflare Pages compatible |

---

## Project structure

```
portfolio/
├── src/
│   ├── App.jsx          # All components and page logic
│   └── index.css        # Tailwind config, CSS custom properties, themes
├── public/
│   ├── projects/        # Project preview SVGs
│   └── agents/          # OpenClaw agent config (portfolio-agent.json)
├── content/
│   └── projects.json    # Project data
├── serve_portfolio.py   # Local dev server + /api/portfolio-chat endpoint
└── vite.config.js
```

---

## Local development

```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```

The app runs at `http://localhost:5173`. The AI chatbot requires the OpenClaw gateway to be running separately (see below).

---

## Building

```bash
npm run build
```

Output goes to `dist/`. To serve the built site with the chatbot backend:

```bash
# Copy your environment variables first (see Configuration below)
python3 serve_portfolio.py
```

Runs on `http://127.0.0.1:18891`.

---

## Configuration

Create a `.env` file at the project root (never commit this):

```env
OPENCLAW_GATEWAY_TOKEN=your_openclaw_gateway_token_here
```

`serve_portfolio.py` reads `OPENCLAW_GATEWAY_TOKEN` from the environment at startup.

---

## AI chatbot

The chatbot uses the **OpenClaw** agent runtime with the config at `public/agents/portfolio-agent.json`. The agent is named `portfolio-website` and presents as Lady Lunaria Eldharia.

When the OpenClaw gateway is unreachable, `serve_portfolio.py` falls back to a local keyword-based reply function so the chat always responds.

---

## Themes

Three visual themes are available via the theme switcher in the navbar:

- **Cyber** — purple/violet gradients (default)
- **Warm** — amber/rose tones
- **Blueprint** — cyan/monospace technical style
