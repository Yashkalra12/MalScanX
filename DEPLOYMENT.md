# 🚀 Deployment Guide

## 📋 **Deployment Options**

### **Option 1: Vercel + Railway (Recommended)**
- **Frontend**: Vercel (automatic deployments)
- **Backend**: Railway (Node.js hosting)

### **Option 2: Vercel + Render**
- **Frontend**: Vercel
- **Backend**: Render (free tier available)

### **Option 3: Vercel + Heroku**
- **Frontend**: Vercel
- **Backend**: Heroku (paid)

## 🎯 **Quick Setup (Vercel + Railway)**

### **1. Frontend Deployment (Vercel)**

1. **Connect to Vercel**:
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy from project root**:
   ```bash
   vercel
   ```

3. **Configure environment variables** in Vercel dashboard:
   ```
   REACT_APP_API_URL=https://your-railway-backend-url.com
   ```

### **2. Backend Deployment (Railway)**

1. **Create Railway account**: https://railway.app

2. **Connect GitHub repository**

3. **Add environment variables**:
   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/malscanx
   PORT=3001
   ```

4. **Deploy automatically** via GitHub Actions

## 🔧 **GitHub Actions Setup**

### **Required Secrets**

Add these secrets in your GitHub repository settings:

#### **For Vercel Frontend**:
- `VERCEL_TOKEN`: Your Vercel API token
- `VERCEL_ORG_ID`: Your Vercel organization ID
- `VERCEL_PROJECT_ID`: Your Vercel project ID

#### **For Railway Backend**:
- `RAILWAY_TOKEN`: Your Railway API token

#### **For Render Backend** (alternative):
- `RENDER_TOKEN`: Your Render API token
- `RENDER_SERVICE_ID`: Your Render service ID

### **How to Get Secrets**

#### **Vercel Secrets**:
1. Go to https://vercel.com/account/tokens
2. Create new token
3. Get org/project IDs from Vercel dashboard

#### **Railway Secrets**:
1. Go to Railway dashboard
2. Navigate to your project
3. Go to Settings → Tokens
4. Create new token

## 📁 **Deployment Files**

### **Frontend Configuration**
- `vercel.json`: Vercel deployment config
- `.github/workflows/deploy-frontend.yml`: GitHub Actions for frontend

### **Backend Configuration**
- `railway.json`: Railway deployment config
- `render.yaml`: Render deployment config
- `.github/workflows/deploy-backend.yml`: GitHub Actions for backend

## 🌐 **Environment Variables**

### **Frontend (Vercel)**
```env
REACT_APP_API_URL=https://your-backend-url.com
```

### **Backend (Railway/Render)**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/malscanx
PORT=3001
```

## 🔄 **Automatic Deployments**

### **GitHub Actions Workflows**

1. **Frontend Deployment**:
   - Triggers on changes to `client/` directory
   - Builds and deploys to Vercel
   - Automatic on push to main branch

2. **Backend Deployment**:
   - Triggers on changes to `server/` directory
   - Builds TypeScript and deploys to Railway
   - Automatic on push to main branch

## 📊 **Monitoring & Health Checks**

### **Health Check Endpoints**
- **Backend**: `GET /health`
- **Frontend**: Automatic Vercel health checks

### **Logs**
- **Vercel**: Built-in logging dashboard
- **Railway**: Real-time logs in dashboard
- **GitHub Actions**: Workflow logs in Actions tab

## 🚨 **Troubleshooting**

### **Common Issues**

1. **Build Failures**:
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check TypeScript compilation

2. **Environment Variables**:
   - Ensure all required env vars are set
   - Check for typos in variable names
   - Verify MongoDB connection string

3. **CORS Issues**:
   - Update CORS configuration in backend
   - Check frontend API URL configuration

### **Debug Commands**

```bash
# Test build locally
cd client && npm run build
cd server && npm run build

# Check environment variables
echo $NODE_ENV
echo $MONGODB_URI

# Test API endpoints
curl https://your-backend-url.com/health
```

## 📈 **Performance Optimization**

### **Frontend (Vercel)**
- Automatic CDN distribution
- Image optimization
- Code splitting
- Caching headers

### **Backend (Railway)**
- Auto-scaling based on traffic
- Health check monitoring
- Automatic restarts on failure

## 🔒 **Security**

### **Environment Variables**
- Never commit secrets to Git
- Use platform-specific secret management
- Rotate tokens regularly

### **CORS Configuration**
- Restrict origins in production
- Use HTTPS only
- Implement proper authentication

## 📞 **Support**

### **Platform Support**
- **Vercel**: https://vercel.com/support
- **Railway**: https://railway.app/support
- **Render**: https://render.com/docs

### **GitHub Actions**
- Check Actions tab for workflow logs
- Review deployment status
- Monitor build times and failures

## 🎉 **Success Metrics**

After deployment, verify:
- ✅ Frontend loads without errors
- ✅ Backend API responds to health check
- ✅ File upload functionality works
- ✅ Real-time logs are streaming
- ✅ MongoDB connection is stable
- ✅ All environment variables are set

Your MalScanX application is now ready for production deployment! 🚀 