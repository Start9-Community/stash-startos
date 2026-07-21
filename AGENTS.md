# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (architecture, for developers and LLMs) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **Package id is `stash`.** Stash has no login of its own; the OS reverse proxy enforces basic auth (username `admin`, password persisted in plaintext in `store.json` on the `main` volume) at the edge via the `ui` interface's `addSsl.auth`. The `set-ui-password` action is a critical task that blocks startup until a password is set. Two volumes: `main` (notes/uploads/chats/settings, backed up) and `models` (re-downloadable model weights, excluded from backups).

## Inspecting a running install

To run a command inside the service's container (read its generated config, grep app logs), use `start-cli package attach stash -n stash-sub -- <cmd>`. Select the subcontainer by **name** with `-n` (the name passed to `SubContainer.of` in `main.ts` — here `stash-sub`) or by image with `-i`. Note: `-s/--subcontainer` matches the internal **Guid**, not the name, so passing a name to `-s` fails with "no matching subcontainers".
