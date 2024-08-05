@echo off
setlocal enabledelayedexpansion

:: Array of required scripts
set "REQUIRED_SCRIPTS=install.bat uninstall.bat start.bat desktop.bat remove_desktop.bat"

:: Base URL for downloading scripts
set "BASE_URL=https://raw.githubusercontent.com/The-Best-Codes/codequill/main/.device_scripts"

:: Function to check and download missing scripts
:check_and_download_scripts
for %%s in (%REQUIRED_SCRIPTS%) do (
    if not exist "%%s" (
        echo Downloading %%s...
        powershell -Command "(New-Object Net.WebClient).DownloadFile('%BASE_URL%/%%s', '%%s')"
        if errorlevel 1 (
            echo Failed to download %%s. Please check your internet connection and try again.
            exit /b 1
        )
    )
)
exit /b 0

:: Function to display the header
:show_header
cls
echo ==================================
echo         CodeQuill Manager         
echo ==================================
echo.
exit /b 0

:: Function to display the menu
:show_menu
echo Please select an option:
echo 1) Install / Update
echo 2) Uninstall
echo 3) Open CodeQuill
echo 4) Cancel or Exit
echo.
set /p "choice=Enter your choice [1-4]: "
exit /b 0

:: Main script
call :check_and_download_scripts

:main_loop
call :show_header
call :show_menu

if "%choice%"=="1" (
    echo Installing / Updating CodeQuill...
    call install.bat
    echo Setting up desktop integration...
    call desktop.bat
    echo CodeQuill has been installed/updated successfully!
    pause
    goto main_loop
) else if "%choice%"=="2" (
    echo Uninstalling CodeQuill...
    call remove_desktop.bat
    call uninstall.bat
    echo CodeQuill has been uninstalled successfully!
    pause
    goto main_loop
) else if "%choice%"=="3" (
    echo Opening CodeQuill...
    start "" start.bat
    exit /b 0
) else if "%choice%"=="4" (
    echo Exiting CodeQuill Manager. Goodbye!
    exit /b 0
) else (
    echo Invalid option. Please try again.
    pause
    goto main_loop
)