import express from 'express';
import {
  updateProfile,
  uploadProfilePicture,
  getProfile,
  getUserProfile,
} from '../controllers/profileController';
import { profileValidator } from '../utils/validations/profileValidation';
import middleware from '../middleware/middleware';
import { protectRoute } from '../controllers/authController';
import * as tweetControls from '../controllers/tweetController';

const router = express.Router();

// router.get('/', protectRoute, userProfile);
router
  .route('/')
  .get(protectRoute, getProfile)
  .put(protectRoute, [middleware(profileValidator)], updateProfile);
router.put('/picture', protectRoute, uploadProfilePicture);

// get user by id
router.route('/:userId').get(protectRoute, getUserProfile);

//list of all user of the app
router.get('/list-of-users', protectRoute, tweetControls.listOfAppUser);

// router.post('/create', protectRoute, [middleware(profileValidator)], createProfile);

export default router;
