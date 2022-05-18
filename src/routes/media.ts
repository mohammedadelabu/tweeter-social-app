import express, { NextFunction, Request, Response } from 'express';
import { protectRoute } from '../controllers/authController';
import { getMediaTweet } from '../controllers/lastestController';

const router = express.Router();

router.use(protectRoute);

//Get Request Tweet with Media
router.get('/', getMediaTweet);

export default router;
