import IDValidator from '@/middleware/idValidator';
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
	.route('/create-organization')
	.post(CreateOrganizationValidator, Controller.createOrganization);

router
	.route('/reconfigure-positions')
	.all(ReconfigurePositionsValidator)
	.post(Controller.reconfigurePositions);

router
	.route('/add-to-organization')
	.all(InviteToOrganizationValidator)
	.post(Controller.inviteToOrganization);

router
	.route('/remove-from-organization/:id')
	.all(IDValidator)
	.post(Controller.removeFromOrganization);

router.route('/list-employees').get(Controller.listEmployees);

router
	.route('/:id/update-details')
	.post(IDValidator, UpdateOrganizationValidator, Controller.updateDetails);
router
	.route('/:id/categories')
	.get(IDValidator, Controller.categories)
	.post(IDValidator, CategoriesValidator, Controller.updateCategories);
router.route('/:id').get(IDValidator, Controller.details);

export default router;
