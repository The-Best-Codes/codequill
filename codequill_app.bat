@echo off
setlocal enabledelayedexpansion

:: Define colors for output
set "GREEN=[92m"
set "RED=[91m"
set "NC=[0m"

:: Function to print colored output
:print_color
echo %~1%~2%NC%
exit /b

:: Function to check if a command was successful
:check_success
if %errorlevel% equ 0 (
    call :print_color "%GREEN%" "✔ %~1"
) else (
    call :print_color "%RED%" "✘ %~1"
    exit /b 1
)
exit /b 0

:: Main installation process
:main
call :print_color "%GREEN%" "Starting CodeQuill manager installation..."

:: Navigate to user profile directory
cd %USERPROFILE%
call :check_success "Changed to user profile directory"

:: Download the installation script
powershell -Command "(New-Object Net.WebClient).DownloadFile('https://raw.githubusercontent.com/The-Best-Codes/codequill/main/.device_scripts/codequill.bat', 'codequill.bat')"
if errorlevel 1 (
    call :print_color "%RED%" "Failed to download installation script"
    exit /b 1
)
call :check_success "Downloaded installation script"

:: Run the installation script
call codequill.bat
if errorlevel 1 (
    call :print_color "%RED%" "Failed to run installation script"
    exit /b 1
)
call :check_success "Ran installation script"

call :print_color "%GREEN%" "CodeQuill manager installation complete!"
exit /b 0

:: Run the main function
call :main

:: Keep the command prompt open until a key is pressed
echo.
call :print_color "%GREEN%" "Press any key to exit."
pause >nul