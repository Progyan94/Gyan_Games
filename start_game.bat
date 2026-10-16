@echo off
title Pen Fight 3D - Online Multiplayer Arena
echo ========================================================
echo   PEN FIGHT 3D - ONLINE MULTIPLAYER ^& TOURNAMENT ARENA
echo ========================================================
echo.
echo Starting local web server on port 8080...
start "" "http://localhost:8080"
python -m http.server 8080
pause
