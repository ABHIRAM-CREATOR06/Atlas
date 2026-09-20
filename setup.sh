#!/usr/bin/env bash

set -e

BOLD='\035[1m'
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BOLD}===================================================${NC}"
echo -e "${BOLD}  Atlas - Protocol Explainer Platform Setup Script ${NC}"
echo -e "${BOLD}===================================================${NC}"
echo ""

if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR] Node.js is not installed or not in PATH.${NC}"
    echo "Please install Node.js v18+ from https://nodejs.org/"
    exit 1
fi

echo -e "${GREEN}[OK] Node.js detected: $(node -v)${NC}"
echo ""

echo "Select setup option:"
echo "  [1] Development mode (Install dependencies & start dev server)"
echo "  [2] Build & Test mode (Run unit tests & build production bundle)"
echo "  [3] Docker deployment (Build & launch Docker container)"
echo "  [4] Exit"
echo ""

read -p "Enter choice (1-4): " CHOICE

case "$CHOICE" in
    1)
        echo ""
        echo "[1/2] Installing dependencies..."
        npm install
        echo "[2/2] Starting development server..."
        npm run dev
        ;;
    2)
        echo ""
        echo "[1/3] Installing dependencies..."
        npm install
        echo "[2/3] Running Vitest unit tests..."
        npm test
        echo "[3/3] Building production bundle..."
        npm run build
        echo ""
        echo -e "${GREEN}[SUCCESS] Build completed successfully. Output directory: ./dist${NC}"
        ;;
    3)
        echo ""
        if ! command -v docker &> /dev/null; then
            echo -e "${RED}[ERROR] Docker is not installed or not in PATH.${NC}"
            echo "Please install Docker from https://www.docker.com/"
            exit 1
        fi
        echo "Building and launching Docker container..."
        docker compose up --build
        ;;
    4)
        echo "Exiting setup."
        exit 0
        ;;
    *)
        echo "Invalid option. Exiting."
        exit 1
        ;;
esac
