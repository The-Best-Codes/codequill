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

# Function to check if a port is in use
check_port() {
    nc -z localhost $1 >/dev/null 2>&1
}

# Function to find an available port
find_available_port() {
    local start_port=$1
    local end_port=$2
    for port in $(seq $start_port $end_port); do
        if ! check_port $port; then
            echo $port
            return 0
        fi
    done
    return 1
}

# Check if the server is already running on this device
if check_port $PORT; then
    print_step "CodeQuill is already running on localhost:$PORT"
    ELECTRON_START_URL=http://localhost:$PORT npm run electron -- --no-sandbox
    exit 0
fi

# Parallel port scanning
print_step "Scanning for running CodeQuill instances..."
FOUND_PORT=""
PORT_RANGE_START=1291
PORT_RANGE_END=1300

for port in $(seq $PORT_RANGE_START $PORT_RANGE_END); do
    (
        if check_port $port; then
            echo $port
            kill -SIGINT $$ # Send interrupt signal to the main script
        fi
    ) &
done

# Wait for any child process to finish or timeout after 5 seconds
timeout 5s wait
FOUND_PORT=$(find_available_port $PORT_RANGE_START $PORT_RANGE_END)

if [ -n "$FOUND_PORT" ]; then
    print_step "CodeQuill is already running on localhost:$FOUND_PORT"
    ELECTRON_START_URL=http://localhost:$FOUND_PORT npm run electron -- --no-sandbox
    exit 0
fi

# If no running instance found, start the server locally
print_step "No running CodeQuill instance found. Starting server locally..."

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

# Electron has exited, perform any necessary cleanup
print_color "35" "
==========================
👋 CodeQuill has stopped 👋
==========================
"
