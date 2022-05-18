import express, { Request, Response } from 'express';
import { protectRoute } from '../controllers/authController';
import {
  searchTweets,
  searchUsers,
  searchLatestTweet,
  searchThroughMedia,
} from '../controllers/searchContoller';
const router = express.Router();

router.get('/', protectRoute, searchTweets);
router.get('/users', protectRoute, searchUsers);
router.get('/late', protectRoute, searchLatestTweet);
router.get('/media', protectRoute, searchThroughMedia);

export default router;
