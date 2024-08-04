#!/bin/bash

# Function to print colored text
print_color() {
    local color=$1
    local text=$2
    echo -e "\e[${color}m${text}\e[0m"
}

# Get the absolute path of the CodeQuill directory
CODEQUILL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Define the path for the desktop file
DESKTOP_FILE="$HOME/.local/share/applications/codequill.desktop"

# Define the path for the icon
ICON_PATH="$CODEQUILL_DIR/codequill/app/favicon.ico"

# Create the desktop entry
cat > "$DESKTOP_FILE" << EOL
[Desktop Entry]
Version=1.0
Type=Application
Name=CodeQuill
Comment=AI-powered code editor
Exec=$CODEQUILL_DIR/start.sh
Icon=$ICON_PATH
Terminal=false
Categories=Development;IDE;
EOL

# Make the desktop file executable
chmod +x "$DESKTOP_FILE"

# Update the desktop database
update-desktop-database "$HOME/.local/share/applications"

print_color "32" "✅ CodeQuill desktop entry created successfully!"
print_color "36" "📌 Desktop file location: $DESKTOP_FILE"
print_color "33" "ℹ️  You may need to log out and log back in for the changes to take effect."