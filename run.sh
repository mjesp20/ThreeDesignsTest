#!/bin/bash

echo "Starting RASA API server..."
# Open in new terminal and change to the directory where this script is located, then to RASA subdirectory
gnome-terminal --tab -- bash -c "cd \"\$(dirname \"\$0\")/RASA\" && rasa run --enable-api --cors \"*\"; exec bash"

echo "Starting RASA actions server..."
# Open in new terminal and change to RASA subdirectory
gnome-terminal --tab -- bash -c "cd \"\$(dirname \"\$0\")/RASA\" && rasa run actions; exec bash"

echo "Starting React development server..."
# Open in new terminal and change to REACT subdirectory
gnome-terminal --tab -- bash -c "cd \"\$(dirname \"\$0\")/REACT\" && npm run dev; exec bash"

echo "All services started!"