import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  /**
   * ======================== Setup ========================
   */
  console.info(i18n('Starting Stash!'))

  /**
   * ======================== Daemons ========================
   *
   * Stash is a single Node service. The `main` volume holds notes, uploads,
   * chats, and settings; the `models` volume caches downloaded model weights.
   * Both are mounted at the paths the app expects.
   */
  return sdk.Daemons.of(effects).addDaemon('primary', {
    subcontainer: await sdk.SubContainer.of(
      effects,
      { imageId: 'stash' },
      sdk.Mounts.of()
        .mountVolume({
          volumeId: 'main',
          subpath: null,
          mountpoint: '/app/data',
          readonly: false,
        })
        .mountVolume({
          volumeId: 'models',
          subpath: null,
          mountpoint: '/app/models',
          readonly: false,
        }),
      'stash-sub',
    ),
    exec: { command: sdk.useEntrypoint() },
    ready: {
      display: i18n('Web Interface'),
      // Stash serves the UI immediately; models load in the background, so a
      // port-listening check is the right readiness signal.
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: i18n('The web interface is ready'),
          errorMessage: i18n('The web interface is not ready'),
        }),
    },
    requires: [],
  })
})
