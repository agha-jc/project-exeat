@echo off
cd /d "c:\Users\Al Agha\Downloads\project_exeat-master"
echo Installing dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo npm install failed
    exit /b 1
)
echo Building Next.js app...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo npm build failed
    exit /b 1
)
echo Build complete!
