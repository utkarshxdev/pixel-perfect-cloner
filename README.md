# Pixel-Perfect Cloner Skill 🎯

> **The end-to-end master protocol for coding agents (Antigravity, Claude Code, Cursor, Codex) to clone complex, modern, interactive, and WebGL-driven websites with 100% pixel perfection.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Protocol: v1.0.0](https://img.shields.io/badge/Protocol-v1.0.0-orange.svg)](SKILL.md)

---

## Why This Skill Exists

Standard website cloners and generic AI prompts fail catastrophically on modern, Awwwards-grade websites:
- **Missing Asset Formats**: Only fetching standard desktop WebP images causes WebGL texture loader promises to reject when `<picture>` requests `.avif` or `-m` mobile variants—leaving canvases stuck at `opacity: 0`.
- **The Hydration Trap**: Static HTML edits get immediately overwritten by client-side hydration (SvelteKit, Next.js, Nuxt, React) because hardcoded strings reside inside compiled JS chunks.
- **Scrollytelling Collisions**: Sticky runway plates (`[data-plate][data-lead]`) stay stuck and visually overlap downstream content or pricing tables.
- **Payment & API Crashes**: Cloned checkout panels crash with `"Invalid API Key provided"` because backend endpoints are missing or return dummy keys.
- **Dead Interactive Elements**: Reference sites often set `pointer-events: none` on 3D canvases to avoid scroll hijacking, leaving visitors frustrated when clicking cards does nothing.

**`pixel-perfect-cloner`** solves every single one of these problems with a battle-tested, 7-phase protocol and ready-to-run automation scripts.

---

## The 7-Phase Execution Lifecycle

```mermaid
flowchart TD
    A[Phase 1: Deep Asset Harvesting] --> B[Phase 2: WebGL & Shader Infrastructure]
    B --> C[Phase 3: Framework Hydration Sync]
    C --> D[Phase 4: Scrollytelling & Collision Guards]
    D --> E[Phase 5: API & Checkout Transparent Proxying]
    E --> F[Phase 6: Interactive 3D Hit-Testing & Modals]
    F --> G[Phase 7: Headless Chrome CDP Verification]
```

1. **Deep Responsive Asset Harvesting**: Automated waterfall discovery for all `<picture>` variants (`.avif`, `.webp`, `-m` breakpoints), fonts (`.woff2`), and media. Enforces eager texture loading.
2. **WebGL2, Halftone Shaders & 3D Runway Engines**: Exposes internal scene controller instances, pre-warms shared image bitmaps, and preserves shader replacement tokens.
3. **Dual-Layer Hydration Synchronization**: Synchronizes static SSR HTML with compiled client JS bundles (`chunks/`, `nodes/`) so customizations and white-labeling persist after hydration.
4. **Scrollytelling Runway Collision Guards**: Runtime `IntersectionObserver` scroll guards that dynamically suppress sticky narrative plates before they collide with downstream content.
5. **Stripe & Backend API Transparent Proxying**: Proxies checkout and booking endpoints with authentic origin/referer headers, with fallback to valid Stripe session parameters.
6. **3D Perspective Projection Hit-Testing & Modals**: Converts static 3D canvas planes into fully interactive elements with real-time perspective raycasting, hover follower badges (`View Project ↗`), and glassmorphic case study lightboxes with keyboard navigation.
7. **Headless Chrome CDP Verification & Multimodal QA**: Automated script that listens for console exceptions, network 404s, computed style drift, and captures multi-viewport screenshot evidence.

---

## Installation

### For Google Antigravity (AGY)
```bash
git clone https://github.com/utkarshxdev/pixel-perfect-cloner.git ~/.gemini/config/skills/pixel-perfect-cloner
```

### For Claude Code
```bash
git clone https://github.com/utkarshxdev/pixel-perfect-cloner.git ~/.claude/skills/pixel-perfect-cloner
```

### For Cursor / Codex / Custom Agents
Place the repository inside your agent's skills directory or import [`SKILL.md`](SKILL.md) into your system instructions.

---

## Usage

Simply prompt your agent with any URL:
> *"Clone https://example.com pixel-perfectly using pixel-perfect-cloner"*

The agent will autonomously execute the 7-phase lifecycle: harvest responsive assets, configure WebGL shaders, resolve hydration strings, attach collision guards, set up checkout proxying, and verify the rendered result in a live browser.

---

## Directory Structure

```text
pixel-perfect-cloner/
├── SKILL.md                          # Master 7-Phase Execution Protocol
├── README.md                         # Documentation & Quickstart
├── LICENSE                           # MIT License
├── references/
│   ├── webgl-and-shaders.md          # WebGL2, halftone shaders & canvas troubleshooting
│   ├── hydration-and-frameworks.md   # Overcoming client-side hydration overwrites
│   └── 3d-hit-testing-and-modals.md  # 3D perspective projection math & lightbox modals
└── scripts/
    ├── deep-asset-fetcher.py         # Responsive asset & picture variant downloader
    └── verify-clone.js               # Headless Chrome CDP inspector & screenshot QA
```

---

## License

[MIT](LICENSE) © 2026 Utkarsh Bhatnagar
