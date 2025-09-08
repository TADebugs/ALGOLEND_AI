#!/bin/bash

echo "🚀 Starting AlgoLend AI Simple Backend..."
echo "📊 This version uses minimal dependencies for demo purposes"
echo ""

# Navigate to backend directory
cd "$(dirname "$0")/backend"

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 is not installed. Please install Python 3.8+ and try again."
    exit 1
fi

# Install minimal dependencies
echo "📦 Installing minimal dependencies..."
pip3 install fastapi uvicorn pydantic

# Start the simple backend
echo "🌟 Starting FastAPI server on http://localhost:8000"
echo "📊 API Documentation available at http://localhost:8000/docs"
echo "🔍 Health check available at http://localhost:8000/health"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 simple_app.py

