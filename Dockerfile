ARG IMAGE
FROM ${IMAGE}
# Upstream's slim base ships no system CA bundle, and Node's compiled-in roots are only as current as the image.
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates && rm -rf /var/lib/apt/lists/* \
 && ! grep -q MIICTjCCAdOgAwIBAgIKPPYHqWhwDtqLhDAKBggqhkjOPQQDAzBr /etc/ssl/certs/ca-certificates.crt
ENV NODE_OPTIONS=--use-openssl-ca
COPY --from=node:22.23.4-bookworm-slim /usr/local/bin/node /usr/local/bin/node
ENV NODE_VERSION=22.23.4
RUN [ "$(node --version)" = v22.23.4 ]
