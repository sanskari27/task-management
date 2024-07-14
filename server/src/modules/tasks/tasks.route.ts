import IDValidator from '@/middleware/idValidator';
import express from 'express';
import Controller from './tasks.controller';
import {
	AssignTaskValidator,
	CreateTaskValidator,
	FetchQueryValidator,
	TaskUpdateValidator,
	UpdateStatusValidator,
} from './tasks.validator';

const router = express.Router();

router.route('/create-task').post(CreateTaskValidator, Controller.createTask);
router.route('/assigned-to-me').get(FetchQueryValidator, Controller.getAssignedToMe);
router.route('/assigned-by-me').get(FetchQueryValidator, Controller.getAssignedByMe);

router.route('/:id/add-update').post(IDValidator, TaskUpdateValidator, Controller.addTaskUpdate);
router
	.route('/:id/update-status')
	.post(IDValidator, UpdateStatusValidator, Controller.updateStatus);
router.route('/:id/transfer-task').post(IDValidator, AssignTaskValidator, Controller.transfer);
router
	.route('/:id')
	.get(IDValidator, Controller.taskDetails)
	.delete(IDValidator, Controller.deleteTask);

router.route('/').get(FetchQueryValidator, Controller.getAssignedToAll);

export default router;
