import express from 'express';
import { protectRoute } from '../controllers/authController';
import {
  viewTrendsController,
  trendsTweetCountController,
  hashtagTweetController,
} from '../controllers/trendingController';
import { hashtagTweetPolicy } from '../utils/validations/trendingValidation';
const router = express.Router();

router.get('/', protectRoute, viewTrendsController); //get trending Hashtags
router.get('/hashtag', hashtagTweetPolicy, protectRoute, hashtagTweetController); //get trending Hashtags

router.get('/tweetcount', protectRoute, trendsTweetCountController);
export default router;
