# 🚀 Render Deployment Guide

## Overview

This guide will help you deploy your Language Translation System to Render with three services:

1. **Frontend** (React) - Static site
2. **Backend** (Node.js) - API gateway
3. **Model Service** (Python FastAPI) - ML model inference

## 📋 Prerequisites

- [Render Account](https://render.com/)
- [GitHub Account](https://github.com/)
- Your code pushed to GitHub

## 🏗️ Project Structure

```
LanguageTranslationFinal/
├── frontend/                 # React frontend
├── backend/                  # Node.js API gateway
│   ├── models/              # Python FastAPI + ML models
│   └── routes/              # API routes
├── render.yaml              # Render configuration
└── RENDER_DEPLOYMENT.md     # This guide
```

## 🚀 Deployment Steps

### Step 1: Prepare Your Repository

1. **Ensure your code is pushed to GitHub** (already done)
2. **Verify all configuration files are included**

### Step 2: Deploy Using render.yaml (Recommended)

#### Option A: Blueprint Deployment

1. **Go to Render Dashboard**
2. **Click "New +" → "Blueprint"**
3. **Connect your GitHub repository**
4. **Select the repository**: `singhshreya-bhriguvanshi/Transl8r`
5. **Render will automatically detect `render.yaml`**
6. **Click "Apply"**

#### Option B: Manual Service Creation

If Blueprint doesn't work, create services manually:

### Step 3: Deploy Python Model Service

1. **Create new Web Service**
2. **Connect GitHub repository**
3. **Configure:**

   - **Name**: `translation-model-service`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r backend/models/requirements.txt`
   - **Start Command**: `cd backend/models && uvicorn model_server:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: Leave empty (root)

4. **Environment Variables:**

   ```env
   PORT=8008
   HOST=0.0.0.0
   MODEL_BASE_PATH=/opt/render/project/src/backend/models
   MODEL_PAIRS=en-fr
   HF_HUB_OFFLINE=1
   MAX_TEXT_LENGTH=512
   MAX_FILE_SIZE=10485760
   TEMP_DIR=/tmp
   ```

5. **Add Disk:**
   - **Name**: `model-storage`
   - **Mount Path**: `/opt/render/project/src/backend/models/en-fr`
   - **Size**: 2GB

### Step 4: Deploy Node.js Backend

1. **Create new Web Service**
2. **Connect GitHub repository**
3. **Configure:**

   - **Name**: `translation-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: Leave empty (root)

4. **Environment Variables:**
   ```env
   PORT=5000
   NODE_ENV=production
   FRONTEND_URL=https://your-frontend-service.onrender.com
   PYTHON_API_URL=https://your-python-service.onrender.com
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   MAX_FILE_SIZE=10485760
   LOG_LEVEL=info
   ```

### Step 5: Deploy React Frontend

1. **Create new Static Site**
2. **Connect GitHub repository**
3. **Configure:**

   - **Name**: `translation-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/build`
   - **Root Directory**: Leave empty (root)

4. **Environment Variables:**
   ```env
   REACT_APP_API_URL=https://your-backend-service.onrender.com
   NODE_ENV=production
   GENERATE_SOURCEMAP=false
   ```

## 📁 Upload Model Files

### Step 1: Access Your Python Service

1. **Go to your Python service dashboard**
2. **Click on "Shell" tab**
3. **Open web shell**

### Step 2: Upload Model Files

```bash
# Navigate to model directory
cd /opt/render/project/src/backend/models/en-fr

# Upload your model files using curl or wget
# You'll need to host them somewhere temporarily (GitHub releases, etc.)
wget https://your-hosted-model-files.com/model.safetensors
wget https://your-hosted-model-files.com/pytorch_model.bin
wget https://your-hosted-model-files.com/source.spm
wget https://your-hosted-model-files.com/target.spm
wget https://your-hosted-model-files.com/vocab.json
wget https://your-hosted-model-files.com/tokenizer_config.json
wget https://your-hosted-model-files.com/config.json
wget https://your-hosted-model-files.com/generation_config.json
```

### Step 3: Verify Model Loading

Check your service logs to ensure models load correctly:

```
Loading model for en-fr from /opt/render/project/src/backend/models/en-fr ...
✅ Successfully loaded model for en-fr
All models loaded. Available pairs: ['en-fr']
```

## 🔍 Health Checks

### Frontend Health Check

- **URL**: `https://your-frontend-service.onrender.com`
- **Expected**: React app loads successfully

### Backend Health Check

- **URL**: `https://your-backend-service.onrender.com/api/health`
- **Expected**: `{"status":"OK","message":"Language Translation API is running"}`

### Python Service Health Check

- **URL**: `https://your-python-service.onrender.com/docs`
- **Expected**: FastAPI documentation page

## 🐛 Troubleshooting

### Common Issues

1. **Model Loading Failures**

   - Check `MODEL_BASE_PATH` environment variable
   - Ensure model files are in the correct directory
   - Check Render logs for memory issues

2. **CORS Errors**

   - Verify service URLs in environment variables
   - Check `FRONTEND_URL` in backend service

3. **Service Communication Failures**

   - Verify `PYTHON_API_URL` in backend service
   - Check `REACT_APP_API_URL` in frontend service
   - Ensure all services are deployed and healthy

4. **Memory Issues**
   - Python service may need more memory for model loading
   - Consider upgrading to a higher plan

### Logs and Monitoring

- **Render Dashboard**: Monitor service logs and performance
- **Health Checks**: Verify all services are responding
- **Environment Variables**: Double-check all URLs and configurations

## 🔄 Updates and Maintenance

### Updating Services

1. **Push changes** to GitHub
2. **Render auto-deploys** (if enabled)
3. **Monitor deployment** logs
4. **Verify health checks**

### Scaling

- **Render auto-scales** based on traffic
- **Monitor usage** in Render dashboard
- **Adjust resources** as needed

## 📊 Performance Optimization

### For Production

1. **Enable caching** for model responses
2. **Implement rate limiting** (already configured)
3. **Monitor memory usage** for Python service
4. **Consider CDN** for static assets

### Cost Optimization

1. **Monitor Render usage** and costs
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

1. **Check Render logs** first
2. **Verify environment variables**
3. **Test health check endpoints**
4. **Review this deployment guide**

---

**Happy Deploying! 🚀**
