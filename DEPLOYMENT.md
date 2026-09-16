# Deployment Guide

Follow these steps to deploy your complete project (Frontend + Backend) for free using a single Vercel project and MongoDB Atlas.

## A. GitHub Setup
Your source code is already tracked by Git and properly configured (`.env` and `node_modules` are excluded).
1. Commit all your changes: `git add . && git commit -m "Configure Vercel Deployment"`
2. Push your code to your GitHub repository.

## B. MongoDB Atlas Setup
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Build a new free cluster.
3. In "Database Access", create a new database user with a secure password.
4. In "Network Access", add `0.0.0.0/0` to allow access from anywhere (required since Vercel Serverless IPs change).
5. Click "Connect" -> "Connect your application" and copy the connection string.
6. Ensure your connection string includes your database name (e.g., `...mongodb.net/store_website?retryWrites=true...`).

## C. Vercel Unified Deployment (Frontend + Backend)
Because of the `vercel.json` file we created, Vercel will automatically build your Vite frontend and deploy your Express backend as Serverless Functions on the same domain!

1. Create an account at [Vercel.com](https://vercel.com/).
2. Click **Add New...** -> **Project**.
3. Import your GitHub repository.
4. **Configuration Details**:
   - **Framework Preset**: Other
   - **Root Directory**: `.` (Leave it as the default root directory)
   - **Build Command**: `cd client && npm install && npm run build` (Should be automatically detected from vercel.json)
   - **Output Directory**: `client/dist` (Should be automatically detected from vercel.json)
5. **Environment Variables**:
   Add all required variables from your backend (no need to add VITE_API_URL since frontend and backend share the same domain now):
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGO_URI`: *(Paste your MongoDB Atlas connection string here)*
   - `CLOUDINARY_CLOUD_NAME`: *(Your Cloudinary Cloud Name)*
   - `CLOUDINARY_API_KEY`: *(Your Cloudinary API Key)*
   - `CLOUDINARY_API_SECRET`: *(Your Cloudinary API Secret)*
   - `CLIENT_URL`: *(Leave empty or set to your Vercel URL if CORS issues arise, but same-domain requests usually bypass CORS)*
6. Click **Deploy**. Vercel will build the frontend and set up the serverless functions.

## D. How to Test the Deployed Project
1. **Test the Backend**: Open your Vercel URL and add `/api` at the end (e.g., `https://your-app.vercel.app/api`). You should see a JSON message: `{"message":"Welcome to Royal Choice API",...}`.
2. **Test the Frontend**: Open your Vercel URL (e.g., `https://your-app.vercel.app`). Ensure products load correctly.

## E. Troubleshooting Common Errors
- **404 Not Found on API routes**: Ensure that you have `vercel.json` pushed to GitHub exactly as configured.
- **Server Error (500) on API**: Check the Vercel Logs (Logs tab in Vercel dashboard). It usually means `MONGO_URI` is incorrect, or a Cloudinary environment variable is missing.
- **Blank page on Frontend**: Means the Vite build failed or Output Directory is wrong. Check Vercel build logs.
