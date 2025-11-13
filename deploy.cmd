#!/bin/bash

# Exit on any error
set -e

cd /home/site/wwwroot

echo "Installing dependencies..."
npm install --production=false

echo "Building Next.js application..."
npm run build

echo "Build complete!"
