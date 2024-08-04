#!/bin/bash

# Function to print colored text
print_color() {
    local color=$1
    local text=$2
    echo -e "\e[${color}m${text}\e[0m"
}

# Function to print step
print_step() {
    print_color "36" "\n📌 $1"
}

# Function to cleanup and exit
cleanup_and_exit() {
    print_color "33" "\n\n🛑 Stopping CodeQuill..."

    if [ -n "$NEXT_PID" ]; then
        if kill -0 $NEXT_PID 2>/dev/null; then
            kill $NEXT_PID
            wait $NEXT_PID 2>/dev/null
            print_color "32" "✅ Next.js server stopped"
        else
            print_color "33" "⚠️ Next.js server was not running"
        fi
    else
        print_color "33" "⚠️ Next.js server PID not set"
    fi

    print_color "35" "
==========================
👋 CodeQuill has stopped 👋
==========================
"
    exit 0
}

# Trap Ctrl+C and other termination signals
trap cleanup_and_exit SIGINT SIGTERM

# Start message
print_color "35" "
==========================
🚀 Starting CodeQuill 🚀
==========================
"

# Change to the CodeQuill directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/codequill" || {
    print_color "31" "❌ Failed to change to CodeQuill directory"
    exit 1
}
print_step "Changed to directory: $(pwd)"

# Check if .next directory exists
if [ ! -d ".next" ]; then
    print_step "The .next directory is missing. Running 'next build'..."
    npm run build
    if [ $? -ne 0 ]; then
        print_color "31" "❌ Build failed. Please check for errors and try again."
        exit 1
    fi
    print_color "32" "✅ Build completed successfully."
else
    print_step ".next directory found. Skipping build."
fi

# Check if settings.json exists
if [ -f "settings.json" ]; then
    # Extract port from settings.json
    PORT=$(grep -oP '"port":\s*\K\d+' settings.json)
    if [ -z "$PORT" ]; then
        PORT=1291
        print_step "No port specified in settings.json. Using default port: $PORT"
    else
        print_step "Using port from settings.json: $PORT"
    fi
else
    PORT=1291
    print_step "settings.json not found. Using default port: $PORT"
fi

# Start the Next.js server in the background
print_step "Starting Next.js server on port $PORT..."
npm run start -- -p $PORT &
NEXT_PID=$!

# Function to check if the server is ready
check_server() {
    curl -s http://localhost:$PORT >/dev/null
    return $?
}

# Wait for the server to be ready
print_step "Waiting for Next.js server to be ready..."
while ! check_server; do
    sleep 1
done
print_color "32" "✅ Next.js server is ready!"

# Start Electron
print_step "Starting Electron..."
ELECTRON_START_URL=http://localhost:$PORT npm run electron -- --no-sandbox

# Electron has exited, so we can clean up
# cleanup_and_exit
