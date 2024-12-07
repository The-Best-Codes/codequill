#!/bin/bash

# Array of required scripts
REQUIRED_SCRIPTS=("install.sh" "uninstall.sh" "start.sh" "desktop.sh" "remove_desktop.sh")

# Base URL for downloading scripts
BASE_URL="https://raw.githubusercontent.com/The-Best-Codes/codequill/main/.device_scripts"

# Function to check and download scripts
check_and_download_scripts() {
    for script in "${REQUIRED_SCRIPTS[@]}"; do
        if [ ! -f "$script" ]; then
            echo "Downloading $script..."
            curl -O "$BASE_URL/$script"
            if [ $? -ne 0 ]; then
                echo "Failed to download $script. Please check your internet connection and try again."
                exit 1
            fi
        fi
    done
}

# Function to update scripts
update_scripts() {
    echo "Updating scripts..."
    for script in "${REQUIRED_SCRIPTS[@]}"; do
        echo "Updating $script..."
        curl -O "$BASE_URL/$script"
        if [ $? -ne 0 ]; then
            echo "Failed to update $script. Please check your internet connection and try again."
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
    echo "1) Install"
    echo "2) Update"
    echo "3) Uninstall"
    echo "4) Open CodeQuill"
    echo "5) Cancel or Exit"
    echo
    echo -n "Enter your choice [1-5]: "
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
            ./install.sh
            ;;
        2)
            update_scripts
            make_executable
            ./install.sh
            ;;
        3)
            ./uninstall.sh
            ;;
        4)
            ./start.sh
            ;;
        5)
            echo "Exiting..."
            exit 0
            ;;
        *)
            echo "Invalid option. Please try again."
            sleep 2
            ;;
    esac
done
