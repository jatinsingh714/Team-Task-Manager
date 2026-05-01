import cors from 'cors';
import express from 'express';
import env from './config/env.js';
import routes from './routes/index.js';

const app = express();

const corsOptions = {
  origin(origin, callback) {
    if (!origin || env.clientUrls.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(null, false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 204
};

app.use(
  cors(corsOptions)
);
app.options('*', cors(corsOptions));

app.get('/', (_req, res) => {
  res.status(200).type('text/plain').send('Backend is running');
});

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend API is healthy'
  });
});

app.use(express.json({ limit: env.jsonLimit }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.use((err, _req, res, _next) => {
  const statusCode = res.statusCode >= 400 ? res.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Server error'
  });
});

export default app;
