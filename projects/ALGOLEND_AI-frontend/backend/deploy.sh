#!/bin/bash

echo "🚀 Deploying AlgoLend AI Backend with Docker..."

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t algolend-backend .

# Run the container
echo "🌟 Starting container..."
docker run -d \
  --name algolend-backend \
  -p 8000:8000 \
  -e ALGOD_NETWORK=testnet \
  -e ALGOD_SERVER=https://testnet-api.algonode.cloud \
  algolend-backend

echo "✅ Backend deployed successfully!"
echo "🌐 API available at: http://localhost:8000"
echo "📊 Health check: http://localhost:8000/health"
echo "📚 API docs: http://localhost:8000/docs"

# Show running containers
echo "📋 Running containers:"
docker ps
