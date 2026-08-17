# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

Work this package's `TODO.md` from top to bottom. Keep `README.md` (technical reference for an AI support or administering agent) and `instructions.md` (end-user docs) in sync with your changes.

## This repo

- **The health check is a port check on purpose.** Stash serves the UI immediately and loads models in the background, so gating readiness on the models would report a working service as unhealthy for the length of a large download. Don't "improve" it into a model-readiness probe.
- **Inference is on-device.** No API keys, no cloud provider, no outbound dependency once the weights are cached — keep it that way in code and in docs.
