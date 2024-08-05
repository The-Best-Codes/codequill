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

:: Start uninstallation
call :print_color 35 "
==================================
🚀 CodeQuill Uninstallation Script 🚀
==================================
"

:: Check if codequill folder exists
if exist "codequill" (
    call :print_step "Removing existing CodeQuill folder..."
    rmdir /s /q "codequill"
    call :check_status
) else (
    call :print_color 33 "⚠️ CodeQuill folder not found."
)

:: Check if database backup exists and remove it
if exist "database.sqlite.backup" (
    call :print_step "Removing database backup..."
    del /f /q "database.sqlite.backup"
    call :check_status
) else (
    call :print_color 33 "⚠️ Database backup not found."
)

:: Run the remove_shortcuts.bat script
call :print_step "Running remove_shortcuts.bat script..."
if exist "remove_shortcuts.bat" (
    call "remove_shortcuts.bat"
    call :check_status
) else (
    call :print_color 31 "❌ remove_shortcuts.bat script not found."
    exit /b 1
)

call :print_color 35 "
====================================
🎉 Uninstallation completed successfully! 🎉
====================================
"

endlocal