#!/bin/sh
set -e

echo "Running database seed..."
vault-seed

echo "Starting server..."
exec "$@"
