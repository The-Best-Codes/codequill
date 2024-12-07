#!/bin/bash

# Function to print colored text
print_color() {
    local color=$1
    local text=$2
    echo -e "\e[${color}m${text}\e[0m"
}

# Function to print step
print_step() {
    print_color "36" "\n $1"
}

# Function to check command status
check_status() {
    if [ $? -eq 0 ]; then
        print_color "32" " Success"
    else
        print_color "31" " Failed"
        return 1
    fi
}

# Function to select package manager
select_package_manager() {
    print_step "Select your preferred package manager:"
    echo "1) npm (with --legacy-peer-deps)"
    echo "2) yarn"
    echo "3) bun"
    read -p "Enter your choice [1-3]: " pm_choice

    case $pm_choice in
        1)
            PM="npm"
            PM_INSTALL="npm install --legacy-peer-deps"
            ;;
        2)
            PM="yarn"
            which yarn >/dev/null || (npm install -g yarn && check_status)
            PM_INSTALL="yarn install"
            ;;
        3)
            PM="bun"
            which bun >/dev/null || (curl -fsSL https://bun.sh/install | bash && check_status)
            PM_INSTALL="bun install"
            ;;
        *)
            print_color "31" "Invalid choice. Using npm as default."
            PM="npm"
            PM_INSTALL="npm install --legacy-peer-deps"
            ;;
    esac
}

# Start installation
print_color "35" "
==================================
 CodeQuill Installation Script 
==================================
"

# Update package list
print_step "Updating package list..."
sudo apt update
check_status || exit 1

# Install dependencies
print_step "Installing dependencies..."
sudo apt install -y git nodejs
check_status || exit 1

# Create codequill folder if it doesn't exist
print_step "Creating codequill folder..."
mkdir -p codequill
check_status || exit 1

# Check if codequill folder exists
if [ -d "codequill" ]; then
    print_step "CodeQuill folder already exists. Backing up database..."
    if [ -f "codequill/database.sqlite" ]; then
        cp codequill/database.sqlite ./database.sqlite.backup
        check_status || exit 1
    else
        print_color "33" " No database file found to backup."
    fi

    print_step "Removing existing CodeQuill folder..."
    rm -rf codequill
    check_status || exit 1
fi

# Stop existing server if running
PID_FILE="/tmp/codequill_server.pid"
if [ -f "$PID_FILE" ]; then
    print_step "Stopping existing CodeQuill server..."
    if kill $(cat "$PID_FILE") 2>/dev/null; then
        print_color "32" " Existing server stopped"
    else
        print_color "33" " Failed to stop existing server, it may not be running"
    fi
    rm -f "$PID_FILE"
fi

# Create codequill folder if it doesn't exist
print_step "Creating codequill folder..."
mkdir -p codequill
check_status || exit 1

# Check if it's a git repository
cd codequill
if [ -d ".git" ]; then
    print_step "Updating existing installation..."
    git pull origin main
    check_status || exit 1
else
    print_step "Cloning CodeQuill repository..."
    git clone https://github.com/The-Best-Codes/codequill.git .
    check_status || exit 1
fi

# Select and install with package manager
select_package_manager
print_step "Installing dependencies using $PM..."
$PM_INSTALL
check_status || exit 1

# Restore database if backup exists
if [ -f "../database.sqlite.backup" ]; then
    print_step "Restoring database..."
    mv ../database.sqlite.backup database.sqlite
    check_status || exit 1
fi

# Install Electron dependencies
print_step "Installing Electron dependencies..."
$PM install --save-dev electron electron-builder
check_status || exit 1

# Build the Next.js app
print_step "Building the Next.js app..."
$PM run build
if [ $? -ne 0 ]; then
    print_color "31" " Build failed. Please check for errors and try again."
    exit 1
fi
print_color "32" " Build completed successfully."

print_color "35" "
====================================
 Installation completed successfully! 

To start the server, run: ./start.sh
"
