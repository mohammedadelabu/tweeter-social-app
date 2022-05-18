import express, { NextFunction, Request, Response } from 'express';
import {
  createBookmark,
  deleteBookmark,
  getAllBookmarks,
  getSingleBookmark,
} from '../controllers/bookmarkController';
import { commentTweet, getComments } from '../controllers/commentController';
import { getLikes, getLikesByUser, likeTweet, unlikeTweet } from '../controllers/likeController';
import { protectRoute } from '../controllers/authController';

const router = express.Router();

router.use(protectRoute);
//GET Request
router.get('/bookmark', getAllBookmarks);
router.get('/bookmark/:id', getSingleBookmark);
router.get('/:id/comment', getComments);
router.get('/:id/like', getLikes);
router.get('/user/likes/:id', getLikesByUser);

//POST Request
router.post('/:id/like', likeTweet);
router.post('/:id/comment', commentTweet);
router.post('/:id/bookmark', createBookmark);

//DELETE Request
router.delete('/:id/like', unlikeTweet);
router.delete('/:id/bookmark', deleteBookmark);

export default router;
