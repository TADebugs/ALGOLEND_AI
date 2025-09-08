#!/bin/bash

# Test script for AlgoLend AI Backend deployment
# Usage: ./test-deployment.sh https://your-app-name.onrender.com

if [ -z "$1" ]; then
    echo "Usage: ./test-deployment.sh <your-render-url>"
    echo "Example: ./test-deployment.sh https://algolend-ai-backend.onrender.com"
    exit 1
fi

BASE_URL="$1"
echo "🧪 Testing AlgoLend AI Backend at: $BASE_URL"
echo "=================================================="

# Test 1: Health Check
echo "1. Testing Health Check..."
HEALTH_RESPONSE=$(curl -s "$BASE_URL/health")
if [[ $HEALTH_RESPONSE == *"healthy"* ]]; then
    echo "✅ Health Check: PASSED"
    echo "   Response: $HEALTH_RESPONSE"
else
    echo "❌ Health Check: FAILED"
    echo "   Response: $HEALTH_RESPONSE"
fi
echo ""

# Test 2: API Root
echo "2. Testing API Root..."
API_RESPONSE=$(curl -s "$BASE_URL/")
if [[ $API_RESPONSE == *"AlgoLend AI API"* ]]; then
    echo "✅ API Root: PASSED"
    echo "   Response: $API_RESPONSE"
else
    echo "❌ API Root: FAILED"
    echo "   Response: $API_RESPONSE"
fi
echo ""

# Test 3: AI Agents Status
echo "3. Testing AI Agents Status..."
AI_RESPONSE=$(curl -s "$BASE_URL/api/ai-agents/status")
if [[ $AI_RESPONSE == *"agents"* ]] || [[ $AI_RESPONSE == *"status"* ]]; then
    echo "✅ AI Agents: PASSED"
    echo "   Response: $AI_RESPONSE"
else
    echo "❌ AI Agents: FAILED"
    echo "   Response: $AI_RESPONSE"
fi
echo ""

# Test 4: API Documentation
echo "4. Testing API Documentation..."
DOC_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/docs")
if [ "$DOC_RESPONSE" = "200" ]; then
    echo "✅ API Documentation: PASSED (HTTP $DOC_RESPONSE)"
    echo "   Visit: $BASE_URL/docs"
else
    echo "❌ API Documentation: FAILED (HTTP $DOC_RESPONSE)"
fi
echo ""

echo "=================================================="
echo "🎯 Test Complete! Check the results above."
echo "📖 API Documentation: $BASE_URL/docs"
