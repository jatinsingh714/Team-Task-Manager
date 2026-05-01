import cors from 'cors';
import express from 'express';
import env from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

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
app.use(express.json({ limit: env.jsonLimit }));
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
