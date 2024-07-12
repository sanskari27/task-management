import IDValidator from '@/middleware/idValidator';
import express from 'express';
import Controller from './organization.controller';
import {
	CreateOrganizationValidator,
	InviteToOrganizationValidator,
	ReconfigurePositionsValidator,
	UpdateOrganizationValidator,
} from './organization.validator';

const router = express.Router();

router
	.route('/create-organization')
	.post(CreateOrganizationValidator, Controller.createOrganization);

router.route('/update-details').post(UpdateOrganizationValidator, Controller.updateDetails);

router
	.route('/reconfigure-positions')
	.all(ReconfigurePositionsValidator)
	.post(Controller.reconfigurePositions);

router
	.route('/invite-to-organization')
	.all(InviteToOrganizationValidator)
	.post(Controller.inviteToOrganization);

router
	.route('/remove-from-organization/:id')
	.all(IDValidator)
	.post(Controller.removeFromOrganization);

export default router;
