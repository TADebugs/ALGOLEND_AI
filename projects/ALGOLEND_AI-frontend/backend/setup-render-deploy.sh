#!/bin/bash

echo "🚀 Setting up AlgoLend AI Backend for Render deployment..."

# Create a temporary directory for the backend
TEMP_DIR="/tmp/algolend-backend"
BACKEND_SOURCE="/Users/tanmaydesai/my-react-app/ALGOLEND_AI/projects/ALGOLEND_AI-frontend/backend"

echo "📁 Creating temporary backend directory..."
mkdir -p $TEMP_DIR

echo "📋 Copying backend files..."
cp -r $BACKEND_SOURCE/* $TEMP_DIR/

echo "📝 Creating README for deployment..."
cat > $TEMP_DIR/README.md << EOF
# AlgoLend AI Backend

This is the backend API for AlgoLend AI, deployed on Render.

## API Endpoints

- \`GET /\` - API root
- \`GET /health\` - Health check
- \`GET /docs\` - API documentation
- \`POST /api/analyze-account\` - Analyze Algorand account
- \`GET /api/network-stats\` - Get network statistics
- \`GET /api/ai-agents/status\` - Get AI agents status
- \`GET /api/market-insights\` - Get market insights

## Environment Variables

Set these in your Render dashboard:

- \`ALGOD_NETWORK\` = testnet
- \`ALGOD_SERVER\` = https://testnet-api.algonode.cloud
- \`ALGOD_TOKEN\` = (leave empty)
- \`INDEXER_SERVER\` = https://testnet-idx.algonode.cloud
- \`INDEXER_TOKEN\` = (leave empty)
- \`CORS_ORIGINS\` = *
- \`AI_MODEL_PATH\` = ./config/ai_models.json
- \`NETWORK_CONFIG_PATH\` = ./config/networks.json
EOF

echo "✅ Backend files prepared in: $TEMP_DIR"
echo ""
echo "📋 Next steps:"
echo "1. Create a new GitHub repository"
echo "2. Copy files from $TEMP_DIR to your new repo"
echo "3. Deploy to Render using the new repository"
echo "4. Set root directory to: / (root of repository)"
echo ""
echo "🌐 Or try the original path again: ALGOLEND_AI/projects/ALGOLEND_AI-frontend/backend"
