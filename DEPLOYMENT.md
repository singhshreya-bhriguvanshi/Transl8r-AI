# 🚀 Railway Deployment Guide

## Overview

This guide will help you deploy your Language Translation System to Railway with three services:

1. **Frontend** (React) - User interface
2. **Backend** (Node.js) - API gateway
3. **Model Service** (Python FastAPI) - ML model inference

## 📋 Prerequisites

- [Railway Account](https://railway.app/)
- [GitHub Account](https://github.com/)
- Your code pushed to GitHub

## 🏗️ Project Structure

```
LanguageTranslationFinal/
├── frontend/                 # React frontend
├── backend/                  # Node.js API gateway
│   ├── models/              # Python FastAPI + ML models
│   └── routes/              # API routes
└── railway.json             # Railway configuration
```

## 🔧 Environment Variables Setup

### 1. Frontend Service Environment Variables

```env
REACT_APP_API_URL=https://your-backend-service.railway.app
REACT_APP_PYTHON_API_URL=https://your-python-service.railway.app
NODE_ENV=production
GENERATE_SOURCEMAP=false
```

### 2. Backend Service Environment Variables

```env
PORT=5000
NODE_ENV=production
FRONTEND_URL=https://your-frontend-service.railway.app
PYTHON_API_URL=https://your-python-service.railway.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
MAX_FILE_SIZE=10485760
LOG_LEVEL=info
```

### 3. Python Model Service Environment Variables

```env
PORT=8008
HOST=0.0.0.0
MODEL_BASE_PATH=/app/models
MODEL_PAIRS=en-fr
HF_HUB_OFFLINE=1
CORS_ORIGINS=https://your-frontend-service.railway.app,https://your-backend-service.railway.app
MAX_TEXT_LENGTH=512
MAX_FILE_SIZE=10485760
TEMP_DIR=/tmp
```

## 🚀 Deployment Steps

### Step 1: Prepare Your Repository

1. **Push your code to GitHub** with all the configuration files
2. **Ensure model files are included** (or use Railway's persistent storage)

### Step 2: Deploy Python Model Service

1. **Create new Railway project**
2. **Connect GitHub repository**
3. **Set service directory** to `backend/models`
4. **Add environment variables** (see Python service above)
5. **Deploy** - This will take longer due to model loading

### Step 3: Deploy Node.js Backend

1. **Add new service** to the same Railway project
2. **Set service directory** to `backend`
3. **Add environment variables** (see Backend service above)
4. **Update PYTHON_API_URL** with the Python service URL
5. **Deploy**

### Step 4: Deploy React Frontend

1. **Add new service** to the same Railway project
2. **Set service directory** to `frontend`
3. **Add environment variables** (see Frontend service above)
4. **Update REACT_APP_API_URL** with the backend service URL
5. **Deploy**

### Step 5: Configure Domains

1. **Set custom domains** for each service (optional)
2. **Update environment variables** with new URLs
3. **Redeploy** services if needed

## 🔍 Health Checks

### Frontend Health Check

- **URL**: `https://your-frontend-service.railway.app`
- **Expected**: React app loads successfully

### Backend Health Check

- **URL**: `https://your-backend-service.railway.app/api/health`
- **Expected**: `{"status":"OK","message":"Language Translation API is running"}`

### Python Service Health Check

- **URL**: `https://your-python-service.railway.app/docs`
- **Expected**: FastAPI documentation page

## 🐛 Troubleshooting

### Common Issues

1. **Model Loading Failures**

   - Check `MODEL_BASE_PATH` environment variable
   - Ensure model files are in the correct directory
   - Check Railway logs for memory issues

2. **CORS Errors**

   - Verify `CORS_ORIGINS` includes all service URLs
   - Check `FRONTEND_URL` in backend service

3. **Service Communication Failures**

   - Verify `PYTHON_API_URL` in backend service
   - Check `REACT_APP_API_URL` in frontend service
   - Ensure all services are deployed and healthy

4. **Memory Issues**
   - Python service may need more memory for model loading
   - Consider using Railway's persistent storage for models

### Logs and Monitoring

- **Railway Dashboard**: Monitor service logs and performance
- **Health Checks**: Verify all services are responding
- **Environment Variables**: Double-check all URLs and configurations

## 🔄 Updates and Maintenance

### Updating Services

1. **Push changes** to GitHub
2. **Railway auto-deploys** (if enabled)
3. **Monitor deployment** logs
4. **Verify health checks**

### Scaling

- **Railway auto-scales** based on traffic
- **Monitor usage** in Railway dashboard
- **Adjust resources** as needed

## 📊 Performance Optimization

### For Production

1. **Enable caching** for model responses
2. **Implement rate limiting** (already configured)
3. **Monitor memory usage** for Python service
4. **Consider CDN** for static assets

### Cost Optimization

1. **Monitor Railway usage** and costs
2. **Optimize model loading** times
3. **Consider model quantization** for smaller memory footprint

## 🛡️ Security Considerations

1. **Environment Variables**: Never commit `.env` files
2. **CORS**: Restrict origins to your domains only
3. **Rate Limiting**: Already configured in backend
4. **Input Validation**: Implemented in both services
5. **File Upload**: Restricted to text files only

## 📞 Support

If you encounter issues:

1. **Check Railway logs** first
2. **Verify environment variables**
3. **Test health check endpoints**
4. **Review this deployment guide**

---

**Happy Deploying! 🚀**
