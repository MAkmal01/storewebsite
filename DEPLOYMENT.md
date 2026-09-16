# Deployment Guide

Follow these steps to deploy your project for free using Vercel (Frontend), Render (Backend), and MongoDB Atlas (Database).

## A. GitHub Setup
Your source code is already tracked by Git and properly configured (`.env` and `node_modules` are excluded).
1. Commit all your changes: `git add . && git commit -m "Prepare for deployment"`
2. Push your code to a GitHub repository.

## B. MongoDB Atlas Setup
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Build a new free cluster.
3. In "Database Access", create a new database user with a secure password.
4. In "Network Access", add `0.0.0.0/0` to allow access from anywhere (required since Render's IPs change).
5. Click "Connect" -> "Connect your application" and copy the connection string. It will look like:
   `mongodb+srv://<username>:<password>@cluster0...mongodb.net/store_website?retryWrites=true&w=majority`
6. Save this connection string; you will need it for Render.

## C. Render Backend Setup
1. Create an account at [Render.com](https://render.com/).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub account and select your repository.
4. **Configuration Details**:
   - **Name**: `store-website-api` (or any name)
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. **Environment Variables** (under Advanced):
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: *(Paste your MongoDB Atlas connection string here)*
   - `CLIENT_URL`: *(Leave this empty for now, we will update it after deploying the frontend)*
   - `CLOUDINARY_CLOUD_NAME`: *(Your Cloudinary Cloud Name)*
   - `CLOUDINARY_API_KEY`: *(Your Cloudinary API Key)*
   - `CLOUDINARY_API_SECRET`: *(Your Cloudinary API Secret)*
6. Click **Create Web Service**. Wait for the deployment to finish, and copy the Render URL (e.g., `https://store-website-api.onrender.com`).

## D. Vercel Frontend Setup
1. Create an account at [Vercel.com](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. **Configuration Details**:
   - **Framework Preset**: Vite
   - **Root Directory**: `client` (Click Edit to change this from the default root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Environment Variables**:
   - Name: `VITE_API_URL`
   - Value: *(Paste your Render URL here, e.g., `https://store-website-api.onrender.com/api`)*
6. Click **Deploy**. Vercel will build and host your frontend. Wait for it to finish and copy your new Vercel URL (e.g., `https://store-website.vercel.app`).

## E. CORS Configuration Update
1. Go back to your Render Dashboard.
2. Select your `store-website-api` Web Service.
3. Go to **Environment**.
4. Update the `CLIENT_URL` variable to your new Vercel URL (e.g., `https://store-website.vercel.app`). Do not add a trailing slash.
5. Click **Save Changes**. Render will automatically redeploy the backend with the new CORS rules.

## F. How to Test the Deployed Project
1. **Test the API**: Open your Render URL in the browser (e.g., `https://store-website-api.onrender.com/`). You should see a JSON message: `{"message":"Welcome to Royal Choice API",...}`.
2. **Test the Frontend**: Open your Vercel URL. Ensure products load correctly (this confirms the API URL and CORS are working). Try adding an item to the cart and submitting a test review.

## H. Common Errors
- **Products not loading / Network Error**: 
  - Ensure you added `/api` to the end of your Render URL when setting `VITE_API_URL` in Vercel.
  - Ensure your Vercel URL exactly matches the `CLIENT_URL` in Render (no trailing slashes like `https://site.com/`).
- **Backend crashes on startup**: Check Render logs. It usually means the `MONGO_URI` is incorrect, or a required environment variable is missing.
- **CORS Error in Browser Console**: Means the `CLIENT_URL` in Render does not match the Vercel URL you are accessing from.
