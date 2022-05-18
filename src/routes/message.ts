import express from 'express';
import { createMessage, getMessages } from '../controllers/messageController';
import { protectRoute } from '../controllers/authController';

const router = express.Router();

router.post('/', protectRoute, createMessage);
router.get('/:conversationId', protectRoute, getMessages);

export default router;
