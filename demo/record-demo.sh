#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT="${1:-$ROOT/demo/proofgrid-demo-silent.mp4}"
DISPLAY_NUM="${DISPLAY_NUM:-99}"
DISPLAY=":$DISPLAY_NUM"
PROFILE="/tmp/proofgrid-chromium-demo"
SERVER_LOG="/tmp/proofgrid-server.log"
CHROME_LOG="/tmp/proofgrid-chromium.log"

cleanup() {
  [[ -n "${CHROME_PID:-}" ]] && kill "$CHROME_PID" 2>/dev/null || true
  [[ -n "${SERVER_PID:-}" ]] && kill "$SERVER_PID" 2>/dev/null || true
  [[ -n "${XVFB_PID:-}" ]] && kill "$XVFB_PID" 2>/dev/null || true
}
trap cleanup EXIT

rm -rf "$PROFILE"
mkdir -p "$(dirname "$OUT")"

cd "$ROOT"
node server.mjs >"$SERVER_LOG" 2>&1 &
SERVER_PID=$!

Xvfb "$DISPLAY" -screen 0 1280x720x24 -ac +extension RANDR >/tmp/proofgrid-xvfb.log 2>&1 &
XVFB_PID=$!
sleep 1

DISPLAY="$DISPLAY" chromium \
  --no-sandbox \
  --no-first-run \
  --no-default-browser-check \
  --disable-infobars \
  --disable-session-crashed-bubble \
  --disable-features=TranslateUI \
  --force-device-scale-factor=1 \
  --window-position=0,0 \
  --window-size=1280,720 \
  --kiosk \
  --user-data-dir="$PROFILE" \
  "http://127.0.0.1:4173/?record=1" >"$CHROME_LOG" 2>&1 &
CHROME_PID=$!
sleep 3

ffmpeg -y -loglevel warning \
  -f x11grab -framerate 30 -video_size 1280x720 -i "$DISPLAY.0+0,0" \
  -t 61 \
  -c:v libx264 -preset veryfast -crf 20 -pix_fmt yuv420p \
  -movflags +faststart "$OUT"

echo "$OUT"
