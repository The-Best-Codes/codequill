@echo off
setlocal enabledelayedexpansion

:: Function to print colored text
:print_color
set "color=%~1"
set "text=%~2"
echo [%color%m%text%[0m
exit /b

:: Get the absolute path of the CodeQuill directory
set "CODEQUILL_DIR=%~dp0"

:: Define the path for the shortcut
set "SHORTCUT_PATH=%USERPROFILE%\Desktop\CodeQuill.lnk"

:: Define the path for the icon
set "ICON_PATH=%CODEQUILL_DIR%codequill\app\favicon.ico"

:: Create the shortcut
echo Set oWS = WScript.CreateObject("WScript.Shell") > CreateShortcut.vbs
echo sLinkFile = "%SHORTCUT_PATH%" >> CreateShortcut.vbs
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> CreateShortcut.vbs
echo oLink.TargetPath = "%CODEQUILL_DIR%start.bat" >> CreateShortcut.vbs
echo oLink.WorkingDirectory = "%CODEQUILL_DIR%" >> CreateShortcut.vbs
echo oLink.Description = "AI-powered code editor" >> CreateShortcut.vbs
echo oLink.IconLocation = "%ICON_PATH%" >> CreateShortcut.vbs
echo oLink.Save >> CreateShortcut.vbs
cscript //nologo CreateShortcut.vbs
del CreateShortcut.vbs

:: Create the Manager shortcut
set "MANAGER_SHORTCUT_PATH=%USERPROFILE%\Desktop\CodeQuill Manager.lnk"
echo Set oWS = WScript.CreateObject("WScript.Shell") > CreateManagerShortcut.vbs
echo sLinkFile = "%MANAGER_SHORTCUT_PATH%" >> CreateManagerShortcut.vbs
echo Set oLink = oWS.CreateShortcut(sLinkFile) >> CreateManagerShortcut.vbs
echo oLink.TargetPath = "cmd.exe" >> CreateManagerShortcut.vbs
echo oLink.Arguments = "/c %CODEQUILL_DIR%codequill.bat" >> CreateManagerShortcut.vbs
echo oLink.WorkingDirectory = "%CODEQUILL_DIR%" >> CreateManagerShortcut.vbs
echo oLink.Description = "CodeQuill Manager" >> CreateManagerShortcut.vbs
echo oLink.IconLocation = "%ICON_PATH%" >> CreateManagerShortcut.vbs
echo oLink.Save >> CreateManagerShortcut.vbs
cscript //nologo CreateManagerShortcut.vbs
del CreateManagerShortcut.vbs

call :print_color 32 "✅ CodeQuill desktop shortcuts created successfully!"
call :print_color 36 "📌 Shortcut locations:"
echo     %SHORTCUT_PATH%
echo     %MANAGER_SHORTCUT_PATH%
call :print_color 33 "ℹ️  The shortcuts should be available on your desktop immediately."

endlocal