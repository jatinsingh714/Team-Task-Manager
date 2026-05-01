import env from '../config/env.js';

export function getHealth(_req, res) {
  res.status(200).json({
    success: true,
    message: 'Backend API is healthy.',
    environment: env.nodeEnv,
    uptime: process.uptime()
  });
}
