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
        exit 1
    fi
}

# Start installation
print_color "35" "
==================================
🚀 CodeQuill Installation Script 🚀
==================================
"

# Update package list
print_step "Updating package list..."
sudo apt update
check_status

# Install dependencies
print_step "Installing dependencies..."
sudo apt install -y git nodejs npm
check_status

# Create codequill folder if it doesn't exist
print_step "Creating codequill folder..."
mkdir -p codequill
check_status

# Check if codequill folder exists
if [ -d "codequill" ]; then
    print_step "CodeQuill folder already exists. Backing up database..."
    if [ -f "codequill/database.sqlite" ]; then
        cp codequill/database.sqlite ./database.sqlite.backup
        check_status
    else
        print_color "33" "⚠️ No database file found to backup."
    fi

    print_step "Removing existing CodeQuill folder..."
    rm -rf codequill
    check_status
fi

# Clone the repository
print_step "Cloning the CodeQuill repository..."
git clone https://github.com/The-Best-Codes/codequill.git
check_status

# Restore database if backup exists
if [ -f "./database.sqlite.backup" ]; then
    print_step "Restoring database..."
    mv ./database.sqlite.backup codequill/database.sqlite
    check_status
fi

# Change directory
print_step "Changing to the CodeQuill directory..."
mkdir -p codequill
cd codequill
check_status

# Install Node.js dependencies
print_step "Installing Node.js dependencies..."
npm install
check_status

# Install Electron dependencies
print_step "Installing Electron dependencies..."
npm install --save-dev electron electron-builder
check_status

# Build the Next.js app
print_step "Building the Next.js app..."
npm run build
if [ $? -ne 0 ]; then
    print_color "31" "❌ Build failed. Please check for errors and try again."
    exit 1
fi
print_color "32" "✅ Build completed successfully."

print_color "35" "
====================================
🎉 Installation completed successfully! 🎉
====================================

To start the server, run: ./start.sh
"
