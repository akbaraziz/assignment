import express from 'express';
import { getTasks, createTask, updateTask } from '../controllers/taskController';

const router = express.Router();

router.get('/', getTasks);
router.post('/', createTask);
router.patch('/:id', updateTask);

export default router;