#!/bin/bash

# Exit on any error
set -e

echo "Installing dependencies..."
npm install

echo "Building Next.js application..."
npm run build

echo "Build complete!"
