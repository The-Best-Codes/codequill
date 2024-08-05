@echo off
setlocal enabledelayedexpansion

:: Function to print colored text
:print_color
set "color=%~1"
set "text=%~2"
echo [%color%m%text%[0m
exit /b

:: Function to print step
:print_step
call :print_color 36 "
📌 %~1"
exit /b

:: Function to check command status
:check_status
if %errorlevel% equ 0 (
    call :print_color 32 "✅ Success"
) else (
    call :print_color 31 "❌ Failed"
    exit /b 1
)
exit /b

:: Start installation
call :print_color 35 "
==================================
🚀 CodeQuill Installation Script 🚀
==================================
"

:: Check if Git is installed
where git >nul 2>&1
if %errorlevel% neq 0 (
    call :print_color 31 "❌ Git is not installed. Please install Git and try again."
    exit /b 1
)

:: Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    call :print_color 31 "❌ Node.js is not installed. Please install Node.js and try again."
    exit /b 1
)

:: Check if npm is installed
where npm >nul 2>&1
if %errorlevel% neq 0 (
    call :print_color 31 "❌ npm is not installed. Please install npm and try again."
    exit /b 1
)

:: Check if codequill folder exists
if exist "codequill" (
    call :print_step "CodeQuill folder already exists. Backing up database..."
    if exist "codequill\database.sqlite" (
        copy "codequill\database.sqlite" "database.sqlite.backup" >nul
        call :check_status
    ) else (
        call :print_color 33 "⚠️ No database file found to backup."
    )

    call :print_step "Removing existing CodeQuill folder..."
    rmdir /s /q "codequill"
    call :check_status
)

:: Clone the repository
call :print_step "Cloning the CodeQuill repository..."
git clone https://github.com/The-Best-Codes/codequill.git
call :check_status

:: Restore database if backup exists
if exist "database.sqlite.backup" (
    call :print_step "Restoring database..."
    move "database.sqlite.backup" "codequill\database.sqlite" >nul
    call :check_status
)

:: Change directory
call :print_step "Changing to the CodeQuill directory..."
cd codequill
call :check_status

:: Install Node.js dependencies
call :print_step "Installing Node.js dependencies..."
npm install
call :check_status

:: Install Electron dependencies
call :print_step "Installing Electron dependencies..."
npm install --save-dev electron electron-builder
call :check_status

:: Build the Next.js app
call :print_step "Building the Next.js app..."
npm run build
if %errorlevel% neq 0 (
    call :print_color 31 "❌ Build failed. Please check for errors and try again."
    exit /b 1
)
call :print_color 32 "✅ Build completed successfully."

call :print_color 35 "
====================================
🎉 Installation completed successfully! 🎉
====================================

To start the server, run: start.bat
"

endlocal