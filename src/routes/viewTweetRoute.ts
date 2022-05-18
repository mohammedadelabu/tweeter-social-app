import express, { NextFunction, Response, Request } from 'express';
import { protectRoute } from '../controllers/authController';
import { viewTweetController, viewFriendTweetController } from '../controllers/viewTweetController';
import { viewtwitterPolicy, friendtweetPolicy } from '../utils/validations/viewTweetPolicy';
const router = express.Router();

router.get('/', viewtwitterPolicy, protectRoute, viewTweetController); // get followers
router.get('/friend/:id', friendtweetPolicy, protectRoute, viewFriendTweetController); // get followers

export default router;
