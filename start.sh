#!/bin/bash

# Set default port if not provided
export PORT=${PORT:-3000}

# Start the application
echo "Starting application on port $PORT"
npm start 