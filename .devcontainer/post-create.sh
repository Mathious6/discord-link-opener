#!/usr/bin/env bash

set -euo pipefail # Exit on error // undefined variable // pipe error

if [ -f package.json ]; then
    npm ci
fi
