#!/bin/bash

# Define colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Update package list
echo "Updating package list (you may need to authenticate)..."
apt update
apt install -y curl

# Function to print colored output
print_color() {
    printf "${1}${2}${NC}\n"
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
    curl -O https://raw.githubusercontent.com/The-Best-Codes/codequill/main/.device_scripts/codequill.sh
    check_success "Downloaded installation script"

    # Make the script executable
    chmod +x codequill.sh
    check_success "Made script executable"

    # Run the installation script
    ./codequill.sh
    check_success "Ran installation script"

    print_color "${GREEN}" "CodeQuill manager installation complete!"
}

# Run the main function
main
