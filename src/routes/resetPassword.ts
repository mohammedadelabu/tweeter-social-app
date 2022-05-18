import express, { Request, Response } from 'express';
import resetRouter from '../controllers/resetPasswordController';
import { protectRoute } from '../controllers/authController';
const router = express.Router();

const { resetPassword, forgotPassword, changePassword } = resetRouter;

router.post('/changepassword', protectRoute, changePassword);
router.post('/forgotpassword', forgotPassword);
router.post('/resetpassword/:token', resetPassword);

export default router;
