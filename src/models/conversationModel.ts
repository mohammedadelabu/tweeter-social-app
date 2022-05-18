import { IChat } from '../utils/interfaces/chatInterface';
import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema(
  {
    // members:[
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',

    //   },
    // ]
    members: {
      type: Array,
      ref: 'User',
    },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

export default mongoose.model<IChat>('Conversation', ConversationSchema);
