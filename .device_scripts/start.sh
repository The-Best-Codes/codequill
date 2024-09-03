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

# Function to check command status
check_status() {
    if [ $? -eq 0 ]; then
        print_color "32" "✅ Success"
    else
        print_color "31" "❌ Failed"
        return 1
    fi
}

# Start message
print_color "35" "
==========================
🚀 Starting CodeQuill 🚀
==========================
"

# Define constants
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PORT=1291
PID_FILE="/tmp/codequill_server.pid"
TIMEOUT=60

# Change to the CodeQuill directory
cd "$SCRIPT_DIR/codequill" || {
    print_color "31" "❌ Failed to change to CodeQuill directory"
    exit 1
}
print_step "Changed to directory: $(pwd)"

# Function to get local IP address
get_local_ip() {
    hostname -I | awk '{print $1}'
}

# Function to check if CodeQuill is running on another device
check_remote_codequill() {
    local network_prefix=$(echo $1 | cut -d. -f1-3)
    local last_ip_file="$HOME/.codequill_last_ip"

    if [ -f "$last_ip_file" ]; then
        local last_ip=$(cat "$last_ip_file")
        if nc -z -w 1 $last_ip $PORT 2>/dev/null; then
            echo $last_ip
            return 0
        fi
    fi

    for i in {1..254}; do
        local ip="$network_prefix.$i"
        if [ "$ip" != "$1" ] && nc -z -w 1 $ip $PORT 2>/dev/null; then
            echo $ip >"$last_ip_file"
            echo $ip
            return 0
        fi
    done

    return 1
}

# Function to start the Next.js server
start_server() {
    npm run start -- -p $PORT &
    echo $! >"$PID_FILE"
}

# Function to check if the server is ready
check_server() {
    curl -s http://localhost:$PORT >/dev/null
    return $?
}

# Function to wait for the server to be ready
wait_for_server() {
    local elapsed=0
    while ! check_server; do
        sleep 1
        elapsed=$((elapsed + 1))
        if [ $elapsed -ge $TIMEOUT ]; then
            print_color "31" "❌ Timeout waiting for Next.js server to start"
            return 1
        fi
    done
    print_color "32" "✅ Next.js server is ready!"
    return 0
}

# Main execution
LOCAL_IP=$(get_local_ip)
REMOTE_IP=$(check_remote_codequill $LOCAL_IP)

if [ -n "$REMOTE_IP" ]; then
    print_step "CodeQuill is already running on $REMOTE_IP:$PORT"
    ELECTRON_START_URL=http://$REMOTE_IP:$PORT npm run electron -- --no-sandbox
else
    if [ ! -d ".next" ] || [ ! -d ".next/static" ]; then
        print_step "Building the Next.js app..."
        npm install && npm run build
        check_status || exit 1
    fi

    print_step "Starting Next.js server on port $PORT..."
    start_server
    wait_for_server || {
        kill $(cat "$PID_FILE")
        rm -f "$PID_FILE"
        exit 1
    }

    # Check if the Next.js server is ready by querying the homepage.
    #
    # Returns 0 if the server is ready, 1 if it is not.
    print_step "Starting Electron..."
    ELECTRON_START_URL=http://$LOCAL_IP:$PORT npm run electron -- --no-sandbox || {
        print_color "31" "❌ Failed to start Electron"
        kill $(cat "$PID_FILE")
        rm -f "$PID_FILE"
        exit 1
    }
fi

# Clean up
kill $(cat "$PID_FILE") 2>/dev/null
rm -f "$PID_FILE"

print_color "35" "
==========================
👋 CodeQuill has stopped 👋
==========================
"
