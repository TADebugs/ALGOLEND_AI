#!/bin/bash

echo "🚀 Deploying AlgoLend AI to production..."

# Build frontend
echo "📦 Building frontend..."
cd /Users/tanmaydesai/my-react-app/ALGOLEND_AI/projects/ALGOLEND_AI-frontend
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Frontend build successful!"
else
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "🎉 Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Deploy frontend to Vercel: vercel --prod"
echo "2. Deploy backend to Railway: railway up"
echo "3. Update environment variables in both platforms"
echo "4. Test your deployed application"
