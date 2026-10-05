@echo off
echo Starting local web server on port 8000...
echo Please leave this window open while you work on the website.
echo.
npx serve -p 8000 || python -m http.server 8000
pause
