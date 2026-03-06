#!/usr/bin/env bash
set -euo pipefail

PORT=8788
PID_FILE=".wrangler/dev.pid"

start() {
  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "⚡ Server already running (PID $(cat "$PID_FILE")) → http://localhost:$PORT"
    return
  fi
  mkdir -p .wrangler
  npx wrangler pages dev . --port "$PORT" &
  echo $! > "$PID_FILE"
  echo "🚀 Server starting (PID $!) → http://localhost:$PORT"
}

stop() {
  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    kill "$(cat "$PID_FILE")"
    rm -f "$PID_FILE"
    echo "🛑 Server stopped."
  else
    rm -f "$PID_FILE"
    echo "No server running."
  fi
}

restart() {
  stop
  sleep 1
  start
}

case "${1:-start}" in
  start)   start   ;;
  stop)    stop    ;;
  restart) restart ;;
  *)       echo "Usage: $0 {start|stop|restart}" ;;
esac
