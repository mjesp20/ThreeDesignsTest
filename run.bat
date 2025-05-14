@echo off
echo Starting RASA API server...
start cmd /k "cd %~dp0RASA && rasa run --enable-api --cors "*""

echo Starting RASA actions server...
start cmd /k "cd %~dp0RASA && rasa run actions"

echo Starting React development server...
start cmd /k "cd %~dp0REACT && npm run dev"

echo All services started!