import jwt from 'jsonwebtoken';
import env from '../config/env.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized. Token missing.');
  }

  const token = authHeader.split(' ')[1];
  let decoded;

  try {
    decoded = jwt.verify(token, env.jwtSecret);
  } catch (error) {
    res.status(401);
    throw new Error(error.message === 'jwt expired' ? 'Token expired.' : 'Not authorized. Invalid token.');
  }

  const user = await User.findById(decoded.id).select('-password');
  if (!user) {
    res.status(401);
    throw new Error('Not authorized. User no longer exists.');
  }

  req.user = user;
  req.auth = {
    id: decoded.id,
    role: decoded.role
  };

  next();
});

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role)) {
      res.status(403);
      throw new Error('Forbidden. Insufficient permissions.');
    }

    next();
  };
};

export { authorize, protect };
