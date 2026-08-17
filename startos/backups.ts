import { sdk } from './sdk'

// `models` is a separate volume so it can be left out of the backup: the
// weights are 1.3 GB+, identical for every install, and re-downloaded on
// demand. Don't fold them into `main`.
export const { createBackup, restoreInit } = sdk.setupBackups(
  async ({ effects }) => sdk.Backups.ofVolumes('main'),
)
