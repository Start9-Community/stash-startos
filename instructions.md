# Stash

Stash is your private "save anything" inbox with a brain. Paste a link, screenshot, code snippet, quote, or reminder and Stash automatically figures out what it is, titles it, summarizes it, tags it, and makes it searchable — then you can **ask questions** and get answers drawn from your own saved items, each source cited. Everything runs on your server via QVAC; nothing you save ever leaves the box.

## Getting started

1. Open Stash's **Dashboard** tab.
2. Click the **Web UI** interface to open the app.
3. Paste anything into the bar and hit Enter — it's saved instantly.

## First run

On first launch Stash downloads about **1.3 GB of AI model weights** in the background (you'll see a progress bar). Until that finishes:

- Saving and browsing work right away.
- AI classification and **Ask mode** switch on automatically once the models report **Ready**.

The vision model that describes images is downloaded separately the first time you save or ask about an image (it needs ~2 GB of RAM while active).

## Choosing models

Open the **Settings** tab inside Stash to pick your language, embedding, and vision models from curated presets — including lighter options for lower-powered hardware. Switching the embedding model re-indexes your notes in the background. Your selection is saved and survives restarts and updates.

## Your data

- **Notes, uploads, chats, and settings** are stored on the backed-up `main` volume — they're included in StartOS backups and restored automatically.
- **Model weights** live on a separate volume that is *not* backed up, because they re-download automatically when needed.

## Tips

- **Ask mode** answers only from what you've saved, and highlights the source cards it used.
- Performance depends on your hardware — answers are near-instant on stronger machines and a few tokens per second on lighter ones. 8 GB RAM is recommended.
