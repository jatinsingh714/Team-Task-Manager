import { Router } from 'express';
import { getUsers } from '../controllers/userController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', protect, authorize('admin'), getUsers);

export default router;
