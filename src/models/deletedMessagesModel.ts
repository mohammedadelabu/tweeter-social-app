import { IDelete } from '../utils/interfaces/chatInterface';
import { Schema, model } from 'mongoose';

const DeleteSchema = new Schema(
  {
    messageId: {
      type: String,
    },
    deleterId: {
      type: String,
    },
  },

  {
    timestamps: true,
  },
);

export default model<IDelete>('Delete', DeleteSchema);
