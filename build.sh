#!/usr/bin/env zsh
# Usage: ./build.sh

echo "Compiling MakeCode target..."

# Try the fast build. If it fails, fallback to install + rebuild.
docker run --rm \
  -v "$(pwd)":/arcade-env/workspace \
  -w "/arcade-env/workspace" \
  makecode-arcade-env \
  bash -c "pxt build || { echo -e '\n[!] Build failed. Attempting to fetch missing dependencies...\n' && pxt install && pxt build; }"