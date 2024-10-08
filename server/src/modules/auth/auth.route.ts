import VerifySession from '@/middleware/VerifySession';
import express from 'express';
import Controller from './auth.controller';
import {
	LoginAccountValidator,
	RegisterAccountValidator,
	ResetPasswordValidator,
	UpdateAccountValidator,
	UpdatePasswordValidator,
} from './auth.validator';

const router = express.Router();

router.route('/validate-auth').all(VerifySession).get(Controller.validateAuth);

router
	.route('/details')
	.all(VerifySession)
	.get(Controller.details)
	.patch(UpdateAccountValidator, Controller.updateDetails);

router.route('/login').all(LoginAccountValidator).post(Controller.login);

router.route('/register').all(RegisterAccountValidator).post(Controller.register);

router.route('/forgot-password').all(ResetPasswordValidator).post(Controller.forgotPassword);

router.route('/reset-password/:id').all(UpdatePasswordValidator).post(Controller.resetPassword);

router.route('/logout').post(Controller.logout);

export default router;
