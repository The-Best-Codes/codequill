#!/bin/bash

# Array of required scripts
REQUIRED_SCRIPTS=("install.sh" "uninstall.sh" "start.sh" "desktop.sh" "remove_desktop.sh")

# Base URL for downloading scripts
BASE_URL="https://raw.githubusercontent.com/The-Best-Codes/codequill/main/.device_scripts"

# Function to check and download missing scripts
check_and_download_scripts() {
    for script in "${REQUIRED_SCRIPTS[@]}"; do
        echo "Downloading $script..."
        curl -O "$BASE_URL/$script"
        if [ $? -ne 0 ]; then
            echo "Failed to download $script. Please check your internet connection and try again."
            exit 1
        fi
    done
}

# Function to display the header
show_header() {
    clear
    echo "=================================="
    echo "        CodeQuill Manager         "
    echo "=================================="
    echo
}

# Function to display the menu
show_menu() {
    echo "Please select an option:"
    echo "1) Install / Update"
    echo "2) Uninstall"
    echo "3) Open CodeQuill"
    echo "4) Cancel or Exit"
    echo
    echo -n "Enter your choice [1-4]: "
}

# Function to make scripts executable
make_executable() {
    chmod +x "${REQUIRED_SCRIPTS[@]}"
}

# Main script
check_and_download_scripts
make_executable

while true; do
    show_header
    show_menu

    read choice

    case $choice in
    1)
        echo "Installing / Updating CodeQuill..."
        ./install.sh
        echo "Setting up desktop integration..."
        ./desktop.sh
        echo "CodeQuill has been installed/updated successfully!"
        read -p "Press Enter to continue..."
        ;;
    2)
        echo "Uninstalling CodeQuill..."
        ./remove_desktop.sh
        ./uninstall.sh
        echo "CodeQuill has been uninstalled successfully!"
        read -p "Press Enter to continue..."
        ;;
    3)
        echo "Opening CodeQuill..."
        ./start.sh
        exit 0
        ;;
    4)
        echo "Exiting CodeQuill Manager. Goodbye!"
        exit 0
        ;;
    *)
        echo "Invalid option. Please try again."
        read -p "Press Enter to continue..."
        ;;
    esac
done
