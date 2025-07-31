# 🚀 Manual Deployment Guide

## 📋 **Deployment Strategy**

This project is configured for **manual deployment** using the Vercel dashboard for both frontend and backend.

## 🎯 **Deployment Options**

### **Option 1: Vercel Dashboard (Recommended)**
- **Frontend**: Deploy from Vercel dashboard
- **Backend**: Deploy from Vercel dashboard

### **Option 2: Railway for Backend**
- **Frontend**: Vercel dashboard
- **Backend**: Railway (alternative to Vercel)

## 🚀 **Quick Setup (Vercel Dashboard)**

### **1. Frontend Deployment**

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard

2. **Import Project**:
   - Click "New Project"
   - Import your GitHub repository: `Yashkalra12/MalScanX`
   - Select the `client` directory as the root directory

3. **Configure Settings**:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Environment Variables**:
   ```
   REACT_APP_API_URL=https://your-backend-url.com
   ```

5. **Deploy**: Click "Deploy"

### **2. Backend Deployment**

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard

2. **Import Project**:
   - Click "New Project"
   - Import your GitHub repository: `Yashkalra12/MalScanX`
   - Select the `server` directory as the root directory

3. **Configure Settings**:
   - **Framework Preset**: Node.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`



5. **Deploy**: Click "Deploy"

## 🔧 **Configuration Files**

### **Frontend (client/vercel.json)**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://your-backend-url.com/api/$1"
    }
  ]
}
```

### **Backend (server/vercel.json)**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ]
}
```

## 🌐 **Environment Variables**

### **Frontend (Vercel)**
```env
REACT_APP_API_URL=https://your-backend-url.com
```

### **Backend (Vercel)**
```env
MONGODB_URI=your-mongodb-connection-string
```

## 📊 **Deployment Steps**

### **Step 1: Deploy Backend**
1. Go to Vercel dashboard
2. Import `server` directory
3. Deploy and get the URL

### **Step 2: Deploy Frontend**
1. Go to Vercel dashboard
2. Import `client` directory
3. Deploy



## 🔄 **Automatic Deployments**

### **Vercel Dashboard**
- **Automatic deployments** on every push to main branch
- **Preview deployments** for pull requests
- **Custom domains** support
- **SSL certificates** included

## 📊 **Monitoring & Health Checks**

### **Health Check Endpoints**
- **Backend**: `GET /health`
- **Frontend**: Automatic Vercel health checks

### **Logs**
- **Vercel**: Built-in logging dashboard
- **Real-time logs** in Vercel dashboard
- **Function logs** for serverless functions

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

### **Vercel Features**
- **Automatic CDN** distribution
- **Image optimization**
- **Code splitting**
- **Caching headers**
- **Edge functions** support

## 🔒 **Security**

### **Environment Variables**
- Use Vercel's built-in secret management
- Never commit secrets to Git
- Rotate tokens regularly

### **CORS Configuration**
- Restrict origins in production
- Use HTTPS only
- Implement proper authentication

## 📞 **Support**

### **Platform Support**
- **Vercel**: https://vercel.com/support
- **Documentation**: https://vercel.com/docs

### **Deployment Status**
- Check Vercel dashboard for deployment logs
- Review function logs for backend issues
- Monitor performance metrics

## 🎉 **Success Metrics**

After deployment, verify:
- ✅ Frontend loads without errors
- ✅ Backend API responds to health check
- ✅ File upload functionality works
- ✅ Real-time logs are streaming
- ✅ MongoDB connection is stable
- ✅ All environment variables are set

Your MalScanX application is now ready for manual deployment via Vercel dashboard! 🚀 