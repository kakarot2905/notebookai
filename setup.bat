@echo off
setlocal enabledelayedexpansion

echo =========================================
echo Installing Server Dependencies
echo =========================================
cd /d "%~dp0\server"
call npm install
echo Completed installing server dependencies.

echo =========================================
echo Installing Python Dependencies
echo =========================================
cd /d "%~dp0\server\scripts\Python"
call python -m pip install -r requirements.txt
echo Completed installing Python dependencies.

echo =========================================
echo Installing Frontend Dependencies
echo =========================================
cd /d "%~dp0\frontend"
call npm install
echo Completed installing frontend dependencies.

echo =========================================
echo Starting the Server
echo =========================================

cd ..
start cmd /k "start.bat"
