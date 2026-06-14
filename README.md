<p align="center">
  <img src="icon.svg" alt="Stash Logo" width="21%">
</p>

# Stash on StartOS

> **Upstream repo:** <https://github.com/savewithstash/stash>

Stash is a private "save anything" inbox with a brain — paste links, screenshots, code, quotes, or reminders and each is automatically classified, titled, summarized, tagged, and made semantically searchable. Ask mode answers questions from your own saved items, each source cited. All inference runs on-device via QVAC.

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Configuration Management](#configuration-management)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Actions (StartOS UI)](#actions-startos-ui)
- [Backups and Restore](#backups-and-restore)
- [Health Checks](#health-checks)
- [Dependencies](#dependencies)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

| Property      | Value                                          |
| ------------- | ---------------------------------------------- |
| Image         | `savewithstash/stash:1.0.1` (Docker Hub)       |
| Architectures | x86_64, aarch64                                |
| Command       | `sh -c 'cd /app && exec node server.js'`       |

The command forces the working directory to `/app` because `lib/store.js` resolves the data directory relative to CWD; `server.js` resolves everything else via `__dirname`.

---

## Volume and Data Layout

| Volume   | Mount Point    | Purpose                                          | Backed up |
| -------- | -------------- | ------------------------------------------------ | --------- |
| `main`   | `/app/data`    | Notes, uploads, chats, settings (`notes.json` …) | ✅        |
| `models` | `/app/models`  | Cached model weights (~1.3 GB+, re-downloadable) | ❌        |

Models live on a separate volume excluded from backups — they re-download automatically, so there's no point storing gigabytes of weights in every encrypted backup.

---

## Installation and First-Run Flow

Install and start. The web UI is usable immediately. On first run Stash downloads ~1.3 GB of model weights into the `models` volume in the background (a progress bar shows status); AI classification and Ask mode switch on automatically once the models report Ready. Until then, saving still works via heuristic classification.

---

## Configuration Management

No StartOS-managed config. Model selection (language / embedding / vision) is configured **in-app** from the Settings tab and persisted to the `main` volume.

---

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose          |
| --------- | ---- | -------- | ---------------- |
| Web UI    | 5173 | HTTP     | Stash web app    |

Exposed as a `ui` interface over LAN, `.local`, Tor, and custom domains via the standard StartOS host bindings.

---

## Actions (StartOS UI)

None.

---

## Backups and Restore

**Included in backup:** `main` volume (notes, uploads, chats, settings).
**Excluded:** `models` volume (re-downloaded on next start).
**Restore behavior:** `main` is fully restored before the service starts; models download again as needed.

---

## Health Checks

| Check         | Method                  | Messages                                                                          |
| ------------- | ----------------------- | --------------------------------------------------------------------------------- |
| Web Interface | Port listening (5173)   | Success: "The web interface is ready" / Error: "The web interface is not ready"   |

The UI serves immediately, so port-listening is the correct readiness signal; model loading happens in the background after the service is already healthy.

---

## Dependencies

None.

---

## Limitations and Differences

1. **First-run model download** (~1.3 GB) requires internet; AI features are degraded to heuristics until it completes.
2. **No AVX-512 / SVE required** — the upstream image targets AVX2+FMA (x86_64) and standard NEON (aarch64), so it runs on typical StartOS hardware.
3. **RAM:** 8 GB recommended; the vision model adds ~2 GB when first used.

---

## Quick Reference for AI Consumers

```yaml
package_id: stash
image: savewithstash/stash:1.0.1
architectures: [x86_64, aarch64]
volumes:
  main: /app/data       # backed up
  models: /app/models   # not backed up (re-downloadable)
ports:
  ui: 5173
command: ["sh", "-c", "cd /app && exec node server.js"]
dependencies: none
startos_managed_env_vars: none
actions: none
```
