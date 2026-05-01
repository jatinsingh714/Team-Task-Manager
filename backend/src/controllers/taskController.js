import mongoose from 'mongoose';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const taskPopulation = [
  { path: 'assignedTo', select: 'name email role' },
  { path: 'createdBy', select: 'name email role' }
];

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

async function findUserOrFail(userId, res) {
  if (!isValidObjectId(userId)) {
    res.status(400);
    throw new Error('Invalid assigned user id.');
  }

  const user = await User.findById(userId);
  if (!user) {
    res.status(404);
    throw new Error('Assigned user not found.');
  }

  return user;
}

const createTask = asyncHandler(async (req, res) => {
  const { title, description, assignedTo, status } = req.body;

  if (!title || !assignedTo) {
    res.status(400);
    throw new Error('Title and assigned user are required.');
  }

  await findUserOrFail(assignedTo, res);

  const task = await Task.create({
    title,
    description,
    assignedTo,
    status,
    createdBy: req.user._id
  });

  const populatedTask = await task.populate(taskPopulation);

  res.status(201).json({
    success: true,
    task: populatedTask
  });
});

const getTasks = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { assignedTo: req.user._id };

  const tasks = await Task.find(filter)
    .populate(taskPopulation)
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: tasks.length,
    tasks
  });
});

const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, assignedTo, title, description } = req.body;

  if (!isValidObjectId(id)) {
    res.status(400);
    throw new Error('Invalid task id.');
  }

  const task = await Task.findById(id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found.');
  }

  const isAdmin = req.user.role === 'admin';
  const isAssignedMember = task.assignedTo.equals(req.user._id);

  if (!isAdmin && !isAssignedMember) {
    res.status(403);
    throw new Error('Forbidden. You can only update your assigned tasks.');
  }

  if (status) {
    task.status = status;
  }

  if (isAdmin) {
    if (assignedTo) {
      await findUserOrFail(assignedTo, res);
      task.assignedTo = assignedTo;
    }

    if (title) {
      task.title = title;
    }

    if (description !== undefined) {
      task.description = description;
    }
  }

  const updatedTask = await task.save();
  const populatedTask = await updatedTask.populate(taskPopulation);

  res.status(200).json({
    success: true,
    task: populatedTask
  });
});

const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!isValidObjectId(id)) {
    res.status(400);
    throw new Error('Invalid task id.');
  }

  const task = await Task.findById(id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found.');
  }

  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully.'
  });
});

export { createTask, deleteTask, getTasks, updateTask };
