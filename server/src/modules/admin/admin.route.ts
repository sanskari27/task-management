import express from 'express';
import Controller from './admin.controller';

const router = express.Router();

router.route('/overview').get(Controller.dashboardDetails);
router.route('/users').get(Controller.listUsers);

export default router;
