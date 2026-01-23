# Vercel Deployment - White Screen Fix Instructions

## Current Issue:
The white screen persists because JavaScript files are being served as HTML. This happens when Vercel's routing configuration catches asset requests.

## **SOLUTION: Configure in Vercel Dashboard**

Since automatic deployments and CLI have permissions issues, please follow these steps in the Vercel Dashboard:

### **Step 1: Go to Project Settings**
1. Visit: https://vercel.com/dashboard
2. Select your project: `cooperative-farming-systemfarm`
3. Go to **Settings**

### **Step 2: Update Root Directory**
1. In Settings, go to **General** tab
2. Find **Root Directory**
3. Set it to: `project`
4. Click **Save**

### **Step 3: Update Build Settings** 
1. Still in Settings, scroll to **Build & Development Settings**
2. Set these values:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
3. Click **Save**

### **Step 4: Redeploy**
1. Go to **Deployments** tab
2. Click **...** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete (2-3 minutes)

### **Step 5: Test**
Visit your deployment URL: https://cooperative-farming-systemfarm.vercel.app

---

## **Alternative: Delete and Reimport Project**

If the above doesn't work:

1. **Delete Current Project**:
   - Vercel Dashboard → Project Settings → Advanced → Delete Project

2. **Reimport from GitHub**:
   - Vercel Dashboard → Add New Project
   - Import from: `Sabari7866/Cooperative-Farming-System`
   - **Root Directory**: `project` ← **IMPORTANT!**
   - Framework: Vite (auto-detected)
   - Click Deploy

3. **Add Environment Variables** (After deployment):
   ```
   GOOGLE_API_KEY=your_gemini_api_key
   MONGODB_URI=your_mongodb_uri
   EMAIL_USER=your_gmail
   EMAIL_PASS=your_gmail_app_password
   JWT_SECRET=random-secret-key
   NODE_ENV=production
   ```

4. **Redeploy** with environment variables

---

## Why This Happens:

The issue is that Vercel is deploying from the **repository root** instead of the `project` subfolder. This means:
- ❌ It can't find `package.json` correctly
- ❌ It can't build the Vite app properly
- ❌ The build output isn't in the right place
- ❌ Routes serve `index.html` for everything

Setting the **Root Directory to `project`** fixes this!

---

## Expected Result:

After setting the root directory correctly, you should see:
- ✅ Login screen (English/Tamil/Hindi selector)
- ✅ AgriSmart branding
- ✅ No console errors
- ✅ Functional navigation

---

**Please try the Vercel Dashboard method above and let me know the result!** 🚀
