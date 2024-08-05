@echo off
setlocal enabledelayedexpansion

:: Function to print colored text
:print_color
set "color=%~1"
set "text=%~2"
echo [%color%m%text%[0m
exit /b

:: Define the paths for the shortcuts
set "SHORTCUT_PATH=%USERPROFILE%\Desktop\CodeQuill.lnk"
set "MANAGER_SHORTCUT_PATH=%USERPROFILE%\Desktop\CodeQuill Manager.lnk"

:: Check if the shortcuts exist and remove them
set "removed=0"

if exist "%SHORTCUT_PATH%" (
    del "%SHORTCUT_PATH%"
    set /a "removed+=1"
)

if exist "%MANAGER_SHORTCUT_PATH%" (
    del "%MANAGER_SHORTCUT_PATH%"
    set /a "removed+=1"
)

:: Print appropriate message based on removal status
if %removed% gtr 0 (
    call :print_color 32 "✅ CodeQuill desktop shortcuts removed successfully!"
) else (
    call :print_color 33 "⚠️ CodeQuill desktop shortcuts not found. Nothing to remove."
)

call :print_color 33 "ℹ️  The changes should take effect immediately on your desktop."

endlocal