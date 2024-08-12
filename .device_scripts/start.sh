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

PORT=1291

# Function to get local IP address
get_local_ip() {
    hostname -I | awk '{print $1}'
}

# Function to check if CodeQuill is running on another device (parallelized)
check_remote_codequill() {
    local network_prefix=$(echo $1 | cut -d. -f1-3)
    local ip_list=($(seq 1 254 | xargs -I {} echo "${network_prefix}.{}"))
    local -a pids=()

    for ip in "${ip_list[@]}"; do
        if [ "$ip" != "$1" ]; then
            (nc -z -w 1 $ip $PORT && echo $ip) &
            pids+=($!)
        fi
    done

    for pid in "${pids[@]}"; do
        wait $pid
    done | head -n 1
}

LOCAL_IP=$(get_local_ip)
REMOTE_IP=$(check_remote_codequill $LOCAL_IP)

if [ -n "$REMOTE_IP" ]; then
    print_step "CodeQuill is already running on $REMOTE_IP:$PORT"
    ELECTRON_START_URL=http://$REMOTE_IP:$PORT npm run electron -- --no-sandbox
else
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
    ELECTRON_START_URL=http://$LOCAL_IP:$PORT npm run electron -- --no-sandbox
fi

print_color "35" "
==========================
👋 CodeQuill has stopped 👋
==========================
"
