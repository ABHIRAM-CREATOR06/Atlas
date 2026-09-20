@echo off
setlocal enabledelayedexpansion

echo ===================================================
echo   Atlas - Protocol Explainer Platform Setup Script
echo ===================================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not found in PATH.
    echo Please install Node.js v18+ from https://nodejs.org/ and rerun this script.
    pause
    exit /b 1
)

echo [OK] Node.js detected:
node --version

echo.
echo Select setup option:
echo   [1] Development mode (Install dependencies ^& start dev server)
echo   [2] Build ^& Test mode (Run tests ^& build production bundle)
echo   [3] Docker deployment (Build ^& start Docker container)
echo   [4] Exit
echo.

set /p CHOICE="Enter choice (1-4): "

if "%CHOICE%"=="1" (
    echo.
    echo [1/2] Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
    echo [2/2] Starting development server...
    call npm run dev
) else if "%CHOICE%"=="2" (
    echo.
    echo [1/3] Installing dependencies...
    call npm install
    echo [2/3] Running Vitest unit tests...
    call npm test
    echo [3/3] Building production bundle...
    call npm run build
    echo.
    echo [SUCCESS] Build completed successfully. Output directory: ./dist
    pause
) else if "%CHOICE%"=="3" (
    echo.
    where docker >nul 2>nul
    if %errorlevel% neq 0 (
        echo [ERROR] Docker is not installed or not running.
        echo Please install Docker Desktop from https://www.docker.com/
        pause
        exit /b 1
    )
    echo Building and launching Docker container...
    docker compose up --build
) else (
    echo Exiting setup.
)

endlocal
