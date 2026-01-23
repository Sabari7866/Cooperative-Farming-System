# 🚀 Vercel Deployment Guide - Cooperative Farming System

## Quick Deployment via Vercel Dashboard (Recommended)

### Step 1: Prepare Your GitHub Repository
✅ **Already Done!** Your code is pushed to: `https://github.com/Sabari7866/Cooperative-Farming-System.git`

### Step 2: Deploy to Vercel

1. **Go to Vercel**: Visit [vercel.com](https://vercel.com) and sign up/login with your GitHub account

2. **Import Your Project**:
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Find and select: `Sabari7866/Cooperative-Farming-System`
   - Click "Import"

3. **Configure Project Settings**:
   ```
   Framework Preset: Vite
   Root Directory: ./project
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Add Environment Variables** (Critical!):
   Click "Environment Variables" and add these:

   ```env
   # Google AI (Gemini)
   GOOGLE_API_KEY=your_google_gemini_api_key_here
   GOOGLE_MODEL_ID=gemini-pro

   # MongoDB Connection
   MONGODB_URI=your_mongodb_connection_string_here

   # Email Configuration (NodeMailer)
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password

   # JWT Secret
   JWT_SECRET=your-super-secret-jwt-key-change-this-to-something-secure

   # Node Environment
   NODE_ENV=production
   ```

   **Important Notes**:
   - For MongoDB, use MongoDB Atlas (free tier): https://www.mongodb.com/cloud/atlas
   - For email, enable 2FA on Gmail and create an App Password
   - Generate a strong JWT_SECRET (random 32+ characters)

5. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (2-5 minutes)
   - Your app will be live at: `https://your-project-name.vercel.app`

---

## Alternative: Deploy via Vercel CLI

If you prefer command line deployment:

### Step 1: Install Vercel CLI
```powershell
npm install -g vercel
```

### Step 2: Login to Vercel
```powershell
cd "E:\final mini project 2121\final mini project 2\project"
vercel login
```

### Step 3: Deploy
```powershell
# Production deployment
vercel --prod

# Follow the prompts:
# - Set up and deploy? Y
# - Which scope? (select your account)
# - Link to existing project? N
# - Project name? cooperative-farming-system
# - Root directory? ./
```

### Step 4: Add Environment Variables via CLI
```powershell
vercel env add GOOGLE_API_KEY
vercel env add MONGODB_URI
vercel env add EMAIL_USER
vercel env add EMAIL_PASS
vercel env add JWT_SECRET
vercel env add NODE_ENV
```

Then redeploy:
```powershell
vercel --prod
```

---

## 🔧 Current Project Configuration

Your project already has `vercel.json` configured:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "dist" }
    },
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

This configuration:
- ✅ Builds your frontend as static files
- ✅ Deploys your backend as serverless functions
- ✅ Routes API calls to `/api/*` to your backend
- ✅ Serves frontend from root

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] MongoDB Atlas account and connection string
- [ ] Google Gemini API key
- [ ] Gmail account with App Password for emails
- [ ] GitHub repository is up to date
- [ ] All environment variables ready

---

## 🗄️ MongoDB Atlas Setup (Required)

1. **Create Account**: Go to https://www.mongodb.com/cloud/atlas
2. **Create Free Cluster**: 
   - Choose AWS/GCP with closest region
   - Select M0 (Free tier)
3. **Create Database User**:
   - Database Access → Add New User
   - Set username and password (save these!)
4. **Whitelist IP**: 
   - Network Access → Add IP Address
   - Allow access from anywhere: `0.0.0.0/0` (for Vercel)
5. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database password
   - Replace `<dbname>` with: `agrismart`

Your `MONGODB_URI` should look like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/agrismart?retryWrites=true&w=majority
```

---

## 🔑 Google Gemini API Key Setup

1. Go to: https://makersuite.google.com/app/apikey
2. Create new API key
3. Copy and use as `GOOGLE_API_KEY`

---

## 📧 Gmail App Password Setup

1. Enable 2-Factor Authentication on your Google account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate a new App Password for "Mail"
4. Use this 16-character password as `EMAIL_PASS`
5. Your Gmail address is `EMAIL_USER`

---

## 🎯 Post-Deployment

After successful deployment:

1. **Test Your Application**:
   - Visit your Vercel URL
   - Test login with demo accounts:
     - `farmer@demo.com` / `password`
     - `worker@demo.com` / `password`
     - `buyer@demo.com` / `password`

2. **Monitor Logs**:
   - Go to Vercel Dashboard
   - Click your project → "Functions" tab
   - Check for any errors

3. **Custom Domain** (Optional):
   - Vercel Dashboard → Project → Settings → Domains
   - Add your custom domain

---

## 🐛 Troubleshooting

### Build Fails
- Check that root directory is set to `./project`
- Ensure all dependencies are in `package.json`
- Review build logs in Vercel dashboard

### API Not Working
- Verify environment variables are set correctly
- Check MongoDB connection string
- Ensure API routes are accessible at `/api/*`

### MongoDB Connection Issues
- Verify IP whitelist includes `0.0.0.0/0`
- Check username/password in connection string
- Ensure database user has read/write permissions

### Email Not Sending
- Verify Gmail App Password is correct
- Check that 2FA is enabled
- Ensure `EMAIL_USER` and `EMAIL_PASS` are set

---

## 📊 Features Available After Deployment

Your deployed app includes:

✨ **Multi-language Support**: English, Hindi, Tamil
📱 **Dashboards**: Farm Owner, Worker, Buyer, Renter
🤖 **AI Chatbot**: Gemini-powered agricultural advice
📊 **IoT Dashboard**: Real-time monitoring
🛒 **Marketplace**: Buy/sell agricultural products
👥 **Resource Sharing**: Share equipment and workers
📧 **Email Notifications**: Support tickets and alerts
🔐 **Authentication**: JWT-based secure login
💾 **MongoDB**: Persistent data storage

---

## 🚀 Quick Start Commands

```powershell
# Navigate to project
cd "E:\final mini project 2121\final mini project 2\project"

# Deploy to Vercel
vercel --prod

# View deployment
vercel ls

# Check logs
vercel logs
```

---

**Happy Deploying! 🎉**

For support, visit: https://vercel.com/docs
