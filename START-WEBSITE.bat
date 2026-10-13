@echo off
title Woody and Co website
cd /d "%~dp0"
echo.
echo  Woody ^& Co Tree Services - starting the website...
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo  Node.js is not installed yet.
  echo  1. Go to https://nodejs.org
  echo  2. Download and install the LTS version
  echo  3. Then double-click this file again
  echo.
  pause
  exit /b
)
if not exist node_modules (
  echo  First-time setup: installing. This takes 1-3 minutes...
  echo.
  call npm install
  if errorlevel 1 (
    echo.
    echo  The install failed. Take a photo/screenshot of this window and send it to Claude.
    pause
    exit /b
  )
)
echo.
echo  Starting. Your browser will open in a few seconds.
echo  Leave this window open while you look at the site. Close it to stop.
echo.
start "" cmd /c "timeout /t 12 >nul & start http://localhost:3000"
call npm run dev
pause
