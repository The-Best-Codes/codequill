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

# Start uninstallation
print_color "35" "
==================================
🚀 CodeQuill Uninstallation Script 🚀
==================================
"

# Check if codequill folder exists
if [ -d "codequill" ]; then
    print_step "Removing existing CodeQuill folder..."
    rm -rf codequill
    check_status
else
    print_color "33" "⚠️ CodeQuill folder not found."
fi

# Check if database backup exists and remove it
if [ -f "./database.sqlite.backup" ]; then
    print_step "Removing database backup..."
    rm -f ./database.sqlite.backup
    check_status
else
    print_color "33" "⚠️ Database backup not found."
fi

# Run the remove_desktop.sh script
print_step "Running remove_desktop.sh script..."
if [ -f "./remove_desktop.sh" ]; then
    bash ./remove_desktop.sh
    check_status
else
    print_color "31" "❌ remove_desktop.sh script not found."
    exit 1
fi

print_color "35" "
====================================
🎉 Uninstallation completed successfully! 🎉
====================================
"
