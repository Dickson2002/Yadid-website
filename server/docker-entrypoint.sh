#!/bin/sh
set -e

echo "Running database seed..."
python -m app.seed

echo "Starting server..."
exec "$@"
