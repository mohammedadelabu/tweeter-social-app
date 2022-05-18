import express from 'express';
import {
  createConversation,
  getConversation,
  getUsersConversation,
} from '../controllers/conversationController';
import { protectRoute } from '../controllers/authController';

const router = express.Router();

router.post('/', protectRoute, createConversation);
router.get('/:id', protectRoute, getConversation);
router.get('/:firstUserId/:secondUserId', protectRoute, getUsersConversation);
// router.get('/:coversationId', protectRoute, getUsersConversation);

export default router;
