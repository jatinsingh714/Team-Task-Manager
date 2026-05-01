# TT Manager

Full-stack MERN project with:

- `frontend`: React + Vite + Tailwind CSS
- `backend`: Node.js + Express + MongoDB/Mongoose

## Setup

Install dependencies:

```bash
npm install
npm run install:all
```

Create `backend/.env` from `backend/.env.example`, then start both apps:

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000/api`

## Deployment

Backend environment variables:

```bash
NODE_ENV=production
PORT=5000
MONGO_URI=your-mongodb-atlas-uri
CLIENT_URL=https://your-frontend-domain.com
JWT_SECRET=your-long-random-secret
JWT_EXPIRES_IN=7d
JSON_LIMIT=1mb
```

`CLIENT_URL` may contain multiple allowed frontend origins separated by commas.

Frontend environment variables:

```bash
VITE_API_URL=https://your-backend-domain.com/api
```

For local development, `frontend/vite.config.js` can proxy `/api` to a backend using:

```bash
VITE_DEV_API_PROXY_TARGET=http://localhost:5000
```

Build commands:

```bash
npm install --prefix backend
npm run start --prefix backend

npm install --prefix frontend
npm run build --prefix frontend
```

Deploy `frontend/dist` to your static host and deploy `backend` to a Node.js host. In production, set `VITE_API_URL` to the deployed backend `/api` URL and set `CLIENT_URL` on the backend to the deployed frontend URL.
