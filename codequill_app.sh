#!/bin/bash

# Define colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Update package list
echo "Updating package list (you may need to authenticate)..."
if ! sudo apt update; then
    echo -e "${RED}Failed to update package list${NC}"
    exit 1
fi

if ! sudo apt install -y curl; then
    echo -e "${RED}Failed to install curl${NC}"
    exit 1
fi

# Function to print colored output
print_color() {
    printf "${1}%b${NC}\n" "$2"
}

# Function to check if a command was successful
check_success() {
    if [ $? -eq 0 ]; then
        print_color "${GREEN}" "✔ $1"
    else
        print_color "${RED}" "✘ $1"
        exit 1
    fi
}

# Main installation process
main() {
    print_color "${GREEN}" "Starting CodeQuill manager installation..."

    # Navigate to home directory
    cd ~ || exit
    check_success "Changed to home directory"

    # Download the installation script
    if ! curl -O https://raw.githubusercontent.com/The-Best-Codes/codequill/main/.device_scripts/codequill.sh; then
        print_color "${RED}" "Failed to download installation script"
        exit 1
    fi
    check_success "Downloaded installation script"

    # Make the script executable
    if ! sudo chmod +x codequill.sh; then
        print_color "${RED}" "Failed to make script executable"
        exit 1
    fi
    check_success "Made script executable"

    # Run the installation script
    if ! ./codequill.sh; then
        print_color "${RED}" "Failed to run installation script"
        exit 1
    fi
    check_success "Ran installation script"

    print_color "${GREEN}" "CodeQuill manager installation complete!"
}

# Run the main function
main

# Keep the terminal open until Ctrl+C is pressed
echo -e "${GREEN}Press Ctrl+C to exit.${NC}"
trap : TERM INT; sleep infinity & wait