<p align="center">
  <img src="icon.png" alt="Stash Logo" width="21%">
</p>

# Stash on StartOS

> Everything not listed in this document should behave the same as upstream
> Stash. If a feature, setting, or behavior is not mentioned here, the upstream
> documentation is accurate and fully applicable — see the Documentation
> section of `instructions.md` for links.

[Stash](https://github.com/savewithstash/stash) is a "save anything" inbox with a brain: paste a link, a screenshot, a quote or a reminder and it classifies, titles, summarizes, tags and indexes it for semantic search — and answers questions from what you have saved. **All of the inference runs on the server**, with no accounts, no API keys and no cloud. This package adds the login Stash does not have and keeps the model cache out of your backups.

- **Upstream repo:** <https://github.com/savewithstash/stash>
- **Wrapper repo:** <https://github.com/Start9-Community/stash-startos>

---

## Table of Contents

- [Image and Container Runtime](#image-and-container-runtime)
- [Volume and Data Layout](#volume-and-data-layout)
- [File Models](#file-models)
- [Dependencies](#dependencies)
- [Network Access and Interfaces](#network-access-and-interfaces)
- [Installation and First-Run Flow](#installation-and-first-run-flow)
- [Actions](#actions)
- [Tasks](#tasks)
- [Health Checks](#health-checks)
- [Backups and Restore](#backups-and-restore)
- [Limitations and Differences](#limitations-and-differences)
- [Quick Reference for AI Consumers](#quick-reference-for-ai-consumers)

---

## Image and Container Runtime

One upstream image, consumed unmodified.

| Property      | Value                      |
| ------------- | -------------------------- |
| Image         | `savewithstash/stash`      |
| Architectures | x86_64, aarch64            |
| Command       | The image's own entrypoint |

| Subcontainer | Purpose                                  |
| ------------ | ---------------------------------------- |
| `stash-sub`  | The only daemon — the one to `attach` to |

## Volume and Data Layout

Two volumes, and the split between them is the point.

| Volume   | Mount Point   | Purpose                  |
| -------- | ------------- | ------------------------ |
| `main`   | `/app/data`   | Everything you saved     |
| `models` | `/app/models` | Downloaded model weights |

| Path         | Written by | Holds                                      |
| ------------ | ---------- | ------------------------------------------ |
| _app data_   | Stash      | Notes, uploads, chats, settings, the index |
| `store.json` | The action | The web UI password                        |

**The model cache is a separate volume so it can be left out of backups.** The weights are a gigabyte and more, they are identical for every install, and they re-download on demand — including them would make every backup enormous to protect nothing.

## File Models

One model, holding one value.

| File         | Format | Modelled                | Written by |
| ------------ | ------ | ----------------------- | ---------- |
| `store.json` | JSON   | Yes — `FileHelper.json` | The action |

**The web UI password**, absent until the action generates it. Stash's own settings live in its application data and are edited in its interface.

The model is merged on every init, so a field added by a later version arrives with its default rather than missing, and it is read reactively — setting or rotating the password rebuilds the binding without any further step.

## Dependencies

None.

**And no external services either.** Inference runs on this server, so once the weights are downloaded Stash needs no internet to classify, summarize or answer — which is the whole point of it.

## Network Access and Interfaces

One interface.

| Interface | Id   | Type | Port | Description             |
| --------- | ---- | ---- | ---- | ----------------------- |
| Web UI    | `ui` | ui   | 5173 | The Stash web interface |

**Stash has no login of its own.** The whole interface is gated by HTTP basic auth applied at the StartOS reverse proxy, with the username `admin` and the generated password — the application never learns about it. The gate rides on the interface's TLS address, which is the one StartOS publishes for the LAN.

Until a password is set the binding carries an empty one, which never serves anything — because a `critical` task blocks the service from starting at the same time.

## Installation and First-Run Flow

Install raises a `critical` task to generate the web UI password. **The service cannot start until it exists**, so there is no window in which Stash is reachable with no credential.

Once started, **the first run downloads well over a gigabyte of model weights in the background**. Saving and browsing work immediately; classification, summarization and question-answering switch on by themselves when the weights are ready. A second, larger model is fetched the first time you save or ask about an image.

That download is why the health check is what it is — see below.

## Actions

One action.

### Set UI Password

Generates the basic-auth password and shows it once.

- **What it changes:** the password in the store, and through it the credential on the interface.
- **Cost:** the service restarts, since the binding is rebuilt.
- **Repeat safety:** each run generates a **new** password and invalidates the old one. It is never user-chosen, and the action warns that saved logins need updating.
- **Outputs:** the fixed username and the new password.
- **Runnable at any status**, including stopped — which is how the install-time task is completed.

## Tasks

One, and it is reactive.

| Task            | Severity   | Raised when                     | Cleared when    |
| --------------- | ---------- | ------------------------------- | --------------- |
| Set UI Password | `critical` | Any init that finds no password | The action runs |

`critical` blocks the service from starting and suspends the ordinary controls, so a fresh install shows the task and nothing else. Clearing the password re-raises it.

## Health Checks

One check, on the only daemon.

| Check     | Displayed as    | Method                 |
| --------- | --------------- | ---------------------- |
| `primary` | "Web Interface" | Port 5173 is listening |

**A port check is the right signal here, not an understatement.** Stash serves its interface immediately and loads models in the background, so waiting on the models would report a healthy service as unhealthy for the length of a large download.

The consequence is that **a green check does not mean the AI features work yet**. Their state is shown inside the application, which reports when the models are ready.

## Backups and Restore

**Only `main` is backed up** — `sdk.Backups.ofVolumes('main')`. That is everything you saved: notes, uploads, chats, settings, and the search index. It also holds the web UI password.

**The model volume is deliberately excluded.** Those weights are large, identical across installs, and re-downloadable — so a restored instance comes back with all of your content and re-fetches the models in the background, exactly as a fresh install does.

Expect a restored instance to take a while before its AI features light up again, for that reason.

## Limitations and Differences

1. **Authentication is the reverse proxy's, not Stash's.** One shared credential, username always `admin`, password generated rather than chosen.
2. **The model cache is not backed up**, so a restore re-downloads it.
3. **The first run — and the first run after a restore — downloads over a gigabyte** before the AI features work.
4. **Inference is local and needs the RAM for it.** The image model in particular wants a couple of gigabytes while it is active.
5. **A green health check does not mean the models are loaded.**
6. **No StartOS-side configuration** beyond the password — everything else is in Stash's interface.
7. **Single user.** There is one credential and no per-user separation.

---

## Quick Reference for AI Consumers

```yaml
package_id: stash
image: savewithstash/stash
architectures:
  - x86_64
  - aarch64
subcontainers:
  - stash-sub
volumes:
  main: /app/data # notes, uploads, chats, settings, index, store.json — backed up
  models: /app/models # ~1.3 GB+ of weights — NOT backed up, re-downloaded on demand
file_models:
  - store.json # uiPassword only
startos_managed_env_vars: []
dependencies: [] # inference is on-device; no cloud, no API keys
interfaces:
  ui: { type: ui, port: 5173 } # basic auth at the StartOS proxy, user "admin"
actions:
  - set-ui-password
tasks:
  - { action: set-ui-password, severity: critical } # reactive
health_checks:
  - primary # port only, deliberately — models load in the background after the UI serves
```
