# 🚀 Railway Model Setup Guide

## Problem: Large Model Files

Your MarianMT model files are too large (~574MB) for Git, causing push timeouts.

## Solution: Railway Persistent Storage

### Step 1: Deploy Without Models

1. **Remove model files from Git** (already done with .gitignore)
2. **Deploy Python service** to Railway
3. **Upload models** to Railway's persistent storage

### Step 2: Upload Models to Railway

After deploying the Python service:

```bash
# Get your Railway service URL
# Example: https://your-python-service.railway.app

# Upload model files using Railway CLI or web interface
railway login
railway link
railway up --service your-python-service
```

### Step 3: Alternative Upload Methods

#### Method A: Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and link project
railway login
railway link

# Upload model files
railway up --service your-python-service
```

#### Method B: Web Interface

1. Go to Railway Dashboard
2. Select your Python service
3. Go to "Storage" tab
4. Upload model files to `/app/models/en-fr/`

### Step 4: Verify Model Loading

Check your service logs to ensure models load correctly:

```bash
railway logs --service your-python-service
```

## Expected Log Output:

```
Loading model for en-fr from /app/models/en-fr ...
✅ Successfully loaded model for en-fr
All models loaded. Available pairs: ['en-fr']
```

## Troubleshooting:

- **Model not found**: Ensure files are in `/app/models/en-fr/`
- **Memory issues**: Railway may need more memory for model loading
- **Timeout**: Model loading can take 2-5 minutes on first deploy

## Benefits of This Approach:

- ✅ **Faster Git pushes** (no large files)
- ✅ **Better version control** (only code, not data)
- ✅ **Flexible model updates** (can update models without code changes)
- ✅ **Railway optimized** (uses Railway's storage infrastructure)
