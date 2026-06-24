#!/bin/bash
# Canaan ERP — start backend + frontend together
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"

echo "==> Starting Canaan ERP"

# 1. Backend
echo ""
echo "[backend] Starting FastAPI on :8000 ..."
osascript -e "tell application \"Terminal\"
  activate
  do script \"cd '$ROOT/backend' && conda activate deeplearning && uvicorn main:app --host 0.0.0.0 --port 8000 --reload\"
end tell"

# Give the backend a moment to boot
sleep 3

# 2. Frontend
echo "[frontend] Starting Next.js on :3000 ..."
osascript -e "tell application \"Terminal\"
  activate
  do script \"cd '$ROOT/frontend' && npm run dev\"
end tell"

echo ""
echo "==> Both services started in new Terminal windows."
echo "    Backend:  http://localhost:8000"
echo "    Frontend: http://localhost:3000"
echo "    API docs: http://localhost:8000/docs"
