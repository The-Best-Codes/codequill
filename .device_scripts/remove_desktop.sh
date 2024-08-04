#!/bin/bash

# Function to print colored text
print_color() {
    local color=$1
    local text=$2
    echo -e "\e[${color}m${text}\e[0m"
}

# Define the path for the desktop file
DESKTOP_FILE="$HOME/.local/share/applications/codequill.desktop"

# Check if the desktop file exists
if [ -f "$DESKTOP_FILE" ]; then
    # Remove the desktop file
    sudo rm "$DESKTOP_FILE"

    # Update the desktop database
    update-desktop-database "$HOME/.local/share/applications"

    print_color "32" "✅ CodeQuill desktop entry removed successfully!"
else
    print_color "33" "⚠️ CodeQuill desktop entry not found. Nothing to remove."
fi

print_color "33" "ℹ️  You may need to log out and log back in for the changes to take effect."
