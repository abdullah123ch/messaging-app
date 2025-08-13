#!/bin/bash

# Exit on error
set -e

# Renew certificates
docker-compose run --rm --entrypoint "\
  certbot renew \
    --quiet \
    --webroot \
    -w /var/www/certbot \
    --deploy-hook '\
      nginx -s reload && \
      echo "Reloading nginx..."'
" certbot
