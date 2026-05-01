import { Router } from 'express';
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask
} from '../controllers/taskController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.route('/')
  .post(authorize('admin'), createTask)
  .get(getTasks);

router.route('/:id')
  .put(updateTask)
  .delete(authorize('admin'), deleteTask);

export default router;
