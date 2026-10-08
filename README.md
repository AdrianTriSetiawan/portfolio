# Adrian Tri Setiawan — Portfolio

Personal portfolio website built with React, Vite, and Tailwind CSS. Includes a 3D portfolio, a 2D profile view, and a local Lady Lunaria guide.

**Live site:** [adriandev.online](https://adriandev.online)

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS v4 |
| Animations | Motion (Framer Motion) |
| Icons | react-icons (Simple Icons) |
| Portfolio guide | Local profile and project data |
| Backend | Python `http.server` (serve_portfolio.py) |
| Hosting | Self-hosted / Cloudflare Pages compatible |

---

## Project structure

```
portfolio/
├── src/
│   ├── App.jsx          # React app entry point
│   └── index.css        # Tailwind config, CSS custom properties, themes
├── public/
│   ├── profile/        # Adrian's portrait
│   ├── projects/       # Project images
│   └── agents/         # Public agent profile
├── content/
│   ├── profile.json    # Profile and technical stack
│   └── projects.json   # Project data
├── serve_portfolio.py  # Local dev server + /api/portfolio-chat endpoint
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

The app runs at `http://localhost:5173`. The in-page guide reads the local profile and project records; it does not require an OpenClaw gateway.

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

## Portfolio guide

Lady Lunaria uses `content/profile.json` and `content/projects.json` for profile, stack, and project answers. `public/agents/portfolio-agent.json` stores the public agent profile.

---

## Themes

Three visual themes are available via the theme switcher in the navbar:

- **Cyber** — purple/violet gradients (default)
- **Warm** — amber/rose tones
- **Blueprint** — cyan/monospace technical style
