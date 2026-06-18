# Updating the upstream version

Stash's authors publish a prebuilt multi-arch image to Docker Hub (`savewithstash/stash`); we pin that image rather than building it ourselves. "Upstream" here is the app repo, [savewithstash/stash](https://github.com/savewithstash/stash).

## Determining the upstream version

- **Docker Hub tags** (authoritative for what we can pin):

  ```sh
  curl -s 'https://hub.docker.com/v2/repositories/savewithstash/stash/tags?page_size=25' \
    | jq -r '.results[].name'
  ```

- **Source tags** (the app repo publishes git tags, not GitHub Releases):

  ```sh
  gh api repos/savewithstash/stash/tags --jq '.[].name'
  ```

The current pin lives in `startos/manifest/index.ts` at `images.stash.source.dockerTag` (the version after the `:` in `savewithstash/stash:<version>`), and the StartOS version string lives in `startos/versions/current.ts`.

## Applying the bump

1. Bump `dockerTag` in `startos/manifest/index.ts` to `savewithstash/stash:<new version>` (drop any leading `v`).
2. Bump `version` in `startos/versions/current.ts` to `<new version>:0` and refresh `releaseNotes`.
3. Confirm the new image is still multi-arch (`amd64` + `arm64`) so it installs on both x86_64 and aarch64 StartOS hosts:

   ```sh
   docker manifest inspect savewithstash/stash:<new version> \
     | jq -r '.manifests[].platform.architecture'
   ```

Spin off a new version file only when the bump needs a data migration; otherwise edit `current.ts` in place. See the packaging guide's [Versions](https://docs.start9.com/packaging/versions) page.
