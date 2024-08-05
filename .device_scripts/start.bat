@echo off
setlocal enabledelayedexpansion

:: Function to print colored text
:print_color
set "color=%~1"
set "text=%~2"
powershell -Command "Write-Host '%text%' -ForegroundColor %color%"
exit /b

:: Function to print step
:print_step
call :print_color Cyan "
📌 %~1"
exit /b

:: Function to cleanup and exit
:cleanup_and_exit
call :print_color Yellow "

🛑 Stopping CodeQuill..."

if defined NEXT_PID (
    tasklist /FI "PID eq %NEXT_PID%" 2>NUL | find /I /N "node.exe">NUL
    if !ERRORLEVEL! equ 0 (
        taskkill /F /PID %NEXT_PID%
        call :print_color Green "✅ Next.js server stopped"
    ) else (
        call :print_color Yellow "⚠️ Next.js server was not running"
    )
) else (
    call :print_color Yellow "⚠️ Next.js server PID not set"
)

call :print_color Magenta "
==========================
👋 CodeQuill has stopped 👋
==========================
"
exit /b

:: Start message
call :print_color Magenta "
==========================
🚀 Starting CodeQuill 🚀
==========================
"

:: Change to the CodeQuill directory
cd /d "%~dp0codequill" || (
    call :print_color Red "❌ Failed to change to CodeQuill directory"
    exit /b 1
)
call :print_step "Changed to directory: %CD%"

:: Check if .next directory exists
if not exist ".next" (
    call :print_step "The .next directory is missing. Running 'next build'..."
    call npm run build
    if !ERRORLEVEL! neq 0 (
        call :print_color Red "❌ Build failed. Please check for errors and try again."
        exit /b 1
    )
    call :print_color Green "✅ Build completed successfully."
) else (
    call :print_step ".next directory found. Skipping build."
)

:: Check if settings.json exists
if exist "settings.json" (
    :: Extract port from settings.json
    for /f "tokens=2 delims=:," %%a in ('findstr /C:"port" settings.json') do set PORT=%%a
    set PORT=!PORT: =!
    if not defined PORT (
        set PORT=1291
        call :print_step "No port specified in settings.json. Using default port: !PORT!"
    ) else (
        call :print_step "Using port from settings.json: !PORT!"
    )
) else (
    set PORT=1291
    call :print_step "settings.json not found. Using default port: !PORT!"
)

:: Start the Next.js server in the background
call :print_step "Starting Next.js server on port !PORT!..."
start "" npm run start -- -p !PORT!
for /f "tokens=2" %%a in ('tasklist /fi "imagename eq node.exe" /fo list ^| find "PID:"') do set NEXT_PID=%%a

:: Function to check if the server is ready
:check_server
powershell -Command "(Invoke-WebRequest -Uri http://localhost:!PORT! -UseBasicParsing -DisableKeepAlive).StatusCode" > nul 2>&1
if !ERRORLEVEL! neq 0 (
    timeout /t 1 /nobreak > nul
    goto check_server
)
call :print_color Green "✅ Next.js server is ready!"

:: Start Electron
call :print_step "Starting Electron..."
set ELECTRON_START_URL=http://localhost:!PORT!
call npm run electron -- --no-sandbox

:: Electron has exited, so we can clean up
call :cleanup_and_exit