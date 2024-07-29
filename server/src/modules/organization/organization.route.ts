import IDValidator from '@/middleware/idValidator';
import { VerifyAdmin } from '@/middleware/VerifySession';
import express from 'express';
import Controller from './organization.controller';
import {
	CategoriesValidator,
	CreateOrganizationValidator,
	InviteToOrganizationValidator,
	ReconfigurePositionsValidator,
	UpdateOrganizationValidator,
} from './organization.validator';

const router = express.Router();

router
	.route('/reconfigure-positions')
	.all(ReconfigurePositionsValidator)
	.post(Controller.reconfigurePositions);

router.route('/employees/:id').all(IDValidator).delete(Controller.removeFromOrganization);

router
	.route('/employees')
	.get(Controller.listEmployees)
	.post(InviteToOrganizationValidator, Controller.inviteToOrganization);

router
	.route('/:id/categories')
	.get(IDValidator, Controller.categories)
	.post(IDValidator, CategoriesValidator, Controller.updateCategories);

router
	.route('/:id')
	.get(IDValidator, Controller.details)
	.patch(IDValidator, UpdateOrganizationValidator, Controller.updateDetails);

router
	.route('/')
	.get(VerifyAdmin, Controller.listOrganizations)
	.post(CreateOrganizationValidator, Controller.createOrganization);

export default router;
