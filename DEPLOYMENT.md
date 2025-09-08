# 🚀 Deployment Guide

This guide covers various deployment options for AlgoLend AI.

## 🐳 Docker Deployment

### Prerequisites
- Docker Desktop installed
- Docker Compose (optional)

### Local Docker Deployment

1. **Build the Docker image**
   ```bash
   cd projects/ALGOLEND_AI-frontend/backend
   docker build -t algolend-backend .
   ```

2. **Run the container**
   ```bash
   docker run -d --name algolend-backend -p 8000:8000 algolend-backend
   ```

3. **Using Docker Compose**
   ```bash
   docker-compose up -d
   ```

### Docker Commands
```bash
# Build image
docker build -t algolend-backend .

# Run container
docker run -d --name algolend-backend -p 8000:8000 algolend-backend

# View logs
docker logs algolend-backend

# Stop container
docker stop algolend-backend

# Remove container
docker rm algolend-backend

# View running containers
docker ps
```

## ☁️ Cloud Deployment

### Railway (Recommended)

1. **Visit [railway.app](https://railway.app)**
2. **Sign up with GitHub**
3. **New Project → Deploy from GitHub repo**
4. **Select your repository**
5. **Set Root Directory to:** `projects/ALGOLEND_AI-frontend/backend`
6. **Railway automatically detects Python and deploys**

### Heroku

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku app**
   ```bash
   heroku create your-algolend-backend
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

### Render

1. **Visit [render.com](https://render.com)**
2. **Connect GitHub repository**
3. **Select backend folder**
4. **Set build command:** `pip install -r requirements.txt`
5. **Set start command:** `uvicorn app:app --host 0.0.0.0 --port $PORT`

### Google Cloud Run

1. **Install Google Cloud CLI**
2. **Build and push image**
   ```bash
   gcloud builds submit --tag gcr.io/PROJECT-ID/algolend-backend
   ```
3. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy --image gcr.io/PROJECT-ID/algolend-backend
   ```

## 🌐 Frontend Deployment

### Vercel (Recommended)

1. **Visit [vercel.com](https://vercel.com)**
2. **Connect GitHub repository**
3. **Select frontend folder**
4. **Vercel automatically detects React and deploys**

### Netlify

1. **Visit [netlify.com](https://netlify.com)**
2. **Connect GitHub repository**
3. **Set build command:** `npm run build`
4. **Set publish directory:** `dist`

### GitHub Pages

1. **Enable GitHub Pages in repository settings**
2. **Set source to GitHub Actions**
3. **Add workflow file for deployment**

## 🔧 Environment Variables

### Backend Environment Variables
```env
ALGOD_NETWORK=testnet
ALGOD_SERVER=https://testnet-api.algonode.cloud
ALGOD_TOKEN=
INDEXER_SERVER=https://testnet-idx.algonode.cloud
INDEXER_TOKEN=
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=False
```

### Frontend Environment Variables
```env
VITE_ALGOD_NETWORK=testnet
VITE_ALGOD_SERVER=https://testnet-api.algonode.cloud
VITE_API_BASE_URL=https://your-backend-url.com
```

## 📊 Monitoring and Logs

### Health Checks
- **Backend Health:** `GET /health`
- **API Documentation:** `GET /docs`
- **Network Stats:** `GET /api/network-stats`

### Logging
- **Application logs** are available in cloud provider dashboards
- **Error tracking** with Sentry (optional)
- **Performance monitoring** with New Relic (optional)

## 🔒 Security Considerations

### Production Security
- Use HTTPS for all endpoints
- Implement rate limiting
- Add CORS configuration
- Use environment variables for secrets
- Regular security updates

### Database Security
- Use connection pooling
- Implement proper authentication
- Regular backups
- Encryption at rest

## 📈 Scaling

### Horizontal Scaling
- Use load balancers
- Implement auto-scaling
- Database replication
- CDN for static assets

### Vertical Scaling
- Increase server resources
- Optimize database queries
- Implement caching
- Use CDN for static assets

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   lsof -i :8000
   kill -9 PID
   ```

2. **Docker daemon not running**
   ```bash
   open -a Docker  # macOS
   sudo systemctl start docker  # Linux
   ```

3. **Environment variables not loading**
   - Check .env file location
   - Verify variable names
   - Restart application

4. **Database connection issues**
   - Check connection string
   - Verify network access
   - Check credentials

### Debug Commands
```bash
# Check running processes
ps aux | grep python

# Check port usage
lsof -i :8000

# Check Docker containers
docker ps -a

# View application logs
docker logs algolend-backend
```

## 📞 Support

For deployment issues:
- Check GitHub Issues
- Contact team via email
- Join Discord community
- Review documentation

## 🎯 Production Checklist

- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Database backups set up
- [ ] Monitoring configured
- [ ] Error tracking enabled
- [ ] Performance monitoring active
- [ ] Security headers configured
- [ ] Rate limiting implemented
- [ ] CORS properly configured
- [ ] Logging configured
- [ ] Health checks working
- [ ] Documentation updated

---

**Happy Deploying! 🚀**
