import express, { NextFunction, Request, Response } from 'express';
import { protectRoute } from '../controllers/authController';
import { getLatestTweet } from '../controllers/lastestController';

const router = express.Router();

router.use(protectRoute);

//GET Request Lastest Tweet
router.get('/', getLatestTweet);

export default router;
