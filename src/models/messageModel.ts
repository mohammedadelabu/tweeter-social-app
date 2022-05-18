import { IMessage } from '../utils/interfaces/chatInterface';
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: String,
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    deleted: {
      type: Boolean,
      default: false,
    },

    text: {
      type: String,
    },
    emoji: {
      type: String,
    },
    media: {
      media: {
        type: String,
        data: URL,
      },
      enums: ['Document', 'Audio', 'Picture', 'Video'],
    },
    audioR: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.model<IMessage>('Message', MessageSchema);
