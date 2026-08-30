@echo off
echo ==============================================
echo Kisan Nighaban - Backend Startup Script
echo ==============================================

rem Change directory to the folder containing this batch file (backend folder)
cd /d "%~dp0"

echo [1/5] Checking for virtual environment...
IF NOT EXIST "..\.venv" (
    echo Creating virtual environment...
    python -m venv ..\.venv
) ELSE (
    echo Virtual environment already exists.
)

echo.
echo [2/5] Activating virtual environment...
call ..\.venv\Scripts\activate.bat

echo.
echo [3/5] Installing dependencies...
rem Requirements are in the root folder
pip install -r ..\requirements.txt

echo.
echo [4/5] Checking environment variables...
IF NOT EXIST ".env" (
    echo Creating .env from .env.example...
    copy .env.example .env
    echo.
    echo ===================================================================
    echo IMPORTANT: A new .env file was created in the backend folder.
    echo Please open backend\.env and replace "your_gemini_api_key_here" 
    echo with your actual Gemini API Key!
    echo ===================================================================
    echo.
    pause
) ELSE (
    echo .env file already exists.
)

echo.
echo [5/5] Initializing Database...
python init_db.py

echo.
echo ==============================================
echo Starting FastAPI Server...
echo The API will be available at http://127.0.0.1:8000
echo Swagger UI Docs: http://127.0.0.1:8000/docs
echo ==============================================
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
