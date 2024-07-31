import express from 'express';
import Controller from './admin.controller';
import { OrganizationCodeValidator } from './admin.validator';

const router = express.Router();

router.route('/overview').get(Controller.dashboardDetails);
router.route('/users').get(Controller.listUsers);

router
	.route('/organizations/code')
	.all(OrganizationCodeValidator)
	.post(Controller.sendOrganizationCode);

export default router;
