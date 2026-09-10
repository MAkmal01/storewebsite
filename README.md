# Store Website - MERN Stack Project

A full-stack modern MERN (MongoDB, Express, React, Node.js) application template configured for building an e-commerce store.

## Architecture

- **Frontend (`client/`)**:
  - React 19 + Vite 6
  - Tailwind CSS v4 for modern styling
  - Axios for HTTP requests
  - Lucide React for modern iconography
  - Pre-configured dev proxy to `/api` (port 5000)

- **Backend (`server/`)**:
  - Node.js + Express 4 (ES Modules `import/export`)
  - Mongoose 8 for MongoDB ODM
  - CORS, Dotenv, and centralized error handling
  - Nodemon for fast development reloading
  - Health check endpoint at `/api/health`

- **Database**:
  - Local MongoDB Server instance running on `mongodb://127.0.0.1:27017/store_website`
  - Fully compatible with MongoDB Atlas by updating `MONGO_URI` in `server/.env`

---

## Directory Structure

```text
store-website/
├── client/                     # Frontend React (Vite)
│   ├── public/
│   ├── src/
│   │   ├── api/                # API client Axios helpers
│   │   ├── components/         # React components
│   │   ├── App.jsx             # Main dashboard & health monitor
│   │   ├── index.css           # Tailwind CSS imports
│   │   └── main.jsx            # React root mount
│   ├── index.html
│   ├── package.json
│   └── vite.config.js          # Vite config & API proxy
├── server/                     # Backend Express API
│   ├── src/
│   │   ├── config/             # DB connection (Mongoose)
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Error handling & middleware
│   │   ├── models/             # Mongoose data models
│   │   ├── routes/             # Express API routes
│   │   └── server.js           # Server entry point
│   ├── .env                    # Environment variables
│   ├── .env.example
│   └── package.json
├── .gitignore
├── package.json                # Root orchestration scripts
└── README.md
```

---

## Quick Start

### 1. Install All Dependencies

From the project root:

```bash
npm run install:all
```

Or install individually:
```bash
# Root dependencies
npm install

# Backend dependencies
cd server
npm install

# Frontend dependencies
cd ../client
npm install
```

### 2. Start Development Servers

Run both the frontend and backend concurrently with a single command from the root directory:

```bash
npm run dev
```

- **Frontend UI**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5000](http://localhost:5000)
- **Health Check Endpoint**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Running Services Separately

- Start only the backend:
  ```bash
  npm run server
  ```
- Start only the frontend:
  ```bash
  npm run client
  ```

---

## Environment Variables

The backend configuration is managed in `server/.env`:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Express server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGO_URI` | MongoDB connection URI | `mongodb://127.0.0.1:27017/store_website` |
| `CLIENT_URL` | Frontend origin for CORS | `http://localhost:5173` |

To connect to MongoDB Atlas, replace `MONGO_URI` with your connection string:
```env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/store_website?retryWrites=true&w=majority
```
