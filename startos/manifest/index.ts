import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'stash',
  title: 'Stash',
  license: 'AGPL-3.0',
  packageRepo: 'https://github.com/savewithstash/stash-startos',
  upstreamRepo: 'https://github.com/savewithstash/stash',
  marketingUrl: 'https://github.com/savewithstash/stash',
  donationUrl: null,
  description: { short, long },
  // `main` holds notes/uploads/chats/settings and is backed up; `models`
  // caches re-downloadable model weights (~1.3 GB+) and is excluded from
  // backups (see startos/backups.ts).
  volumes: ['main', 'models'],
  images: {
    stash: {
      source: { dockerTag: 'savewithstash/stash:1.0.1' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  alerts: {
    install: null,
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})
