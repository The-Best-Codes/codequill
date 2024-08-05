@echo off
setlocal enabledelayedexpansion

rem Function to check if a command was successful
:check_success
if %errorlevel% equ 0 (
    echo %~1
) else (
    echo %~1
    exit /b 1
)
exit /b 0

rem Main installation process
:main
echo Starting CodeQuill manager installation...

rem Navigate to user profile directory
cd %USERPROFILE%
call :check_success "Changed to user profile directory"

rem Download the installation script
powershell -Command "(New-Object Net.WebClient).DownloadFile('https://raw.githubusercontent.com/The-Best-Codes/codequill/main/.device_scripts/codequill.bat', 'codequill.bat')"
if errorlevel 1 (
    echo Failed to download installation script
    exit /b 1
)
call :check_success "Downloaded installation script"

rem Run the installation script
call codequill.bat
if errorlevel 1 (
    echo Failed to run installation script
    exit /b 1
)
call :check_success "Ran installation script"

echo CodeQuill manager installation complete!
exit /b 0

rem Run the main function
call :main

rem Keep the command prompt open until a key is pressed
echo.
echo Press any key to exit.
pause >nul