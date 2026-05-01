import env from '../config/env.js';

export function notFound(req, res, next) {
  const error = new Error(`Not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  if (error?.code === 11000) {
    res.status(409);
    error.message = 'Email is already registered.';
  }

  if (error?.name === 'ValidationError') {
    res.status(400);
    error.message = Object.values(error.errors)
      .map((validationError) => validationError.message)
      .join(' ');
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: error.message,
    stack: env.nodeEnv === 'production' ? undefined : error.stack
  });
}
