import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find({})
    .select('name email role')
    .sort({ name: 1, email: 1 });

  res.status(200).json({
    success: true,
    count: users.length,
    users
  });
});

export { getUsers };
