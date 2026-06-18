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

Model selection (language / embedding / vision) is configured **in-app** from the Settings tab and persisted to the `main` volume. The one StartOS-managed setting is the UI login password (see [Actions](#actions-startos-ui)), stored in `store.json` on the `main` volume.

---

## Network Access and Interfaces

| Interface | Port | Protocol | Purpose          |
| --------- | ---- | -------- | ---------------- |
| Web UI    | 5173 | HTTP     | Stash web app    |

Exposed as a `ui` interface over LAN, `.local`, Tor, and custom domains via the standard StartOS host bindings.

Stash has **no login of its own**, so StartOS enforces HTTP basic auth at the reverse proxy for every address on this port. On first install a **critical task** prompts you to run **Set UI Password**, which generates the password (username `admin`); the UI stays locked until you do. See [Actions](#actions-startos-ui).

---

## Actions (StartOS UI)

| Action          | ID                | Purpose                                                                 |
| --------------- | ----------------- | ----------------------------------------------------------------------- |
| Set UI Password | `set-ui-password` | Generate a new random login password for the Web UI (username `admin`). |

Stash ships with no authentication, so the package enforces an OS-level basic-auth gate at the edge proxy. A **critical task** raised on first install (and any time the stored password is missing) requires you to run **Set UI Password**, which generates a strong random password, stores it in `store.json` (on the `main` volume), and shows you the credentials. Run it again to rotate the password.

---

## Backups and Restore

**Included in backup:** `main` volume (notes, uploads, chats, settings, and the UI login password in `store.json`).
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
auth: enforced HTTP basic auth at edge proxy (username admin); app has no native login
actions:
  - set-ui-password   # generate/rotate the enforced UI login password (username admin)
```
