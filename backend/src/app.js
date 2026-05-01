import cors from 'cors';
import express from 'express';
import env from './config/env.js';
import routes from './routes/index.js';
import { notFound } from './middleware/errorMiddleware.js';

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

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'Backend API is healthy'
  });
});

app.use(express.json({ limit: env.jsonLimit }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use(notFound);
app.use((err, _req, res, _next) => {
  res.status(500).json({
    success: false,
    message: err.message
  });
});

export default app;
